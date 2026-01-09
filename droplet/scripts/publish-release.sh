#!/bin/bash
# Publish a new APK release to the update server
# Usage: ./scripts/publish-release.sh [debug|release]

set -e

BUILD_TYPE="${1:-debug}"
source .env

# Expected signing certificate CN - MUST match for OTA updates to work
EXPECTED_CERT_CN="CN=Doewah, OU=Dev, O=Doewah, L=Local, ST=Dev, C=AU"

# Get version from pubspec.yaml
VERSION=$(grep 'version:' app/pubspec.yaml | sed 's/version: //' | cut -d'+' -f1)
BUILD_NUMBER=$(grep 'version:' app/pubspec.yaml | sed 's/version: //' | cut -d'+' -f2)

APK_NAME="orchon-${VERSION}-${BUILD_TYPE}.apk"

# Flutter outputs to flutter-apk directory with generic names
if [ "$BUILD_TYPE" = "release" ]; then
  LOCAL_APK="app/build/app/outputs/flutter-apk/app-release.apk"
else
  LOCAL_APK="app/build/app/outputs/flutter-apk/app-debug.apk"
fi

if [ ! -f "$LOCAL_APK" ]; then
  echo "APK not found: $LOCAL_APK"
  echo "Build first with: flutter build apk --${BUILD_TYPE}"
  exit 1
fi

# CRITICAL: Verify APK is signed with the correct certificate
echo "Verifying APK signature..."
CERT_INFO=$(jarsigner -verify -verbose -certs "$LOCAL_APK" 2>&1 | grep "X.509" | head -1 || true)

if [ -z "$CERT_INFO" ]; then
  echo "ERROR: APK is not signed or signature verification failed"
  exit 1
fi

if echo "$CERT_INFO" | grep -q "Doewah"; then
  echo "✓ APK signed with correct certificate (Doewah)"
else
  echo "ERROR: APK signed with WRONG certificate!"
  echo "Expected: $EXPECTED_CERT_CN"
  echo "Found: $CERT_INFO"
  echo ""
  echo "This would cause 'App not installed' errors on user devices."
  echo "Check key.properties has absolute path to keystore."
  exit 1
fi

echo "Publishing ${APK_NAME} to droplet..."

# Create releases directory on droplet
ssh -i ${DROPLET_SSH_KEY} root@${DROPLET_IP} "mkdir -p /root/orchon/releases"

# Copy APK to droplet with correct name
scp -i ${DROPLET_SSH_KEY} "$LOCAL_APK" root@${DROPLET_IP}:/root/orchon/releases/${APK_NAME}

# Update version.json on droplet
ssh -i ${DROPLET_SSH_KEY} root@${DROPLET_IP} "cat > /root/orchon/releases/version.json << EOF
{
  \"version\": \"${VERSION}\",
  \"buildNumber\": ${BUILD_NUMBER},
  \"apkFile\": \"${APK_NAME}\",
  \"releaseDate\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
  \"changelog\": \"Latest release\"
}
EOF"

echo "Published ${APK_NAME}"
echo "Version: ${VERSION}+${BUILD_NUMBER}"
echo ""
echo "Update server URL: http://${DROPLET_IP}:8406/version"
