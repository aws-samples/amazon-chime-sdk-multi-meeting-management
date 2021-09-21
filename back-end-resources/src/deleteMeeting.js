var AWS = require('aws-sdk');
const utils = require('utils');

exports.handler = async (event, context, callback) => {
    var response = {
      "statusCode": 200,
      "headers": { 
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Credentials": false },
      "body": '',
      "isBase64Encoded": false
    };
    const uuid = event.queryStringParameters.uuid;
    
    const dynamoResponse = await utils.deleteMeeting(uuid);
    console.log(dynamoResponse);

    response.body = dynamoResponse;
    callback(null, response);

}