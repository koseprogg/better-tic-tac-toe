import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

// inspiration: https://github.com/dannysteenman/aws-cdk-examples/blob/main/openid-connect-github/main.ts

export interface GitHubStackProps extends cdk.StackProps {
  /**
   * Name of the deploy role to assume in GitHub Actions.
   *
   * @default - 'exampleGitHubDeployRole'
   */
  readonly deployRole: string;
  /**
   * The sub prefix string from the JWT token used to be validated by AWS. Appended after `repo:${owner}/${repo}:`
   * in an IAM role trust relationship. The default value '*' indicates all branches and all tags from this repo.
   *
   * Example:
   * repo:octo-org/octo-repo:ref:refs/heads/demo-branch - only allowed from `demo-branch`
   * repo:octo-org/octo-repo:ref:refs/tags/demo-tag - only allowed from `demo-tag`.
   * repo:octo-org/octo-repo:pull_request - only allowed from the `pull_request` event.
   * repo:octo-org/octo-repo:environment:Production - only allowd from `Production` environment name.
   *
   * @default '*'
   * @see https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect#configuring-the-oidc-trust-with-the-cloud
   */
  readonly repositoryConfig: { owner: string; repo: string; filter?: string }[];
  deploymentBucket: s3.IBucket;
}

class GithubAccessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GitHubStackProps) {
    super(scope, id, props);

    const githubDomain = "token.actions.githubusercontent.com";

    const githubProvider = new iam.OpenIdConnectProvider(
      this,
      "KoseproggGithubProvider",
      {
        url: `https://${githubDomain}`,
        clientIds: ["sts.amazonaws.com"],
      }
    );

    const iamRepoDeployAccess = props.repositoryConfig.map(
      (r) => `repo:${r.owner}/${r.repo}:${r.filter ?? "*"}`
    );

    // grant only requests coming from a specific GitHub repository.
    const conditions: iam.Conditions = {
      StringLike: {
        [`${githubDomain}:sub`]: iamRepoDeployAccess,
      },
    };

    const openidConnectRole = new iam.Role(this, "KoseproggGithubDeployRole", {
      assumedBy: new iam.WebIdentityPrincipal(
        githubProvider.openIdConnectProviderArn,
        conditions
      ),
      roleName: props.deployRole,
      description: "This role is used via GitHub Actions to deploy webapp",
      maxSessionDuration: cdk.Duration.hours(1),
    });

    props.deploymentBucket.grantWrite(openidConnectRole);

    openidConnectRole.addToPolicy(
      new iam.PolicyStatement({
        resources: [
          "arn:aws:lambda:eu-west-1:859141738257:function:KoseproggInfraStackKosepr-KoseproggWebappDeployF99-Z9SFKeXmetI0",
        ],
        actions: ["lambda:InvokeFunction"],
      })
    );
  }
}

export default GithubAccessStack;
