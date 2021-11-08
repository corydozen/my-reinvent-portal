import { refreshCatalog } from "./refreshCatalog";
import { refreshMySessions } from "./refreshMySessions";
import * as AWS from "aws-sdk";

const ddb = new AWS.DynamoDB({ apiVersion: "2018-05-29" });

export const handler = async (event: any): Promise<boolean> => {
  console.log(JSON.stringify(event));
  switch (event.function) {
    case "refreshMySessions":
      return await refreshMySessions(event, ddb);
    default:
      // If it doesn't have an event.function, it came from the cron and needs to refresh the catalog
      return await refreshCatalog(event, ddb);
  }
};
