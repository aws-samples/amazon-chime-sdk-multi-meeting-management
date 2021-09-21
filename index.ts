#!/usr/bin/env node
import cdk = require('@aws-cdk/core');
import { FrontEnd } from './front-end-resources/front-end';
import { BackEnd } from './back-end-resources/back-end';

class FrontEndStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
        super(parent, name, props);

        new FrontEnd(this, 'MeetingFrontEnd' 
    );
    }
}
class BackEndStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
      super(parent, name, props);
      const region = new cdk.CfnParameter(this, 'region', {
        type: 'String',
        default: 'us-east-1'
       });
       new cdk.CfnOutput(this, "identityPoolRegion", {
        value: region.valueAsString, 
        exportName: "IdentityPoolRegion"
      })
  
      new BackEnd(this, 'MeetingBackEnd');

  }
  }

const app = new cdk.App();
console.log("Deployment region ", process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION );

new BackEndStack(app, 'MeetingBackEnd', { env: {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION 
}})





new FrontEndStack(app, 'MeetingFrontEnd', { env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION 
}});

app.synth();
