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
   
    const dynamoResponse = await utils.listScheduledMeetings();
    
    response.body = JSON.stringify(dynamoResponse);
    callback(null, response);

}