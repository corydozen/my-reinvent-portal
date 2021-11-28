import { DynamoDBRecord } from "aws-lambda";
import * as AWS from "aws-sdk";

export interface AlertToSend {
  body: string;
  emailAddress: string;
}

export const findAlertsToSend = async (
  row: DynamoDBRecord,
  alerts: AWS.DynamoDB.ItemList,
  alertsToSend: AlertToSend[],
  eventName: "INSERT" | "MODIFY" | "REMOVE"
): Promise<AlertToSend[]> => {
  console.log({
    row: JSON.stringify(row),
    alerts: JSON.stringify(alerts),
    alertsToSend: JSON.stringify(alertsToSend),
    eventName,
    alertsLength: alerts.length,
  });
  for (let iterator = 0; iterator < alerts.length; iterator++) {
    const alert = alerts[iterator];
    console.log({ alert });
    if (alert.parameters.S && row.dynamodb && row.dynamodb.NewImage) {
      const sessionType = JSON.parse(
        row.dynamodb?.NewImage.sessionType.S!
      ) as any;
      const sessionId = row.dynamodb.NewImage.alias.S!;
      const startTime = parseInt(row.dynamodb.NewImage.startTime.N!);
      const parameters = JSON.parse(alert.parameters.S) as AlertParameter[];
      console.log({ parameters });
      // if (eventName === "INSERT") {
      let sendAlert = true;
      for (let iterator = 0; iterator < parameters.length; iterator++) {
        const parameter = parameters[iterator];
        switch (parameter.parameterType) {
          case "sessionType":
            if (sessionType.name !== parameter.parameterData) {
              sendAlert = false;
            }
            break;
          case "sessionIdEquals":
            if (sessionId !== parameter.parameterData) {
              sendAlert = false;
            }
            break;
          case "sessionIdStartsWith":
            if (
              sessionId.substring(
                0,
                (parameter.parameterData as string).length
              ) !== parameter.parameterData
            ) {
              sendAlert = false;
            }
            break;
          case "time":
            const eightHours = 28800000;
            // I'm going to ignore the 'or' case for now
            const { before, after } = parameter.parameterData as TimeParameters;
            if (before) {
              const beforeEpoch = parseInt(before) - eightHours;
              if (beforeEpoch > startTime) {
                sendAlert = false;
              }
            }
            if (after) {
              const afterEpoch = parseInt(after) - eightHours;
              if (afterEpoch < startTime) {
                sendAlert = false;
              }
            }
            break;
          default:
            sendAlert = false;
        }
      }
      console.log({ sendAlert });
      if (sendAlert) {
        const emailIndex = alertsToSend.findIndex(
          e => e.emailAddress === alert.emailAddress.S
        );
        if (emailIndex === -1) {
          alertsToSend.push({
            body: `<h1>Reinvent Catalog Alert</h1><p>Name: ${
              row.dynamodb.NewImage.name.S
            }</p><p>SessionType: ${sessionType.name}</p><p>Description: ${
              row.dynamodb.NewImage.description.S
            }</p><p>session: ${JSON.stringify(
              row
            )}</p><p>alert: ${JSON.stringify(alert)}</p>`,
            emailAddress: alert.emailAddress.S!,
          });
        } else {
          alertsToSend[emailIndex].body += `<hr/><p>Name: ${
            row.dynamodb.NewImage.name.S
          }</p><p>SessionType: ${sessionType.name}</p><p>Description: ${
            row.dynamodb.NewImage.description.S
          }</p><p>session: ${JSON.stringify(row)}</p><p>alert: ${JSON.stringify(
            alert
          )}</p>`;
        }
      }
      // }
    }
  }
  console.log({ alertsToSend });
  return alertsToSend;
};

// copied from src/interfaces.ts
// TODO: this should be stored in a separate location so that both files can reference the same interfaces
export type AlertType = "sns" | "autoregister";
export type AlertJoinParametersWithType = "and" | "or";
export type AlertUpdateOrNewType = "update" | "new" | "both";

export type AlertParameterType =
  | "sessionIdEquals"
  | "sessionIdStartsWith"
  | "time"
  | "sessionType";
export interface DbAlert {
  PK: string;
  SK: string;
  alertType: AlertType;
  parameters: string;
}
//{ "classId": { "startswith": "svs"}, "datetime": { "after": "2021-11-29 09:00" }, "datetime: { "before": "2021-11-29 13:00"} }
export interface TimeParameters {
  before?: string;
  after?: string;
}
export interface AlertParameter {
  parameterType?: AlertParameterType;
  parameterData?: string | TimeParameters;
}
export interface Alert {
  id: string;
  alertType: AlertType;
  updateOrNew: AlertUpdateOrNewType;
  parameters: AlertParameter[];
  joinParametersWith: AlertJoinParametersWithType;
}
