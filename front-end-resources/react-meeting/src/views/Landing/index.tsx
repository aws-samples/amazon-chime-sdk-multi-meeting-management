import React from 'react'

import { useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import MeetingRoom from '@material-ui/icons/MeetingRoom'
import Header from "../Shared/header";
const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
  },
  title: {
    textAlign: 'center',
     padding: "1vh"
  }
}))
const Landing: React.FunctionComponent = () => {
  const classes = useStyles()

  const history = useHistory()

  const signIn = () => {
    history.push('/signin')
  }

  return (
    <div className={classes.root}>
    
      <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12} lg={12}> <Header/></Grid>
        <Grid item xs={12} sm={12}></Grid>
        <Grid item xs={12} sm={12}> </Grid>
        <Grid item xs={1} sm={1}>
        </Grid>
        <Grid item xs={10} sm={10}>
            <Grid container direction="row" justifyContent="center" alignItems="center">
              <MeetingRoom fontSize="large" />
              <Typography className={classes.title} variant="h3">
                AWS Social Rooms
              </Typography>
            </Grid>
            <Grid container direction="row" justifyContent="center" alignItems="center">
              <Button onClick={signIn} variant="contained" color="primary">
                Sign in / Sign up
              </Button>
            </Grid>
        </Grid>
        
        <Grid item xs={1} sm={1}></Grid>
      </Grid>
    </div>
  )
}

export default Landing
