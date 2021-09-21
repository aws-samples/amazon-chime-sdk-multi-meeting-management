import React from 'react';

import MeetingRooms from '../../containers/MeetingRooms';
import Grid from '@material-ui/core/Grid'
import Header from '../Shared/header'

const Home = () => (
  <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12}> <Header/></Grid>
        
        <Grid item xs={1} sm={1} md={1} lg={1}></Grid>  
        <Grid item xs={10} sm={10} md={10} lg={10}><MeetingRooms /></Grid> 
        <Grid item xs={1} sm={1} md={1} lg={1}></Grid> 
        
        <Grid item xs={12} sm={12} md={12} lg={12}></Grid> 
        
        <Grid item xs={8} sm={8} md={8} lg={8}></Grid> 
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid> 
  </Grid>
);

export default Home;