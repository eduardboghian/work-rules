import React, { useEffect } from 'react'
import './css/index.css'
import axios from 'axios'
import { addWorkers } from '../../actions/workerActions'
import { addSites } from '../../actions/siteActions'
import { connect } from 'react-redux'

import TopBar from './TopBar'
import Worker from './Worker'

const WeeklyStatemnt = ({dispatch, workers, sites}) => {
    useEffect(() => {
        axios.get('/worker/get')
        .then(res=> {
            let workers = res.data.filter(item => item.status === 'active')
            dispatch( addWorkers(workers) )
        })
        .catch(err => console.log(err))

        axios.get('/site/get',{headers: {
            authorization: 'Bearer ' + localStorage.getItem('token')
          }})
        .then(res => {
            //let sites = res.data.filter(item => item.workers.length > 0)
            dispatch( addSites(res.data) )
        })
        .catch(error=>console.error(error))
    }, [])

    const storeWeekEnding = () => {

    }

    return (
        <div className='weekly-wr' id='test'>
            Week Ending 09.02.2020
                    
            {sites.map((site, i) => {
                return <div key={i}>
                    <TopBar site={site} />
                    {site.workers.map((worker,i) => {
                        return <Worker key={i} worker={worker} site={site} />
                    })}
                </div>
            })}
            
        </div>
    )
}

const mapStateToProps = state => {
    return {
        workers: state.workersReducer.workers,
        sites: state.siteReducers.sites
    }
}

export default connect( mapStateToProps )(WeeklyStatemnt)
