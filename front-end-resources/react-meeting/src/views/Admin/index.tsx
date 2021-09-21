// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import ScheduleMeetings from '../../containers/ScheduleMeetings';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TransitionsModal from '../../containers/ScheduleMeetings/popup'
import Header from '../Shared/header'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

export default function Admin() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
       <Grid item xs={12} sm={12} md={12} lg={12}> <Header/></Grid>
      <Grid item xs={9} sm={9} md={9} lg={9}>
        </Grid>
        <Grid item xs={2} sm={2} md={2} lg={2}>  <TransitionsModal /> 
        </Grid>
       
        <Grid item xs={1} sm={1} md={1} lg={1}>  
        </Grid>
        <Grid item xs={1} sm={1}>
        </Grid>
        <Grid item xs={10} sm={10}>
          <ScheduleMeetings />
        </Grid>
        <Grid item xs={1} sm={1}>
        </Grid>
      </Grid>
    </div>
  );
}
