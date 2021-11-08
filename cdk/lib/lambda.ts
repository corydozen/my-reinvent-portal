import { config } from "../config";
import { LambdaProps } from "./interfaces";
import cdk = require("@aws-cdk/core");
import events = require("@aws-cdk/aws-events");
import eventsTargets = require("@aws-cdk/aws-events-targets");
import iam = require("@aws-cdk/aws-iam");
import lambda = require("@aws-cdk/aws-lambda");
import path = require("path");

const {
  proj,
  sub,
  reinventCognitoClientId,
  reinventCognitoPoolId,
  reinventAppsyncUrl,
  region,
  emailAddress,
} = config;

export class Lambda extends cdk.Stack {
  public readonly catalogActionsFunction: lambda.Function;
  constructor(scope: cdk.Construct, id: string, props: LambdaProps) {
    super(scope, id, props.stackProps);
    this.catalogActionsFunction = new lambda.Function(
      this,
      `${proj}RefreshCatalogFunction`,
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "app.handler",
        code: lambda.Code.fromAsset(
          path.join(__dirname, "../assets/lambda/catalogactions"),
          {
            exclude: ["*.ts", "catalogactions.zip", "README.md", "LICENSE"],
          }
        ),
        environment: {
          sub,
          reinventCognitoClientId,
          reinventCognitoPoolId,
          reinventAppsyncUrl,
          region,
          tablename: props.dynamodb.table.tableName,
          emailAddress,
        },
        timeout: cdk.Duration.minutes(10),
        memorySize: 256,
      }
    );

    const refreshCatalogFunctionRole = this.catalogActionsFunction
      .role as iam.Role;

    const dynamoPolicy = new iam.Policy(this, `${proj}DynamoPolicy`);
    const dynamoPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    });

    dynamoPolicyStatement.addActions("dynamodb:GetItem");
    dynamoPolicyStatement.addActions("dynamodb:PutItem");
    dynamoPolicyStatement.addActions("dynamodb:UpdateItem");
    dynamoPolicyStatement.addActions("dynamodb:Query");
    dynamoPolicyStatement.addActions("dynamodb:BatchWriteItem");

    dynamoPolicyStatement.addResources(props.dynamodb.table.tableArn);

    dynamoPolicy.addStatements(dynamoPolicyStatement);
    refreshCatalogFunctionRole.attachInlinePolicy(dynamoPolicy);

    const eventDaySchedule = events.Schedule.cron({
      hour: "0",
      minute: "55",
      month: "*",
      year: "*",
      weekDay: "*",
    });
    const refreshCatalogFunctionTarget = new eventsTargets.LambdaFunction(
      this.catalogActionsFunction
    );

    new events.Rule(this, `${proj}SavedAuctionWarningEmailRule`, {
      enabled: true,
      schedule: eventDaySchedule,
      targets: [refreshCatalogFunctionTarget],
    });

    new cdk.CfnOutput(this, "refreshCatalogFunctionCliCmd", {
      description: "refreshCatalogFunctionCliCmd",
      value:
        "cd assets/lambda/catalogactions && yarn --prod --frozen-lockfile && touch catalogactions.zip && rm catalogactions.zip && find ./ -path './*' ! -path './prod_node_modules/*' ! -path './dev_node_modules/*' ! -path './*.ts' -type f -print | zip ./catalogactions.zip -@ && aws lambda update-function-code --region us-east-1 --function-name" +
        this.catalogActionsFunction.functionName +
        " --zip-file fileb://./catalogactions.zip --profile=portal-reinvented && rm catalogactions.zip && cd ../../../..",
    });
  }
}

// cd assets/lambda/catalogactions && yarn --prod --frozen-lockfile && touch catalogactions.zip && rm catalogactions.zip && find ./ -path './*' ! -path './*.ts' -type f -print | zip ./catalogactions.zip -@ && aws lambda update-function-code --region us-east-1 --function-name PersonalReinventBot2021La-PersonalReinventBot2021R-I6blW14qDgo2 --zip-file fileb://./catalogactions.zip --profile=portal-reinvented && rm catalogactions.zip && cd ../../../..
