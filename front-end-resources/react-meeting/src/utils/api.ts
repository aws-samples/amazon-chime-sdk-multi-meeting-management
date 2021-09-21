// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import routes from '../constants/routes';


export const BASE_URL = routes.API;

interface MeetingResponse {
  JoinInfo: {
    Attendee: any;
    Meeting: any;
  };
}

interface MeetingInfo {
  uuid: any,
  meetingName: any;
  topic: any;
  startTime: any;
  duration: any;
  region: any;
}


export async function fetchMeeting(
  meetingId: string,
  name: string,
  region: string
): Promise<MeetingResponse> {
  const response = await fetch(
    `${BASE_URL}join?title=${encodeURIComponent(
      meetingId
    )}&name=${encodeURIComponent(name)}${
      region ? `&region=${encodeURIComponent(region)}` : ''
    }`,
    {
      method: 'POST'
    }
  );
  const data = await response.json();

  if (data.error) {
    throw new Error(`Server error: ${data.error}`);
  }

  return data;
}

export async function scheduleMeeting(
  title: string,
  topic: string,
  startTime: number,
  duration : number, 
  region: string
) {

  const response = await fetch(
    `${BASE_URL}schedule?title=${encodeURIComponent(title)
    }&topic=${encodeURIComponent(topic)
    }&duration=${duration
    }&region=${encodeURIComponent(region)
    }&startTime=${startTime
    }`,
    {
      method: 'POST'
    }
  );
  console.log(response);
 
}

export async function deleteMeeting(
  uuid: string
) {
  const response = await fetch(
    `${BASE_URL}deleteMeeting?uuid=${encodeURIComponent(uuid)
    }`,
    {
      method: 'POST'
    }
  );
  console.log(response);
 
}


export async function fetchActiveMeetings() {
  const response = await fetch(
    `${BASE_URL}listActive`, 
    {
      method: 'GET'
    }
  );
  const data = await response.json();

  if (data.error) {
    throw new Error(`Server error: ${data.error}`);
  }
  return data;
}


export async function fetchScheduledMeetings(
  ): Promise<MeetingInfo[]> {
    const response = await fetch(
      `${BASE_URL}listScheduled`, 
      {
        method: 'GET'
      }
    );
    const data = await response.json();
  
    if (data.error) {
      throw new Error(`Server error: ${data.error}`);
    }
  
    return data;
  }


export function createGetAttendeeCallback(meetingId: string) {
  return async (chimeAttendeeId: string, externalUserId?: string) => {
    const attendeeUrl = `${BASE_URL}attendee?title=${encodeURIComponent(
      meetingId
    )}&attendee=${encodeURIComponent(chimeAttendeeId)}`;
    const res = await fetch(attendeeUrl, {
      method: 'GET'
    });

    if (!res.ok) {
      throw new Error('Invalid server response');
    }

    const data = await res.json();

    return {
      name: data.AttendeeInfo.Name
    };
  };
}

export async function endMeeting(meetingId: string) {
  const res = await fetch(
    `${BASE_URL}end?title=${encodeURIComponent(meetingId)}`,
    {
      method: 'POST'
    }
  );

  if (!res.ok) {
    throw new Error('Server error ending meeting');
  }
}
