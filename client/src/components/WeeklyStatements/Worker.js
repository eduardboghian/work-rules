import React, { useEffect, useState } from 'react'
import './css/index.css'
import axios from 'axios'

export default function Worker({worker}) {
    const [ratesData, setData] = useState({})
    const [hours, setHours] = useState(0)
    const [hoursOT, setOT] = useState(0)

    useEffect(() => {
        if (!!worker.sitesData  ) {
        
            let site = worker.sitesData.find(item => item._id === worker.site._id);
            if(!!site) {
              if(site.gotClient !== '0') {
                setData({
                  gotClient: site.gotClient,
                  paidWorker: site.paidWorker,
                  overtimeGot: site.overtimeGot,
                  overtimePaid: site.overtimePaid
                });
              } else if( site.gotClient === '0' ) {
                let site = worker.site
                setData({
                  gotClient: site.gotClient,
                  paidWorker: site.paidWorker,
                  overtimeGot: site.overtimeGot,
                  overtimePaid: site.overtimePaid
                });
              }
              
            } else {
              let site = worker.site
              setData({
                gotClient: site.gotClient,
                paidWorker: site.paidWorker,
                overtimeGot: site.overtimeGot,
                overtimePaid: site.overtimePaid
              });
            }
            
        }

        setHours(worker.hours)
        setOT(worker.hoursOT)
    }, [worker])

    useEffect(() => {
      if(worker.hours !== hours || worker.hoursOT !== hoursOT) {
        if(hours > 0 || hoursOT > 0 ) {
          axios.put('/worker/add-hours', {
            id: worker._id,
            hours: hours,
            hoursOT: hoursOT
          })
          .then(res=> console.log(res))
          .catch(err=> console.log(err))
        }
      }
    }, [hours, hoursOT])

    const makeFloat = (nr) => {
        return parseFloat(nr).toFixed(1)
    }

    const invoiced = (worker) => { 
        let res = (ratesData.gotClient*hours + ratesData.overtimeGot*hoursOT) * (worker.CIS ?  0.7 : 0.8) 
        res = res.toFixed(1)
        return res
    }    
    const workerAmount = (worker) => {
        let res = (ratesData.paidWorker*hours + ratesData.overtimePaid*hoursOT) * (worker.CIS ?  0.7 : 0.8)
        res = res.toFixed(1)
        return res
    }    

    return (
        <div className='worker-wr'>
            <ul className='test'>

                {/* GENERAL INFO */}
                <div><li>{ worker ? worker.company ? worker.company.companyName: null : null }</li></div>
                <div><li>{ worker ? worker.site ? worker.site.siteName: null : null }</li></div>
                <div><li>{ worker ? worker.firstname+' '+ worker.lastname : null }</li></div>
                <div><li>{ worker ? worker.cis===false ? 'PAYE' : 'CIS' : null }</li></div>
                <div><li>{ worker ? worker.category : null }</li></div>
                <div><li className='small-text'>upload timesheet</li></div>

                {/* RATES */}
                <div><li>{ ratesData.gotClient }</li></div>
                <div><li>{ ratesData.paidWorker}</li></div>
                <div><li>{ makeFloat(ratesData.gotClient) - makeFloat(ratesData.paidWorker) }</li></div>
                <div><li><input value={hours} onChange={ e => setHours(e.target.value) } /></li></div>

                <div><li>{ ratesData.overtimeGot }</li></div>
                <div><li>{ ratesData.overtimePaid }</li></div>
                <div><li>{ makeFloat(ratesData.overtimeGot) - makeFloat(ratesData.overtimePaid) }</li></div> 
                <div><li><input value={hoursOT} onChange={ e => setOT(e.target.value) }  /></li></div>

                {/* AMOUNTS AND OTHERS */}
                <div><li>{ worker ? invoiced(worker)===NaN ? null : invoiced(worker) :null }</li></div>
                <div><li>{ worker ? worker.margin*hours+worker.marginOT*hoursOT : null }</li></div>
                <div><li>{ worker ? workerAmount(worker)===NaN ? null : workerAmount(worker) : null }</li></div>
                <div><li>No</li></div>
                <div><li>{ worker ? worker.communicationChannel : null }</li></div>
            </ul>
        </div>
    )
}
