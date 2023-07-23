const core = require('@actions/core');
const child_process = require('child_process');
const fs = require('fs');
async function run() {
  try {
    const stackName = core.getInput('stackName');
    const templateFile = core.getInput('templateFile');
    const parameterFile = core.getInput('parameterFile');
    const hasIAMCapability = core.getInput('hasIAMCapability');
    const hasIAMNamedCapability = core.getInput('hasIAMNamedCapability');

    // Pre-process parameterFile to replace $(VAR) with environment variables
    let parameterOverrides = fs.readFileSync(parameterFile, 'utf8');
    const parameterRegex = /\$\((.*?)\)/g;
    const matches = parameterOverrides.match(parameterRegex);
    if (matches) {
      for (const match of matches) {
        const envVariable = match.slice(2, -1);
        const envValue = process.env[envVariable] || '';
        parameterOverrides = parameterOverrides.replace(match, envValue);
        console.log(`Replaced ${envVariable} with ${envValue}`);
      }
    }

    // Run AWS CLI command to create or update the stack
    const deployArgs = ['cloudformation', 'deploy', '--stack-name', stackName, '--template-file', templateFile, '--parameter-overrides', parameterOverrides];
    if (hasIAMCapability) {
      deployArgs.push('--capabilities', 'CAPABILITY_IAM');
    }
    if (hasIAMNamedCapability) {
      deployArgs.push('--capabilities', 'CAPABILITY_NAMED_IAM');
    }
    child_process.execFileSync('aws', deployArgs, {
      stdio: 'inherit'
    });

    // Get the stack outputs using AWS CLI and set them as environment variables
    const describeStacksArgs = ['cloudformation', 'describe-stacks', '--stack-name', stackName];
    const describeStacksOutput = child_process.execFileSync('aws', describeStacksArgs, {
      encoding: 'utf8'
    });
    const stacks = JSON.parse(describeStacksOutput).Stacks;
    if (stacks.length > 0 && stacks[0].Outputs) {
      for (const output of stacks[0].Outputs) {
        const outputKey = output.OutputKey;
        const outputValue = output.OutputValue;
        core.exportVariable(outputKey, outputValue);
        console.log(`set output ${outputKey} and ${outputValue}`);
      }
    }
    core.setOutput('stackOutputs', describeStacksOutput);
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
