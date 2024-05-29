const { spawn } = require('child_process');

// Function to run a server script
function runServer(scriptName) {
    const process = spawn('node', [scriptName], { stdio: 'inherit' });

    process.on('close', (code) => {
        console.log(`${scriptName} exited with code ${code}`);
    });

    process.on('error', (error) => {
        console.error(`Error starting ${scriptName}:`, error);
    });
}

// Run both server scripts
runServer('server1.js');
runServer('server2.js');

