import { DynamoDBStreamEvent } from "aws-lambda";
import * as AWS from "aws-sdk";
import { QueryInput } from "aws-sdk/clients/dynamodb";
import { emailTemplate, EmailTemplateInterface } from "./emailtemplate";
import { AlertToSend, findAlertsToSend } from "./sendalerts";
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
    let alertsToSend: AlertToSend[] = [];
    for (let iterator = 0; iterator < Records.length; iterator++) {
      const row = Records[iterator];
      if (row.dynamodb && row.dynamodb.Keys && row.dynamodb.Keys.PK.S) {
        const PK = row.dynamodb.Keys.PK.S;
        const rowType = PK.substring(
          0,
          PK.indexOf("#") !== -1 ? PK.indexOf("#") : 999
        );
        console.log({ rowType });
        const { eventName } = row;
        if (eventName === "MODIFY" || eventName === "INSERT") {
          switch (rowType) {
            case "class":
              alertsToSend = await findAlertsToSend(
                row,
                alertsQueryResult.Items,
                alertsToSend,
                eventName
              );
              break;
            case "user":
            case "alert":
            default:
            // do nothing
          }
        }
      }
    }
    for (let iterator = 0; iterator < alertsToSend.length; iterator++) {
      const params: EmailTemplateInterface = {
        body: alertsToSend[iterator].body,
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
        alertsToSend[iterator].emailAddress,
        "Reinvent Catalog Alert"
      );
      console.log(`email sent to ${alertsToSend[iterator].emailAddress}`);
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
