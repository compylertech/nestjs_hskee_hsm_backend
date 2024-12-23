const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper function to capitalize first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Replacement function
function replacePlaceholders(content, moduleName, subModuleName) {
  const actualModule = subModuleName || moduleName;

  const replacements = {
    '\\[module\\]': actualModule.toLowerCase(),
    '\\[MODULE\\]': actualModule.toUpperCase(),
    '\\[Module\\]': capitalize(actualModule),
  };

  let updatedContent = content;
  for (const [pattern, replacement] of Object.entries(replacements)) {
    const regex = new RegExp(pattern, 'g');
    updatedContent = updatedContent.replace(regex, replacement);
  }
  return updatedContent;
}

// File Processor
function processFile(inputPath, outputPath, moduleName, subModuleName) {
  const fileContent = fs.readFileSync(inputPath, 'utf8');
  const updatedContent = replacePlaceholders(fileContent, moduleName, subModuleName);

  // Ensure the output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Write the updated file
  fs.writeFileSync(outputPath, updatedContent, 'utf8');
  console.log(`Generated: ${outputPath}`);
}

// Function to process contract files
function processContractFiles(baseDir, moduleName, subModuleName) {
  const sourceDir = path.join(__dirname, 'sample/example/contracts'); // Define a template folder for contracts
  const targetDir = subModuleName
    ? `libs/contracts/src/${moduleName}/${subModuleName}`
    : `libs/contracts/src/${moduleName}`;

  const filesToCreate = [
    '[module].dto.ts',
    '[module].enum.ts',
    '[module].pattern.ts',
    'create-[module].dto.ts',
    'update-[module].dto.ts',
  ];

  filesToCreate.forEach((file) => {
    const fileName = file.replace('[module]', subModuleName || moduleName);
    const outputPath = path.join(targetDir, fileName);

    // Optionally add templates for these files or leave them empty
    const fileContent = `// Template for ${fileName}`; // Add meaningful templates if required
    const updatedContent = replacePlaceholders(fileContent, moduleName, subModuleName);

    // Write the file
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, updatedContent, 'utf8');
    console.log(`Generated: ${outputPath}`);
  });
}

// Function to process microservice files
function processMicroserviceFiles(microserviceType, baseDir, moduleName, subModuleName) {
  const sourceDir = path.join(__dirname, 'sample/example/microservices');
  const targetDir = subModuleName
    ? `${baseDir}/microservice/${moduleName}/src/${subModuleName}`
    : `${baseDir}/microservice/${moduleName}/src/${moduleName}`;

  const filesToProcess = {
    controller: '[module].controller.ts',
    service: '[module].service.ts',
    module: '[module].module.ts',
  };

  if (microserviceType === 'all') {
    Object.values(filesToProcess).forEach((file) => {
      const inputPath = path.join(sourceDir, file);
      const outputPath = path.join(targetDir, file.replace('[module]', subModuleName || moduleName));
      processFile(inputPath, outputPath, moduleName, subModuleName);
    });
  } else {
    const inputPath = path.join(sourceDir, filesToProcess[microserviceType]);
    const outputPath = path.join(targetDir, filesToProcess[microserviceType].replace('[module]', subModuleName || moduleName));
    processFile(inputPath, outputPath, moduleName, subModuleName);
  }
}

// Function to process gateway files
function processGatewayFiles(gatewayType, baseDir, moduleName, subModuleName) {
  const gatewayDir = fs.readdirSync(baseDir).find((dir) => dir.endsWith('-gateway'));
  if (!gatewayDir) {
    console.error('No gateway directory found in the base directory!');
    return;
  }

  const sourceDir = path.join(__dirname, 'sample/example/gateway');
  const targetDir = subModuleName
    ? `${baseDir}/${gatewayDir}/src/${moduleName}/modules/${subModuleName}`
    : `${baseDir}/${gatewayDir}/src/${moduleName}/${moduleName}`;

  const filesToProcess = {
    controller: '[module].controller.ts',
    service: '[module].service.ts',
    module: '[module].module.ts',
  };

  if (gatewayType === 'all') {
    Object.values(filesToProcess).forEach((file) => {
      const inputPath = path.join(sourceDir, file);
      const outputPath = path.join(targetDir, file.replace('[module]', subModuleName || moduleName));
      processFile(inputPath, outputPath, moduleName, subModuleName);
    });
  } else {
    const inputPath = path.join(sourceDir, filesToProcess[gatewayType]);
    const outputPath = path.join(targetDir, filesToProcess[gatewayType].replace('[module]', subModuleName || moduleName));
    processFile(inputPath, outputPath, moduleName, subModuleName);
  }
}

// Main function to handle arguments
function main() {
  const args = require('minimist')(process.argv.slice(2));
  const { module: moduleName, base: baseDir, microservice, gateway, submodule: subModuleName, contracts } = args;

  if (!moduleName || !baseDir) {
    console.error('Error: --module and --base arguments are required.');
    process.exit(1);
  }

  if (microservice) {
    console.log('Processing Microservice files...');
    processMicroserviceFiles(microservice, baseDir, moduleName, subModuleName);
  }

  if (gateway) {
    console.log('Processing Gateway files...');
    processGatewayFiles(gateway, baseDir, moduleName, subModuleName);
  }

  if (contracts) {
    console.log('Processing Contract files...');
    processContractFiles(baseDir, moduleName, subModuleName);
  }

  console.log('Script execution completed.');
}

main();
