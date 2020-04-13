import React, { useEffect, useState } from 'react'
import './css/index.css'
import axios from 'axios'
import { addWorkers } from '../../actions/workerActions'
import { addSites } from '../../actions/siteActions'
import { connect } from 'react-redux'

import TopBar from './TopBar'
import Worker from './Worker'
import moment from 'moment'
import Dashboard from '../../pages/Dashboard'

const WeeklyStatemnt = ({dispatch, sites}) => {
    const [weekEnding, setWeekEnding] = useState('')

    useEffect(() => {
        
        addDataToState()

        let date = moment().day(0)
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
        let weekE = new Date(date).getFullYear()+' '+monthNames[new Date(date).getMonth()] +' '+new Date(date).getDate()

        setWeekEnding(weekE)

    }, [])

    const addDataToState = () => {
        axios.get('/worker/get')
        .then(res=> {
            let workers = res.data.filter(item => item.status === 'active')
            dispatch( addWorkers(workers) )
        })
        .catch(err => {
            console.log(err)
            window.location.reload(true)
        })

        axios.get('/site/get',{headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
          }})
        .then(res => {
            //let sites = res.data.filter(item => item.workers.length > 0)
            dispatch( addSites(res.data) )
        })
        .catch(error=>console.error(error))
    }

    const storeWeekEnding = () => {
        axios.post('/weekly/add', {
            weekEnding,
            data: sites
        })
        .then(res => {})
        .catch(err => console.error(err))
    }

    return (
      <div>
        <Dashboard/>
        <div className='weekly-wr' id='test'>
            Week Ending {`${weekEnding}`}

            {sites.map((site, i) => {
                return <div key={i}>
                    <TopBar site={site} />
                    {site.workers.map((worker,i) => {
                        return worker.rates ? <Worker key={i} worker={worker} site={site} /> : undefined
                    })}
                </div>
            })}


            <button type='submit' onClick={ e => storeWeekEnding() } >store weekly</button>
        </div>
      </div>
    )
}

const mapStateToProps = state => {
    return {
        sites: state.siteReducers.sites
    }
}

export default connect( mapStateToProps )(WeeklyStatemnt)
