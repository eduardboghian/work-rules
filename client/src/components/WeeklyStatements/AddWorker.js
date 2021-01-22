/* eslint-disable */

import React, { useState, useEffect } from 'react'
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';

import { editCreateStyles } from '../../utils/styles';
import { addSites } from '../../actions/siteActions';
import { loadData } from '../../actions/listActions';
import { TextField } from '@material-ui/core';
import { connect } from 'react-redux';

import axios from 'axios'
import './css/index.css'

const AddWorker = ({ dispatch, formClass, close, siteId, weekEnding }) => {
  const useStyles = makeStyles(editCreateStyles);
  const classes = useStyles();
  const [completeList, setList] = useState([])
  const [workers, setWorkers] = useState([])
  const [newWorker, setNewWorker] = useState({
    firstname: 'Prenume',
    lastname: 'Nume'
  })
  const [showCreateNewWorker, setCreateNewWorker] = useState(false)
  const [searchedData, setSearchedData] = useState('');
  const [showFrom, setShowForm] = useState(false)
  const [data, setData] = useState({
    type: "physical",
    peer: "",
    companyName: "",
    firstname: "",
    lastname: "",
    uniqueID: "",
    firstPost: "",
    secondPost: "",
    city: '',
    zipCode: '',
    utr: "",
    vat: "GB ",
    nino: "",
    phone: "+44",
    phoneScnd: '+44',
    email: "",
    communicationChannel: "whatsapp",
    account: '',
    sortCode: '',
    taxPercentage: "",
    category: "",
    trades: [],
    tickets: [],
    documents: [],
    comment: '',
    status: "active"
  })

  useEffect(() => {
    getWorkersFromDB()
  }, [])

  useEffect(() => {
    let data = JSON.parse(JSON.stringify(completeList));

    if (!!searchedData) {
      data = data.filter(item => item['firstname'].toLowerCase().includes(searchedData) || item['lastname'].toLowerCase().includes(searchedData));
      if (data[0] !== undefined) {
        setWorkers(data)
        setNewWorker(data[0])
        setCreateNewWorker(false)
      } else {
        setCreateNewWorker(true)
      }
    }
  }, [searchedData])

  const getWorkersFromDB = () => {
    axios.get('/worker/get')
      .then(res => {
        setWorkers(res.data)
        setList(res.data)
        setNewWorker(res.data[0])
      })
      .catch(error => console.error(error))
  }

  const addWorker = () => {
    if (newWorker.added === undefined) {
      newWorker.added = weekEnding.weekEnding

      axios.put('/worker/added', {
        id: newWorker._id,
        added: weekEnding.weekEnding
      })
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }

    axios.put('/weekly/add-worker', {
      weekEnding: weekEnding.weekEnding,
      siteId,
      newWorker,
      rates: {
        rateGot: '0,0',
        ratePaid: '0,0'
      }
    })
      .then(res => {
        console.log(res.data.data)
        dispatch(addSites(res.data.data))
        dispatch(loadData(res.data.data))

      })
      .catch(error => console.log(error))
  }

  const handleSubmit = () => {
    if (data.type === 'company') {
      if (data.companyName = '') return console.error('enter a copanyName')
    } else {
      if (data.firstnam === '' || data.lastname === '') return console.error('please enter valid data')
    }

    axios.post('/worker/add', {
      action: 'create',
      data
    }, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        console.log(res.data)
        setWorkers([...workers, res.data])
        setShowForm(!showFrom)
        setNewWorker(res.data)
      })
      .catch(err => console.error(err))
  }

  return (
    <div
      className={`${formClass} addworker-wr`}
      style={showFrom ? { height: '68%' } : { height: 'auto' }}
    >
      <p className='title-add-worker'>Add Worker</p>
      <div className="close-btn" onClick={e => close()}>X</div>


      <Grid style={{
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        width: '100%',
        height: '40px',
        marginBottom: '30px'
      }}
        className='search-worker-main'
      >
        <Typography style={{ paddingRight: "10px" }}>Worker</Typography>
        <SearchIcon style={{ color: '#777', marginTop: '8px', marginRight: '50px' }} />
        <Grid xs={9}>
          <TextField
            size="small"
            variant="outlined"
            value={searchedData}
            placeholder='John Smith'
            className='input-worker'
            onChange={e => setSearchedData(e.target.value.toLowerCase())}
          />
        </Grid>
      </Grid>


      <Grid
        className='select-wr'
        container direction='row'
        classes={{ root: classes.inputContainer }}
        style={{
          height: '55px'
        }}
      >
        <Grid item xs={2} style={{
          marginRight: '30px'
        }}>
          <Typography>Chose Worker</Typography>
        </Grid>
        <Grid item xs={7}>
          <FormControl fullWidth classes={{ root: classes.inputContainer }}>
            <Select
              style={{
                height: '40px !important'
              }}
              variant="outlined"
              size='samll'
              renderValue={() => {
                return newWorker ? newWorker.firstname + ' ' + newWorker.lastname : ''
              }}
              defaultValue={'John'}
              onChange={e => {
                let worker = workers.find(worker => worker._id === e.target.value);
                setNewWorker(worker)
              }}
            >
              {workers.map((worker, i) => (
                <MenuItem key={i} value={worker._id}>{worker.firstname + ' ' + worker.lastname}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <button type='submit' className='add-worker-btn' onClick={e => addWorker(e)}>Add Worker</button>

      <div className="add-question" style={showCreateNewWorker ? {} : { display: 'none' }}>
        <p>There is no worker with this name! Would you like to create a new one?</p>
        <button onClick={e => {
          setShowForm(!showFrom)
          setCreateNewWorker(!showCreateNewWorker)
        }}>Create New Worker</button>
      </div>

      <div className="create-new-worker" style={showFrom ? {} : { display: 'none' }}>
        <Grid className='switcher'>
          <Typography>Person</Typography>
          <Switch
            classes={{ root: classes.switch }}
            checked={data.type === 'physical' ? false : true}
            onClick={e => {
              console.log('change...', e.target.value)
              data.type === 'physical' ? setData({ ...data, type: 'company' }) : setData({ ...data, type: 'physical' })
            }}
          />
          <Typography>Company</Typography>
        </Grid>

        {data.type === 'company' ?
          <Grid className='create-field'>
            <Grid>

              <Typography>Company Name</Typography>
              <Input
                value={data.companyName}
                classes={{ input: classes.input }}
                onChange={e => setData({ ...data, companyName: e.target.value })}
              />
            </Grid>
          </Grid>
          : <div></div>}

        <Grid className='create-field' >
          <Grid>
            <Typography>Firstname</Typography>
            <Input
              value={data.firstname}
              classes={{ input: classes.input }}
              onChange={e => setData({ ...data, firstname: e.target.value })}
            />
          </Grid>
        </Grid>

        <Grid className='create-field'  >
          <Grid>
            <Typography>Lastname</Typography>
            <Input
              value={data.lastname}
              classes={{ input: classes.input }}
              onChange={e => setData({ ...data, lastname: e.target.value })}
            />
          </Grid>
        </Grid>

        <button
          className="submit"
          onClick={e => handleSubmit()}
        >Create New Worker</button>
        <button
          className="cancel-btn"
          onClick={e => setShowForm(!showFrom)}
        >Cancel</button>

      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    sites: state.siteReducers.sites
  }
}

export default connect(mapStateToProps)(AddWorker)