import { OutputProps } from "./interfaces";
import cdk = require("@aws-cdk/core");

export class Output extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: OutputProps) {
    super(scope, id, props.stackProps);
    new cdk.CfnOutput(this, "userpoolid", {
      description: "userpoolid",
      value: props.cognito.userpool.userPoolId,
    });

    new cdk.CfnOutput(this, "webclientid", {
      description: "webclientid",
      value: props.cognito.webclient.userPoolClientId,
    });

    new cdk.CfnOutput(this, "apiurl", {
      description: "apiurl",
      value: props.appsync.api.graphqlUrl,
    });

    new cdk.CfnOutput(this, "bucketUrl", {
      description: "bucketUrl",
      value:
        "http://" +
        props.s3.websiteBucket.bucketName +
        ".s3-website-us-east-1.amazonaws.com/",
    });
  }
}
