import { config } from "../config";
import { AppsyncPreProps } from "./interfaces";
import cdk = require("@aws-cdk/core");
import iam = require("@aws-cdk/aws-iam");

const { proj } = config;

export class AppsyncPre extends cdk.Stack {
  public readonly role: iam.Role;
  constructor(scope: cdk.Construct, id: string, props: AppsyncPreProps) {
    super(scope, id, props.stackProps);

    const apiPolicyDocument = new iam.PolicyDocument();
    const apiPolicyStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    });
    apiPolicyStatement.addActions(
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem"
    );
    apiPolicyStatement.addResources(
      props.dynamodb.table.tableArn,
      props.dynamodb.table.tableArn + "/*"
    );
    apiPolicyDocument.addStatements(apiPolicyStatement);

    this.role = new iam.Role(this, `${proj}RoleAppsyncDS`, {
      assumedBy: new iam.ServicePrincipal("appsync.amazonaws.com"),
      inlinePolicies: { dynamoDSPolicyDocument: apiPolicyDocument },
    });
  }
}
