#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { DynamoDb } from "../lib/dynamodb";
import { Cognito } from "../lib/cognito";
import { config } from "../config";
import { Output } from "../lib/output";
import { Appsync } from "../lib/appsync";
import { S3 } from "../lib/s3";
import { AppsyncPre } from "../lib/appsync-pre";
import { AppsyncResolvers } from "../lib/appsync-resolvers";

const { proj, region } = config;

const env = { region };
const app = new cdk.App();
const dynamodb = new DynamoDb(app, `${proj}DynamoDb`, { env });
const cognito = new Cognito(app, `${proj}Cognito`, {
  stackProps: { env },
  dynamodb,
});
const appsyncPre = new AppsyncPre(app, `${proj}AppsyncPre`, {
  stackProps: { env },
  dynamodb,
});
const appsync = new Appsync(app, `${proj}Appsync`, {
  stackProps: { env },
  appsyncPre,
  cognito,
  dynamodb,
});
const s3 = new S3(app, `${proj}S3`, { env });
new AppsyncResolvers(app, `${proj}AppsyncResolvers`, {
  stackProps: { env },
  appsync,
});
new Output(app, `${proj}Output`, { stackProps: { env }, cognito, appsync, s3 });
