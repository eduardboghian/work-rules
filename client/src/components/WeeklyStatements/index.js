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

const WeeklyStatemnt = ({dispatch, sites, weekEnding}) => {
    const [we, setWEs] = useState([])
    const [sitesMenu, setMenu] = useState([])
    const [newSite, setNewSite] = useState({})
    const [styleStatus, setStyle] = useState('none')

    useEffect(() => {
        const addDataToState = () => {
            let sitesRes = new Promise((resolve, reject) => {
                axios.get('/site/get',{headers: {
                    authorization: 'Bearer ' + localStorage.getItem('token')
                  }})
                .then(async res => {
                    setNewSite(res.data[0])
                    setMenu(res.data)
                    let activeSites = await res.data.filter(item => item.status === 'Active')
                    dispatch( addSites(activeSites) )
                    resolve(activeSites)
                })
                .catch(error=> {
                    reject(error)
                    window.location.reload(true)
                })
            })

            axios.get('/weekly/get-all')
            .then(async res => {
                let date = new Date().getDay() === 0 ? moment().day(-7).format('YYYY MMMM DD') : moment().day(0).format('YYYY MMMM DD')

                let currentWE =  {
                    weekEnding: date,
                    data: await sitesRes
                }
                
                res.data.unshift(currentWE)
                setWEs(res.data)
            })
            .catch(err => console.log(err))
        }
        
        addDataToState()
        
        if(new Date().getDay() === 0) {
            let date = moment().day(-7).format('YYYY MMMM DD')

            dispatch( setWeekEnding(date) )
        }else {
            let date = moment().day(0).format('YYYY MMMM DD')

            dispatch( setWeekEnding(date) )
        }
        
    }, []) 
    
    const selectSite = () => {
        newSite.workers = []
        axios.put('/weekly/add-site', {
            weekEnding: weekEnding,
            newSite
        })
        .then(res => window.location.reload(true))
        .catch(err =>console.error(err))
    }

    return (
      <div>
        <Dashboard/>
        <div className='weekly-wr' id='test'>
            <Grid container direction='row' style={{ width: '400px', marginLeft: '20px' }}>
                <Grid item xs={3}>
                    <Typography>WeekEnding</Typography>
                </Grid>
                <Grid item xs={9}>
                    <FormControl fullWidth>
                        <Select
                            value={ weekEnding }
                            onChange={e => {
                                let currentWE = we.find(item => item.weekEnding === e.target.value);
                                dispatch( setWeekEnding(currentWE.weekEnding) )
                                dispatch( addSites(currentWE.data) )  
                            }}
                        >
                        
                        {we.map((we, i) => {
                            return <MenuItem key={i} value={we.weekEnding}>{we.weekEnding}</MenuItem>
                        })}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {sites.map((site, i) => {
                return <div key={i}>
                    <TopBar site={site} />
                    {site.workers.length === 0 ? <div className='site-name'>Add worker to {site.siteName}! </div>: null} 
                    {site.workers.map((worker,i) => {
                        return worker.rates ? <Worker key={i} worker={worker} site={site} /> : undefined 
                    })}
                </div>
            })}

            <div className="add-site-wr">
                { weekEnding !== moment().day(0).format('YYYY MMMM DD')  ? <div className='add-site-btn' onClick={ e => setStyle('') }>Add Site</div> : null }
                <div className={`${styleStatus}`}>
                    <Grid container direction='row' style={{ width: '450px' }}>
                        <Grid item xs={9}>
                            <FormControl fullWidth >
                                <Select
                                    style={{ width: '80%' }}
                                    renderValue={ () => {
                                        return newSite.companyName+' '+newSite.siteName
                                    }}
                                    defaultValue={'John'}
                                    onChange={e => {
                                        let site = sitesMenu.find(site => site._id === e.target.value);
                                        setNewSite(site)
                                    }}
                                >
                                    {sitesMenu.map((site, i) => (
                                        <MenuItem key={i} value={site._id}>{site.companyName+' '+site.siteName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <button className="ok-btn" onClick={ e => selectSite() }>OK</button>
                    </Grid>
                </div>
            </div>
            

        </div>
      </div>
    )
}

const mapStateToProps = state => {
    return {
        sites: state.siteReducers.sites,
        weekEnding: state.weekEndingReducers.weekEnding
    }
}

export default connect( mapStateToProps )(WeeklyStatemnt)
