---
nav_order: 3
parent: Templates
---

# Worker

---

## lambda-sqs-worker

An asynchronous [worker] built on [AWS Lambda] and deployed with [Serverless].

Modelled after the "enricher" pattern where an event is received from a source SNS topic and a corresponding enrichment is published to a destination SNS topic.
For fault tolerance,
a message queue is employed between the source topic and the Lambda function,
and unprocessed events are sent to a dead-letter queue for manual triage.

[View on GitHub](https://github.com/seek-oss/skuba/tree/master/template/lambda-sqs-worker)


Added in [3.4.1](https://github.com/seek-oss/skuba/releases/tag/v3.4.1)

<details markdown="block">
  <summary>
    Changelog
  </summary>
  {: .text-delta }

- [4.2.1](https://github.com/seek-oss/skuba/releases/tag/v4.2.1): Time out Buildkite test steps after 10 minutes ([#842](https://github.com/seek-oss/skuba/pull/842))

  Successful testing and linting should complete within this window. This timeout prevents commands from hanging and indefinitely preoccupying your Buildkite agents.

  ```diff
  steps:
    - label: 🧪 Test & Lint
  +   timeout_in_minutes: 10
  ```

- [4.2.1](https://github.com/seek-oss/skuba/releases/tag/v4.2.1): Bump Node.js version to 16 ([#862](https://github.com/seek-oss/skuba/pull/862))

- [4.2.0](https://github.com/seek-oss/skuba/releases/tag/v4.2.0): Propagate Buildkite environment variables for lint autofixing ([#800](https://github.com/seek-oss/skuba/pull/800))

- [4.2.0](https://github.com/seek-oss/skuba/releases/tag/v4.2.0): Exclude DOM type definitions by default ([#822](https://github.com/seek-oss/skuba/pull/822))

  TypeScript will now raise compiler errors when DOM globals like `document` and `window` are referenced in new projects. This catches unsafe usage of Web APIs that will throw exceptions in a Node.js context.

  If you are developing a new npm package for browser use or require specific Node.js-compatible Web APIs like the [Encoding API](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API), you can opt in to DOM type definitions in your `tsconfig.json`:

  ```diff
  {
    "compilerOptions": {
  -   "lib": ["ES2020"]
  +   "lib": ["DOM", "ES2020"]
    }
  }
  ```

  If you have an existing backend project, you can opt out of DOM type definitions in your `tsconfig.json`.

  For Node.js 14:

  ```diff
  {
    "compilerOptions": {
  +   "lib": ["ES2020"],
      "target": "ES2020"
    }
  }
  ```

  For Node.js 16:

  ```diff
  {
    "compilerOptions": {
  +   "lib": ["ES2021"],
      "target": "ES2021"
    }
  }
  ```

- [4.1.1](https://github.com/seek-oss/skuba/releases/tag/v4.1.1): Disable type checking in tests ([#787](https://github.com/seek-oss/skuba/pull/787))

  Newly initialised projects will skip TypeScript type checking on `skuba test` as it's already covered by `skuba lint`. You can now iterate on your tests without running into annoying compilation errors like TS6133 (unused declarations).

  This will be defaulted for existing projects in a future major version. You can opt in early by setting the `globals` configuration option in your `jest.config.ts`:

  ```typescript
  export default Jest.mergePreset({
    globals: {
      'ts-jest': {
        // seek-oss/skuba#626
        isolatedModules: true,
      },
    },
    // Rest of config
  });
  ```

- [4.1.1](https://github.com/seek-oss/skuba/releases/tag/v4.1.1): Specify default Buildkite agent ([#775](https://github.com/seek-oss/skuba/pull/775))

- [4.1.0](https://github.com/seek-oss/skuba/releases/tag/v4.1.0): skuba-dive ^2.0.0 ([#766](https://github.com/seek-oss/skuba/pull/766))

- [4.1.0](https://github.com/seek-oss/skuba/releases/tag/v4.1.0): Remove `variablesResolutionMode` ([#768](https://github.com/seek-oss/skuba/pull/768))

  This resolves the following deprecation warning in Serverless Framework v3:

  ```console
  Starting with v3.0, the "variablesResolutionMode" option is now useless. You can safely remove it from the configuration
  More info: https://serverless.com/framework/docs/deprecations/#VARIABLES_RESOLUTION_MODE
  ```

- [4.1.0](https://github.com/seek-oss/skuba/releases/tag/v4.1.0): Add `NODE_ENV=production` to environment variables ([#763](https://github.com/seek-oss/skuba/pull/763))

- [4.1.0](https://github.com/seek-oss/skuba/releases/tag/v4.1.0): Move environment variables to `provider.environment` to reduce repetition ([#767](https://github.com/seek-oss/skuba/pull/767))

- [4.0.0](https://github.com/seek-oss/skuba/releases/tag/v4.0.0): Use `--enable-source-maps` ([#761](https://github.com/seek-oss/skuba/pull/761))

  Stable source map support has landed in Node.js 14.18+ via the built-in `--enable-source-maps` option.

  We recommend migrating off of custom source map implementations in favour of this option. Upgrading to [**skuba-dive** v2](https://github.com/seek-oss/skuba-dive/releases/tag/v2.0.0) will remove `source-map-support` from the `skuba-dive/register` hook.

  For a containerised application, update your Dockerfile:

  ```diff
  - FROM gcr.io/distroless/nodejs:12 AS runtime
  + FROM gcr.io/distroless/nodejs:16 AS runtime

  + # https://nodejs.org/api/cli.html#cli_node_options_options
  + ENV NODE_OPTIONS=--enable-source-maps
  ```

  For a Serverless Lambda application, update your `serverless.yml`:

  ```diff
  provider:
  - runtime: nodejs12.x
  + runtime: nodejs14.x

  functions:
    Worker:
      environment:
  +     # https://nodejs.org/api/cli.html#cli_node_options_options
  +     NODE_OPTIONS: --enable-source-maps
  ```

  For a CDK Lambda application, update your stack:

  ```diff
  new aws_lambda.Function(this, 'worker', {
  - runtime: aws_lambda.Runtime.NODEJS_12_X,
  + runtime: aws_lambda.Runtime.NODEJS_14_X,
    environment: {
  +   // https://nodejs.org/api/cli.html#cli_node_options_options
  +   NODE_OPTIONS: '--enable-source-maps',
    },
  });
  ```

- [4.0.0](https://github.com/seek-oss/skuba/releases/tag/v4.0.0): Disable `tty` on deploy step ([#753](https://github.com/seek-oss/skuba/pull/753))

  Serverless Framework v3 renders progress spinners on interactive terminals. We recommend disabling [tty](https://github.com/buildkite-plugins/docker-compose-buildkite-plugin#tty-optional-run-only) in CI/CD for cleaner log output.

- [4.0.0](https://github.com/seek-oss/skuba/releases/tag/v4.0.0): serverless ^3.0.0 ([#748](https://github.com/seek-oss/skuba/pull/748))

- [4.0.0](https://github.com/seek-oss/skuba/releases/tag/v4.0.0): Replace `custom.env` configuration with `params` ([#752](https://github.com/seek-oss/skuba/pull/752))

  You can now define environment specific variables using the new Serverless parameters feature. See <https://www.serverless.com/framework/docs/guides/parameters> for more details.

- [4.0.0](https://github.com/seek-oss/skuba/releases/tag/v4.0.0): Remove `provider.lambdaHashingVersion` ([#751](https://github.com/seek-oss/skuba/pull/751))

  This resolves the following deprecation warning in Serverless Framework v3:

  ```console
  Setting "20201221" for "provider.lambdaHashingVersion" is no longer effective as new hashing algorithm is now used by default. You can safely remove this property from your configuration.
  ```

- [3.17.2](https://github.com/seek-oss/skuba/releases/tag/v3.17.2): Remove qualifier from smoke test invocation ([#743](https://github.com/seek-oss/skuba/pull/743))

  Previously, this template's smoke test hook specified a `$LATEST` qualifier in its `Lambda.Invoke` API call. AWS authorised the call based on the unqualified Lambda ARN in our `serverless.yml` IAM policy, but will stop doing so after April 2022.

  To avoid deployment failures, remove the qualifier in `src/hooks.ts`. An unqualified call is equivalent to targeting `$LATEST`.

  ```diff
  - Qualifier: '$LATEST',
  + Qualifier: undefined,
  ```

- [3.17.0](https://github.com/seek-oss/skuba/releases/tag/v3.17.0): Retrieve GitHub token on Test & Lint ([#667](https://github.com/seek-oss/skuba/pull/667))

- [3.17.0](https://github.com/seek-oss/skuba/releases/tag/v3.17.0): serverless-prune-plugin ^2.0.0 ([#719](https://github.com/seek-oss/skuba/pull/719))

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): Use correct `environment` key in `docker-compose.yml` ([#654](https://github.com/seek-oss/skuba/pull/654))

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): Switch to ARM64 architecture ([#640](https://github.com/seek-oss/skuba/pull/640))

  These are a bit cheaper and a bit faster than x86 Lambdas:
  <https://aws.amazon.com/blogs/aws/aws-lambda-functions-powered-by-aws-graviton2-processor-run-your-functions-on-arm-and-get-up-to-34-better-price-performance/>

  The underlying Lambda architecture should be invisible to typical TypeScript Lambdas.

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): Bump non-Lambda templates to Node.js 16 ([#633](https://github.com/seek-oss/skuba/pull/633))

  Node.js 16 is now in active LTS. The Lambda templates are stuck on Node.js 14 until the new AWS Lambda runtime is released.

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): seek-jobs/gantry v1.5.2 ([#634](https://github.com/seek-oss/skuba/pull/634))

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): hot-shots ^9.0.0 ([#639](https://github.com/seek-oss/skuba/pull/639))

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): Remove `pino.Logger` indirection ([#624](https://github.com/seek-oss/skuba/pull/624))

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): @seek/logger ^5.0.0 ([#621](https://github.com/seek-oss/skuba/pull/621))

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): Ignore `.gantry` YAML paths via `.prettierignore` ([#636](https://github.com/seek-oss/skuba/pull/636))

  Gantry resource and value files often live in the `.gantry` subdirectory and may use non-standard template syntax.

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): Propagate environment variables for GitHub annotations ([#642](https://github.com/seek-oss/skuba/pull/642))

  This enables GitHub annotations for newly-initialised projects with the appropriate Buildkite configuration.

- [3.15.2](https://github.com/seek-oss/skuba/releases/tag/v3.15.2): Convert Serverless `isProduction` config value to boolean ([#602](https://github.com/seek-oss/skuba/pull/602))

  This avoids potentially surprising behaviour if you try to make use of this config value in a context that tests for truthiness. The boolean is still correctly applied as a string `seek:env:production` tag value.

- [3.15.2](https://github.com/seek-oss/skuba/releases/tag/v3.15.2): Opt in to [new Serverless variables resolver](https://www.serverless.com/framework/docs/deprecations/#NEW_VARIABLES_RESOLVER) ([#601](https://github.com/seek-oss/skuba/pull/601))

- [3.15.2](https://github.com/seek-oss/skuba/releases/tag/v3.15.2): Remove README tables of contents ([#596](https://github.com/seek-oss/skuba/pull/596))

  GitHub's Markdown renderer now generates its own table of contents.

- [3.15.2](https://github.com/seek-oss/skuba/releases/tag/v3.15.2): seek-jobs/gantry v1.5.1 ([#604](https://github.com/seek-oss/skuba/pull/604))

- [3.15.2](https://github.com/seek-oss/skuba/releases/tag/v3.15.2): Fail fast on invalid Serverless config ([#605](https://github.com/seek-oss/skuba/pull/605))

- [3.15.2](https://github.com/seek-oss/skuba/releases/tag/v3.15.2): pino-pretty ^6.0.0 ([#594](https://github.com/seek-oss/skuba/pull/594))

  pino-pretty@7 requires pino@7, which has not been released on its stable channel yet.

- [3.15.1](https://github.com/seek-oss/skuba/releases/tag/v3.15.1): Remove `unknown` specifier in catch clauses ([#580](https://github.com/seek-oss/skuba/pull/580))

  Strict TypeScript 4.4 now defaults to typing catch clause variables as `unknown`.

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): pino-pretty ^7.0.0 ([#506](https://github.com/seek-oss/skuba/pull/506))

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): Configure environment variables and volume mounts for Buildkite annotations ([#558](https://github.com/seek-oss/skuba/pull/558))

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): serverless-plugin-canary-deployments ^0.7.0 ([#508](https://github.com/seek-oss/skuba/pull/508))

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): Prime dev ECR cache in Buildkite pipeline ([#503](https://github.com/seek-oss/skuba/pull/503))

  This should result in faster "Deploy Dev" times as the ECR cache will already be warm.

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): seek-jobs/gantry v1.4.1 ([#504](https://github.com/seek-oss/skuba/pull/504))

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): Remove `@types/node` resolution override ([#498](https://github.com/seek-oss/skuba/pull/498))

  Jest 27.1 is compatible with newer versions of `@types/node`.

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): Remove Yarn cache from worker Docker images ([#499](https://github.com/seek-oss/skuba/pull/499))

  This shrinks the cached Docker images that our worker templates generate.

- [3.14.4](https://github.com/seek-oss/skuba/releases/tag/v3.14.4): @types/node ^14.17.19 ([#490](https://github.com/seek-oss/skuba/pull/490))

- [3.14.4](https://github.com/seek-oss/skuba/releases/tag/v3.14.4): seek-jobs/gantry v1.4.0 ([#483](https://github.com/seek-oss/skuba/pull/483))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): seek-oss/docker-ecr-cache v1.11.0 ([#467](https://github.com/seek-oss/skuba/pull/467))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Add `test:ci` script ([#473](https://github.com/seek-oss/skuba/pull/473))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Force `@jest/types` resolution to fix clean installs ([#468](https://github.com/seek-oss/skuba/pull/468))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Use [Docker Build secrets](https://docs.docker.com/develop/develop-images/build_enhancements/#new-docker-build-secret-information) ([#476](https://github.com/seek-oss/skuba/pull/476))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Group Buildkite pipeline anchors ([#474](https://github.com/seek-oss/skuba/pull/474))

  This provides a bit more structure to our `pipeline.yml`s and allows anchored plugins to be recognised by Renovate.

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Default Docker Compose image to empty string ([#469](https://github.com/seek-oss/skuba/pull/469))

  This suppresses Docker Compose CLI warnings and errors when running outside of Buildkite.

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Use BUILDKITE_PIPELINE_DEFAULT_BRANCH in `pipeline.yml` ([#475](https://github.com/seek-oss/skuba/pull/475))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Add placeholder test coverage configuration ([#472](https://github.com/seek-oss/skuba/pull/472))

- [3.14.2](https://github.com/seek-oss/skuba/releases/tag/v3.14.2): Set `memorySize` for smoke test hook to 128 MiB ([#457](https://github.com/seek-oss/skuba/pull/457))

- [3.14.2](https://github.com/seek-oss/skuba/releases/tag/v3.14.2): Reuse ECR cache in Docker Compose ([#453](https://github.com/seek-oss/skuba/pull/453))

- [3.14.1](https://github.com/seek-oss/skuba/releases/tag/v3.14.1): pino-pretty ^5.0.0 ([#441](https://github.com/seek-oss/skuba/pull/441))

- [3.14.1](https://github.com/seek-oss/skuba/releases/tag/v3.14.1): seek-jobs/gantry v1.3.0 ([#452](https://github.com/seek-oss/skuba/pull/452))

- [3.14.0](https://github.com/seek-oss/skuba/releases/tag/v3.14.0): Banish `typeof undefined` syntax ([#429](https://github.com/seek-oss/skuba/pull/429))

- [3.14.0](https://github.com/seek-oss/skuba/releases/tag/v3.14.0): Prune `devDependencies` instead of installing twice in Docker ([#435](https://github.com/seek-oss/skuba/pull/435))

  The template-bundled Dockerfiles would previously run `yarn install` twice to build a separate stage for production `dependencies` only. These have been updated to correctly share the Yarn cache across stages and to use `yarn install --production` to perform offline pruning.

- [3.13.1](https://github.com/seek-oss/skuba/releases/tag/v3.13.1): @types/node ^15.0.0 ([#422](https://github.com/seek-oss/skuba/pull/422))

- [3.13.0](https://github.com/seek-oss/skuba/releases/tag/v3.13.0): Upgrade to Node 14 ([#347](https://github.com/seek-oss/skuba/pull/347))

  Node.js 14 is [now supported on AWS Lambda](https://aws.amazon.com/about-aws/whats-new/2021/02/aws-lambda-now-supports-node-js-14/). This lets us upgrade the Node.js requirement for skuba's templates.

  This should only impact newly created projects. You can use the template changes in this PR as an example of how to upgrade an existing project. A future version of skuba may include a fixup command to automatically upgrade your project to the most recent LTS release.

- [3.13.0](https://github.com/seek-oss/skuba/releases/tag/v3.13.0): Use new `serverless.yml#/provider/iam` grouping ([#357](https://github.com/seek-oss/skuba/pull/357))

  The `provider.iamRoleStatements` property [will be removed in Serverless v3](https://github.com/serverless/serverless/blob/v2.25.1/docs/deprecations.md#grouping-iam-settings-under-provideriam).

- [3.13.0](https://github.com/seek-oss/skuba/releases/tag/v3.13.0): serverless-plugin-canary-deployments ^0.5.0 ([#394](https://github.com/seek-oss/skuba/pull/394))

  The plugin now patches in CodeDeploy permissions to your `iamRoleStatements`, so you can clean your `serverless.yml`:

  ```diff
  - - Action: codedeploy:PutLifecycleEventHookExecutionStatus
  -   Effect: Allow
  -   Resource: !Sub arn:aws:codedeploy:${AWS::Region}:${AWS::AccountId}:deploymentgroup:*/${WorkerLambdaFunctionDeploymentGroup}
  ```

- [3.13.0](https://github.com/seek-oss/skuba/releases/tag/v3.13.0): runtypes-filter ^0.6.0 ([#408](https://github.com/seek-oss/skuba/pull/408))

- [3.13.0](https://github.com/seek-oss/skuba/releases/tag/v3.13.0): Drop region parameterisation ([#363](https://github.com/seek-oss/skuba/pull/363))

- [3.13.0](https://github.com/seek-oss/skuba/releases/tag/v3.13.0): runtypes ^6.0.0 ([#404](https://github.com/seek-oss/skuba/pull/404))

- [3.13.0](https://github.com/seek-oss/skuba/releases/tag/v3.13.0): Remove custom Serverless variable syntax ([#350](https://github.com/seek-oss/skuba/pull/350))

  `serverless@2.3.0` bundled native support for CloudFormation pseudo parameters. This even works with arbitrary logical IDs like `!Sub ${WorkerLambdaFunctionDeploymentGroup}`.

- [3.13.0](https://github.com/seek-oss/skuba/releases/tag/v3.13.0): Use new `serverless.yml#/package/patterns` property ([#415](https://github.com/seek-oss/skuba/pull/415))

  The `package.exclude` and `package.include` properties [will be removed in Serverless v3](https://github.com/serverless/serverless/blob/v2.32.0/docs/deprecations.md#new-way-to-define-packaging-patterns).

- [3.13.0](https://github.com/seek-oss/skuba/releases/tag/v3.13.0): Add GitHub repository settings and Renovate to init checklist ([#388](https://github.com/seek-oss/skuba/pull/388))

- [3.12.1](https://github.com/seek-oss/skuba/releases/tag/v3.12.1): seek-jobs/gantry v1.2.11 ([#336](https://github.com/seek-oss/skuba/pull/336))

- [3.12.0](https://github.com/seek-oss/skuba/releases/tag/v3.12.0): Simplify Buildkite pipeline ([#314](https://github.com/seek-oss/skuba/pull/314))

- [3.12.0](https://github.com/seek-oss/skuba/releases/tag/v3.12.0): Use `jest.config.ts` ([#303](https://github.com/seek-oss/skuba/pull/303))

- [3.12.0](https://github.com/seek-oss/skuba/releases/tag/v3.12.0): Add smoke test ([#328](https://github.com/seek-oss/skuba/pull/328))

  This brings back versioned functions along with `serverless-prune-plugin` to control Lambda storage consumption. By default we configure `serverless-plugin-canary-deployments` for an instantaneous switch once the smoke test has passed, but this can be customised as necessary.

- [3.12.0](https://github.com/seek-oss/skuba/releases/tag/v3.12.0): Enable retry of successful deployment steps ([#311](https://github.com/seek-oss/skuba/pull/311))

  This should be used with caution, but may be necessary if you need to rapidly roll back a broken deployment.

- [3.12.0](https://github.com/seek-oss/skuba/releases/tag/v3.12.0): Add `start` script ([#301](https://github.com/seek-oss/skuba/pull/301))

- [3.12.0](https://github.com/seek-oss/skuba/releases/tag/v3.12.0): Require deployment bucket ([#330](https://github.com/seek-oss/skuba/pull/330))

- [3.12.0](https://github.com/seek-oss/skuba/releases/tag/v3.12.0): Bump caret ranges ([#331](https://github.com/seek-oss/skuba/pull/331))

- [3.12.0](https://github.com/seek-oss/skuba/releases/tag/v3.12.0): Lock Serverless `lambdaHashingVersion` ([#329](https://github.com/seek-oss/skuba/pull/329))

  This gets rid of the following warning when deploying:

  ```text
  Deprecation warning: Starting with next major version, default value of provider.lambdaHashingVersion will be equal to "20201221"
  More Info: https://www.serverless.com/framework/docs/deprecations/#LAMBDA_HASHING_VERSION_V2
  ```

- [3.12.0](https://github.com/seek-oss/skuba/releases/tag/v3.12.0): Uplift READMEs ([#334](https://github.com/seek-oss/skuba/pull/334))

- [3.11.0](https://github.com/seek-oss/skuba/releases/tag/v3.11.0): Check coverage on default `test` script ([#290](https://github.com/seek-oss/skuba/pull/290))

- [3.11.0](https://github.com/seek-oss/skuba/releases/tag/v3.11.0): Include `test:watch` script ([#290](https://github.com/seek-oss/skuba/pull/290))

- [3.11.0](https://github.com/seek-oss/skuba/releases/tag/v3.11.0): Lock `.nvmrc`s to Node.js 12 ([#281](https://github.com/seek-oss/skuba/pull/281))

- [3.10.2](https://github.com/seek-oss/skuba/releases/tag/v3.10.2): Add `.me` files ([#248](https://github.com/seek-oss/skuba/pull/248))

- [3.10.2](https://github.com/seek-oss/skuba/releases/tag/v3.10.2): Remove redundant `ecr` plugin ([#259](https://github.com/seek-oss/skuba/pull/259))

- [3.10.2](https://github.com/seek-oss/skuba/releases/tag/v3.10.2): seek-jobs/gantry v1.2.9 ([#249](https://github.com/seek-oss/skuba/pull/249))

- [3.10.2](https://github.com/seek-oss/skuba/releases/tag/v3.10.2): supertest ^6.0.0 ([#243](https://github.com/seek-oss/skuba/pull/243))

- [3.10.2](https://github.com/seek-oss/skuba/releases/tag/v3.10.2): runtypes-filter ^0.4.0 ([#257](https://github.com/seek-oss/skuba/pull/257))

- [3.10.2](https://github.com/seek-oss/skuba/releases/tag/v3.10.2): @koa/router ^10.0.0 ([#249](https://github.com/seek-oss/skuba/pull/249))

- [3.10.2](https://github.com/seek-oss/skuba/releases/tag/v3.10.2): Mount working directory in Docker Compose ([#247](https://github.com/seek-oss/skuba/pull/247))

- [3.10.2](https://github.com/seek-oss/skuba/releases/tag/v3.10.2): Default to unversioned Lambdas ([#245](https://github.com/seek-oss/skuba/pull/245))

  Our baseline template does not do canary deployments, and this makes it less likely to hit code storage limits down the road.

- [3.10.2](https://github.com/seek-oss/skuba/releases/tag/v3.10.2): seek-datadog-custom-metrics ^4.0.0 ([#261](https://github.com/seek-oss/skuba/pull/261))

- [3.10.1](https://github.com/seek-oss/skuba/releases/tag/v3.10.1): seek-jobs/gantry v1.2.8 ([#238](https://github.com/seek-oss/skuba/pull/238))

- [3.10.0](https://github.com/seek-oss/skuba/releases/tag/v3.10.0): Remove region from subscription example snippet ([#223](https://github.com/seek-oss/skuba/pull/223))

- [3.10.0](https://github.com/seek-oss/skuba/releases/tag/v3.10.0): supertest ^5.0.0 ([#220](https://github.com/seek-oss/skuba/pull/220))

- [3.10.0](https://github.com/seek-oss/skuba/releases/tag/v3.10.0): Recommend `@seek/logger` ([#225](https://github.com/seek-oss/skuba/pull/225))

  This provides logging structure, trimming and redaction over plain Pino.

- [3.10.0](https://github.com/seek-oss/skuba/releases/tag/v3.10.0): docker-compose v3.7.0 ([#224](https://github.com/seek-oss/skuba/pull/224))

- [3.10.0](https://github.com/seek-oss/skuba/releases/tag/v3.10.0): Unset initial skuba version ([#216](https://github.com/seek-oss/skuba/pull/216))

- [3.10.0](https://github.com/seek-oss/skuba/releases/tag/v3.10.0): Skip pre-build in Docker Compose service ([#222](https://github.com/seek-oss/skuba/pull/222))

- [3.10.0](https://github.com/seek-oss/skuba/releases/tag/v3.10.0): Add `start:debug` scripts ([#230](https://github.com/seek-oss/skuba/pull/230))

- [3.9.2](https://github.com/seek-oss/skuba/releases/tag/v3.9.2): docker-compose v3.6.0 ([#210](https://github.com/seek-oss/skuba/pull/210))

- [3.9.2](https://github.com/seek-oss/skuba/releases/tag/v3.9.2): serverless ^2.0.0 ([#203](https://github.com/seek-oss/skuba/pull/203))

- [3.9.2](https://github.com/seek-oss/skuba/releases/tag/v3.9.2): Bump dep ranges ([#212](https://github.com/seek-oss/skuba/pull/212))

- [3.9.1](https://github.com/seek-oss/skuba/releases/tag/v3.9.1): Include `aws-sdk` in bundle ([#198](https://github.com/seek-oss/skuba/pull/198))

- [3.9.0](https://github.com/seek-oss/skuba/releases/tag/v3.9.0): Use unknown catch clause variables ([#189](https://github.com/seek-oss/skuba/pull/189))

- [3.9.0](https://github.com/seek-oss/skuba/releases/tag/v3.9.0): Qualify `awsRequestId` log field ([#186](https://github.com/seek-oss/skuba/pull/186))

- [3.8.0](https://github.com/seek-oss/skuba/releases/tag/v3.8.0): seek-jobs/gantry v1.2.5 ([#174](https://github.com/seek-oss/skuba/pull/174))

- [3.7.7](https://github.com/seek-oss/skuba/releases/tag/v3.7.7): seek-jobs/gantry v1.2.4 ([#170](https://github.com/seek-oss/skuba/pull/170))

- [3.7.7](https://github.com/seek-oss/skuba/releases/tag/v3.7.7): Remove explicitly set NPM_READ_TOKEN from Dockerfile commands ([#168](https://github.com/seek-oss/skuba/pull/168))

- [3.7.6](https://github.com/seek-oss/skuba/releases/tag/v3.7.6): runtypes-filter ^0.3.0 ([#160](https://github.com/seek-oss/skuba/pull/160))

- [3.7.6](https://github.com/seek-oss/skuba/releases/tag/v3.7.6): seek-jobs/gantry v1.2.3 ([#161](https://github.com/seek-oss/skuba/pull/161))

- [3.7.6](https://github.com/seek-oss/skuba/releases/tag/v3.7.6): docker-compose v3.5.0 ([#153](https://github.com/seek-oss/skuba/pull/153))

- [3.7.6](https://github.com/seek-oss/skuba/releases/tag/v3.7.6): runtypes ^5.0.0 ([#156](https://github.com/seek-oss/skuba/pull/156))

- [3.7.5](https://github.com/seek-oss/skuba/releases/tag/v3.7.5): Default VERSION to local ([#148](https://github.com/seek-oss/skuba/pull/148))

- [3.7.5](https://github.com/seek-oss/skuba/releases/tag/v3.7.5): ecr v2.1.1 ([#144](https://github.com/seek-oss/skuba/pull/144))

- [3.7.5](https://github.com/seek-oss/skuba/releases/tag/v3.7.5): Use better Runtypes syntax ([#152](https://github.com/seek-oss/skuba/pull/152))

- [3.7.5](https://github.com/seek-oss/skuba/releases/tag/v3.7.5): docker-compose v3.4.0 ([#144](https://github.com/seek-oss/skuba/pull/144))

- [3.7.5](https://github.com/seek-oss/skuba/releases/tag/v3.7.5): Add basic deployment documentation ([#148](https://github.com/seek-oss/skuba/pull/148))

- [3.7.4](https://github.com/seek-oss/skuba/releases/tag/v3.7.4): Use connection reuse environment variable ([#130](https://github.com/seek-oss/skuba/pull/130))

- [3.7.4](https://github.com/seek-oss/skuba/releases/tag/v3.7.4): Redact `err.config.agent` path from logs ([#140](https://github.com/seek-oss/skuba/pull/140))

- [3.7.0](https://github.com/seek-oss/skuba/releases/tag/v3.7.0): Drop `hot-shots` dependency ([#57](https://github.com/seek-oss/skuba/pull/57))

- [3.7.0](https://github.com/seek-oss/skuba/releases/tag/v3.7.0): Redact `Authorization` headers in logs ([#59](https://github.com/seek-oss/skuba/pull/59))

- [3.7.0](https://github.com/seek-oss/skuba/releases/tag/v3.7.0): Redact `err.config.sockets` from logs ([#82](https://github.com/seek-oss/skuba/pull/82))

- [3.7.0](https://github.com/seek-oss/skuba/releases/tag/v3.7.0): Drop duplicate team name prompt ([#72](https://github.com/seek-oss/skuba/pull/72))

- [3.5.0](https://github.com/seek-oss/skuba/releases/tag/v3.5.0): Switch to `seek-datadog-custom-metrics` ([#28](https://github.com/seek-oss/skuba/pull/28))

</details>

---

## lambda-sqs-worker-cdk

An asynchronous [worker] built on [AWS Lambda] and deployed with [AWS CDK].

```text
SNS -> SQS (with a dead-letter queue) -> Lambda
```

Comes with configuration validation and infrastructure snapshot testing.

[View on GitHub](https://github.com/seek-oss/skuba/tree/master/template/lambda-sqs-worker-cdk)


Added in [3.13.0](https://github.com/seek-oss/skuba/releases/tag/v3.13.0)

<details markdown="block">
  <summary>
    Changelog
  </summary>
  {: .text-delta }

- [4.2.1](https://github.com/seek-oss/skuba/releases/tag/v4.2.1): Time out Buildkite test steps after 10 minutes ([#842](https://github.com/seek-oss/skuba/pull/842))

  Successful testing and linting should complete within this window. This timeout prevents commands from hanging and indefinitely preoccupying your Buildkite agents.

  ```diff
  steps:
    - label: 🧪 Test & Lint
  +   timeout_in_minutes: 10
  ```

- [4.2.1](https://github.com/seek-oss/skuba/releases/tag/v4.2.1): Bump Node.js version to 16 ([#862](https://github.com/seek-oss/skuba/pull/862))

- [4.2.0](https://github.com/seek-oss/skuba/releases/tag/v4.2.0): Fix progress configuration in `cdk.json` ([#797](https://github.com/seek-oss/skuba/pull/797))

- [4.2.0](https://github.com/seek-oss/skuba/releases/tag/v4.2.0): Propagate Buildkite environment variables for lint autofixing ([#800](https://github.com/seek-oss/skuba/pull/800))

- [4.2.0](https://github.com/seek-oss/skuba/releases/tag/v4.2.0): Exclude DOM type definitions by default ([#822](https://github.com/seek-oss/skuba/pull/822))

  TypeScript will now raise compiler errors when DOM globals like `document` and `window` are referenced in new projects. This catches unsafe usage of Web APIs that will throw exceptions in a Node.js context.

  If you are developing a new npm package for browser use or require specific Node.js-compatible Web APIs like the [Encoding API](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API), you can opt in to DOM type definitions in your `tsconfig.json`:

  ```diff
  {
    "compilerOptions": {
  -   "lib": ["ES2020"]
  +   "lib": ["DOM", "ES2020"]
    }
  }
  ```

  If you have an existing backend project, you can opt out of DOM type definitions in your `tsconfig.json`.

  For Node.js 14:

  ```diff
  {
    "compilerOptions": {
  +   "lib": ["ES2020"],
      "target": "ES2020"
    }
  }
  ```

  For Node.js 16:

  ```diff
  {
    "compilerOptions": {
  +   "lib": ["ES2021"],
      "target": "ES2021"
    }
  }
  ```

- [4.1.1](https://github.com/seek-oss/skuba/releases/tag/v4.1.1): Disable type checking in tests ([#787](https://github.com/seek-oss/skuba/pull/787))

  Newly initialised projects will skip TypeScript type checking on `skuba test` as it's already covered by `skuba lint`. You can now iterate on your tests without running into annoying compilation errors like TS6133 (unused declarations).

  This will be defaulted for existing projects in a future major version. You can opt in early by setting the `globals` configuration option in your `jest.config.ts`:

  ```typescript
  export default Jest.mergePreset({
    globals: {
      'ts-jest': {
        // seek-oss/skuba#626
        isolatedModules: true,
      },
    },
    // Rest of config
  });
  ```

- [4.1.1](https://github.com/seek-oss/skuba/releases/tag/v4.1.1): Specify default Buildkite agent ([#775](https://github.com/seek-oss/skuba/pull/775))

- [4.1.0](https://github.com/seek-oss/skuba/releases/tag/v4.1.0): skuba-dive ^2.0.0 ([#766](https://github.com/seek-oss/skuba/pull/766))

- [4.1.0](https://github.com/seek-oss/skuba/releases/tag/v4.1.0): Remove `variablesResolutionMode` ([#768](https://github.com/seek-oss/skuba/pull/768))

  This resolves the following deprecation warning in Serverless Framework v3:

  ```console
  Starting with v3.0, the "variablesResolutionMode" option is now useless. You can safely remove it from the configuration
  More info: https://serverless.com/framework/docs/deprecations/#VARIABLES_RESOLUTION_MODE
  ```

- [4.1.0](https://github.com/seek-oss/skuba/releases/tag/v4.1.0): Add `NODE_ENV=production` to environment variables ([#763](https://github.com/seek-oss/skuba/pull/763))

- [4.1.0](https://github.com/seek-oss/skuba/releases/tag/v4.1.0): Add `NODE_ENV=production` to environment variables ([#763](https://github.com/seek-oss/skuba/pull/763))

- [4.1.0](https://github.com/seek-oss/skuba/releases/tag/v4.1.0): Move environment variables to `provider.environment` to reduce repetition ([#767](https://github.com/seek-oss/skuba/pull/767))

- [4.0.0](https://github.com/seek-oss/skuba/releases/tag/v4.0.0): Use `--enable-source-maps` ([#761](https://github.com/seek-oss/skuba/pull/761))

  Stable source map support has landed in Node.js 14.18+ via the built-in `--enable-source-maps` option.

  We recommend migrating off of custom source map implementations in favour of this option. Upgrading to [**skuba-dive** v2](https://github.com/seek-oss/skuba-dive/releases/tag/v2.0.0) will remove `source-map-support` from the `skuba-dive/register` hook.

  For a containerised application, update your Dockerfile:

  ```diff
  - FROM gcr.io/distroless/nodejs:12 AS runtime
  + FROM gcr.io/distroless/nodejs:16 AS runtime

  + # https://nodejs.org/api/cli.html#cli_node_options_options
  + ENV NODE_OPTIONS=--enable-source-maps
  ```

  For a Serverless Lambda application, update your `serverless.yml`:

  ```diff
  provider:
  - runtime: nodejs12.x
  + runtime: nodejs14.x

  functions:
    Worker:
      environment:
  +     # https://nodejs.org/api/cli.html#cli_node_options_options
  +     NODE_OPTIONS: --enable-source-maps
  ```

  For a CDK Lambda application, update your stack:

  ```diff
  new aws_lambda.Function(this, 'worker', {
  - runtime: aws_lambda.Runtime.NODEJS_12_X,
  + runtime: aws_lambda.Runtime.NODEJS_14_X,
    environment: {
  +   // https://nodejs.org/api/cli.html#cli_node_options_options
  +   NODE_OPTIONS: '--enable-source-maps',
    },
  });
  ```

- [4.0.0](https://github.com/seek-oss/skuba/releases/tag/v4.0.0): Disable `tty` on deploy step ([#753](https://github.com/seek-oss/skuba/pull/753))

  Serverless Framework v3 renders progress spinners on interactive terminals. We recommend disabling [tty](https://github.com/buildkite-plugins/docker-compose-buildkite-plugin#tty-optional-run-only) in CI/CD for cleaner log output.

- [4.0.0](https://github.com/seek-oss/skuba/releases/tag/v4.0.0): serverless ^3.0.0 ([#748](https://github.com/seek-oss/skuba/pull/748))

- [4.0.0](https://github.com/seek-oss/skuba/releases/tag/v4.0.0): Replace `custom.env` configuration with `params` ([#752](https://github.com/seek-oss/skuba/pull/752))

  You can now define environment specific variables using the new Serverless parameters feature. See <https://www.serverless.com/framework/docs/guides/parameters> for more details.

- [4.0.0](https://github.com/seek-oss/skuba/releases/tag/v4.0.0): Remove `provider.lambdaHashingVersion` ([#751](https://github.com/seek-oss/skuba/pull/751))

  This resolves the following deprecation warning in Serverless Framework v3:

  ```console
  Setting "20201221" for "provider.lambdaHashingVersion" is no longer effective as new hashing algorithm is now used by default. You can safely remove this property from your configuration.
  ```

- [3.17.2](https://github.com/seek-oss/skuba/releases/tag/v3.17.2): Remove qualifier from smoke test invocation ([#743](https://github.com/seek-oss/skuba/pull/743))

  Previously, this template's smoke test hook specified a `$LATEST` qualifier in its `Lambda.Invoke` API call. AWS authorised the call based on the unqualified Lambda ARN in our `serverless.yml` IAM policy, but will stop doing so after April 2022.

  To avoid deployment failures, remove the qualifier in `src/hooks.ts`. An unqualified call is equivalent to targeting `$LATEST`.

  ```diff
  - Qualifier: '$LATEST',
  + Qualifier: undefined,
  ```

- [3.17.0](https://github.com/seek-oss/skuba/releases/tag/v3.17.0): Retrieve GitHub token on Test & Lint ([#667](https://github.com/seek-oss/skuba/pull/667))

- [3.17.0](https://github.com/seek-oss/skuba/releases/tag/v3.17.0): serverless-prune-plugin ^2.0.0 ([#719](https://github.com/seek-oss/skuba/pull/719))

- [3.17.0](https://github.com/seek-oss/skuba/releases/tag/v3.17.0): Migrate to AWS CDK v2 ([#714](https://github.com/seek-oss/skuba/pull/714))

- [3.17.0](https://github.com/seek-oss/skuba/releases/tag/v3.17.0): Fix docker-compose volume mount and deploy output ([#695](https://github.com/seek-oss/skuba/pull/695))

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): Use correct `environment` key in `docker-compose.yml` ([#654](https://github.com/seek-oss/skuba/pull/654))

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): Switch to ARM64 architecture ([#640](https://github.com/seek-oss/skuba/pull/640))

  These are a bit cheaper and a bit faster than x86 Lambdas:
  <https://aws.amazon.com/blogs/aws/aws-lambda-functions-powered-by-aws-graviton2-processor-run-your-functions-on-arm-and-get-up-to-34-better-price-performance/>

  The underlying Lambda architecture should be invisible to typical TypeScript Lambdas.

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): Bump non-Lambda templates to Node.js 16 ([#633](https://github.com/seek-oss/skuba/pull/633))

  Node.js 16 is now in active LTS. The Lambda templates are stuck on Node.js 14 until the new AWS Lambda runtime is released.

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): seek-jobs/gantry v1.5.2 ([#634](https://github.com/seek-oss/skuba/pull/634))

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): hot-shots ^9.0.0 ([#639](https://github.com/seek-oss/skuba/pull/639))

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): Remove `pino.Logger` indirection ([#624](https://github.com/seek-oss/skuba/pull/624))

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): @seek/logger ^5.0.0 ([#621](https://github.com/seek-oss/skuba/pull/621))

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): Ignore `.gantry` YAML paths via `.prettierignore` ([#636](https://github.com/seek-oss/skuba/pull/636))

  Gantry resource and value files often live in the `.gantry` subdirectory and may use non-standard template syntax.

- [3.16.0](https://github.com/seek-oss/skuba/releases/tag/v3.16.0): Propagate environment variables for GitHub annotations ([#642](https://github.com/seek-oss/skuba/pull/642))

  This enables GitHub annotations for newly-initialised projects with the appropriate Buildkite configuration.

- [3.15.2](https://github.com/seek-oss/skuba/releases/tag/v3.15.2): Convert Serverless `isProduction` config value to boolean ([#602](https://github.com/seek-oss/skuba/pull/602))

  This avoids potentially surprising behaviour if you try to make use of this config value in a context that tests for truthiness. The boolean is still correctly applied as a string `seek:env:production` tag value.

- [3.15.2](https://github.com/seek-oss/skuba/releases/tag/v3.15.2): Opt in to [new Serverless variables resolver](https://www.serverless.com/framework/docs/deprecations/#NEW_VARIABLES_RESOLVER) ([#601](https://github.com/seek-oss/skuba/pull/601))

- [3.15.2](https://github.com/seek-oss/skuba/releases/tag/v3.15.2): Remove README tables of contents ([#596](https://github.com/seek-oss/skuba/pull/596))

  GitHub's Markdown renderer now generates its own table of contents.

- [3.15.2](https://github.com/seek-oss/skuba/releases/tag/v3.15.2): seek-jobs/gantry v1.5.1 ([#604](https://github.com/seek-oss/skuba/pull/604))

- [3.15.2](https://github.com/seek-oss/skuba/releases/tag/v3.15.2): Fail fast on invalid Serverless config ([#605](https://github.com/seek-oss/skuba/pull/605))

- [3.15.2](https://github.com/seek-oss/skuba/releases/tag/v3.15.2): pino-pretty ^6.0.0 ([#594](https://github.com/seek-oss/skuba/pull/594))

  pino-pretty@7 requires pino@7, which has not been released on its stable channel yet.

- [3.15.1](https://github.com/seek-oss/skuba/releases/tag/v3.15.1): Remove `unknown` specifier in catch clauses ([#580](https://github.com/seek-oss/skuba/pull/580))

  Strict TypeScript 4.4 now defaults to typing catch clause variables as `unknown`.

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): pino-pretty ^7.0.0 ([#506](https://github.com/seek-oss/skuba/pull/506))

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): Configure environment variables and volume mounts for Buildkite annotations ([#558](https://github.com/seek-oss/skuba/pull/558))

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): serverless-plugin-canary-deployments ^0.7.0 ([#508](https://github.com/seek-oss/skuba/pull/508))

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): Prime dev ECR cache in Buildkite pipeline ([#503](https://github.com/seek-oss/skuba/pull/503))

  This should result in faster "Deploy Dev" times as the ECR cache will already be warm.

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): seek-jobs/gantry v1.4.1 ([#504](https://github.com/seek-oss/skuba/pull/504))

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): Remove `@types/node` resolution override ([#498](https://github.com/seek-oss/skuba/pull/498))

  Jest 27.1 is compatible with newer versions of `@types/node`.

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): Run "Test, Lint & Build" step in prod ([#503](https://github.com/seek-oss/skuba/pull/503))

  This reduces our dependence on a dev environment to successfully deploy to prod.

- [3.15.0](https://github.com/seek-oss/skuba/releases/tag/v3.15.0): Remove Yarn cache from worker Docker images ([#499](https://github.com/seek-oss/skuba/pull/499))

  This shrinks the cached Docker images that our worker templates generate.

- [3.14.4](https://github.com/seek-oss/skuba/releases/tag/v3.14.4): @types/node ^14.17.19 ([#490](https://github.com/seek-oss/skuba/pull/490))

- [3.14.4](https://github.com/seek-oss/skuba/releases/tag/v3.14.4): seek-jobs/gantry v1.4.0 ([#483](https://github.com/seek-oss/skuba/pull/483))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): seek-oss/docker-ecr-cache v1.11.0 ([#467](https://github.com/seek-oss/skuba/pull/467))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Add `test:ci` script ([#473](https://github.com/seek-oss/skuba/pull/473))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Force `@jest/types` resolution to fix clean installs ([#468](https://github.com/seek-oss/skuba/pull/468))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Use [Docker Build secrets](https://docs.docker.com/develop/develop-images/build_enhancements/#new-docker-build-secret-information) ([#476](https://github.com/seek-oss/skuba/pull/476))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Use [Docker Build secrets](https://docs.docker.com/develop/develop-images/build_enhancements/#new-docker-build-secret-information) ([#476](https://github.com/seek-oss/skuba/pull/476))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Group Buildkite pipeline anchors ([#474](https://github.com/seek-oss/skuba/pull/474))

  This provides a bit more structure to our `pipeline.yml`s and allows anchored plugins to be recognised by Renovate.

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Default Docker Compose image to empty string ([#469](https://github.com/seek-oss/skuba/pull/469))

  This suppresses Docker Compose CLI warnings and errors when running outside of Buildkite.

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Use BUILDKITE_PIPELINE_DEFAULT_BRANCH in `pipeline.yml` ([#475](https://github.com/seek-oss/skuba/pull/475))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Add placeholder test coverage configuration ([#472](https://github.com/seek-oss/skuba/pull/472))

- [3.14.3](https://github.com/seek-oss/skuba/releases/tag/v3.14.3): Build once upfront ([#477](https://github.com/seek-oss/skuba/pull/477))

  This employs Buildkite [artifacts](https://buildkite.com/docs/pipelines/artifacts) to share compiled code with each subsequent deployment step.

- [3.14.2](https://github.com/seek-oss/skuba/releases/tag/v3.14.2): Set `memorySize` for smoke test hook to 128 MiB ([#457](https://github.com/seek-oss/skuba/pull/457))

- [3.14.2](https://github.com/seek-oss/skuba/releases/tag/v3.14.2): Reuse ECR cache in Docker Compose ([#453](https://github.com/seek-oss/skuba/pull/453))

- [3.14.1](https://github.com/seek-oss/skuba/releases/tag/v3.14.1): pino-pretty ^5.0.0 ([#441](https://github.com/seek-oss/skuba/pull/441))

- [3.14.1](https://github.com/seek-oss/skuba/releases/tag/v3.14.1): seek-jobs/gantry v1.3.0 ([#452](https://github.com/seek-oss/skuba/pull/452))

- [3.14.0](https://github.com/seek-oss/skuba/releases/tag/v3.14.0): Banish `typeof undefined` syntax ([#429](https://github.com/seek-oss/skuba/pull/429))

- [3.14.0](https://github.com/seek-oss/skuba/releases/tag/v3.14.0): Always build before deploy ([#428](https://github.com/seek-oss/skuba/pull/428))

  This prevents stale compiled code from being cached and deployed from ECR.

- [3.14.0](https://github.com/seek-oss/skuba/releases/tag/v3.14.0): Prune `devDependencies` instead of installing twice in Docker ([#435](https://github.com/seek-oss/skuba/pull/435))

  The template-bundled Dockerfiles would previously run `yarn install` twice to build a separate stage for production `dependencies` only. These have been updated to correctly share the Yarn cache across stages and to use `yarn install --production` to perform offline pruning.

- [3.13.1](https://github.com/seek-oss/skuba/releases/tag/v3.13.1): Trim CDK deployment output ([#423](https://github.com/seek-oss/skuba/pull/423))

- [3.13.1](https://github.com/seek-oss/skuba/releases/tag/v3.13.1): @types/node ^15.0.0 ([#422](https://github.com/seek-oss/skuba/pull/422))

- [3.13.1](https://github.com/seek-oss/skuba/releases/tag/v3.13.1): Fix npm token in Buildkite pipeline ([#423](https://github.com/seek-oss/skuba/pull/423))

</details>

[aws cdk]: https://tech-strategy.ssod.skinfra.xyz/docs/v1/technology.html#cdk
[aws lambda]: https://tech-strategy.ssod.skinfra.xyz/docs/v1/technology.html#lambda
[serverless]: https://serverless.com/
[worker]: https://tech-strategy.ssod.skinfra.xyz/docs/v1/components.html#worker
