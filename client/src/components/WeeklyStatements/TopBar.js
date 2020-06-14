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
  const [number, setNr] = useState(0)

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
      invoiceNumber: number
    })
      .then(res => {
        res.data.map(data => {
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

          // Insert a link that allows the user to download the PDF file
          let link = document.createElement('a');
          link.innerHTML = 'Download PDF file';
          link.download = 'file.pdf';
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
    let date = new Date().getDay() === 0 ? moment().day(0).format('YYYY MMMM DD') : moment().day(7).format('YYYY MMMM DD')

    if (weekEnding.weekEnding === date) {
      axios.put('/client/site-status', {
        clientId: client._id,
        siteId: site._id,
        value: 'Not Active'
      })
        .then(res => console.log(res))
        .catch(err => console.error(err))

      axios.put('/site/update-status', {
        id: site._id,
        value: 'Not Active'
      })
        .then(res => {
          let activeSites = res.data.filter(site => site.status === 'Active')
          dispatch(addSites(activeSites))
        })
        .catch(err => console.log(err))
    } else {
      axios.put('/weekly/remove-site', {
        weekEnding: weekEnding,
        removedSite: site
      })
        .then(res => {
          dispatch(loadData(res.data.data))
          dispatch(addSites(res.data.data))
        })
        .catch(err => console.error(err))

    }
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
          <li>{site ? site.companyName ? site.companyName : null : null} -</li>
          <li>{site ? site.siteName ? site.siteName : null : null}</li>
        </div>
        <div
          className='generator1'
          onClick={e => generateInvoice(site, 'site')}
          onMouseEnter={() => setInvoiceNr('')}
        >Generate Invoice for Site
        </div>
        <form className={`${invoiceNumber} invoiceNr`} onMouseLeave={() => setTimeout(() => {
          setInvoiceNr('none')
        }, 2000)}>
          <input type="text" placeholder='Invoice Number' className='invoice-input' onChange={e => setNr(e.target.value)} />
        </form>

        <form className={`${invoiceNumber2} invoiceNr2`} onMouseLeave={() => setTimeout(() => {
          setInvoiceNr2('none')
        }, 2000)}>
          <input type="text" placeholder='Invoice Number' className='invoice-input' onChange={e => setNr(e.target.value)} />
        </form>
        <div className='generator2' onClick={e => generateInvoice(sites, 'client')} onMouseEnter={() => setInvoiceNr2('')}>Generate Invoice for Client</div>
        <div className='add-worker' onClick={e => addWorkerToSite()}>Add Worker</div>
        <div className='remove-site' onClick={e => deleteSite(site)}>Remove this Site</div>
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
