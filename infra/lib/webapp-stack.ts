import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as lifligCdk from "@liflig/cdk";
import * as webappDeploy from "@capraconsulting/webapp-deploy-lambda";
import { Construct } from "constructs";
import GithubAccessStack from "./github-access-stack";

interface Props extends cdk.StackProps {}

export interface GitHubStackProps extends cdk.StackProps {
  readonly repositoryConfig: { owner: string; repo: string; filter?: string }[];
}

class WebappStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const artifactsBucket = new s3.Bucket(this, "ArtifactsBucket", {
      bucketName: "koseprogg-event-webapp-artifacts",
    });

    /*const cloudFrontCertificate = new acm.Certificate(
      this,
      "KoseproggWebappCNAMECertificate",
      {
        domainName: "aibattles.koseprogg.no",
      }
    );*/

    const cloudFrontCertificate = acm.Certificate.fromCertificateArn(
      this,
      "KoseproggAiBattlesCertificate",
      "arn:aws:acm:us-east-1:859141738257:certificate/c94eba62-1f90-46d5-82d7-b016686efd37"
    );

    new cdk.CfnOutput(this, "CertArn", {
      value: cloudFrontCertificate.certificateArn,
    });

    const webapp = new lifligCdk.webapp.Webapp(this, "KoseproggWebapp", {
      domainNames: ["aibattles.koseprogg.no"],
      cloudfrontCertificate: cloudFrontCertificate,
    });

    webapp.addDeployment(
      webappDeploy.Source.bucket(artifactsBucket, "app/latest.zip")
    );

    new GithubAccessStack(this, "KoseproggGithubActionsAccess", {
      deployRole: "GithubDeployRole",
      repositoryConfig: [
        {
          owner: "koseprogg",
          repo: "tic-tac-toe-webapp",
          // filter: "main",
        },
        {
          owner: "koseprogg",
          repo: "better-tic-tac-toe",
        },
      ],
      deploymentBucket: artifactsBucket,
    });
  }
}

export default WebappStack;
