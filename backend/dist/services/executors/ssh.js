export async function executeSSHCommand(config) {
    const { host, command, user = 'root', port = 22 } = config;
    if (!host || !command) {
        throw new Error('Missing required config: host, command');
    }
    console.log(`[SSH] Executing on ${user}@${host}:${port}: ${command}`);
    // For SSH, we'll use the ssh2 library if available, or fall back to spawning ssh
    // For now, we'll use a simpler approach with the native ssh command
    // This requires the SSH key to be in ~/.ssh/id_rsa on the ORCHON server
    const { spawn } = await import('node:child_process');
    return new Promise((resolve, reject) => {
        const args = [
            '-o', 'StrictHostKeyChecking=no',
            '-o', 'UserKnownHostsFile=/dev/null',
            '-o', 'ConnectTimeout=10',
            '-p', String(port),
            `${user}@${host}`,
            command,
        ];
        const ssh = spawn('ssh', args, {
            timeout: 60000, // 60 second timeout
        });
        let stdout = '';
        let stderr = '';
        ssh.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        ssh.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        ssh.on('close', (code) => {
            if (code === 0) {
                resolve(`Command executed successfully on ${host}.\n\nOutput:\n${stdout || '(no output)'}`);
            }
            else {
                reject(new Error(`SSH command failed with exit code ${code}.\n\nStderr:\n${stderr}\n\nStdout:\n${stdout}`));
            }
        });
        ssh.on('error', (err) => {
            reject(new Error(`SSH connection failed: ${err.message}`));
        });
    });
}
//# sourceMappingURL=ssh.js.map