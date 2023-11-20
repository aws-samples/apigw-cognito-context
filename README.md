## Context for Amazon Cognito Access Tokens with Amazon API Gateway

This sample demonstrates how Amazon API Gateway can be used to augment the data available in an Amazon Cognito access token. By leveraging AWS Lambda as a Lambda Authorizer, Amazon API Gateway can populate the context with the Amazon Cognito user's attributes.

### Contents

The CloudFormation template contains an empty Amazon API Gateway REST API, an AWS Lambda function which provides the authorizer logic, an Amazon API Gateway Lambda Authorizer configuration and Permissions which are required for Amazon API Gateway to invoke the Lambda Authorizer function.

### Prerequisites

This sample requires an existing Amazon Cognito User Pool with a client configured.

### Architecture

The sample flow is as follows:

![Image visualising sample flow](<apigw-cognito-context.png>)

1. Amazon Cognito authenticated user submits access token to Amazon API Gateway REST API.
2. Amazon API Gateway invokes an AWS Lambda function as a Lambda Authorizer.
3. The AWS Lambda function validates the access token and retrieves the Amazon Cognito user attributes, embedding them in the context.
4. The Amazon API Gateway REST API calls the backend resource with the additional user data available in the Amazon API Gateway context.

### Output

The output of the Amazon API Gateway Lambda Authorizer will resemble the following:

```
{
  "principalId": "yyyyyyyy", // sub ID from Amazon Cognito
  "policyDocument": {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "execute-api:Invoke",
        "Effect": "Allow",
        "Resource": "arn:aws:execute-api:{regionId}:{accountId}:{apiId}/*/*/*"
      }
    ]
  },
  "context": {
    "sub": "yyyyyyyy",
    "address": "ssssssss",
    "email": "rrrrrrrr",
    "email_verified": "true"
  }
}
```

### Deployment

Deploy the CloudFormation template `cloudformation.json` to `us-east-1` and provide your Cognito User Pool Id and Client Id as parameter values.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

