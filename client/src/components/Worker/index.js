import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Snackbar from "@material-ui/core/Snackbar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Divider } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

import { getWorkers } from "../../utils/api";
import { pageStyles } from "../../utils/styles";
import { multiSort } from "../../utils/methods";

import WorkerRow from "./tableRow";
import EditCreate from "./editCreate";
import Search from "../common/Search";
import Dashboard from '../../pages/Dashboard';

const useStyles = makeStyles(pageStyles);

const Worker = props => {
  const [dialog, isDialogOpened] = useState(false);
  const [snackbarState, setSnackbarState] = useState(false);
  const [workersData, setWorkersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchedData, setSearchedData] = useState(null);
  const [editData, setEditData] = useState({
    type: "physical",
    peer: "",
    firstname: "",
    lastname: "",
    id: "",
    firstPost: "",
    secondPost: "",
    city: '',
    zipCode: '',
    utr: "",
    vat: "GB ",
    cis: false,
    nino: "",
    phone: "+44",
    email: "",
    communicationChannel: "",
    account: '',
    sortCode: '',
    taxPercentage: "",
    category: "",
    status: ""
  });
  const [actionType, setActionType] = useState("edit");
  const [archived, isArchived] = useState(false);
  const [noCis, setCisState] = useState(false);
  const [noUtr, setUtrState] = useState(false);
  const [noNino, setNinoState] = useState(false);
  const [sort, setSort] = useState({});

  const classes = useStyles();
  useEffect(() => {
    const updateClientData = async () => {
      let data = await getWorkers();
      setWorkersData(data.data);
    };

    updateClientData()
  }, []);


  useEffect(() => {
    const workersFilter = () => {
      let data = [...workersData];
      if (!archived) {
        data = data.filter(item => item.status === "active");
      }
      if (!noCis) {
        data = data.filter(item => item.cis === true);
      }
      if (noUtr) {
        data = data.filter(item => item.utr.length === 0);
      }
      if (noNino) {
        data = data.filter(item => item.nino.length === 0);
      }
      if (!!searchedData) {
        data = data.filter(item => !!searchedData.find(data => data._id === item._id));
      }
      setFilteredData(data);
    };

    workersFilter();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workersData, searchedData, archived, noCis, noUtr, noNino]);


  useEffect(() => {
    let sortedData = multiSort(filteredData, sort);
    setFilteredData(sortedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);
  
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

  const updateClientData = async () => {
    let data = await getWorkers();
    setWorkersData(data.data);
  };
  
  const sortHandler = (name, dir) => {
    if (dir === "desc") {
      setSort({ [name]: "asc" });
    } else {
      setSort({ [name]: "desc" });
    }
  };
  return (
    <Grid>
      <Dashboard/>
      {dialog ? (
        <EditCreate isDialogOpened={isDialogOpened} data={editData} setEditData={setEditData} actionType={actionType} update={updateClientData} />
      ) : (
        <>
          <Grid container justify="space-between" classes={{ root: classes.pageHeader }}>
            <Grid classes={{ root: classes.pageHeaderText, container: classes.pageHeaderContainer }} container>
              <Typography style={{ paddingRight: "10px" }}>Worker</Typography>
              <Search setSearchedData={setSearchedData} data={workersData} keys={["firstname", "lastname", "communicationChannel", "utr", "nino"]} />
            </Grid>
            <Button
              onClick={() => {
                isDialogOpened(true);
                setActionType("create");
              }}
              style={{ marginLeft: "80px" }}
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
          <Divider style={{ backgroundColor: "mistyrose" }} />
          <Grid container justify="space-between" direction="row" style={{ flexWrap: "nowrap" }} classes={{ root: classes.pageHeader }}>
            <Grid item container>
              <Typography classes={{ root: classes.pageHeaderText }}>
                CIS
                <Switch checked={noCis} onChange={setCisState.bind(null, !noCis)} />
                No CIS
              </Typography>
            </Grid>
            <Grid item container justify="center">
              <Typography classes={{ root: classes.pageHeaderText }}>
                UTR
                <Switch checked={noUtr} onChange={setUtrState.bind(null, !noUtr)} />
                No UTR
              </Typography>
            </Grid>
            <Grid item container justify="flex-end">
              <Typography classes={{ root: classes.pageHeaderText }}>
                NINO
                <Switch checked={noNino} onChange={setNinoState.bind(null, !noNino)} />
                No NINO
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell classes={{ root: classes.cellHeaderSortable }} onClick={() => sortHandler("firstname", sort.firstname)}>
                    <Grid container>firstname + Lastname {sort.firstname === "desc" ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</Grid>
                  </TableCell>
                  <TableCell classes={{ root: classes.cellHeaderSortable }} onClick={() => sortHandler("phone", sort.phone)}>
                    <Grid container>Phone Number {sort.phone === "desc" ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</Grid>
                  </TableCell>
                  <TableCell
                    classes={{ root: classes.cellHeaderSortable }}
                    onClick={() => sortHandler("communicationChannel", sort.communicationChannel)}
                  >
                    <Grid container>
                      Preferred Communication Channel {sort.communicationChannel === "desc" ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    </Grid>
                  </TableCell>
                  <TableCell classes={{ root: classes.cellHeader }}>Trade</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item, index) => (
                  <WorkerRow key={index} even={index % 2 !== 0} item={item} openDialog={openDialog} setActionType={setActionType} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={snackbarState}
        autoHideDuration={5000}
        onClose={snackbarClose}
        message={actionType === "edit" ? "Worker updated" : "Worker created"}
      />
    </Grid>
  );
};

export default Worker;
