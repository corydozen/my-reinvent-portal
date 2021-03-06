import appsync = require("@aws-cdk/aws-appsync");
import cognito = require("@aws-cdk/aws-cognito");
import dynamodb = require("@aws-cdk/aws-dynamodb");
import iam = require("@aws-cdk/aws-iam");
import lambda = require("@aws-cdk/aws-lambda");
import s3 = require("@aws-cdk/aws-s3");
import sns = require("@aws-cdk/aws-sns");
import cdk = require("@aws-cdk/core");

export interface AppsyncPreProps {
  dynamodb: PropsFromDynamoDb;
  stackProps: cdk.StackProps;
}

export interface AppsyncProps {
  appsyncPre: PropsFromAppsyncPre;
  cognito: PropsFromCognito;
  dynamodb: PropsFromDynamoDb;
  lambda: PropsFromLambda;
  stackProps: cdk.StackProps;
}

export interface AppsyncResolversProps {
  appsync: PropsFromAppsync;
  stackProps: cdk.StackProps;
}

export interface CognitoProps {
  dynamodb: PropsFromDynamoDb;
  stackProps: cdk.StackProps;
}

export interface LambdaProps {
  dynamodb: PropsFromDynamoDb;
  stackProps: cdk.StackProps;
}

export interface OutputProps {
  cognito: PropsFromCognito;
  appsync: PropsFromAppsync;
  stackProps: cdk.StackProps;
  s3: PropsFromS3;
}

export interface PropsFromAppsync {
  api: appsync.GraphqlApi;
  dynamodbDataSource: appsync.DynamoDbDataSource;
  catalogActionsDataSource: appsync.LambdaDataSource;
}

export interface PropsFromAppsyncPre {
  role: iam.Role;
}

export interface PropsFromCognito {
  userpool: cognito.UserPool;
  webclient: cognito.UserPoolClient;
}

export interface PropsFromDynamoDb {
  table: dynamodb.Table;
}

export interface PropsFromLambda {
  catalogActionsFunction: lambda.Function;
}

export interface PropsFromS3 {
  websiteBucket: s3.Bucket;
}

export interface CreateResolverParams {
  typeName: "Query" | "Mutation";
  fieldName: string;
  props: AppsyncResolversProps;
  responseType: "Lambda" | "Multiple" | "Single";
  dataSource: appsync.DynamoDbDataSource | appsync.LambdaDataSource;
}
