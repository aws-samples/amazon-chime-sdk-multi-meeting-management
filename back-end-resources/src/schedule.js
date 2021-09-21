const utils = require('utils');

exports.handler = async (event, context, callback) => {
    var response = {
      "statusCode": 200,
      "headers": { 
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Credentials": false,
      },
      "body": '',
      "isBase64Encoded": false
    };
    
    const title = event.queryStringParameters.title;
    const startTime = event.queryStringParameters.startTime;
    const duration = event.queryStringParameters.duration;
    const topic = event.queryStringParameters.topic || "";
    const region = event.queryStringParameters.region || "";
    try {
      const dynamoResponse = await utils.scheduleMeeting(title, startTime, duration, topic, region );
      response.body = JSON.stringify(dynamoResponse);
    }
    catch (error) {
      console.log(error);
      response.body = JSON.stringify(error);
    }
    callback(null, response);

}