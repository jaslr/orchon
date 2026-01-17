import { env } from '../../config/env.js';
export async function executeFlyAction(config) {
    const { app, action, machineId } = config;
    if (!app) {
        throw new Error('Missing required config: app');
    }
    if (!env.flyApiToken) {
        throw new Error('FLY_API_TOKEN not configured');
    }
    // If machineId is specified, restart that specific machine
    // Otherwise, list machines and restart them all
    if (machineId) {
        return await restartMachine(app, machineId);
    }
    // List all machines for the app
    const machines = await listMachines(app);
    if (machines.length === 0) {
        throw new Error(`No machines found for app: ${app}`);
    }
    const results = [];
    for (const machine of machines) {
        const result = await restartMachine(app, machine.id);
        results.push(result);
    }
    return results.join('\n');
}
async function listMachines(app) {
    const response = await fetch(`https://api.machines.dev/v1/apps/${app}/machines`, {
        headers: {
            Authorization: `Bearer ${env.flyApiToken}`,
        },
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to list machines: ${response.status} ${text}`);
    }
    return response.json();
}
async function restartMachine(app, machineId) {
    console.log(`[Fly] Restarting machine ${machineId} in app ${app}`);
    const response = await fetch(`https://api.machines.dev/v1/apps/${app}/machines/${machineId}/restart`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.flyApiToken}`,
        },
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to restart machine ${machineId}: ${response.status} ${text}`);
    }
    // Wait for machine to be running
    let attempts = 0;
    const maxAttempts = 30;
    while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        attempts++;
        const statusResponse = await fetch(`https://api.machines.dev/v1/apps/${app}/machines/${machineId}`, {
            headers: {
                Authorization: `Bearer ${env.flyApiToken}`,
            },
        });
        if (statusResponse.ok) {
            const machine = await statusResponse.json();
            if (machine.state === 'started') {
                return `Machine ${machineId} restarted successfully (state: started)`;
            }
            console.log(`[Fly] Machine ${machineId} state: ${machine.state}, waiting...`);
        }
    }
    return `Machine ${machineId} restart initiated, but did not confirm started state within timeout`;
}
//# sourceMappingURL=fly.js.map