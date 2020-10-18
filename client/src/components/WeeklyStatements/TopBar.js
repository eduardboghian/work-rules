/* eslint-disable */

import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import axios from 'axios'
import AddWorker from './AddWorker'
import { addSites } from '../../actions/siteActions'
import moment from 'moment'
import { loadData } from '../../actions/listActions'

const TopBar = ({ dispatch, site, weekEnding, sites }) => {
  const [workersForCompany, setWrC] = useState([])
  const [formClass, setClass] = useState('none')
  const [client, setClient] = useState()
  const [invoiceNumber, setInvoiceNr] = useState('none')
  const [invoiceNumber2, setInvoiceNr2] = useState('none')
  const [popStyle, setPopStyle] = useState('none')
  const [number, setNr] = useState(0)
  const [adminFee, setAdminFee] = useState(0)


  useEffect(() => {
    axios.post('/client/get-by-name', {
      companyName: site.companyName
    })
      .then(res => setClient(res.data[0]))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    setWrC(site.companyName)
  }, [site])

  // GENERATE INVOICE FOR SITE FUNCTION

  const generateInvoice = (list, type) => {
    let site
    if (type === 'site') {
      let sites = JSON.parse(JSON.stringify(list))
      let newWorkersList = []
      for (let j = 0; j < sites.workers.length; j++) {
        if (sites.workers[j].worker.selected !== false) {
          newWorkersList.push(sites.workers[j])
        }
      }
      sites.workers = newWorkersList
      site = sites
    } else {
      let sites = JSON.parse(JSON.stringify(list))

      for (let i = 0; i < sites.length; i++) {
        let newWorkersList = []
        for (let j = 0; j < sites[i].workers.length; j++) {
          if (sites[i].workers[j].worker.selected !== false) {
            newWorkersList.push(sites[i].workers[j])
          }
        }
        sites[i].workers = newWorkersList
      }

      let sitesOfClient = sites.filter(site => site.companyName === workersForCompany)

      for (let index = 1; index < sitesOfClient.length; index++) {
        const element = sitesOfClient[index];
        let data = sitesOfClient[0].workers.concat(element.workers)
        sitesOfClient[0].workers = data
      }

      site = sitesOfClient[0]
    }

    axios.post('/api/generate-invoice', {
      site,
      weekEnding: weekEnding.weekEnding,
      type,
      invoiceNumber: number,
      adminFee
    })
      .then(res => {
        res.data.map((data, i) => {
          if (i > 0) return
          function arrayBufferToBase64(buffer) {
            let binary = '';
            let bytes = new Uint8Array(buffer);
            let len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
          }
          let b64 = arrayBufferToBase64(data.data)

          console.log(res.data)

          // Insert a link that allows the user to download the PDF file
          let link = document.createElement('a');
          link.innerHTML = 'Download PDF file';
          link.download = `Nr. ${res.data[1].nr} - ${moment(res.data[1].issueDate).format('YYYY.MM.DD')} - ${res.data[1].client}.pdf`;
          link.href = 'data:application/octet-stream;base64,' + b64;
          document.body.appendChild(link);
          link.click()
          link.remove()

          return true
        })

      })
      .catch(err => console.log(err))
  }

  const deleteSite = site => {
    axios.put('/weekly/remove-site', {
      weekEnding: weekEnding,
      removedSite: site
    })
      .then(res => {
        dispatch(loadData(res.data.data))
        dispatch(addSites(res.data.data))
      })
      .catch(err => console.error(err))
  };


  const addWorkerToSite = () => {
    setClass('')
  }

  const closeAddWorker = () => {
    setClass('none')
  }


  return (
    <div className='topbar-wr'>
      <div className='topbar-btns'>
        <div className='company-name'>
          <li>{site ? site.companyName ? site.companyName : null : null} - </li>
          <li style={{ textIndent: '3px' }}>{site ? site.siteName ? site.siteName : null : null}</li>
        </div>


        <div
          className='generator1'
          onClick={e => {
            if (invoiceNumber === 'none') {
              setInvoiceNr('')
            } else { setInvoiceNr('none') }
          }}
        >Generate Invoice for Site
        </div>


        <form className={`${invoiceNumber} invoiceNr`}>
          <input type="text" placeholder='Invoice Number' className='invoice-input' onChange={e => setNr(e.target.value)} />
          <input type="text" placeholder='Admin Fee' className='invoice-input' onChange={e => setAdminFee(e.target.value)} />

          <div className='theSubmit' onClick={e => {
            generateInvoice(site, 'site')
            setInvoiceNr('none')
          }}>Submit</div>
        </form>

        <form className={`${invoiceNumber2} invoiceNr2`}>
          <input type="text" placeholder='Invoice Number' className='invoice-input' onChange={e => setNr(e.target.value)} />
          <input type="text" placeholder='Admin Fee' className='invoice-input' onChange={e => setAdminFee(e.target.value)} />

          <div className='theSubmit' onClick={e => {
            generateInvoice(sites, 'client')
            setInvoiceNr2('none')
          }}>Submit</div>
        </form>
        <div className='generator2' onClick={e => {
          if (invoiceNumber2 === 'none') {
            setInvoiceNr2('')
          } else { setInvoiceNr2('none') }
        }}>Generate Invoice for Client</div>
        <div className='add-worker' onClick={e => addWorkerToSite()}>Add Worker</div>
        <div className='remove-site' onClick={e => setPopStyle('')}>Remove this Site</div>
        <section className={`${popStyle} pop-out`}>
          Do you want DELETE<br /> {site ? site.siteName : null}
          <button className='ok' onClick={e => deleteSite(site)}>OK</button>
          <button className='cancel' onClick={e => setPopStyle('none')}>Cancel</button>
        </section>
      </div>
      <ul>
        <div><li>Worker Name</li></div>
        <div><li>Trade</li></div>
        <div><li>Checked</li></div>
        <div><li>Rate Got</li></div>
        <div><li>Rate paid</li></div>
        <div><li>Margin</li></div>
        <div><li>Hours</li></div>
        <div><li>Invoiced</li></div>
        <div><li>Margin</li></div>
        <div className='last-cell'><li>Worker</li></div>
      </ul>
      <AddWorker formClass={formClass} close={closeAddWorker} siteId={site._id} weekEnding={weekEnding} />
    </div>
  )
}

const mapStateToProps = state => {
  return {
    weekEnding: state.weekEndingReducers,
    sites: state.siteReducers.sites
  }
}

export default connect(mapStateToProps)(TopBar)
