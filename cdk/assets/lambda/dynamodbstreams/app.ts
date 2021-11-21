import * as AWS from "aws-sdk";
import { emailTemplate, EmailTemplateInterface } from "./emailtemplate";

export const handler = async (event: any): Promise<any> => {
  console.log("DynamoDb Streams", JSON.stringify(event));
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
