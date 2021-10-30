#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { DynamoDb } from "../lib/dynamodb";
import { Cognito } from "../lib/cognito";
import { config } from "../config";
import { Output } from "../lib/output";
import { Appsync } from "../lib/appsync";
import { S3 } from "../lib/s3";

const { proj, region } = config;

const env = { region };
const app = new cdk.App();
const dynamodb = new DynamoDb(app, `${proj}DynamoDb`, { env });
const cognito = new Cognito(app, `${proj}Cognito`, {
  stackProps: { env },
  dynamodb,
});
const appsync = new Appsync(app, `${proj}Appsync`, {
  stackProps: { env },
  cognito,
  dynamodb,
});
const s3 = new S3(app, `${proj}S3`, { env });
new Output(app, `${proj}Output`, { stackProps: { env }, cognito, appsync, s3 });
