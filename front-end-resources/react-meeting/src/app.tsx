// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { FC } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import {
  lightTheme,
  MeetingProvider,
  NotificationProvider,
  darkTheme,
  GlobalStyles
} from 'amazon-chime-sdk-component-library-react';

import { AppStateProvider, useAppState } from './providers/AppStateProvider';
import ErrorProvider from './providers/ErrorProvider';
import routes from './constants/routes';
import { NavigationProvider } from './providers/NavigationProvider';
import { Meeting, Home, DeviceSetup, Admin, Login, Signup, ProtectedRoute, AdminRoute, Confirmation, Landing } from './views';
import Notifications from './containers/Notifications';
import NoMeetingRedirect from './containers/NoMeetingRedirect';
import meetingConfig from './meetingConfig';

import { Auth } from 'aws-amplify';
import Amplify from '@aws-amplify/core';
import cdkExports from './cdk-outputs.json';

const awsConfig = {
  Auth: {
    "identityPoolRegion": cdkExports.MeetingBackEnd.identityPoolRegion,
    "region": cdkExports.MeetingBackEnd.identityPoolRegion ,
    "userPoolId": cdkExports.MeetingBackEnd.AwsUserPoolsId,
    "userPoolWebClientId": cdkExports.MeetingBackEnd.AwsUserPoolsWebClientId
  }
};

Amplify.configure(awsConfig);
Auth.configure(awsConfig);


const App: FC = () => (
  <Router>
    <AppStateProvider>
      <Theme>
        <NotificationProvider>
          <Notifications />
          <ErrorProvider>
            <MeetingProvider {...meetingConfig}>
              <NavigationProvider>
                <Switch> 
                  <Route path="/signup">
                    <Signup />
                  </Route>
                  <Route path="/signin">
                    <Login />
                  </Route>
                  <Route path="/confirmation">
                    <Confirmation />
                  </Route>
                  <Route exact path="/">
                    <Landing />
                  </Route>
                  <Route path={routes.HOME}>
                    <ProtectedRoute component={Home} />
                  </Route>
                  <Route path={routes.ADMIN}>
                    <AdminRoute component={Admin} />
                  </Route>
                  <Route path={routes.DEVICE}>
                    <NoMeetingRedirect>
                      <DeviceSetup />
                    </NoMeetingRedirect>
                  </Route>
                  <Route path={routes.MEETING}>
                    <NoMeetingRedirect>
                      <Meeting />
                    </NoMeetingRedirect>
                  </Route>
                </Switch>
              </NavigationProvider>
            </MeetingProvider>
          </ErrorProvider>
        </NotificationProvider>
      </Theme>
    </AppStateProvider>
  </Router>
);

const Theme: React.FC = ({ children }) => {
  const { theme } = useAppState();

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

export default App;

