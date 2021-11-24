import * as AWS from "aws-sdk";
import { PostAuthenticationTriggerEvent } from "aws-lambda";
import { PutItemInput, QueryInput } from "aws-sdk/clients/dynamodb";

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

interface Person {
  email: string;
  sub: string;
}

export const createuser = async (
  event: PostAuthenticationTriggerEvent
): Promise<PostAuthenticationTriggerEvent> => {
  console.log(JSON.stringify(event));
  const TableName = process.env.tablename!;
  const params: PutItemInput = {
    TableName,
    Item: {
      PK: { S: `user#${event.request.userAttributes.sub}` },
      SK: { S: "info" },
      email: { S: event.request.userAttributes.email },
      lastUpdated: {
        S: new Date().toString(),
      },
    },
  };
  await ddb.putItem(params).promise();
  const getOverviewQueryInput: QueryInput = {
    TableName,
    KeyConditionExpression: "PK = :PK",
    ExpressionAttributeValues: {
      ":PK": { S: "overview" },
    },
  };
  const overviewQueryResult = await ddb.query(getOverviewQueryInput).promise();
  console.log({ overviewQueryResult });
  let everybody: Person[] = [];
  const me: Person = {
    email: event.request.userAttributes.email,
    sub: event.request.userAttributes.sub,
  };
  if (
    overviewQueryResult.Items &&
    overviewQueryResult.Items.length > 0 &&
    overviewQueryResult.Items[0].everybody.S
  ) {
    // There will only be one if there are any
    everybody = JSON.parse(
      overviewQueryResult.Items[0].everybody.S
    ) as Person[];
    everybody.push(me);
  } else {
    everybody = [me];
  }
  const putOverviewParams: PutItemInput = {
    TableName,
    Item: {
      PK: { S: "overview" },
      everybody: { S: JSON.stringify(everybody) },
      lastUpdated: { S: new Date().toString() },
    },
  };
  await ddb.putItem(putOverviewParams).promise();
  return event;
};
