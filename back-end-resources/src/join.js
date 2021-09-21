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
  const name = event.queryStringParameters.name;
  const region = event.queryStringParameters.region || 'us-east-1';

  if (!title || !name) {
    response["statusCode"] = 400;
    response["body"] = "Must provide title and name";
    callback(null, response);
    return;
  }

  
  let data = await utils.getMeetings();
  
  let meetingInfo = null;
  if (data !== null && data !== undefined ) {
    for (let meeting of data['Meetings']) {
      if (title == meeting['ExternalMeetingId']) {
        meetingInfo = meeting;
      }
    }
  }
 
  if (!meetingInfo || meetingInfo == null) {
    const request = {
      ExternalMeetingId: title,
      ClientRequestToken: utils.uuid(),
      MediaRegion: region,
    };
    
    console.info('Creating new meeting before joining: ' + JSON.stringify(request));
    meetingInfo = await chime.createMeeting(request).promise();
    meetingInfo = await meetingInfo.Meeting;
    await utils.putMeeting(title, meetingInfo);
  }

  console.info('Adding new attendee');
  const attendeeInfo = (await chime.createAttendee({
      MeetingId: await meetingInfo.MeetingId,
      ExternalUserId: utils.uuid(),
    }).promise());
  utils.putAttendee(title, attendeeInfo.Attendee.AttendeeId, name);

  const joinInfo = {
    JoinInfo: {
      Title: title,
      Meeting: await meetingInfo,
      Attendee: attendeeInfo.Attendee
    },
  };

  response.body = JSON.stringify(joinInfo, '', 2);
  callback(null, response);
};
  