import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { editCreateStyles } from '../../utils/styles';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import moment from 'moment'
import axios from 'axios'
import './css/index.css'

export default function AddWorker({ formClass, close, siteId, weekEnding }) {
  const useStyles = makeStyles(editCreateStyles);
  const classes = useStyles();
  const [workers, setWorkers] = useState([])
  const [newWorker, setNewWorker] = useState({
    firstname: 'andrei',
    lastname: 'el'
  })

  const [searchedData, setSearchedData] = useState('');

  useEffect(() => {
    getWorkersFromDB()
  }, [])

  useEffect(() => {
    let data = [...workers];

    if (!!searchedData) {
      data = data.filter(item => item['firstname'].toLowerCase().includes(searchedData) || item['lastname'].toLowerCase().includes(searchedData));
      if (data[0] !== undefined) {
        setWorkers(data)
        setNewWorker(data[0])
      }
    }
  }, [searchedData])

  const getWorkersFromDB = () => {
    axios.get('/worker/get')
      .then(res => {
        setWorkers(res.data)
        setNewWorker(res.data[0])
      })
      .catch(error => console.error(error))
  }

  const addWorker = () => {
    let date = new Date().getDay() === 0 ? moment().day(0).format('YYYY MMMM DD') : moment().day(7).format('YYYY MMMM DD')
    console.log(date, weekEnding)

    if (weekEnding.weekEnding === date) {
      axios.put('/site/add-worker', {
        siteId,
        newWorker,
        rates: {
          rateGot: 0,
          ratePaid: 0,
          otGot: 0,
          otPaid: 0
        }
      })
        .then(res => {
          if (res.data !== 'worker already on this site') {
            window.location.reload(true)
          } else {
            alert('The worker is already on this site!')
          }
        })
        .catch(error => console.log(error))
    } else {
      axios.put('/weekly/add-worker', {
        weekEnding: weekEnding.weekEnding,
        siteId,
        newWorker,
        rates: {
          rateGot: 0,
          ratePaid: 0,
          otGot: 0,
          otPaid: 0
        }
      })
        .then(res => {
          if (res.data !== 'worker already on this site') {
            window.location.reload(true)
          } else {
            alert('The worker is already on this site!')
          }
        })
        .catch(error => console.log(error))
    }

  }

  return (
    <div className={`${formClass} addworker-wr`}>
      <p className='title-add-worker'>Add Worker</p>
      <div className="close-btn" onClick={e => close()}>X</div>


      <Grid classes={{ root: classes.pageHeaderText, container: classes.pageHeaderContainer }} container>
        <Typography style={{ paddingRight: "10px" }}>Worker</Typography>
        <SearchIcon style={{ color: '#777' }} />
        <Grid item xs={9}>
          <FormControl fullWidth>
            <Input
              value={searchedData}
              placeholder='John Smith'
              className='input-worker'
              onChange={e => setSearchedData(e.target.value.toLowerCase())}
            />
          </FormControl>
        </Grid>
      </Grid>


      <Grid className='select-wr' container direction='row' classes={{ root: classes.inputContainer }}>
        <Grid item xs={3}>
          <Typography>Chose Worker</Typography>
        </Grid>
        <Grid item xs={9}>
          <FormControl fullWidth classes={{ root: classes.inputContainer }}>
            <Select
              style={{ width: '80%' }}
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
    </div>
  )
}
