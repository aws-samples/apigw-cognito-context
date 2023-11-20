import { CognitoJwtVerifier } from "aws-jwt-verify";
import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL_ID,
    tokenUse: "access",
    clientId: process.env.CLIENT_ID,
});

const generatePolicy = (principalId, effect, attributes) => {
    const policy = {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: process.env.RESOURCE,
            }],
        },
    };
    // Add Cognito user attributes to context
    if (attributes) {
        policy.context = attributes.reduce((accumulator, { Name, Value}) => {
            return { ...accumulator, [Name]: Value }
        }, {});
    };
    return policy;
};

export const handler = async (event) => {
    try {
        const payload = await verifier.verify(
            event.authorizationToken,
        );
        // Token is valid, get user attributes from Cognito
        const client = new CognitoIdentityProviderClient(payload);
        const input = {
            AccessToken: event.authorizationToken,
        };
        const command = new GetUserCommand(input);
        const response = await client.send(command);
        return generatePolicy(payload.sub, "Allow", response.UserAttributes);
    } catch {
        console.log("Token not valid!");
        return generatePolicy("Unknown", "Deny");
    }
}