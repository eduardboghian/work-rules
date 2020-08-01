/* eslint-disable */

import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Divider } from "@material-ui/core";
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
import Dashboard from '../../pages/Dashboard'

const useStyles = makeStyles(pageStyles);

const Client = props => {
  const [companyId, setCompanyId] = useState('')
  const [dialog, isDialogOpened] = useState(false);
  const [snackbarState, setSnackbarState] = useState(false);
  const [workersData, setWorkersData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchedData, setSearchedData] = useState(null);
  const [editData, setEditData] = useState({
    _id: '',
    companyName: '',
    peer: '',
    name: '',
    lastName: '',
    id: '',
    firstPost: '',
    secondPost: '',
    city: '',
    zipCode: '',
    utr: '',
    vat: 'GB ',
    cis: '',
    nino: '',
    category: '',
    phone: '+44',
    phoneScnd: '+44',
    email: '',
    comment: '',
    companyComment: '',
    communicationChannel: 'whatsapp',
    sites: [],
    status: 'active'
  });
  const [actionType, setActionType] = useState('edit');
  const [archived, isArchived] = useState(true);
  const [sort, setSort] = useState({});
  const classes = useStyles();

  useEffect(() => {
    loadClientData()
  }, [dialog]);


  // FILTERS
  useEffect(() => {
    let filteredData = [...clientData];
    if (!archived) {
      filteredData = filteredData.filter(item => item.status !== 'active');
    }
    if (!!searchedData) {
      filteredData = filteredData.filter(item => !!searchedData.find(data => data._id === item._id));
    }
    setFilteredData(filteredData);
  }, [clientData, archived, searchedData]);


  useEffect(() => {
    let sortedData = multiSort(filteredData, sort);
    setFilteredData(sortedData);
  }, [sort]);

  const loadClientData = () => {
    getClientData()
      .then(res => {
        setCompanyId(res.data[0]._id)
        setClientData(res.data)
      })
      .catch(err => console.error(err))
  }

  const openDialog = data => {
    setEditData(data)
    isDialogOpened(true)
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
    <Grid className='client-wr'>
      <Dashboard />
      {dialog ? (
        <EditCreate isDialogOpened={isDialogOpened} data={editData} companyId={companyId} setEditData={setEditData} actionType={actionType} update={updateClientData} />
      ) : (
          <>
            <Grid container justify='space-between' style={{ marginTop: '20px' }} className='search-client'>
              <Grid classes={{ root: classes.pageHeaderText, container: classes.pageHeaderContainer }} container>
                <Search setSearchedData={setSearchedData} data={clientData} keys={['companyName', 'peer', 'phone', 'communicationChannel']} />
              </Grid>
              <Button
                onClick={() => {
                  isDialogOpened(true);
                  setActionType('create');
                }}
                className='create-newclient-btn'
              >
                Create New Client
            </Button>
            </Grid>

            <Divider style={{ backgroundColor: "inherit", marginBottom: '40px' }} />


            <Divider />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell classes={{ root: classes.cellHeaderSortable }} onClick={() => sortHandler('companyName', sort.companyName)}>
                      <Grid container>Company Name {sort.companyName === 'desc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</Grid>
                    </TableCell>

                    <TableCell classes={{ root: classes.cellHeaderSortable }} onClick={() => sortHandler('peer', sort.peer)}>
                      <Grid container>Contact Person {sort.peer === 'desc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</Grid>
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

                    <TableCell classes={{ root: classes.cellHeaderSortable }} onClick={() => sortHandler('phone', sort.phone)}>
                      <Grid container>eMail {sort.email === 'desc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</Grid>
                    </TableCell>

                    <TableCell classes={{ root: classes.cellHeader }}>Status</TableCell>
                    <TableCell style={{ width: '10px' }} classes={{ root: classes.cellHeader }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <ClientRow key={index} even={index % 2 !== 0} item={item} openDialog={openDialog} setActionType={setActionType} />
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
