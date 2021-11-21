import { DynamoDBStreamEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import { QueryInput } from "aws-sdk/clients/dynamodb";
import { sendAlerts } from "./sendalerts";
const ddb = new AWS.DynamoDB({ apiVersion: "2018-05-29" });

export const handler = async (event: DynamoDBStreamEvent): Promise<any> => {
  console.log("DynamoDb Streams", JSON.stringify(event));
  const TableName = process.env.tablename!;
  const alertsQueryInput: QueryInput = {
    TableName,
    KeyConditionExpression: "GSI1PK = :PK",
    ExpressionAttributeValues: {
      ":PK": { S: `alert` },
    },
    IndexName: "GSI1",
  };
  const alertsQueryResult = await ddb.query(alertsQueryInput).promise();
  console.log("alertsQueryResult", JSON.stringify(alertsQueryResult));
  if (alertsQueryResult.Items && alertsQueryResult.Items.length > 0) {
    const { Records } = event;
    for (let iterator = 0; iterator < Records.length; iterator++) {
      const row = Records[iterator];
      if (row.dynamodb && row.dynamodb.Keys && row.dynamodb.Keys.PK.S) {
        const PK = row.dynamodb.Keys.PK.S;
        const rowType = PK.substring(
          0,
          PK.indexOf("#") !== -1 ? PK.indexOf("#") : 999
        );
        console.log({ rowType });
        switch (rowType) {
          case "user":
            break;
          case "class":
            await sendAlerts(row, alertsQueryResult.Items);
            break;
          case "alert":
            break;
          default:
          // do nothing
        }
      }
    }
  }
};
