const core = require('@actions/core');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml-cfn');

async function run() {
  try {
    const stackName = core.getInput('stackName');
    const templateFile = core.getInput('templateFile');
    const hasIAMCapability = core.getInput('hasIAMCapability');
    const hasIAMNamedCapability = core.getInput('hasIAMNamedCapability');

    // Parse the CloudFormation template file to get all parameters
    const templateContent = fs.readFileSync(templateFile, 'utf8');
    const cfnTemplate = yaml.yamlParse(templateContent);
    const parameters = cfnTemplate.Parameters;

    let parameterOverrides = [];
    for (const parameterKey in parameters) {
      if (Object.prototype.hasOwnProperty.call(parameters, parameterKey)) {
        const parameterEnvVariable = process.env[parameterKey];
        if (parameterEnvVariable !== undefined) {
          parameterOverrides.push({
            "ParameterKey": parameterKey,
            "ParameterValue": parameterEnvVariable
          });
        } else {
          core.warning(`Environment variable '${parameterKey}' not found. Parameter will not be overridden.`);
        }
      }
    }

    const filePath = path.join(process.env.GITHUB_WORKSPACE, 'params.json');
    const jsonString = JSON.stringify(parameterOverrides, null, 2);
    fs.writeFileSync(filePath, jsonString);

    // Run AWS CLI command to create or update the stack
    const deployArgs = [
      'cloudformation', 'deploy',
      '--stack-name', stackName,
      '--template-file', templateFile,
      '--parameter-overrides', `file://${filePath}`
    ];

    if (hasIAMCapability) {
      deployArgs.push('--capabilities', 'CAPABILITY_IAM');
    }

    if (hasIAMNamedCapability) {
      deployArgs.push('--capabilities', 'CAPABILITY_NAMED_IAM');
    }

    child_process.execFileSync('aws', deployArgs, { stdio: 'inherit' });

    // Get the stack outputs using AWS CLI and set them as environment variables
    const describeStacksArgs = ['cloudformation', 'describe-stacks', '--stack-name', stackName];
    const describeStacksOutput = child_process.execFileSync('aws', describeStacksArgs, { encoding: 'utf8' });

    const stacks = JSON.parse(describeStacksOutput).Stacks;
    if (stacks.length > 0 && stacks[0].Outputs) {
      for (const output of stacks[0].Outputs) {
        const outputKey = output.OutputKey;
        const outputValue = output.OutputValue;
        core.exportVariable(outputKey, outputValue);
        core.info(`outputs[${outputKey}] = ${outputValue}`);
      }
    }

    core.setOutput('stackOutputs', describeStacksOutput);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
