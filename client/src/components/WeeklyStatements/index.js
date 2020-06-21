import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';

import './css/index.css'
import axios from 'axios'
import { addSites } from '../../actions/siteActions'
import { setWeekEnding } from '../../actions/weekEndingAction'
import { connect } from 'react-redux'

import TopBar from './TopBar'
import Worker from './Worker'
import moment from 'moment'
import Dashboard from '../../pages/Dashboard'
import { loadData } from '../../actions/listActions';

import xlsxG from '../../utils/xlsx2'

const WeeklyStatemnt = ({ dispatch, sites, weekEnding }) => {
  const [we, setWEs] = useState([])
  const [sitesMenu, setMenu] = useState([])
  const [newSite, setNewSite] = useState({})
  const [removedSite, setRemovedSite] = useState({})
  const [styleStatus, setStyle] = useState('none')
  const [styleStatus2, setStyle2] = useState('none')

  useEffect(() => {
    const addDataToState = () => {
      let sitesRes = new Promise((resolve, reject) => {
        axios.get('/site/all', {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
          }
        }
        )
          .then(res => {
            let activeSites = res.data.filter(site => site.status === 'Active')
            setNewSite(activeSites[0])
            dispatch(loadData([...activeSites]))
            setMenu([...res.data])
            dispatch(addSites([...activeSites]))
            resolve(res.data)
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
      })

      axios.get('/weekly/get-all')
        .then(async res => {
          let date = new Date().getDay() === 0 ? moment().day(0).format('YYYY MMMM DD') : moment().day(+7).format('YYYY MMMM DD')

          let currentWE = {
            weekEnding: date,
            data: await sitesRes
          }

          res.data.unshift(currentWE)
          setWEs(res.data)
        })
        .catch(err => console.log(err))
    }

    addDataToState()

    if (new Date().getDay() === 0) {
      let date = moment().day(0).format('YYYY MMMM DD')

      dispatch(setWeekEnding(date))
    } else {
      let date = moment().day(+7).format('YYYY MMMM DD')
      dispatch(setWeekEnding(date))
    }

  }, [])

  const selectSite = () => {

    let date = new Date().getDay() === 0 ? moment().day(0).format('YYYY MMMM DD') : moment().day(7).format('YYYY MMMM DD')

    if (weekEnding === date) {
      axios.post('/client/get-by-name', {
        companyName: newSite.companyName
      })
        .then(res => {
          console.log(res.data[0])
          axios.put('/client/site-status', {
            clientId: res.data[0]._id,
            siteId: newSite._id,
            value: 'Active'
          })
            .then(res => console.log(res))
            .catch(err => console.error(err))
        })
        .catch(err => console.error(err))


      axios.put('/site/update-status', {
        id: newSite._id,
        value: "Active"
      })
        .then(res => {
          let activeSites = res.data.filter(site => site.status === 'Active')
          dispatch(addSites(activeSites))
        })
        .catch(err => console.log(err))
    } else {
      axios.put('/weekly/add-site', {
        weekEnding: weekEnding,
        newSite
      })
        .then(res => {
          dispatch(loadData(res.data.data))
          dispatch(addSites(res.data.data))
          setStyle2('none')
        })
        .catch(err => console.error(err))
    }
  }

  const updateState = () => {
    let sitesRes = new Promise((resolve, reject) => {
      axios.get('/site/all', {
        headers: {
          authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
      )
        .then(res => {
          let activeSites = res.data.filter(site => site.status === 'Active')
          resolve(res.data)
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
    axios.get('/weekly/get-all')
      .then(async res => {
        let date = new Date().getDay() === 0 ? moment().day(0).format('YYYY MMMM DD') : moment().day(+7).format('YYYY MMMM DD')

        let currentWE = {
          weekEnding: date,
          data: await sitesRes
        }
        res.data.unshift(currentWE)
        setWEs(res.data)
      })
      .catch(err => console.log(err))
  }

  const dataToState = () => {
    let sitesRes = new Promise((resolve, reject) => {
      axios.get('/site/all', {
        headers: {
          authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }
      )
        .then(res => {
          let activeSites = res.data.filter(site => site.status === 'Active')
          setNewSite(activeSites[0])
          setMenu([...res.data])
          dispatch(addSites(activeSites))
          resolve(res.data)
        })
        .catch(error => {
          reject(error)
        })
    })

    axios.get('/weekly/get-all')
      .then(async res => {
        let date = new Date().getDay() === 0 ? moment().day(0).format('YYYY MMMM DD') : moment().day(+7).format('YYYY MMMM DD')

        let currentWE = {
          weekEnding: date,
          data: await sitesRes
        }

        res.data.unshift(currentWE)
        setWEs(res.data)
      })
      .catch(err => console.log(err))
  }


  return (
    <div>
      <Dashboard />
      <div className='weekly-wr' id='test'>
        <div className='first-row' >
          <Grid container direction='row' style={{ width: '400px', marginLeft: '20px' }}>
            <Grid item xs={3}>
              <Typography>WeekEnding</Typography>
            </Grid>
            <Grid item xs={9}>
              <FormControl fullWidth>
                <Select
                  value={weekEnding}
                  onChange={e => {
                    let currentWE = we.find(item => item.weekEnding === e.target.value);
                    dispatch(setWeekEnding(currentWE.weekEnding))
                    updateState()
                    let date = new Date().getDay() === 0 ? moment().day(0).format('YYYY MMMM DD') : moment().day(+7).format('YYYY MMMM DD')

                    console.log('test for date', e.target.value, date)
                    if (e.target.value === date) {
                      dataToState()
                    } else {
                      dispatch(loadData(currentWE.data))
                      dispatch(addSites(currentWE.data))
                    }
                  }}
                >

                  {we.map((we, i) => {
                    return <MenuItem key={i} value={we.weekEnding}>{we.weekEnding}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>


          <div onClick={e => xlsxG(sites, 'Matt', weekEnding)} className='first-row-element' >Generate Excel for Matt</div>
          <div onClick={e => xlsxG(sites, 'Rob', weekEnding)} className='first-row-element' >Generate Excel for Rob</div>
          <div className="add-site-wr">
            <div className='add-site-top' onClick={e => setStyle2('')}>Add New Site</div>
            <div className={`${styleStatus2}`}>
              <Grid container direction='row' style={{ width: '450px' }}>
                <Grid item xs={9}>
                  <FormControl fullWidth >
                    <Select
                      style={{ width: '80%' }}
                      renderValue={() => {
                        return newSite ? newSite.companyName + ' ' + newSite.siteName : 'Please select a Site!'
                      }}
                      defaultValue={'John'}
                      onChange={e => {
                        let site = sitesMenu.find(site => site._id === e.target.value);
                        setNewSite(site)
                      }}
                    >
                      {sitesMenu.map((site, i) => (
                        <MenuItem key={i} value={site._id}>{site.companyName + ' ' + site.siteName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <button className="ok-btn" onClick={e => selectSite()}>OK</button>
              </Grid>
            </div>
          </div>
        </div>

        {sites ? sites.map((site, i) => {
          return <div key={i}>
            <TopBar site={site} clientId={''} />
            {site.workers.length === 0 ? <div className='site-name'>Add worker to {site.siteName}! </div> : null}
            {site.workers.map((worker, i) => {
              return worker.rates ? <Worker
                key={i}
                worker={worker}
                site={site}
                rowNumber={i}
              /> : undefined
            })}
          </div>
        }) : null}

      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    sites: state.siteReducers.sites,
    weekEnding: state.weekEndingReducers.weekEnding,
    list: state.listReducers.list
  }
}

export default connect(mapStateToProps)(WeeklyStatemnt)
