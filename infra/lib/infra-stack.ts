import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import assets = require("@aws-cdk/aws-s3-assets")
import apigw = require("@aws-cdk/aws-apigateway")
import path = require("path")


export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Golang binaries must have a place where they are uploaded to s3 as a .zip
    const asset = new assets.Asset(this, 'HelloGoServerLambdaFnZip', {
      path: path.join(__dirname, '../../functions/gin-server'),
    });

    const myhandler = new lambda.Function(this, "HelloGoServerLambdaFn", {
      runtime: lambda.Runtime.GO_1_X,
      handler: "main",
      code: lambda.Code.fromBucket(
        asset.bucket,
        asset.s3ObjectKey
      ),
    });

    // all routes (and REST verbs) will pass through to the lambda
    const api = new apigw.LambdaRestApi(this, 'HelloGoServerLambdaFnEndpoint', {handler: myhandler});
  }
}

const app = new cdk.App();
new InfraStack(app, "HelloGoServerLambdaFn");
app.synth();