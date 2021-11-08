import Amplify from "aws-amplify";
import { QueryInput } from "aws-sdk/clients/dynamodb";

export const listSessionsQuery =
  "query ListSessions($input: ListSessionsInput!) {\n  listSessions(input: $input) {\n    results {\n      ...SessionFieldFragment\n      isConflicting {\n        reserved {\n          sessionId\n          isPaidSession\n          __typename\n        }\n        waitlisted {\n          sessionId\n          isPaidSession\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    totalCount\n    nextToken\n    __typename\n  }\n}\n\nfragment SessionFieldFragment on Session {\n  action\n  alias\n  createdAt\n  description\n  duration\n  endTime\n  isConflicting {\n    reserved {\n      alias\n      createdAt\n      name\n      sessionId\n      type\n      __typename\n    }\n    waitlisted {\n      alias\n      createdAt\n      name\n      sessionId\n      type\n      __typename\n    }\n    __typename\n  }\n  isEmbargoed\n  isFavoritedByMe\n  isPaidSession\n  isPaidSession\n  level\n  location\n  myReservationStatus\n  name\n  sessionId\n  startTime\n  status\n  type\n  capacities {\n    reservableRemaining\n    waitlistRemaining\n    __typename\n  }\n  customFieldDetails {\n    name\n    type\n    visibility\n    fieldId\n    ... on CustomFieldValueFlag {\n      enabled\n      __typename\n    }\n    ... on CustomFieldValueSingleSelect {\n      value {\n        fieldOptionId\n        name\n        __typename\n      }\n      __typename\n    }\n    ... on CustomFieldValueMultiSelect {\n      values {\n        fieldOptionId\n        name\n        __typename\n      }\n      __typename\n    }\n    ... on CustomFieldValueHyperlink {\n      text\n      url\n      __typename\n    }\n    __typename\n  }\n  package {\n    itemId\n    __typename\n  }\n  price {\n    currency\n    value\n    __typename\n  }\n  room {\n    name\n    venue {\n      name\n      __typename\n    }\n    __typename\n  }\n  sessionType {\n    name\n    __typename\n  }\n  tracks {\n    name\n    __typename\n  }\n  __typename\n}\n";

export const mySessionsQuery =
  "query MySessions($eventId: ID!, $limit: Int, $nextToken: String) {\n  event(id: $eventId) {\n    eventId\n    name\n    mySessions(limit: $limit, nextToken: $nextToken) {\n      items {\n        ...SessionFieldFragment\n        __typename\n      }\n      nextToken\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment SessionFieldFragment on Session {\n  action\n  alias\n  createdAt\n  description\n  duration\n  endTime\n  eventId\n  isConflicting {\n    reserved {\n      alias\n      createdAt\n      eventId\n      name\n      sessionId\n      type\n      __typename\n    }\n    waitlisted {\n      alias\n      createdAt\n      eventId\n      name\n      sessionId\n      type\n      __typename\n    }\n    __typename\n  }\n  isEmbargoed\n  isFavoritedByMe\n  isPaidSession\n  level\n  location\n  myReservationStatus\n  name\n  sessionId\n  startTime\n  status\n  type\n  capacities {\n    reservableRemaining\n    waitlistRemaining\n    __typename\n  }\n  customFieldDetails {\n    name\n    type\n    visibility\n    fieldId\n    ... on CustomFieldValueFlag {\n      enabled\n      __typename\n    }\n    ... on CustomFieldValueSingleSelect {\n      value {\n        fieldOptionId\n        name\n        __typename\n      }\n      __typename\n    }\n    ... on CustomFieldValueMultiSelect {\n      values {\n        fieldOptionId\n        name\n        __typename\n      }\n      __typename\n    }\n    ... on CustomFieldValueHyperlink {\n      text\n      url\n      __typename\n    }\n    __typename\n  }\n  package {\n    itemId\n    __typename\n  }\n  price {\n    currency\n    value\n    __typename\n  }\n  venue {\n    name\n    __typename\n  }\n  room {\n    name\n    __typename\n  }\n  sessionType {\n    name\n    __typename\n  }\n  tracks {\n    name\n    __typename\n  }\n  __typename\n}\n";

export const eventId = "b84dca69-6995-4e60-bc3f-7bb7a6d170d1";

export const logIntoReinventPortal = async (sub: string, ddb: AWS.DynamoDB) => {
  const {
    region,
    reinventCognitoPoolId,
    reinventCognitoClientId,
    reinventAppsyncUrl,
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
    const emailAddress = response.Items[0].emailAddress.S;
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
    return user;
  }
};
