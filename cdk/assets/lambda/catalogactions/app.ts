import * as AWS from "aws-sdk";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import {
  QueryInput,
  BatchWriteItemInput,
  BatchWriteItemRequestMap,
  WriteRequest,
} from "aws-sdk/clients/dynamodb";
import { eventId, listSessionsQuery } from "./constants";
import { ListSessionsResult, QueryBody } from "./interfaces";

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

  const TableName = process.env.tablename!;

  const params: QueryInput = {
    TableName,
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
    try {
      let nextToken = true;
      let body: QueryBody = {
        input: { eventId, maxResults: 25 },
      };
      while (nextToken) {
        const awsQueryResult = (await API.graphql(
          graphqlOperation(listSessionsQuery, body)
        )) as ListSessionsResult;
        if (awsQueryResult.data.listSessions.nextToken === null) {
          nextToken = false;
        } else {
          body.input.nextToken = awsQueryResult.data.listSessions.nextToken;
        }
        const sessions = awsQueryResult.data.listSessions.results;
        let writeRequests: WriteRequest[] = [];
        for (let row = 0; row < 25 && row < sessions.length; row++) {
          const session = sessions[row];
          console.log({ session: JSON.stringify(session) });
          const PutRequest = {
            Item: {
              PK: { S: `class#${session.sessionId}` },
              SK: { S: "info" },
              action: { S: session.action },
              alias: { S: session.alias },
              createdAt: { N: session.createdAt.toString() },
              description: { S: session.description },
              duration: { N: session.duration.toString() },
              endTime: { N: session.endTime?.toString() || "0" },
              eventId: { S: session.eventId },
              isConflicting: { S: JSON.stringify(session.isConflicting) },
              isEmbargoed: { BOOL: session.isEmbargoed || false },
              isFavoritedByMe: { BOOL: session.isFavoritedByMe || false },
              isPaidSession: { BOOL: session.isPaidSession || false },
              level: { S: session.level || " " },
              location: { S: session.location || " " },
              myReservationStatus: { S: session.myReservationStatus },
              name: { S: session.name },
              startTime: { N: session.startTime.toString() },
              status: { S: session.status },
              type: { S: session.type },
              capacities: { S: JSON.stringify(session.capacities) },
              customFieldDetails: {
                S: JSON.stringify(session.customFieldDetails),
              },
              package: {
                S: session.package ? JSON.stringify(session.package) : " ",
              },
              price: { N: session.price?.value.toString() || "0" },
              room: { S: JSON.stringify(session.room) },
              sessionType: { S: JSON.stringify(session.sessionType) },
              tracks: { S: session.tracks.map(t => t.name).join(", ") },
            },
          };
          writeRequests.push({ PutRequest });
        }
        let RequestItems: BatchWriteItemRequestMap = {
          [TableName]: writeRequests,
        };
        const batchWriteItemInput: BatchWriteItemInput = {
          RequestItems,
        };
        const result = await ddb.batchWriteItem(batchWriteItemInput).promise();
        console.log({ result });
      }
    } catch (err) {
      console.error("Error!" + JSON.stringify(err));
    }
    return true;
  }
  return false;
};
