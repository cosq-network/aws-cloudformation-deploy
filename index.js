const { execFile } = require('node:child_process');
const core = require('@actions/core');
const { stdout, stderr } = require('node:process');
const YAML = require('yaml');
const fs = require('fs');
const process = require('node:process');
const { yamlParse } = require('yaml-cfn');
const { error } = require('node:console');

const templateFile = core.getInput('template-file', { required: true });
const stackName = core.getInput('stack-name', { required: true });
const capabilityIAM = core.getInput('capability-iam', { required: false });
const capabilityNamedIAM = core.getInput('capability-named-iam', { required: false });
const s3Bucket = core.getInput('s3-bucket', { required: false });
const forceUpload = core.getInput('force-upload', { required: false });
const s3Prefix = core.getInput('s3-prefix', { required: false });
const kmsKeyId = core.getInput('kms-key-id', { required: false });

let arguments = ['cloudformation', 'deploy'];
arguments.push('--template-file');
arguments.push(templateFile);
arguments.push('--stack-name');
arguments.push(stackName);
if (s3Bucket) {
    arguments.push('--s3-bucket');
    arguments.push(s3Bucket);
}
if ((forceUpload) && ('true' === forceUpload)) {
    arguments.push('--force-upload');
}
if (s3Prefix) {
    arguments.push('--s3-prefix');
    arguments.push(s3Prefix);
}
if (kmsKeyId) {
    arguments.push('--kms-key-id');
    arguments.push(kmsKeyId);
}

const templateFileContent = fs.readFileSync(templateFile);
const templateObject = yamlParse(templateFileContent);

if (templateObject['Parameters']) {
    arguments.push('--parameter-overrides');
    for (const parameterName in templateObject['Parameters']) {
        if (!process.env[parameterName]) {
            core.warning(`Evironment varibale expected for the parameter ${parameterName}`);
            continue;
        }
        const param = `${parameterName}=${process.env[parameterName]}`;
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

const fetchEvents = function (arguments, parentError) {
    execFile('aws', arguments, (error, stdout, stderr) => {
        if (stderr) core.error(stderr);
        if (stdout && !stderr) core.debug(stdout);
        if (error) {
            core.setFailed(`An error occured while trying to get the events of stack ${stackName} update/create`);
        } else {
            core.debug(`aws cloudformation describe-stack-events: ${stdout}`);
            core.setFailed(`error while trying to deploy ${stackName} with error ${parentError}`);
        }
    });
}

execFile('aws', arguments, (error, stdout, stderr) => {
    if (error) {
        // if (stderr) core.error(stderr);
        // if (stdout && !stderr) core.debug(stdout);
        core.debug(`aws cloudformation deply: ${stdout}`);
        arguments = ['cloudformation', 'describe-stack-events', '--stack-name', stackName, '--output', 'json'];
        fetchEvents(arguments, error);
    } else {
        core.info(stdout);
    }
});
