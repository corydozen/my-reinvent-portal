import { AppsyncResolversProps, CreateResolverParams } from "./interfaces";
import { config } from "../config";
import cdk = require("@aws-cdk/core");
import appsync = require("@aws-cdk/aws-appsync");

const { proj } = config;

export class AppsyncResolvers extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: AppsyncResolversProps) {
    super(scope, id, props.stackProps);

    const createResolver = (params: CreateResolverParams): appsync.Resolver => {
      const { typeName, fieldName, props, responseType, dataSource } = params;

      const requestMappingTemplate = appsync.MappingTemplate.fromFile(
        `./assets/appsync/resolvers/${typeName}.${fieldName}.vtl`
      );
      const responseMappingTemplate = appsync.MappingTemplate.fromFile(
        `./assets/appsync/resolvers/response.${responseType}.vtl`
      );

      return new appsync.Resolver(this, `${proj}${fieldName}${typeName}`, {
        api: props.appsync.api,
        fieldName,
        typeName,
        dataSource,
        requestMappingTemplate,
        responseMappingTemplate,
      });
    };

    createResolver({
      typeName: "Query",
      fieldName: "getMe",
      props,
      responseType: "Multiple",
      dataSource: props.appsync.dynamodbDataSource,
    });

    createResolver({
      typeName: "Mutation",
      fieldName: "savePassword",
      props,
      responseType: "Single",
      dataSource: props.appsync.dynamodbDataSource,
    });

    createResolver({
      typeName: "Mutation",
      fieldName: "refreshMySessions",
      props,
      responseType: "Single",
      dataSource: props.appsync.catalogActionsDataSource,
    });
  }
}
