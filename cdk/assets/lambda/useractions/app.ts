import * as AWS from "aws-sdk";
import { PostAuthenticationTriggerEvent } from "aws-lambda";
import { PutItemInput } from "aws-sdk/clients/dynamodb";

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

export const createuser = async (
  event: PostAuthenticationTriggerEvent
): Promise<PostAuthenticationTriggerEvent> => {
  console.log(JSON.stringify(event));
  const params: PutItemInput = {
    TableName: process.env.tablename!,
    Item: {
      PK: { S: `user#${event.request.userAttributes.sub}` },
      SK: { S: "info" },
      email: { S: event.request.userAttributes.email },
      lastUpdated: {
        S: new Date().toString(),
      },
      isAdmin: { BOOL: false },
    },
  };
  await ddb.putItem(params).promise();
  return event;
};
