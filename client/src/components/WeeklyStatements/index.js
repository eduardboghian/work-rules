import React, { useEffect, useState } from 'react'
import './css/index.css'
import axios from 'axios'
import { addWorkers } from '../../actions/workerActions'
import { connect } from 'react-redux'

import TopBar from './TopBar'
import Worker from './Worker'

const WeeklyStatemnt = ({dispatch, workers}) => {
    useEffect(() => {
        axios.get('/worker/get')
        .then(res=> {
            let workers = res.data.filter(item => item.status === 'active')
            dispatch( addWorkers(workers))
        })
        .catch(err => console.log(err))
    }, [])


    useEffect(() => {
        console.log('workers from redux', workers)
    }, [workers])

    return (
        <div className='weekly-wr' id='test'>
            Week Ending 09.02.2020
                    
            { workers.map((worker, i) => {
                return workers[i-1] ? workers[i].site.siteName !== workers[i-1].site.siteName ? <div> <TopBar site={worker.site} company={worker.company} /><Worker worker={worker}/> </div> : <Worker worker={worker}/> : <div> <TopBar site={worker.site} company={worker.company} /><Worker worker={worker}/> </div>
                
            } )}
            
        </div>
    )
}

const mapStateToProps = state => {
    console.log(state.workersReducer.workers)
    return {
        workers: state.workersReducer.workers
    }
}

export default connect( mapStateToProps )(WeeklyStatemnt)
