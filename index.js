const { execFile } = require('node:child_process');
const core = require('@actions/core');
const { stdout, stderr } = require('node:process');
const YAML = require('yaml');
const fs = require('fs');
const process = require('node:process');
const { yamlParse } = require('yaml-cfn');

const templateFile = core.getInput('template-file', { required: true });
const stackName = core.getInput('stack-name', { required: true });
const parameterOverrides = core.getInput('parameters-json', { required: false });
const capabilityIAM = core.getInput('capability-iam', { required: false });
const capabilityNamedIAM = core.getInput('capability-named-iam', { required: false });

const templateFileContent = fs.readFileSync(templateFile);
const templateObject = yamlParse(templateFileContent);

if (templateObject['Parameters']) {
    core.info(process.env);
    const githubEnv = process.env['GITHUB_ENV'];
    if (!!githubEnv) {
        core.info(githubEnv);
        const githubEnvObject = YAML.parse(githubEnv);
        core.info(githubEnvObject);
        if (!!githubEnvObject['env']) {
            core.info(githubEnvObject['env']);
        }
    }
    for (const parameterName in templateObject['Parameters']) {
        core.info(`parameter found: ${parameterName}`);
    }
}

// const arguments = ['cloudformation', 'deploy'];
// arguments.push('--template-file');
// arguments.push(templateFile);
// arguments.push('--stack-name');
// arguments.push(stackName);
// if (parameterOverrides) {
//     const params = JSON.parse(parameterOverrides);
//     arguments.push('--parameter-overrides');
//     for (const paramName in params) {
//         const param = `${paramName}=${params[paramName]}`;
//         arguments.push(param);
//     }
// }

// const capabilities = [];
// if ((capabilityIAM === 'true') || (capabilityIAM === true)) {
//     capabilities.push('CAPABILITY_IAM');
// }

// if ((capabilityNamedIAM === 'true') || (capabilityNamedIAM === true)) {
//     capabilities.push('CAPABILITY_NAMED_IAM');
// }

// if (capabilities.length) {
//     arguments.push('--capabilities');
//     arguments.push(...capabilities);
// }

// execFile('aws', arguments, (error, stdout, stderr) => {
//     if (error) {
//         core.info(arguments.join(','));
//         core.setFailed(`error while trying to deploy ${stackName} with error ${error}`);
//         return;
//     }
//     core.info(`created/updated ${stackName} stack`);
// });
