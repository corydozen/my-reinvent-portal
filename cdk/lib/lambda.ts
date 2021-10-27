import { LambdaProps } from "./interfaces";
import { config } from "../config";
import cdk = require("@aws-cdk/core");
import lambda = require("@aws-cdk/aws-lambda");
import path = require("path");

const { proj } = config;

export class Lambda extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: LambdaProps) {
    super(scope, id, props.stackProps);

    const fn = new lambda.Function(this, `${proj}Function`, {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "app.handler",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../assets/lambda/function")
      ),
    });
  }
}
