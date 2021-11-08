import * as cdk from "@aws-cdk/core";
import { Pipeline, Artifact } from "@aws-cdk/aws-codepipeline";
import {
  PipelineProject,
  BuildSpec,
  ComputeType,
  LinuxBuildImage,
} from "@aws-cdk/aws-codebuild";

import {
  GitHubSourceAction,
  CodeBuildAction,
} from "@aws-cdk/aws-codepipeline-actions";
import { config } from "../config";
import { ManagedPolicy } from "@aws-cdk/aws-iam";

const {
  proj,
  sub,
  reinventCognitoClientId,
  reinventCognitoPoolId,
  reinventAppsyncUrl,
  region,
  emailAddress,
  repo,
  owner,
  secretName,
  githubOauthTokenKey,
  branch,
} = config;

export class CodeBuild extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const pipeProject = new PipelineProject(this, `${proj}ProjectBuild`, {
      buildSpec: BuildSpec.fromSourceFilename("buildspec.yml"),
      environment: {
        computeType: ComputeType.MEDIUM,
        buildImage: LinuxBuildImage.STANDARD_5_0,
      },
      environmentVariables: {
        emailAddress: { value: emailAddress },
        sub: { value: sub },
        region: { value: region },
        reinventCognitoClientId: { value: reinventCognitoClientId },
        reinventCognitoPoolId: { value: reinventCognitoPoolId },
        reinventAppsyncUrl: { value: reinventAppsyncUrl },
        proj: { value: proj },
      },
    });

    const pipeline = new Pipeline(this, `${proj}Pipeline`);

    const oauthToken = cdk.SecretValue.secretsManager(secretName, {
      jsonField: githubOauthTokenKey,
    });
    const source = pipeline.addStage({ stageName: "Source" });
    const output = new Artifact();
    const sourceAction = new GitHubSourceAction({
      actionName: `${proj}GitHubSource`,
      repo,
      owner,
      output,
      oauthToken,
      branch,
    });
    source.addAction(sourceAction);
    const build = pipeline.addStage({ stageName: "BuildAndDeploy" });
    const buildOutput = new Artifact();
    const buildAction = new CodeBuildAction({
      project: pipeProject,
      actionName: `${proj}Build`,
      input: output,
      outputs: [buildOutput],
    });
    build.addAction(buildAction);
    pipeProject.role!.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess")
    );
    pipeline.role!.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess")
    );
  }
}
