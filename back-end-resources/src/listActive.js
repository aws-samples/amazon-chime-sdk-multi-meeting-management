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
   
    const dynamoResponse = await utils.listScheduledMeetings();
    console.log(dynamoResponse);

    const activeMeetings = []
    for (let meeting of dynamoResponse) {
        let meetingTime = meeting.startTime;

        let timestamp = Math.round( Date.now() / 1000);

        if (timestamp >= meetingTime) {
            activeMeetings.push({ "uuid": meeting.uuid, "name": meeting.meetingName, "topic": meeting.topic || "", "region": meeting.region || "us-east-1" } );
        }
    }
    response.body = JSON.stringify(activeMeetings);
    console.log(response);

    callback(null, response);

}