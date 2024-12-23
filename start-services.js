const { exec } = require('child_process');
const { promisify } = require('util');
const killPort = require('kill-port');
const execAsync = promisify(exec);

// Ports for services
const ports = {
  AUTH_CLIENT_PORT: 3001,
  RBAC_CLIENT_PORT: 3002,
  FORMS_CLIENT_PORT: 3003,
  ADDRESS_CLIENT_PORT: 3004,
  BOOKING_CLIENT_PORT: 3005,
  BILLING_CLIENT_PORT: 3006,
  MAIL_CLIENT_PORT: 3007,
  RESOURCES_CLIENT_PORT: 3008,
};

// Commands for starting services
const services = [
  { name: 'billing', command: 'node ./node_modules/@nestjs/cli/bin/nest.js start billing --watch', port: ports.BILLING_CLIENT_PORT },
  { name: 'address', command: 'node ./node_modules/@nestjs/cli/bin/nest.js start address --watch', port: ports.ADDRESS_CLIENT_PORT },
  { name: 'auth', command: 'node ./node_modules/@nestjs/cli/bin/nest.js start auth --watch', port: ports.RBAC_CLIENT_PORT },
  { name: 'forms', command: 'node ./node_modules/@nestjs/cli/bin/nest.js start forms --watch', port: ports.FORMS_CLIENT_PORT },
  { name: 'messaging', command: 'node ./node_modules/@nestjs/cli/bin/nest.js start messaging --watch', port: ports.MAIL_CLIENT_PORT},
  { name: 'resources', command: 'node ./node_modules/@nestjs/cli/bin/nest.js start resources --watch', port: ports.RESOURCES_CLIENT_PORT }
];

// Function to kill processes on a port
async function killProcessesOnPorts() {
  console.log('Checking ports for running services...');
  for (const port of Object.values(ports)) {
    try {
      await killPort(port);
      console.log(`Killed process running on port ${port}`);
    } catch (err) {
      console.log(`No process running on port ${port}`);
    }
  }
}

// Function to start services
function startServices() {
  services.forEach(({ name, command }) => {
    console.log(`Starting service: ${name}`);
    const process = exec(command);

    // Log output for each service
    process.stdout.on('data', (data) => {
      console.log(`[${name}] ${data}`);
    });

    process.stderr.on('data', (data) => {
      console.error(`[${name} ERROR] ${data}`);
    });

    process.on('close', (code) => {
      console.log(`[${name}] exited with code ${code}`);
    });
  });
}

// Main function to kill processes and start services
async function main() {
  // await killProcessesOnPorts();
  startServices();
}

main().catch((err) => {
  console.error('Error:', err);
});
