import { config } from "../config";
import cdk = require("@aws-cdk/core");
import s3 = require("@aws-cdk/aws-s3");
import s3deploy = require("@aws-cdk/aws-s3-deployment");
const { proj } = config;

export class S3 extends cdk.Stack {
  public readonly websiteBucket: s3.Bucket;
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    this.websiteBucket = new s3.Bucket(this, `${proj}WebsiteBucket`, {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
    });

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("../build")],
      destinationBucket: this.websiteBucket,
    });

    new cdk.CfnOutput(this, "bucketUrl", {
      description: "bucketUrl",
      value:
        "http://" +
        this.websiteBucket.bucketName +
        ".s3-website-us-east-1.amazonaws.com/",
    });
  }
}
