import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import { Construct } from '@aws-cdk/core';
import cdk = require('@aws-cdk/core');
import apigateway = require('@aws-cdk/aws-apigateway'); 
import iam = require('@aws-cdk/aws-iam')
import cognito = require ('@aws-cdk/aws-cognito');



export class BackEnd extends Construct {
 
    constructor(parent: Construct, name: string) {
        super(parent, name);


        // Creation of Cognito User for Attendees
        const userPool = new cognito.UserPool( this, 'AttendeePool', { 
          signInAliases: {
            email: true,
            username: true,
          },
          autoVerify: { email: true },
          selfSignUpEnabled: true,
          passwordPolicy: {
            minLength: 8,
            requireDigits: false,
            requireLowercase: false,
            requireSymbols: false,
            requireUppercase: false,
          },
          userVerification: {
            emailSubject: 'Verify your email for the chimesdk demo app!',
            emailBody: 'Thanks for signing up for the chimesdk demo app! Your verification code is {####}',
            emailStyle: cognito.VerificationEmailStyle.CODE,
          },
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        //User Pool Groups
        new cognito.CfnUserPoolGroup(this, "Admin", {
          userPoolId: userPool.userPoolId,
          groupName: "admin"
        });
        
        const UserPoolClient = userPool.addClient('CdkAuthUserPoolClient')

        const AwsUserPoolsId = new cdk.CfnOutput(this, 'AwsUserPoolsId', { value: userPool.userPoolId });
        AwsUserPoolsId.overrideLogicalId('AwsUserPoolsId');

        const AwsUserPoolsWebClientId = new cdk.CfnOutput(this, 'AwsUserPoolsWebClientId', {value: UserPoolClient.userPoolClientId});
        AwsUserPoolsWebClientId.overrideLogicalId('AwsUserPoolsWebClientId')

        const meetingsTable = new dynamodb.Table(this, 'meetings', {
            partitionKey: {
              name: 'Title',
              type: dynamodb.AttributeType.STRING
            },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            timeToLiveAttribute: 'TTL',
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,            
          });

        const attendeeTable = new dynamodb.Table(this, 'attendees', {
          partitionKey: {
            name: 'AttendeeId',
            type: dynamodb.AttributeType.STRING
          },
          removalPolicy: cdk.RemovalPolicy.DESTROY,
          billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });

        const schedulingTable = new dynamodb.Table(this, 'ChimeMeetingsTable', { 
          partitionKey: {
            name: 'uuid',
            type: dynamodb.AttributeType.STRING,
          },
          timeToLiveAttribute: 'TTL',
          billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
        });


        const lambdaChimeRole = new iam.Role(this, 'LambdaChimeRole', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });
    
        lambdaChimeRole.addToPolicy(new iam.PolicyStatement({
          resources: ['*'],
          actions: ['chime:CreateMeeting',
                    'chime:DeleteMeeting',
                    'chime:GetMeeting',
                    'chime:ListMeetings',
                    'chime:BatchCreateAttendee',
                    'chime:CreateAttendee',
                    'chime:DeleteAttendee',
                    'chime:GetAttendee',
                    'chime:ListAttendees',
                    'logs:CreateLogGroup',
                    'logs:CreateLogStream',
                    'logs:PutLogEvents'
        ]}));

        const lambdaLogsRole = new iam.Role(this, 'LambdaLogRole', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });

        lambdaLogsRole.addToPolicy(new iam.PolicyStatement({
          resources: ['*'],
          actions: ['logs:CreateLogStream',
                    'logs:PutLogEvents',
                    'logs:DescribeLogStreams']
        }));

        const layer = new lambda.LayerVersion(this, 'MeetingUtilsLayer', {
            code: new lambda.AssetCode('back-end-resources/lambda-layer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
            license: 'Apache-2.0',
            description: 'Meeting Utils Layer',
        });

        const joinLambda = new lambda.Function(this, 'joinMeeting', {
            code: lambda.Code.fromAsset("back-end-resources/src", {exclude: ["**", "!join.js"]}),
            handler: 'join.handler',
            runtime: lambda.Runtime.NODEJS_12_X,
            environment: {
              MEETINGS_TABLE_NAME: meetingsTable.tableName,
              ATTENDEES_TABLE_NAME: attendeeTable.tableName,
            },
            layers: [layer],
            role: lambdaChimeRole
        });

        const attendeeLambda = new lambda.Function(this, 'attendeeMeeting', {
            code: lambda.Code.fromAsset("back-end-resources/src", {exclude: ["**", "!attendee.js"]}),
            handler: 'attendee.handler',
            runtime: lambda.Runtime.NODEJS_12_X,
            environment: {
              MEETINGS_TABLE_NAME: meetingsTable.tableName,
              ATTENDEES_TABLE_NAME: attendeeTable.tableName,
            },
            layers: [layer],
            role: lambdaChimeRole
        });

        const endLambda = new lambda.Function(this, 'endMeeting', {
            code: lambda.Code.fromAsset("back-end-resources/src", {exclude: ["**", "!end.js"]}),
            handler: 'end.handler',
            runtime: lambda.Runtime.NODEJS_12_X,
            environment: {
              MEETINGS_TABLE_NAME: meetingsTable.tableName,
              ATTENDEES_TABLE_NAME: attendeeTable.tableName,
            },
            layers: [layer],
            role: lambdaChimeRole
        });

      const logsLambda = new lambda.Function(this, 'logMeeting', {
          code: lambda.Code.fromAsset("back-end-resources/src", {exclude: ["**", "!logs.js"]}),
          handler: 'logs.handler',
          runtime: lambda.Runtime.NODEJS_12_X,
          environment: {
            MEETINGS_TABLE_NAME: meetingsTable.tableName,
            ATTENDEES_TABLE_NAME: attendeeTable.tableName,
          },
          layers: [layer],
          role: lambdaLogsRole
        });

      const scheduleLambda = new lambda.Function(this, 'scheduleMeeting', {
        code: lambda.Code.fromAsset("back-end-resources/src", {exclude: ["**", "!schedule.js"]}),
          handler: 'schedule.handler',
          runtime: lambda.Runtime.NODEJS_12_X,
          environment: {
            SCHEDULING_TABLE_NAME: schedulingTable.tableName,
          },
          layers: [layer],
      });

      const listScheduledLambda = new lambda.Function(this, 'listScheduledMeetings', {
        code: lambda.Code.fromAsset("back-end-resources/src", {exclude: ["**", "!listScheduled.js"]}),
          handler: 'listScheduled.handler',
          runtime: lambda.Runtime.NODEJS_12_X,
          environment: {
            SCHEDULING_TABLE_NAME: schedulingTable.tableName,
          },
          layers: [layer],
      });

      const listActiveLambda = new lambda.Function(this, 'listActive', {
        code: lambda.Code.fromAsset("back-end-resources/src", {exclude: ["**", "!listActive.js"]}),
          handler: 'listActive.handler',
          runtime: lambda.Runtime.NODEJS_12_X,
          environment: {
            SCHEDULING_TABLE_NAME: schedulingTable.tableName,
          },
          layers: [layer],
      });

      const deleteMeetingLambda = new lambda.Function(this, 'deleteMeeting', {
        code: lambda.Code.fromAsset("back-end-resources/src", {exclude: ["**", "!deleteMeeting.js"]}),
          handler: 'deleteMeeting.handler',
          runtime: lambda.Runtime.NODEJS_12_X,
          environment: {
            SCHEDULING_TABLE_NAME: schedulingTable.tableName,
          },
          layers: [layer],
      });


        meetingsTable.grantReadWriteData(joinLambda);
        attendeeTable.grantReadWriteData(joinLambda);
        meetingsTable.grantReadWriteData(endLambda);
        attendeeTable.grantReadWriteData(endLambda);
        meetingsTable.grantReadWriteData(attendeeLambda);
        attendeeTable.grantReadWriteData(attendeeLambda);
        schedulingTable.grantReadWriteData(scheduleLambda);
        schedulingTable.grantReadWriteData(listScheduledLambda);
        schedulingTable.grantReadWriteData(deleteMeetingLambda);
        schedulingTable.grantReadWriteData(listActiveLambda);

        const api = new apigateway.RestApi(this, 'meetingApi', {
            restApiName: 'Meeting BackEnd',
            endpointConfiguration: {
              types: [ apigateway.EndpointType.REGIONAL ]
            }
        });

        const apiURL = new cdk.CfnOutput(this, 'apiURL', { 
          value: api.url,
          exportName: "apiURL"
        });

        apiURL.overrideLogicalId('apiURL')

        new cdk.CfnOutput(this, 'Promote to Admin', {
          value: "aws cognito-idp admin-add-user-to-group --user-pool-id " + userPool.userPoolId + " --username USERNAME --group-name admin",
          exportName: "userPoolId"
        })

        const join = api.root.addResource('join');
        const joinIntegration = new apigateway.LambdaIntegration(joinLambda);
        join.addMethod('POST', joinIntegration);
        addCorsOptions(join);        
      
        const attendee = api.root.addResource('attendee');
        const attendeeIntegration = new apigateway.LambdaIntegration(attendeeLambda);
        attendee.addMethod('GET', attendeeIntegration);
        addCorsOptions(attendee);

        const end = api.root.addResource('end');
        const endIntegration = new apigateway.LambdaIntegration(endLambda);
        end.addMethod('POST', endIntegration);
        addCorsOptions(end);
        
        const logs = api.root.addResource('logs');
        const logsIntegration = new apigateway.LambdaIntegration(logsLambda);
        logs.addMethod('POST', logsIntegration);
        addCorsOptions(logs);

        const schedule = api.root.addResource('schedule');
        const scheduleIntegration = new apigateway.LambdaIntegration(scheduleLambda);
        schedule.addMethod('POST', scheduleIntegration);
        addCorsOptions(schedule);
        
        const listScheduled = api.root.addResource('listScheduled');
        const listScheduledIntegration = new apigateway.LambdaIntegration(listScheduledLambda);
        listScheduled.addMethod('GET', listScheduledIntegration);
        addCorsOptions(listScheduled);

        const listActive = api.root.addResource('listActive');
        const listActiveIntegration = new apigateway.LambdaIntegration(listActiveLambda);
        listActive.addMethod('GET', listActiveIntegration);
        addCorsOptions(listActive);

        const deleteMeeting = api.root.addResource('deleteMeeting');
        const deleteMeetingIntegration = new apigateway.LambdaIntegration(deleteMeetingLambda);
        deleteMeeting.addMethod('POST', deleteMeetingIntegration);
        addCorsOptions(deleteMeeting);
        };    
}

export function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },  
    }]
  })
}