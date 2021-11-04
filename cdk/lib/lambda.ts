import { config } from "../config";
import { LambdaProps } from "./interfaces";
import cdk = require("@aws-cdk/core");
import events = require("@aws-cdk/aws-events");
import eventsTargets = require("@aws-cdk/aws-events-targets");
import lambda = require("@aws-cdk/aws-lambda");
import path = require("path");

const { proj, sub } = config;

export class Lambda extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: LambdaProps) {
    super(scope, id, props.stackProps);

    const refreshCatalogFunction = new lambda.Function(
      this,
      `${proj}RefreshCatalogFunction`,
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: "app.refreshCatalog",
        code: lambda.Code.fromAsset(
          path.join(__dirname, "../assets/lambda/catalogactions")
        ),
        environment: {
          sub,
        },
        timeout: cdk.Duration.minutes(10),
      }
    );

    const eventDaySchedule = events.Schedule.cron({
      hour: "0",
      minute: "0",
      month: "*",
      year: "*",
      weekDay: "*",
    });
    const refreshCatalogFunctionTarget = new eventsTargets.LambdaFunction(
      refreshCatalogFunction
    );

    new events.Rule(this, `${proj}SavedAuctionWarningEmailRule`, {
      enabled: true,
      schedule: eventDaySchedule,
      targets: [refreshCatalogFunctionTarget],
    });
  }
}
