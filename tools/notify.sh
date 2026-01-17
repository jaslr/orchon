#!/bin/bash
# Send a message to Telegram from anywhere

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../.env" 2>/dev/null || source /home/chip/orchon/.env 2>/dev/null

if [ -z "$TELEGRAM_BOT_TOKEN" ] || [ -z "$TELEGRAM_CHAT_ID" ]; then
  echo "Error: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set"
  exit 1
fi

MESSAGE="$*"
if [ -z "$MESSAGE" ]; then
  echo "Usage: notify.sh <message>"
  exit 1
fi

curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d '{"chat_id": "'"${TELEGRAM_CHAT_ID}"'", "text": "'"${MESSAGE}"'", "parse_mode": "Markdown"}' > /dev/null

echo "Sent: $MESSAGE"
