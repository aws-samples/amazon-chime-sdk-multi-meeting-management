import React, { useState, ChangeEvent } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import {
    Grid,
    TextField,
} from '@material-ui/core'
import { useHistory } from 'react-router-dom';
import { Formik, FormikProps } from 'formik'
import * as Yup from 'yup' 
import { useAppState } from '../../providers/AppStateProvider';
import RegionSelection from './RegionSelection';
import { scheduleMeeting } from '../../utils/api';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    root: {
            maxWidth: '650px',
            display: 'block',
            margin: '0 auto',
        },
        textField: {
                width: '100%',
            },
        submitButton: {
            marginTop: '24px',
        },
        title: { color:'black', fontSize: "25px", fontWeight: 475 },
        successMessage: { color: 'green' },
        errorMessage: { color: 'red' },
  }),
);

interface IMeetingForm {
    roomName: string
    roomTopic: string
    startTime: string
    duration: number
    region: string
}

interface IFormStatus {
    message: string
    type: string
}

export default function TransitionsModal() {
    const {
    setAppMeetingInfo,
    region: appRegion,
    meetingId: appMeetingId,
  } = useAppState();
    const [region, setRegion] = useState(appRegion);
    const [time, setTime] = useState('');
    const [displayFormStatus, setDisplayFormStatus] = useState(false)
    const [formStatus, setFormStatus] = useState<IFormStatus>({
        message: '',
        type: '',
    });
    
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="secondary" onClick={handleOpen}>
        Schedule Room
      </Button>
      <Modal
        aria-labelledby="Schedule Room"
        aria-describedby="Schedule Room"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      > 
      
        <Fade in={open}>
          <div className={classes.paper}>
            
             <div className={classes.root}> 
            <Formik
                initialValues={{
                    roomName: '',
                    roomTopic: '',
                    startTime: '',
                    duration: 0,
                    region: '',
                }}
               onSubmit={(values: IMeetingForm, actions) => {
                    console.log("submitting"); 
                    setTimeout(() => {
                        console.log("submitting");
                        actions.setSubmitting(false)
                    }, 500)
                }}
                validationSchema={Yup.object().shape({
                    region: Yup.string()
                        .required('select a valid region'),
                    roomName: Yup.string().required('Please enter a room name'), 
                    roomTopic: Yup.string().required('Please enter a room topic'),
                    startTime: Yup.string().required('Please enter a start time'), 
                    duration: Yup.string().required('Please enter a meeting duration').matches(/^[0-9]+$/, "Must Only Numbers")
                })}
            >
                {(props: FormikProps<IMeetingForm>) => {
                    const {
                        values,
                        touched,
                        errors,
                        handleBlur,
                        handleChange,
                    } = props
                    
                    const schedule = async (meetingName: string, roomTopic: string, region: string, duration: number, startTime: string)  => {
                        console.log("scheduling", meetingName, roomTopic, region, duration, startTime);
                        let timestamp = Math.round(Date.parse(startTime) / 1000);
                        await scheduleMeeting(meetingName, roomTopic, timestamp, duration, region);
                        window.location.reload();
                      
                    }
                     const getTimeZone = () => {
                        return(Intl.DateTimeFormat().resolvedOptions().timeZone);
                    }
                
                    const timezone = getTimeZone();
                    return (
                        <div>    
                        <Grid
                                container
                                justify="space-between"
                                direction="row" 
                            > 
                            <Grid item>
                            <h1 className={classes.title}>Schedule Room</h1> 
                            </Grid>

                            <Grid item>
                             <Button variant="contained" color="secondary" onClick={handleClose}>x</Button>  
                             </Grid> 
                             </Grid>
                            <Grid
                                container
                                justify="space-between"
                                direction="row"
                            >  <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className={classes.textField}><br/> </Grid>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className={classes.textField}
                                >
                                    <TextField
                                        name="roomName"
                                        id="roomName"
                                        placeholder="Room Name"
                                        value={values.roomName}
                                        type="text"
                                        helperText={
                                            errors.roomName && touched.roomName
                                                ? errors.roomName
                                                : 'Enter a room name.'
                                        }
                                        error={
                                            errors.roomName && touched.roomName
                                                ? true
                                                : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Grid>  
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className={classes.textField}><br/> </Grid>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className={classes.textField}
                                >
                                    <TextField
                                        name="roomTopic"
                                        id="roomTopic"
                                        placeholder="Room Topic"
                                        value={values.roomTopic}
                                        type="roomTopic"
                                        helperText={
                                            errors.roomTopic && touched.roomTopic
                                                ? errors.roomTopic
                                                : 'Enter a room topic'
                                        }
                                        error={
                                            errors.roomTopic && touched.roomTopic
                                                ? true
                                                : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Grid>
                            <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className={classes.textField}><br/> </Grid>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className={classes.textField}
                                >
                                    <TextField
                                        id="startTime" 
                                        name = "startTime"
                                        label=""
                                        value={values.startTime}
                                        type="datetime-local" 
                                        helperText={
                                            errors.startTime && touched.startTime
                                                ? errors.startTime
                                                : `Select a start time ( ${timezone} )`
                                        }
                                        error={
                                            errors.startTime && touched.startTime
                                                ? true
                                                : false
                                        }
                                        className={classes.textField}
                                        InputLabelProps={{
                                          shrink: true,
                                        }}  
                                        onChange={handleChange} 
                                        onBlur={handleBlur}
                                      />
                                
                                </Grid>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className={classes.textField}><br/> </Grid>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className={classes.textField}
                                >
                                <TextField
                                        name="duration"
                                        id="duration"
                                        placeholder="Duration (Minutes)"
                                        value={values.duration}
                                        type="number"
                                        helperText={
                                            errors.duration && touched.duration
                                                ? errors.duration
                                                : 'Enter meeting duration in minutes'
                                        }
                                        error={
                                            errors.duration && touched.duration
                                                ? true
                                                : false
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className={classes.textField}><br/> </Grid>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className={classes.textField}
                                >
                                   <RegionSelection setRegion={setRegion} region={region} />
                                </Grid>
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    className={classes.submitButton}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {schedule(values.roomName, values.roomTopic, region, values.duration, values.startTime)}}
                                
                                    >
                                        Submit
                                    </Button>
                                    {displayFormStatus && (
                                        <div className="formStatus">
                                            {formStatus.type === 'error' ? (
                                                <p
                                                    className={
                                                        classes.errorMessage
                                                    }
                                                >
                                                    {formStatus.message}
                                                </p>
                                            ) : formStatus.type ===
                                              'success' ? (
                                                <p
                                                    className={
                                                        classes.successMessage
                                                    }
                                                >
                                                    {formStatus.message}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}
                                </Grid>
                            </Grid>
                        </div>
                    )
                }}
            </Formik>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}