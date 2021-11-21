import { DynamoDBStreamEvent } from "aws-lambda";
import { sendAlerts } from "./sendalerts";

export const handler = async (event: DynamoDBStreamEvent): Promise<any> => {
  console.log("DynamoDb Streams", JSON.stringify(event));
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
          sendAlerts(row);
          break;
        case "alert":
          break;
        default:
        // do nothing
      }
    }
  }
};
