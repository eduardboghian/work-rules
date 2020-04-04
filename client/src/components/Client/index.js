import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import Snackbar from '@material-ui/core/Snackbar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import { getClientData } from '../../utils/api';

import ClientRow from './tableRow';
import EditCreate from './editCreate';
import Search from '../common/Search';

import { getWorkers } from '../../utils/api';
import { pageStyles } from '../../utils/styles';
import { multiSort } from '../../utils/methods';

const useStyles = makeStyles(pageStyles);

const Client = props => {
  const [dialog, isDialogOpened] = useState(false);
  const [snackbarState, setSnackbarState] = useState(false);
  const [workersData, setWorkersData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchedData, setSearchedData] = useState(null);
  const [editData, setEditData] = useState({
    companyName: '',
    peer: '',
    id: '',
    firstPost: '',
    secondPost: '',
    utr: '',
    vat: 'GB ',
    cis: false,
    gross: '',
    phone: '+44',
    email: '',
    communicationChannel: '',
    sites: [],
    status: ''
  });
  const [actionType, setActionType] = useState('edit');
  const [archived, isArchived] = useState(true);
  const [sort, setSort] = useState({});
  const classes = useStyles();

  useEffect(() => {
    getClientData().then(res => setClientData(res.data));
  }, []);

  // FILTERS
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
      let filteredData = [...clientData];
      if (!archived) {
        filteredData = filteredData.filter(item => item.status !== 'archived');
      }
      if (!!searchedData) {
        filteredData = filteredData.filter(item => !!searchedData.find(data => data._id === item._id));
      }
      setFilteredData(filteredData);
  }, [clientData, archived, searchedData]);
  
  
  useEffect(() => {
    let sortedData = multiSort(filteredData, sort);
    setFilteredData(sortedData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort]);
  
  const openDialog = data => {
    setEditData(data);
    isDialogOpened(true);
  };

  const updateClientData = async () => {
    let data = await getWorkers();
    setWorkersData(data.data);
  };
  
  const snackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarState(false);
  };

  const sortHandler = (name, dir) => {
    if (dir === 'desc') {
      setSort({ [name]: 'asc' });
    } else {
      setSort({ [name]: 'desc' });
    }
  };

  return (
    <Grid>
      {dialog ? (
        <EditCreate isDialogOpened={isDialogOpened} data={editData} setEditData={setEditData} actionType={actionType} update={updateClientData} />
      ) : (
        <>
          <Grid container justify='space-between' classes={{ root: classes.pageHeader }}>
            <Grid classes={{ root: classes.pageHeaderText, container: classes.pageHeaderContainer }} container>
              <Typography style={{ paddingRight: '10px' }}>Client</Typography>
              <Search setSearchedData={setSearchedData} data={clientData} keys={['companyName', 'peer', 'phone', 'communicationChannel']} />
            </Grid>
            <Button
              onClick={() => {
                isDialogOpened(true);
                setActionType('create');
              }}
              classes={{ root: classes.pageHeaderButton }}
            >
              Create
            </Button>
            <Typography>
              Active
              <Switch onChange={isArchived.bind(null, !archived)} />
              Archived
            </Typography>
          </Grid>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell classes={{ root: classes.cellHeaderSortable }} onClick={() => sortHandler('companyName', sort.companyName)}>
                    <Grid container>Company Name {sort.companyName === 'desc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</Grid>
                  </TableCell>
                  <TableCell classes={{ root: classes.cellHeaderSortable }} onClick={() => sortHandler('peer', sort.peer)}>
                    <Grid container>Peere {sort.peer === 'desc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</Grid>
                  </TableCell>
                  <TableCell classes={{ root: classes.cellHeaderSortable }} onClick={() => sortHandler('phone', sort.phone)}>
                    <Grid container>Phone Number {sort.phone === 'desc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</Grid>
                  </TableCell>
                  <TableCell
                    classes={{ root: classes.cellHeaderSortable }}
                    onClick={() => sortHandler('communicationChannel', sort.communicationChannel)}
                  >
                    <Grid container>
                      Preferred Communication Channel {sort.communicationChannel === 'desc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                    </Grid>
                  </TableCell>
                  <TableCell classes={{ root: classes.cellHeader }}>Site</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((item, index) => (
                  <ClientRow even={index % 2 !== 0} item={item} openDialog={openDialog} setActionType={setActionType} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackbarState}
        autoHideDuration={5000}
        onClose={snackbarClose}
        message={actionType === 'edit' ? 'Client updated' : 'Client created'}
      />
    </Grid>
  );
};

export default Client;
