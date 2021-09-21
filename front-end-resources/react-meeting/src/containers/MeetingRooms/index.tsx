// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useContext, useEffect } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { useMeetingManager } from "amazon-chime-sdk-component-library-react";

import { getErrorContext } from "../../providers/ErrorProvider";
import routes from "../../constants/routes";
import {
  fetchMeeting,
  createGetAttendeeCallback,
  fetchActiveMeetings,
} from "../../utils/api";
import { Meeting, useAppState } from "../../providers/AppStateProvider";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Progress from "../../components/Progress";
import CustomizedDialogs from "../../components/Dialogs/JoinError";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

const MeetingRooms: React.FC = () => {
  const meetingManager = useMeetingManager();
  const {
    setAppMeetingInfo,
    region: appRegion,
    meetingId: appMeetingId,
  } = useAppState();
  const [meetingArray, setMeetingArray] = useState<Meeting[]>([]);
  const [meetingErr, setMeetingErr] = useState(false);
  const [name, setName] = useState("");
  const [meetingId] = useState(appMeetingId);
  const [nameErr, setNameErr] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { errorMessage, updateErrorMessage } = useContext(getErrorContext());
  const history = useHistory();

  useEffect(() => {
    async function fetchMeetings() {
      try {
        await fetchActiveMeetings().then((data) => {
          setMeetingArray(data);
          return data;
        });
      } catch (error) {
        console.log(error);
        updateErrorMessage(error);
      }
    }
    fetchMeetings();
  }, [meetingId]);

  useEffect(() => {
    async function getUserName() {
      try {
        let info = await Auth.currentAuthenticatedUser();
        setName(info.username);
        return info.username;
      } catch (error) {
        console.log(error);

        return error;
      }
    }
    getUserName();
  }, [meetingId]);

  const handleJoinMeeting = async (
    e: React.FormEvent,
    meetingName: string,
    region: string
  ) => {
    e.preventDefault();

    const id = meetingName;
    const attendeeName = name.trim();

    if (!id || !attendeeName) {
      if (!attendeeName) {
        setNameErr(true);
      }

      if (!id) {
        setMeetingErr(true);
      }

      return;
    }

    setIsLoading(true);
    meetingManager.getAttendee = createGetAttendeeCallback(id);

    try {
      const { JoinInfo } = await fetchMeeting(id, attendeeName, region);
      await meetingManager.join({
        meetingInfo: JoinInfo.Meeting,
        attendeeInfo: JoinInfo.Attendee,
      });
      setAppMeetingInfo(meetingArray, id, attendeeName, region, false);
      history.push(routes.DEVICE);
    } catch (error) {
      console.log(error.message);
      updateErrorMessage(error.message);
    }
  };

  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={3}>
        {meetingArray.map((s) => (
          <Grid item key={s.uuid} xs={12} sm={6} md={4} lg={4}>
            <Card className={classes.root}>
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                height="120"
                image="https://source.unsplash.com/random"
                title="pecky"
              />

              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {s.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {s.topic}
                </Typography>
              </CardContent>

              <CardActions>
                {isLoading ? (
                  <Progress />
                ) : (
                  <Button
                    size="small"
                    color="primary"
                    id={s.name}
                    title={s.region}
                    onClick={(e) => {
                      handleJoinMeeting(e, s.name, s.region);
                    }}
                  >
                    Join Meeting
                  </Button>
                )}
              </CardActions>
            </Card>
            {errorMessage && <CustomizedDialogs />}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default MeetingRooms;
