import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {
  PrimaryButton,
} from 'amazon-chime-sdk-component-library-react';
import { useAppState } from '../../providers/AppStateProvider';
import MeetingRoom from '@material-ui/icons/MeetingRoom'
import { useHistory } from 'react-router-dom';
import routes from '../../constants/routes';
import { Auth } from 'aws-amplify';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    }, 
    title: {
      flexGrow: 1,
    },
  }),
);

export default function Header() {
  const classes = useStyles(); 
  const history = useHistory();

async function signOut() {
    try {
        await Auth.signOut();
        history.push(routes.ROOT);
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

async function signIn() {
    try {
        history.push(routes.SIGNIN);
    } catch (error) {
        console.log('error signing out: ', error);
    }
}

async function admin() {
    try {
        history.push(routes.ADMIN);
    } catch (error) {
        console.log('failure', error);
    }
}

async function rooms() {
    try {
        history.push(routes.HOME);
    } catch (error) {
        console.log('failure', error);
    }
}
  const [isAdmin, setAdmin ] = React.useState(true);
  React.useEffect(() => {
    (async () => {

      try {
        await Auth.currentAuthenticatedUser(). then( user=> {
          if (!user) {
            setAdmin(false);
          }
          if (user.signInUserSession.accessToken.payload["cognito:groups"] === null) {
            setAdmin(false);
          }
          else if (user.signInUserSession.accessToken.payload["cognito:groups"][0] === "admin") {
            setAdmin(true);
          }
        } );
        
      } catch (e) {
        setAdmin(false);
      }
    })();
  });
  
  const [isAuthenticated, setLoggedIn] = React.useState(true);
  React.useEffect(() => {
    (async () => {

      try {
        let user = await Auth.currentAuthenticatedUser();
        if (user) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
       
      } catch (e) {
        setLoggedIn(false);
      }
    })();
  });
  const { toggleTheme, theme } = useAppState();
  const leaveMeeting = async (): Promise<void> => {
    history.push(routes.HOME);
  };
  

  return (
    <div className={classes.root}>
      
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={leaveMeeting}>
            <MeetingRoom />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            AWS Social Rooms
          </Typography> 
       {
        isAdmin ? (
        <div>
          <PrimaryButton onClick={admin} color="inherit" label="Admin Page"></PrimaryButton>
          <PrimaryButton onClick={rooms} label="Rooms Display"> </PrimaryButton> 
          </div>
        ) : (
        <div>
         </div>
        )}
          
         
          
          {isAuthenticated ? (
          <div>
          <PrimaryButton label={theme === 'light' ? 'Dark mode' : 'Light mode'} onClick={toggleTheme}></PrimaryButton>
          <PrimaryButton onClick={signOut} label="Sign Out"> </PrimaryButton> 
          </div>
          ) : (
          <PrimaryButton onClick={signIn} label="Sign In"> </PrimaryButton>
        )
      }
        </Toolbar>
      </AppBar>
    </div>
  );
}