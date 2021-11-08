import { API, graphqlOperation } from "aws-amplify";
import {
  BatchWriteItemInput,
  BatchWriteItemRequestMap,
  WriteRequest,
} from "aws-sdk/clients/dynamodb";
import { eventId, listSessionsQuery, logIntoReinventPortal } from "./constants";
import { ListSessionsInput, ListSessionsResult } from "./interfaces";
import * as AWS from "aws-sdk";

export const refreshCatalog = async (
  event: any,
  ddb: AWS.DynamoDB
): Promise<boolean> => {
  const user = await logIntoReinventPortal(process.env.sub!, ddb);
  const TableName = process.env.tablename!;

  if (user) {
    let nextToken = true;
    let body: ListSessionsInput = {
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
            isConflicting: { S: JSON.stringify(session.isConflicting) },
            isEmbargoed: { BOOL: session.isEmbargoed || false },
            isFavoritedByMe: { BOOL: session.isFavoritedByMe || false },
            isPaidSession: { BOOL: session.isPaidSession || false },
            level: { S: session.level || " " },
            location: { S: session.location || " " },
            myReservationStatus: { S: session.myReservationStatus },
            name: { S: session.name },
            startTime: { N: session.startTime?.toString() || "0" },
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
    return true;
  }
  return false;
};
