import { env } from '../../config/env.js';
export async function executeGCPAction(config) {
    const { project, service, region = 'australia-southeast1', action = 'restart' } = config;
    if (!project || !service) {
        throw new Error('Missing required config: project, service');
    }
    if (!env.gcpServiceAccountKey) {
        throw new Error('GCP_SERVICE_ACCOUNT_KEY not configured');
    }
    // Parse the service account key
    let credentials;
    try {
        credentials = JSON.parse(env.gcpServiceAccountKey);
    }
    catch {
        throw new Error('Invalid GCP_SERVICE_ACCOUNT_KEY format');
    }
    // Get an access token using the service account
    const accessToken = await getGCPAccessToken(credentials);
    console.log(`[GCP] ${action} Cloud Run service ${service} in ${project}/${region}`);
    // For Cloud Run, we can "restart" by updating the service with a new revision
    // This is done by patching the service with a new annotation
    const serviceName = `projects/${project}/locations/${region}/services/${service}`;
    // Get current service
    const getResponse = await fetch(`https://run.googleapis.com/v2/${serviceName}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!getResponse.ok) {
        const text = await getResponse.text();
        throw new Error(`Failed to get service: ${getResponse.status} ${text}`);
    }
    const serviceData = await getResponse.json();
    // Update the service with a new revision trigger annotation
    serviceData.template = serviceData.template || {};
    serviceData.template.annotations = serviceData.template.annotations || {};
    serviceData.template.annotations['run.googleapis.com/restart-timestamp'] = new Date().toISOString();
    const updateResponse = await fetch(`https://run.googleapis.com/v2/${serviceName}`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
    });
    if (!updateResponse.ok) {
        const text = await updateResponse.text();
        throw new Error(`Failed to update service: ${updateResponse.status} ${text}`);
    }
    const result = await updateResponse.json();
    return `Cloud Run service ${service} update triggered.\nRevision: ${result.template?.revision || 'pending'}\nStatus: ${result.conditions?.[0]?.type || 'updating'}`;
}
async function getGCPAccessToken(credentials) {
    // Create a JWT for service account authentication
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const payload = {
        iss: credentials.client_email,
        sub: credentials.client_email,
        aud: 'https://oauth2.googleapis.com/token',
        iat: now,
        exp: now + 3600,
        scope: 'https://www.googleapis.com/auth/cloud-platform',
    };
    // For Node.js, we need to use crypto for JWT signing
    // This is a simplified version - in production you'd use a library like google-auth-library
    const { createSign } = await import('node:crypto');
    const base64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signatureInput = `${base64Header}.${base64Payload}`;
    const sign = createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(credentials.private_key, 'base64url');
    const jwt = `${signatureInput}.${signature}`;
    // Exchange JWT for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt,
        }),
    });
    if (!tokenResponse.ok) {
        const text = await tokenResponse.text();
        throw new Error(`Failed to get GCP access token: ${tokenResponse.status} ${text}`);
    }
    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
}
//# sourceMappingURL=gcp.js.map