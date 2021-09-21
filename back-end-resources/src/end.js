var AWS = require('aws-sdk');
const chime = new AWS.Chime({ region: 'us-east-1' });
const utils = require('utils');
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');


exports.handler = async (event, context, callback) => {
  var response = {
    "statusCode": 200,
    "headers": { 
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Credentials": false },
    "body": '',
    "isBase64Encoded": false
  };
  const title = event.queryStringParameters.title;
  let meetingInfo = await utils.getMeeting(title);
  await chime.deleteMeeting({
    MeetingId: meetingInfo.Meeting.MeetingId,
  }).promise();
  callback(null, response);
};