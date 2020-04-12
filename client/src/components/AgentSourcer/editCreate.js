import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";

import { createAgentSourcer } from "../../utils/api";
import { Input, Tooltip } from "@material-ui/core";
import { editCreateStyles } from "../../utils/styles";

const useStyles = makeStyles(editCreateStyles);

const EditCreate = props => {
  const [temporaryData, setData] = useState({ ...props.data });
  const [roleError, setRoleError] = useState(false);
  const [firstnameError, setFirstnameError] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [pending, setPending] = useState(false);

  const validation = async () => {
    if (temporaryData.role.length === 0) {
      setRoleError(true);
      let timer = setTimeout(() => setRoleError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }

    if (temporaryData.firstname.length < 3) {
      setFirstnameError(true);
      let timer = setTimeout(() => setFirstnameError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (temporaryData.lastname.length < 3) {
      setLastnameError(true);
      let timer = setTimeout(() => setLastnameError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        temporaryData.email
      ) === false
    ) {
      setEmailError(true);
      let timer = setTimeout(() => setEmailError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/.test(temporaryData.password) === false) {
      setPasswordError(true);
      let timer = setTimeout(() => setPasswordError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (temporaryData.status.length === 0) {
      setStatusError(true);
      let timer = setTimeout(() => setStatusError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    setPending(true);
    //let a = await createAgentSourcer({ ...temporaryData }, props.actionType);
    props.update();
    props.snackbar(true);
    closePage();
  };

  const inputHandler = (data, fieldName) => {
    switch (fieldName) {
      case "firstname":
        if (firstnameError) {
          setFirstnameError(false);
        }
        if (data.length <= 50) {
          let checked = data.replace(/[^A-Za-z/s-]/g, "");
          setData({ ...temporaryData, firstname: checked });
        }
        break;
      case "lastname":
        if (lastnameError) {
          setLastnameError(false);
        }
        if (data.length <= 50) {
          let checked = data.replace(/[^A-Za-z/s-]/g, "");
          setData({ ...temporaryData, lastname: checked });
        }
        break;
      default:
        break;
    }
  };
  const closePage = () => {
    props.setEditData({ role: "", firstname: "", lastname: "", email: "", password: "", status: "" });
    props.isDialogOpened(false);
  };
  const classes = useStyles();
  return (
    <>
      <Grid container direction="row" justify="space-between" classes={{ root: classes.editContainer }}>
        <Typography>{props.actionType === "edit" ? "Edit Agent/Sourcer" : "Create Agent/Sourcer"}</Typography>
        <Button classes={{ root: classes.button }} onClick={closePage}>
          Back
        </Button>
      </Grid>
      <Grid container direction="row" classes={{ root: classes.editContainer }}>
        <Grid container direction="row">
          <Grid item xs={1}>
            <Typography>Role</Typography>
          </Grid>
          <Grid item xs={11}>
            <FormControl fullWidth classes={{ root: classes.inputContainer }}>
              <Tooltip open={roleError} title="Please select Role" classes={{ tooltip: classes.errorTooltip }} placement="top">
                <Select
                  value={temporaryData.role}
                  placeholder="Role"
                  onChange={e => {
                    if (roleError) {
                      setRoleError(false);
                    }
                    setData({ ...temporaryData, role: e.target.value });
                  }}
                  classes={{ root: classes.input }}
                  fullWidth
                  error={roleError}
                >
                  <MenuItem value={"agent"}>Agent</MenuItem>
                  <MenuItem value={"sourcer"}>Sourcer</MenuItem>
                </Select>
              </Tooltip>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={1}>
            <Typography>Firstname</Typography>
          </Grid>
          <Grid item xs={11}>
            <Tooltip
              open={firstnameError}
              title="Firstname must have at least 3 Characters"
              classes={{ tooltip: classes.errorTooltip }}
              placement="top"
            >
              <FormControl fullWidth error={firstnameError}>
                <Input
                  value={temporaryData.firstname}
                  placeholder="Firstname"
                  classes={{ input: classes.input }}
                  onChange={e => inputHandler(e.target.value, "firstname")}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={1}>
            <Typography>Lastname</Typography>
          </Grid>
          <Grid item xs={11}>
            <Tooltip
              open={lastnameError}
              title="Lastname must have at least 3 Characters"
              classes={{ tooltip: classes.errorTooltip }}
              placement="top"
            >
              <FormControl fullWidth error={lastnameError}>
                <Input
                  value={temporaryData.lastname}
                  placeholder="Lastname"
                  classes={{ input: classes.input }}
                  onChange={e => inputHandler(e.target.value, "lastname")}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={1}>
            <Typography>Email</Typography>
          </Grid>
          <Grid item xs={11}>
            <Tooltip open={emailError} title="Please provide valid Email" classes={{ tooltip: classes.errorTooltip }} placement="top">
              <FormControl fullWidth error={emailError}>
                <Input
                  value={temporaryData.email}
                  placeholder="Email"
                  classes={{ input: classes.input }}
                  onChange={e => {
                    if (emailError) {
                      setEmailError(false);
                    }
                    setData({ ...temporaryData, email: e.target.value });
                  }}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={1}>
            <Typography>Password</Typography>
          </Grid>
          <Grid item xs={11}>
            <Tooltip
              open={passwordError}
              title="Password (8 characters capital, noncapital, numbers)"
              classes={{ tooltip: classes.errorTooltip }}
              placement="top"
            >
              <FormControl fullWidth error={passwordError}>
                <Input
                  value={temporaryData.password}
                  placeholder="Password"
                  classes={{ input: classes.input }}
                  onChange={e => {
                    setPasswordError(false);
                    setData({ ...temporaryData, password: e.target.value });
                  }}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item xs={1}>
            <Typography>Status</Typography>
          </Grid>
          <Grid item xs={11}>
            <FormControl fullWidth classes={{ root: classes.inputContainer }}>
              <Tooltip open={statusError} title="Please select Status" classes={{ tooltip: classes.errorTooltip }} placement="top">
                <Select
                  id="client-status"
                  value={temporaryData.status}
                  classes={{ root: classes.input }}
                  onChange={e => {
                    if (statusError) {
                      setStatusError(false);
                    }
                    setData({ ...temporaryData, status: e.target.value });
                  }}
                >
                  <MenuItem value={"active"}>Active</MenuItem>
                  <MenuItem value={"archived"}>Not Active</MenuItem>
                </Select>
              </Tooltip>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container justify="space-around">
          <Button
            style={{ marginTop: "10px" }}
            classes={{ root: classes.button }}
            disabled={pending}
            onClick={async () => {
              validation();
            }}
          >
            SAVE
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default EditCreate;
