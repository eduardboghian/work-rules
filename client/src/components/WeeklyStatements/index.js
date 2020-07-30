import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';

import './css/index.css'
import axios from 'axios'
import Cookies from 'universal-cookie'
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
  const [styleStatus2, setStyle2] = useState('none')

  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

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
            activeSites = activeSites.sort(function (a, b) {
              var nameA = a.companyName + ' ' + a.siteName
              var nameB = b.companyName + ' ' + b.siteName
              nameA = nameA.toUpperCase()
              nameB = nameB.toUpperCase()
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
            });
            setMenu(activeSites)
            setNewSite(activeSites[0])
            resolve(res.data)
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
      })

      axios.get('/weekly/get-all')
        .then(async res => {
          setWEs(res.data)
          const cookies = new Cookies()
          const lastWE = cookies.get('lastWE')
          console.log(lastWE)

          if (lastWE === undefined) {
            dispatch(addSites(res.data[0].data))
            dispatch(loadData(res.data[0].data))
          } else {
            let currentWE = res.data.find(item => item.weekEnding === lastWE);
            dispatch(setWeekEnding(currentWE.weekEnding))
            updateState()
            dispatch(loadData(currentWE.data))
            dispatch(addSites(currentWE.data))
          }
        })
        .catch(err => window.location.reload(true))
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

  const updateState = () => {
    axios.get('/weekly/get-all')
      .then(async res => {
        setWEs(res.data)
      })
      .catch(err => console.log(err))
  }

  const dataToState = () => {

    axios.get('/weekly/get-all')
      .then(async res => {
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

                    let d = new Date();
                    d.setTime(d.getTime() + (1000 * 64 * 30))

                    const cookies = new Cookies()
                    cookies.set('lastWE', currentWE.weekEnding, { path: '/', expires: d })

                    dispatch(setWeekEnding(currentWE.weekEnding))
                    updateState()
                    dispatch(loadData(currentWE.data))
                    dispatch(addSites(currentWE.data))
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
