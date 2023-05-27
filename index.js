const { execFile } = require('node:child_process');
const core = require('@actions/core');
const { stdout, stderr } = require('node:process');
const templateFile = core.getInput('template-file', { required: true });
const stackName = core.getInput('stack-name', { required: true });
const parameterOverrides = core.getInput('parameters-json', { required: false });
const capabilityIAM = core.getInput('capability-iam', { required: false });
const capabilityNamedIAM = core.getInput('capability-named-iam', { required: false });

const arguments = ['cloudformation', 'deploy'];
arguments.push('--template-file');
arguments.push(templateFile);
arguments.push('--stack-name');
arguments.push(stackName);
if (parameterOverrides) {
    const params = JSON.parse(parameterOverrides);
    for (const paramName in params) {
        const param = `${paramName}=${params[paramName]}`;
        arguments.push(param);
    }
}

const capabilities = [];
if ((capabilityIAM === 'true') || (capabilityIAM === true)) {
    capabilities.push('CAPABILITY_IAM');
}

if ((capabilityNamedIAM === 'true') || (capabilityNamedIAM === true)) {
    capabilities.push('CAPABILITY_NAMED_IAM');
}

if (capabilities.length) {
    arguments.push('--capabilities');
    arguments.push(...capabilities);
}

const process = execFile('aws', arguments, (error, stdout, stderr) => {
    if (error) {
        core.info(arguments.join(','));
        core.setFailed(`error while trying to deploy ${stackName} with error ${error}`);
        return;
    }
    core.info(`created/updated ${stackName} stack`);
});
