# CloudFormation Deploy Action

This GitHub Action creates or updates an AWS CloudFormation stack using the AWS CLI. It accepts the following inputs:

- `stackName`: Name of the stack to be passed to the `--stack-name` argument of the AWS CLI.
- `templateFile`: Path to the template file to be passed to the `--template-file` argument of the AWS CLI.
- `parameterFile`: Path to a JSON parameter file to be pre-processed and passed to the `--parameter-overrides` argument of the AWS CLI.
- `hasIAMCapability`: Determines whether to pass `CAPABILITY_IAM` as a capability. (Optional, default: `false`)
- `hasIAMNamedCapability`: Determines whether to pass `CAPABILITY_NAMED_IAM` as a capability. (Optional, default: `false`)

The `parameterFile` is pre-processed so that all patterns like `$(VAR)` inside the file are replaced by respective environment variables with the same name (`VAR`) in the GitHub Action context.

Once the stack is successfully created or updated, the action retrieves the outputs of the stack using the `aws cloudformation describe-stacks` command. Each output is then set as an environment variable in GitHub with the same name as the output name and value.

## Example usage

```yaml
on: [push]

jobs:
  deploy_stack:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Deploy CloudFormation Stack
      uses: your-username/cloudformation-deploy-action@v1
      with:
        stackName: 'MyCloudFormationStack'
        templateFile: 'path/to/cloudformation-template.yml'
        parameterFile: 'path/to/parameter-file.json'
        hasIAMCapability: true
        hasIAMNamedCapability: false
