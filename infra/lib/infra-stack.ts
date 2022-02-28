import { Stack, StackProps, App } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import path = require("path")


export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Golang binaries must have a place where they are uploaded to s3 as a .zip
    const asset = new Asset(this, 'HelloGoServerLambdaFnZip', {
      path: path.join(__dirname, '../../functions/gin-server'),
    });

    const myhandler = new Function(this, "HelloGoServerLambdaFn", {
      runtime: Runtime.GO_1_X,
      handler: "main",
      code: Code.fromBucket(
        asset.bucket,
        asset.s3ObjectKey
      ),
    });

    // all routes (and REST verbs) will pass through to the lambda
    new LambdaRestApi(this, 'HelloGoServerLambdaFnEndpoint', {handler: myhandler});
  }
}

const app = new App();
new InfraStack(app, "HelloGoServerLambdaFn");
app.synth();
