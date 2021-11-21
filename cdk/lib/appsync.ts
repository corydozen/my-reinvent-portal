import { config } from "../config";
import { AppsyncProps } from "./interfaces";
import cdk = require("@aws-cdk/core");
import appsync = require("@aws-cdk/aws-appsync");

const { proj } = config;

export class Appsync extends cdk.Stack {
  public readonly api: appsync.GraphqlApi;
  public readonly dynamodbDataSource: appsync.DynamoDbDataSource;
  public readonly catalogActionsDataSource: appsync.LambdaDataSource;
  constructor(scope: cdk.Construct, id: string, props: AppsyncProps) {
    super(scope, id, props.stackProps);
    const apiName = `${proj}API`;
    const filePath = "./assets/appsync/schema.graphql";
    const schema = new appsync.Schema({
      filePath,
    });
    this.api = new appsync.GraphqlApi(this, apiName, {
      name: apiName,
      schema,
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: props.cognito.userpool,
            defaultAction: appsync.UserPoolDefaultAction.ALLOW,
          },
        },
      },
    });
    this.dynamodbDataSource = new appsync.DynamoDbDataSource(
      this,
      `${proj}DynamodbDataSource`,
      {
        api: this.api,
        table: props.dynamodb.table,
        serviceRole: props.appsyncPre.role,
      }
    );
    this.catalogActionsDataSource = new appsync.LambdaDataSource(
      this,
      `${proj}CatalogActionsDataSource`,
      {
        api: this.api,
        lambdaFunction: props.lambda.catalogActionsFunction,
      }
    );
  }
}
