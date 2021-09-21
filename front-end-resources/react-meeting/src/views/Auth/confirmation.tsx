import React from 'react';

import Confirmation from '../../containers/AuthForms/confirmation';
import Grid from '@material-ui/core/Grid'
import Header from '../Shared/header'

const Confirm = () => (
  <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12}> <Header/></Grid>
        
        <Grid item xs={2} sm={2} md={2} lg={2}></Grid>  
        <Grid item xs={8} sm={8} md={8} lg={8}><Confirmation /></Grid> 
        <Grid item xs={2} sm={2} md={2} lg={2}></Grid> 
        
        <Grid item xs={12} sm={12} md={12} lg={12}></Grid> 
        
        <Grid item xs={8} sm={8} md={8} lg={8}></Grid> 
        <Grid item xs={4} sm={4} md={4} lg={4}></Grid> 
  </Grid>
);

export default Confirm;