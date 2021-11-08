import { logIntoReinventPortal, mySessionsQuery } from "./constants";
import * as AWS from "aws-sdk";
import API, { graphqlOperation } from "@aws-amplify/api";
import { ListSessionsResult } from "./interfaces";

export const refreshMySessions = async (
  event: any,
  ddb: AWS.DynamoDB
): Promise<boolean> => {
  await logIntoReinventPortal(event.sub, ddb);
  const awsQueryResult = (await API.graphql(
    graphqlOperation(mySessionsQuery)
  )) as ListSessionsResult;
  console.log({ awsQueryResult });
  return true;
};
