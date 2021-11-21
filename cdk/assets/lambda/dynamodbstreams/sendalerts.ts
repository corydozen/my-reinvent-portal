import { DynamoDBRecord } from "aws-lambda";
import { emailTemplate, EmailTemplateInterface } from "./emailtemplate";
import * as AWS from "aws-sdk";
export const sendAlerts = async (
  row: DynamoDBRecord,
  alerts: AWS.DynamoDB.ItemList
): Promise<any> => {
  //
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
        const params: EmailTemplateInterface = {
          body: `<h1>Reinvent Catalog Alert</h1><p>Name: ${
            row.dynamodb.NewImage.name.S
          }</p><p>SessionType: ${sessionType.name}</p><p>Description: ${
            row.dynamodb.NewImage.description.S
          }</p><p>session: ${JSON.stringify(row)}</p><p>alert: ${JSON.stringify(
            alert
          )}</p>`,
          buttonHref: "",
          buttonText: "",
          footerHtml: "",
          header: "Reinvent Catalog Alert",
          logoHref: "",
          showButton: false,
        };
        await sendEmail(
          params,
          process.env.emailAddress!,
          alert.emailAddress.S!,
          "Reinvent Catalog Alert"
        );
        console.log(`email sent to ${alert.emailAddress.S!}`);
      }
    }
  }
};

const sendEmail = async (
  params: EmailTemplateInterface,
  sourceEmail: string,
  recipientEmail: string,
  subject: string
) => {
  const template: string = emailTemplate(params);
  const sesClient = new AWS.SES();
  const sendEmailRequest = {
    Source: sourceEmail,
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: template,
          Charset: "utf8",
        },
      },
    },
  };
  return await sesClient.sendEmail(sendEmailRequest).promise();
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
