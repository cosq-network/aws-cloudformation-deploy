# AWS CloudFormation Deployment GitHub Action

## Description

The AWS CloudFormation Deployment GitHub Action simplifies the process of deploying AWS CloudFormation templates. It automates the deployment process, enabling users to easily deploy infrastructure as code using GitHub Actions.

## Features

- Seamless deployment of AWS CloudFormation templates.
- Supports versioned releases for continuous integration and deployment.
- Flexible configuration options to tailor the deployment process to your needs.

## Getting Started

Follow these steps to integrate and use the AWS CloudFormation Deployment GitHub Action in your project:

1. **Repository Setup:**

   Make sure you have an AWS account and the necessary credentials set up to deploy CloudFormation templates.

2. **Action Configuration:**

   Create a workflow file (e.g., `.github/workflows/aws-cfn-deploy.yml`) in your repository to define the GitHub Actions workflow. Below is an example workflow configuration:

   ```yaml
   name: AWS CloudFormation Deployment

   on:
     push:
       branches:
         - main

   jobs:
     deploy:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout repository
           uses: actions/checkout@v2

         - name: Deploy AWS CloudFormation template
           uses: cosq-network/aws-cloudformation-deploy@v1.1.0
           with:
             stackName: MyCloudFormationStack
             templateFile: path/to/your/template.yaml
             hasIAMCapability: true
             hasIAMNamedCapability: true
             parameterJSON: '{"Key1": "Value1", "Key2": "Value2"}'
   ```

   Customize the configuration according to your project's needs, such as specifying the stack name, template file path, capabilities, and input parameters using the provided options.

3. **Push to Main Branch:**

   Push your changes to the main branch, which will trigger the GitHub Actions workflow to deploy the CloudFormation template.

## Usage

1. Commit your CloudFormation template (e.g., `template.yaml`) to your repository.

2. Push your changes to the main branch.

3. GitHub Actions will automatically trigger the deployment workflow on every push to the main branch.

## Configuration Options

- `stackName`:
  - Name of the stack to be passed to the `--stack-name` argument of the AWS CLI.
  - Required: true

- `templateFile`:
  - Path to the template file to be passed to the `--template-file` argument of the AWS CLI.
  - Required: true

- `hasIAMCapability`:
  - Determines whether to pass `CAPABILITY_IAM` as a capability.
  - Required: false
  - Default: false

- `hasIAMNamedCapability`:
  - Determines whether to pass `CAPABILITY_NAMED_IAM` as a capability.
  - Required: false
  - Default: false

- `parameterJSON`:
  - JSON object containing parameter key-value pairs.
  - Required: false
  - Default: '{}'

## Examples

Deploying a CloudFormation template using the AWS CloudFormation Deployment GitHub Action with input parameters:

```yaml
name: AWS CloudFormation Deployment

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Deploy AWS CloudFormation template
        uses: cosq-network/aws-cloudformation-deploy@v1.1.0
        with:
          stackName: MyCloudFormationStack
          templateFile: path/to/your/template.yaml
          hasIAMCapability: true
          hasIAMNamedCapability: true
          parameterJSON: '{"Key1": "Value1", "Key2": "Value2"}'
```

## License

This project is licensed under the [MIT License](LICENSE).

## Contributions

Contributions are welcome! If you find any issues or would like to improve the action, feel free to submit a pull request.

## Support

If you encounter any problems or have questions, please create an issue in the repository.
