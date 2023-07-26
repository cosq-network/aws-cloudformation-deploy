# Deploy AWS CloudFormation Stack GitHub Action

## Overview

The "Deploy AWS CloudFormation Stack" GitHub Action allows you to create or update an AWS CloudFormation stack using the AWS CLI. It takes input parameters, such as the stack name and template file, from environment variables to perform the deployment. After a successful deployment, the action retrieves the stack outputs and sets them as environment variables in the GitHub workflow.

This GitHub Action is useful for automating the process of deploying AWS CloudFormation stacks as part of your continuous integration (CI) and continuous deployment (CD) workflows.

## Action Inputs

The following environment variables are required to use the "Deploy AWS CloudFormation Stack" GitHub Action:

1. `stackName`: The name of the AWS CloudFormation stack to create or update.

2. `templateFile`: The path to the AWS CloudFormation template file (YAML or JSON format) to be used for the stack deployment.

3. `hasIAMCapability`: A flag to determine whether to pass `CAPABILITY_IAM` as a capability when deploying the stack. Set this variable to `"true"` if your stack requires IAM capability, or leave it unset otherwise.

4. `hasIAMNamedCapability`: A flag to determine whether to pass `CAPABILITY_NAMED_IAM` as a capability when deploying the stack. Set this variable to `"true"` if your stack requires named IAM capability, or leave it unset otherwise.

## Prerequisites

Before using the "Deploy AWS CloudFormation Stack" GitHub Action, ensure that you have configured AWS CLI credentials to interact with your AWS account. To set up AWS CLI credentials in your GitHub Actions workflow, you can use the `aws-actions/configure-aws-credentials` (or similar) task. Here's an example of how to set up AWS CLI credentials before using the action:

```yaml
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v1.0.3
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1 # Modify this to your desired AWS region
```

Replace `${{ secrets.AWS_ACCESS_KEY_ID }}` and `${{ secrets.AWS_SECRET_ACCESS_KEY }}` with your actual AWS access key and secret access key stored in GitHub Secrets. Also, modify the AWS region as per your requirement.

## How to Use

To use the "Deploy AWS CloudFormation Stack" GitHub Action in your repository, follow these steps:

1. Create a new file named `.github/workflows/deploy-stack.yml` in the root directory of your repository.

2. Add the following content to `deploy-stack.yml`:

```yaml
name: Deploy AWS CloudFormation Stack

on:
  push:
    branches:
      - master # Modify this to the branch you want to trigger the action on

jobs:
  deploy-stack:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v2

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1 # Modify this to your desired AWS region

      - name: Deploy AWS CloudFormation Stack
        uses: cosq-network/aws-cloudformation-deploy@v1.0.4
        env:
          stackName: 'your-stack-name'
          templateFile: 'path/to/your/template-file.yaml'
          hasIAMCapability: 'true'
          hasIAMNamedCapability: 'false'
```

Replace `your-stack-name` with your desired AWS CloudFormation stack name, and `path/to/your/template-file.yaml` with the path to your AWS CloudFormation template file. Additionally, modify `hasIAMCapability` and `hasIAMNamedCapability` variables based on your stack requirements.

3. Commit and push the changes to the `master` branch (or the branch you specified in the `on` section of the YAML file).

4. Whenever you push changes to the specified branch, the action will automatically trigger, and the AWS CloudFormation stack deployment will be initiated.

## Outputs

After the successful deployment of the AWS CloudFormation stack, the action will retrieve the stack outputs using the AWS CLI `describe-stacks` command. Each output will be set as an environment variable in the GitHub workflow with the same name as the output key and its value.

For example, if your stack has an output with key `OutputKey1` and value `OutputValue1`, the action will set an environment variable `OutputKey1` with the value `OutputValue1`.

## Conclusion

The "Deploy AWS CloudFormation Stack" GitHub Action simplifies the process of deploying AWS CloudFormation stacks by automating the deployment and retrieving the stack outputs. With this action, you can seamlessly integrate AWS CloudFormation deployments into your CI/CD workflows, saving time and reducing manual interventions. Happy automating!