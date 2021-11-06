import * as AWS from "aws-sdk";
import Amplify from "aws-amplify";
import { QueryInput } from "aws-sdk/clients/dynamodb";

const ddb = new AWS.DynamoDB({ apiVersion: "2018-05-29" });

export const refreshCatalog = async (event: any): Promise<boolean> => {
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(process.env));
  const {
    region,
    reinventCognitoPoolId,
    reinventCognitoClientId,
    reinventAppsyncUrl,
    emailAddress,
    sub,
    tablename,
  } = process.env;

  const params: QueryInput = {
    TableName: tablename!,
    KeyConditionExpression: "PK = :PK and SK = :SK",
    ExpressionAttributeValues: {
      ":PK": { S: `user#${sub}` },
      ":SK": { S: "info" },
    },
  };
  const response = await ddb.query(params).promise();
  console.log({ response: JSON.stringify(response) });

  if (response.Items && response.Items.length > 0) {
    const password = response.Items[0].awsPassword.S;
    Amplify.configure({
      Auth: {
        region,
        userPoolId: reinventCognitoPoolId,
        userPoolWebClientId: reinventCognitoClientId,
      },
      API: {
        aws_appsync_graphqlEndpoint: reinventAppsyncUrl,
        aws_appsync_region: region,
        aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
      },
      aws_appsync_graphqlEndpoint: reinventAppsyncUrl,
      aws_appsync_region: region,
      aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
    });
    const user = await Amplify.Auth.signIn(emailAddress, password);
    console.log({ user });
    return true;
  }
  return false;
};
