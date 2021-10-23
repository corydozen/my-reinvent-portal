#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { DynamoDb } from "../lib/dynamodb";
import { config } from "../config";

const { proj, region } = config;

const env = { region };
const app = new cdk.App();
new DynamoDb(app, `${proj}DynamoDb`, { env });
