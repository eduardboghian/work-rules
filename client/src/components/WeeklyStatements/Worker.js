import React, { useEffect, useState } from 'react'
import { updateSites, updateHours, updateRatesAction } from '../../actions/siteActions'
import { connect } from 'react-redux'
import moment from 'moment'
import './css/index.css'
import axios from 'axios'

function Worker({dispatch, worker, site, weekEnding}) {
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
							hours,
							hoursOT
						})
						.then(res=> {})
						.catch(err=> console.log(err))
					}

      }
    }, [hours, hoursOT])

    useEffect(() => {
      let date = moment().day(0)
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
      let weekE = new Date(date).getFullYear()+' '+monthNames[new Date(date).getMonth()] +' '+new Date(date).getDate()

      console.log('test ',weekEnding, weekE)
      if( weekEnding === weekE ) {
        console.log(weekEnding)
        if(ratesData.rateGot !== 0 && ratesData.ratePaid ) {
          axios.put('/site/update-rates', {
            siteId: site._id,
            id: worker.worker._id,
            ratesData
          })
          .then(res=> {
            console.log(res)}
          )
          .catch(err=> console.log(err))
        }
      }
    },[ratesData])

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
          
          dispatch( updateHours(site._id, worker.worker._id, hours, value) )
          break 
          
        case 'rateGot':
        case 'ratePaid':
        case 'otGot':
        case 'otPaid':
          setData({ ...ratesData, [field]: value }) 
          dispatch( updateRatesAction(site._id, worker.worker._id, {...ratesData, [field] : value }) )
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
                <div><li><input value={ratesData.rateGot} onChange={ e => updateRates(e.target.value, worker, 'rateGot') } /></li></div>
                <div><li><input value={ratesData.ratePaid} onChange={ e => updateRates(e.target.value, worker, 'ratePaid') } /></li></div>
                <div><li>{ ratesData ? `${makeFloat(ratesData.rateGot) - makeFloat(ratesData.ratePaid)}` : null }</li></div>
                <div><li><input value={hours} onChange={ e => updateRates(e.target.value, worker, 'hours') } /></li></div>

                <div><li><input value={ratesData.otGot} onChange={ e => updateRates(e.target.value, worker, 'otGot') } /></li></div>
                <div><li><input value={ratesData.otPaid} onChange={ e => updateRates(e.target.value, worker, 'otPaid') } /></li></div>
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

const mapStateToProps = state => {
  console.log(state, state.weekEndingReducers.weekEnding)
  return {
      weekEnding: state.weekEndingReducers.weekEnding
  }
}

export default connect( mapStateToProps )(Worker)
