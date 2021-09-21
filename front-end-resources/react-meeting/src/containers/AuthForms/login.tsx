import React from "react";
import TextField from "@material-ui/core/TextField";
import { styled } from "@material-ui/core/styles";
import { useInput } from "../../utils/forms";
import { Auth } from "aws-amplify";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link, useHistory } from "react-router-dom";
import routes from '../../constants/routes';

const Field = styled(TextField)({
  margin: "10px 0",
});

const DLink = styled(Link)({
  margin: "15px 0",
  textAlign: "right",
});

const Signup: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const history = useHistory();

  const { value: email, bind: bindEmail } = useInput("");
  const { value: password, bind: bindPassword } = useInput("");

  const handleSubmit = async (e: React.SyntheticEvent<Element, Event>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Auth.signIn(email, password). then ( info => {
        if ((info.signInUserSession.accessToken.payload["cognito:groups"] != null && info.signInUserSession.accessToken.payload["cognito:groups"][0] === "admin")) {
          history.push(routes.ADMIN);
        }
        else {
          history.push(routes.HOME);
        }

      });

    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onSubmit={handleSubmit}
    >
      <h1 style={{ fontSize: "25px", fontWeight: 800 }}>
        {" "}
        Login to existing account
      </h1>
      <Field label="Email" {...bindEmail} type="email" />
      <Field label="Password" type="password" {...bindPassword} />
      <Button variant="contained" color="primary" size="large" type="submit" disabled={loading}>
        {loading && <CircularProgress size={20} style={{ marginRight: 20 }} />}
        Login 
      </Button>
      <DLink to="/signup">Create a new account &rarr;</DLink>
    </form> 

  );
};

export default Signup;
