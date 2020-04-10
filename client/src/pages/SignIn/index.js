import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
// import { FormattedMessage } from 'react-intl';
import axios from 'axios'

import { login, loginFail } from "../../actions/usersActions";
import { loginRequest } from "../../utils/api";

const useStyles = makeStyles({
  container: {
    marginTop: "30vh"
  },
  header: {
    textAlign: "center"
  },
  input: {
    margin: "10px 0"
  },
  submitBtn: {
    marginLeft: "40%"
  }
});

const SignIn = props => {
  const [username, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const classes = useStyles();
  let history = useHistory();

  useEffect(() => {
    if (props.loginError) {
      setTimeout(() => props.loginFail(false), 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loginError]);

  const submitLogin = async () => {
    let res = await loginRequest({ username, password });
    if (!!res) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      history.push("/dashboard");
    }

  };
  return (
    <Container maxWidth="xs" classes={{ root: classes.container }}>
      <Tooltip title="Wrong username or login" open={props.loginError} placement="top">
        <Typography component="h1" variant="h5" classes={{ root: classes.header }}>
          Sign In
        </Typography>
      </Tooltip>
      <TextField
        variant="outlined"
        autoFocus
        label="Login"
        required
        fullWidth
        value={username}
        error={props.loginError}
        onChange={e => setLogin(e.target.value)}
        classes={{ root: classes.input }}
      />
      <TextField
        variant="outlined"
        label="Password"
        type="password"
        required
        fullWidth
        error={props.loginError}
        value={password}
        onChange={e => setPassword(e.target.value)}
        classes={{ root: classes.input }}
      />
      <Button variant="contained" color="primary" onClick={submitLogin} classes={{ root: classes.submitBtn }}>
        Submit
      </Button>
    </Container>
  );
};

const mapStateToProps = state => {
  return {
    loginError: state.usersReducer.loginError
  };
};

export default connect(mapStateToProps, { login, loginFail })(SignIn);
