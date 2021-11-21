import { DynamoDBRecord } from "aws-lambda";
import * as AWS from "aws-sdk";

export interface AlertToSend {
  body: string;
  emailAddress: string;
}

export const findAlertsToSend = async (
  row: DynamoDBRecord,
  alerts: AWS.DynamoDB.ItemList,
  alertsToSend: AlertToSend[]
): Promise<AlertToSend[]> => {
  for (let iterator = 0; iterator > alerts.length; iterator++) {
    const alert = alerts[iterator];
    const joinParametersWith = alert.joinParametersWith
      .S as AlertJoinParametersWithType;
    if (alert.parameters.S && row.dynamodb && row.dynamodb.NewImage) {
      const sessionType = JSON.parse(
        row.dynamodb?.NewImage.sessionType.S!
      ) as any;
      const parameters = JSON.parse(alert.parameters.S) as AlertParameter[];
      console.log({ parameters });
      let sendAlert = joinParametersWith === "or" ? false : true;
      for (let iterator = 0; iterator < parameters.length; iterator++) {
        const parameter = parameters[iterator];
        switch (parameter.parameterType) {
          case "sessionType":
            if (
              sessionType.name === parameter.parameterData &&
              joinParametersWith === "or"
            ) {
              sendAlert = true;
            }
            if (
              sessionType.name !== parameter.parameterData &&
              joinParametersWith === "and"
            ) {
              sendAlert = false;
            }
            break;
        }
      }
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
    }
  }
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
  before?: String;
  after?: String;
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
