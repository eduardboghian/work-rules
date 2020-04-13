import React, { useEffect, useState } from 'react'
import { updateWorkers } from '../../actions/workerActions'
import { updateSites, updateHours, updateRates } from '../../actions/siteActions'
import { connect } from 'react-redux'
import './css/index.css'
import axios from 'axios'

function Worker({dispatch, worker, site}) {
    const [ratesData, setData] = useState({
      rateGot: 0,
      
    })
    const [hours, setHours] = useState(0)
    const [hoursOT, setOT] = useState(0)
    const [others, setOthers] = useState(0)
 
    useEffect(() => {
        setHours(worker.worker.hours)
        setOT(worker.worker.hoursOT)
        setData(worker.rates)
    }, [worker])

    useEffect(() => {
      if(worker.hours !== hours || worker.hoursOT !== hoursOT) {
          if(hours!==0 || hoursOT !==0) {
						axios.put('/site/add-hours', {
              siteId: site._id,
							id: worker.worker._id,
							hours: hours,
							hoursOT: hoursOT
						})
						.then(res=> {})
						.catch(err=> console.log(err))
					}
        
      }
    }, [hours, hoursOT])

    const makeFloat = (nr) => {
        return parseFloat(nr).toFixed(1)
    }

    const invoiced = (worker) => { 
        let ot = ratesData.otGot*hoursOT ? ratesData.otGot*hoursOT : 0
        let res = (ratesData.rateGot*hours + ot ) * (worker.cis ?  0.8 : 0.7) 
        res = isNaN( res ) ? 0 : res.toFixed(1)
        return res
    }    
    const workerAmount = (worker) => {
        let ot = ratesData.otPaid*hoursOT ? ratesData.otPaid*hoursOT : 0

        let res = (ratesData.ratePaid*hours + ot) * (worker.cis ?  0.8 : 0.7)
        res = isNaN(res) ? 0 : res.toFixed(1)
        return res
    } 
    
    const getMargin = () => {
        let margin = invoiced(worker.worker) - workerAmount(worker.worker)

        margin = isNaN(margin) ? 0 : margin.toFixed(1)
        return margin
    }

    const updateOthers = (value, worker) => {
        setOthers(value)
        dispatch( updateSites(site._id, worker.worker._id, value) )
    }

    const updateRates = async (value, worker, field) => {
      switch(field) {
				case 'hours': 
					setHours(value)
					console.log(await hours)
          worker[field] = value
          dispatch( updateHours(site._id, worker.worker._id, value, hoursOT) )					
					break
         
        case 'hoursOT':  
					setOT(value)
					console.log(await hoursOT)
          worker[field] = value
          dispatch( updateHours(site._id, worker.worker._id, hours, value) )
		  		break 
				default:
					break  
      }
    }

    return (
        <div className='worker-wr'>
            <ul className='test'>

                {/* GENERAL INFO */}
                <div><li>{ site ? site.companyName ? site.companyName: null : null }</li></div>
                <div><li>{ site ? site.siteName ? site.siteName: null : null }</li></div>
                <div><li>{ worker ? worker.worker.firstname+' '+ worker.worker.lastname : null }</li></div>
                <div><li>{ worker ? worker.worker.cis===false ? 'PAYE' : 'CIS' : null }</li></div>
                <div><li>{ worker ? worker.worker.category : null }</li></div>
                <div><li className='small-text'>upload timesheet</li></div>

                {/* RATES */}
                <div><li>{ ratesData.rateGot ? parseFloat(ratesData.rateGot).toFixed(1) : null }</li></div>
                <div><li>{ ratesData.ratePaid ? parseFloat(ratesData.ratePaid).toFixed(1) : null}</li></div>
                <div><li>{ ratesData ? `${makeFloat(ratesData.rateGot) - makeFloat(ratesData.ratePaid)}` : null }</li></div>
                <div><li><input value={hours} onChange={ e => updateRates(e.target.value, worker, 'hours') } /></li></div>

                <div><li>{ ratesData.otGot ? parseFloat(ratesData.otGot).toFixed(1) : null }</li></div>
                <div><li>{ ratesData.otPaid ? parseFloat(ratesData.otPaid).toFixed(1) : null }</li></div>
                <div><li>{ ratesData.otGot ? makeFloat(ratesData.otGot) - makeFloat(ratesData.otPaid) : 0 }</li></div> 
                <div><li><input value={hoursOT} onChange={ e => updateRates(e.target.value, worker, 'hoursOT')  }  /></li></div>

                {/* AMOUNTS AND OTHERS */}
                <div><li>{ worker ? invoiced(worker.worker)===NaN ? null : invoiced(worker.worker) :null }</li></div>
                <div><li>{ worker ? getMargin() : null }</li></div>
                <div><li>{ worker ? workerAmount(worker)===NaN ? null : workerAmount(worker.worker) : null }</li></div>
				        <div><li><input value={others} onChange={ e => updateOthers(e.target.value, worker) }  /></li></div>
								<div className={ worker.worker.paymentStatus==='Yes' ? 'paid' : 'not-paid'  } ><li>{ worker ? worker.worker.paymentStatus : null }</li></div>
                <div><li>{ worker ? worker.worker.communicationChannel : null }</li></div>
            </ul>
        </div>
    )
}


export default connect()(Worker)