import { eventId, logIntoReinventPortal, mySessionsQuery } from "./constants";
import * as AWS from "aws-sdk";
import API, { graphqlOperation } from "@aws-amplify/api";
import { MySessionsResult } from "./interfaces";
import {
  BatchWriteItemInput,
  BatchWriteItemRequestMap,
  QueryInput,
  WriteRequest,
} from "aws-sdk/clients/dynamodb";

export const refreshMySessions = async (
  event: any,
  ddb: AWS.DynamoDB
): Promise<boolean> => {
  await logIntoReinventPortal(event.sub, ddb);
  const awsQueryResult = (await API.graphql(
    graphqlOperation(mySessionsQuery, { eventId })
  )) as MySessionsResult;
  console.log(JSON.stringify(awsQueryResult));
  const mySessions = awsQueryResult.data.event.mySessions.items;
  const TableName = process.env.tablename!;
  const sessionsInDynamoQuery: QueryInput = {
    TableName,
    KeyConditionExpression: "PK = :PK and begins_with(SK, :SK)",
    ExpressionAttributeValues: {
      ":PK": { S: `user#${event.sub}` },
      ":SK": { S: "class#" },
    },
  };

  const sessionsInDynamo = await ddb.query(sessionsInDynamoQuery).promise();
  console.log("sessionsInDynamo", JSON.stringify(sessionsInDynamo));
  let deleteRequests: WriteRequest[] = [];
  // Delete sessions that are no longer present
  if (sessionsInDynamo.Items) {
    for (let row = 0; row < sessionsInDynamo.Items.length; row++) {
      if (
        mySessions.findIndex(s => {
          let PK =
            sessionsInDynamo.Items && sessionsInDynamo.Items[row].PK
              ? sessionsInDynamo.Items[row].PK?.S
              : "";
          PK = PK || "";
          if (PK.length > 36) {
            return s.sessionId === PK.substring(PK.length - 36); //class#registered|favorited#classid
          } else {
            return false;
          }
        }) === -1
      ) {
        // didn't find it!
        const DeleteRequest = {
          Key: {
            PK: sessionsInDynamo.Items[row].PK,
            SK: sessionsInDynamo.Items[row].SK,
          },
        };
        deleteRequests.push({ DeleteRequest });
      }
    }
    if (deleteRequests.length > 0) {
      let RequestItems: BatchWriteItemRequestMap = {
        [TableName]: deleteRequests,
      };
      const batchWriteItemInput: BatchWriteItemInput = {
        RequestItems,
      };
      const result = await ddb.batchWriteItem(batchWriteItemInput).promise();
      console.log("batchDelete", { result });
    }

    let writeRequests: WriteRequest[] = [];
    // Add sessions that are missing
    for (let row = 0; row < mySessions.length; row++) {
      if (
        sessionsInDynamo.Items.findIndex(
          s =>
            s.PK &&
            s.PK.S &&
            s.PK.S.substring(s.PK.S.length - 36) === mySessions[row].sessionId
        ) === -1
      ) {
        // didn't find it
        const PutRequest = {
          Item: {
            PK: { S: `user#${event.sub}` },
            SK: { S: `class#registered#${mySessions[row].sessionId}` },
            name: { S: mySessions[row].name },
            description: { S: mySessions[row].description },
            startTime: { N: mySessions[row].startTime.toString() },
            endTime: { N: mySessions[row].endTime?.toString() || "0" },
            duration: { N: mySessions[row].duration.toString() },
            sessionType: { S: mySessions[row].sessionType.name },
            room: {
              S: `${mySessions[row].venue.name} at ${mySessions[row].room.name}`,
            },
            myReservationStatus: { S: mySessions[row].myReservationStatus },
          },
        };
        writeRequests.push({ PutRequest });
      }
    }
    if (writeRequests.length > 0) {
      let RequestItems: BatchWriteItemRequestMap = {
        [TableName]: writeRequests,
      };
      const batchWriteItemInput: BatchWriteItemInput = {
        RequestItems,
      };
      const result = await ddb.batchWriteItem(batchWriteItemInput).promise();
      console.log("batchPut", { result });
    }
  }
  return true;
};
