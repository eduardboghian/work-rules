import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import Snackbar from "@material-ui/core/Snackbar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

import { getAgentsSourcersData } from "../../utils/api";

import EditCreate from "./editCreate";
import AgentSourcerRow from "./tableRow";
import Search from "../common/Search";
import Dashboard from '../../pages/Dashboard';

import { pageStyles } from "../../utils/styles";
import { multiSort } from "../../utils/methods";

const useStyles = makeStyles(pageStyles);

const AgentSourcer = props => {
  const [dialog, isDialogOpened] = useState(false);
  const [editData, setEditData] = useState({ role: "", firstname: "", lastname: "", email: "", password: "", status: "" });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchedData, setSearchedData] = useState(null);
  const [actionType, setActionType] = useState("edit");
  const [archived, isArchived] = useState(false);
  const [snackbarState, setSnackbarState] = useState(false);
  const [sort, setSort] = useState({});
  const classes = useStyles();
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => agSoFilter(), [data, archived, searchedData]);
  useEffect(() => {
    let sortedData = multiSort(filteredData, sort);
    setFilteredData(sortedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);
  const getData = async () => {
    let data = await getAgentsSourcersData();
    setData(data.data);
  };
  const openDialog = data => {
    setEditData(data);
    isDialogOpened(true);
  };
  const snackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarState(false);
  };
  const agSoFilter = () => {
    let filteredData = [...data];
    if (!archived) {
      filteredData = filteredData.filter(item => item.status !== "archived");
    }
    if (!!searchedData) {
      filteredData = filteredData.filter(item => !!searchedData.find(data => data._id === item._id));
    }
    setFilteredData(filteredData);
  };
  const sortHandler = (name, dir) => {
    if (dir === "desc") {
      setSort({ [name]: "asc" });
    } else {
      setSort({ [name]: "desc" });
    }
  };
  return (
    <Box marginRight="-1px">
      <Dashboard/>
      {dialog ? (
        <EditCreate
          isDialogOpened={isDialogOpened}
          data={editData}
          actionType={actionType}
          snackbar={setSnackbarState}
          setEditData={setEditData}
          update={getData}
        />
      ) : (
        <>
          <Grid container justify="space-between" classes={{ root: classes.pageHeader }}>
            <Grid classes={{ root: classes.pageHeaderText, container: classes.pageHeaderContainer }} container>
              <Typography style={{ paddingRight: "10px" }}>Agent Sourcer</Typography>
              <Search setSearchedData={setSearchedData} data={data} keys={["role", "firstname", "lastname"]} />
            </Grid>
            <Button
              onClick={() => {
                isDialogOpened(true);
                setActionType("create");
              }}
              classes={{ root: classes.pageHeaderButton }}
            >
              Create
            </Button>
            <Typography>
              Active
              <Switch checked={archived} onChange={isArchived.bind(null, !archived)} />
              Archived
            </Typography>
          </Grid>
          <TableContainer>
            <Table style={{ margin: 0 }}>
              <TableHead>
                <TableRow>
                  <TableCell classes={{ root: classes.cellHeaderSortable }} onClick={() => sortHandler("role", sort.role)}>
                    <Grid container>Role {sort.role === "desc" ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</Grid>
                  </TableCell>
                  <TableCell
                    classes={{ root: classes.cellHeaderSortable }}
                    onClick={() => {
                      sortHandler("firstname", sort.firstname);
                    }}
                  >
                    <Grid container> Firstname + Lastname {sort.firstname === "desc" ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</Grid>
                  </TableCell>
                  {/* <TableCell classes={{ root: classes.cellHeader }}>Email/Login</TableCell> */}
                  <TableCell align="center" classes={{ root: classes.cellHeader }}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item, index) => (
                  <AgentSourcerRow even={index % 2 !== 0} item={item} openDialog={openDialog} setActionType={setActionType} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            open={snackbarState}
            autoHideDuration={5000}
            onClose={snackbarClose}
            message={actionType === "edit" ? "Client updated" : "Client created"}
          />
        </>
      )}
    </Box>
  );
};

export default AgentSourcer;
