import { CognitoProps } from "./interfaces";
import { config } from "../config";
import cdk = require("@aws-cdk/core");
import iam = require("@aws-cdk/aws-iam");
import lambda = require("@aws-cdk/aws-lambda");
import cognito = require("@aws-cdk/aws-cognito");
import path = require("path");

const { proj, emailAddress } = config;

export class Cognito extends cdk.Stack {
  public readonly userpool: cognito.UserPool;
  public readonly webclient: cognito.UserPoolClient;
  constructor(scope: cdk.Construct, id: string, props: CognitoProps) {
    super(scope, id, props.stackProps);

    const postConfirmation = new lambda.Function(this, `${proj}CreateUser`, {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: "app.createuser",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../assets/lambda/useractions")
      ),
      environment: {
        tablename: props.dynamodb.table.tableName,
      },
      timeout: cdk.Duration.seconds(30),
    });

    this.userpool = new cognito.UserPool(this, `${proj}UserPool`, {
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      lambdaTriggers: {
        postConfirmation,
      },
      passwordPolicy: {
        minLength: 8,
        requireDigits: false,
        requireLowercase: false,
        requireSymbols: false,
        requireUppercase: false,
      },
    });

    this.webclient = new cognito.UserPoolClient(this, `${proj}UserPoolClient`, {
      userPool: this.userpool,
      userPoolClientName: "web",
      generateSecret: false,
    });

    // this.webclient = new cognito.CfnUserPoolClient(
    //   this,
    //   `${proj}UserPoolClient`,
    //   {
    //     clientName: "web",
    //     userPoolId: this.userpool.userPoolId,
    //     generateSecret: false,
    //     explicitAuthFlows: ["USER_PASSWORD_AUTH", "ADMIN_NO_SRP_AUTH"],
    //   }
    // );

    const role = postConfirmation.role as iam.Role;

    const policyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [
        props.dynamodb.table.tableArn,
        `arn:aws:ses:us-east-1:${this.account}:identity/${emailAddress}`,
      ],
      actions: ["dynamodb:PutItem", "ses:SendEmail"],
    });
    const policy = new iam.Policy(this, `${proj}CreateUserPolicy`);
    policy.addStatements(policyStatement);
    role.attachInlinePolicy(policy);
  }
}
