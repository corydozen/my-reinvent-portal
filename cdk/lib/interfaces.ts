import appsync = require("@aws-cdk/aws-appsync");
import cognito = require("@aws-cdk/aws-cognito");
import dynamodb = require("@aws-cdk/aws-dynamodb");
import s3 = require("@aws-cdk/aws-s3");
import cdk = require("@aws-cdk/core");

export interface AppsyncProps {
  cognito: PropsFromCognito;
  dynamodb: PropsFromDynamoDb;
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
}

export interface PropsFromCognito {
  userpool: cognito.UserPool;
  webclient: cognito.UserPoolClient;
}

export interface PropsFromDynamoDb {
  table: dynamodb.Table;
}

export interface PropsFromS3 {
  websiteBucket: s3.Bucket;
}
