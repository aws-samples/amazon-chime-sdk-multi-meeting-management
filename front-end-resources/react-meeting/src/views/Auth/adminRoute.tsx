import React from "react";
import { Auth } from "aws-amplify";
import { Route, Redirect } from "react-router-dom";

interface Props {
  component: React.FC;
}
const AdminRoute: React.FC<Props> = ({ component }) => {
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
        alert(e.message);
        setAdmin(false);
      }
    })();
  });

  return (
    
    <Route
      render={() =>
        isAdmin ? (
          React.createElement(component)
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
};

export default AdminRoute;
