import React, { useEffect, useState } from 'react'
import  { connect } from 'react-redux'
import axios from 'axios'
import AddWorker from './AddWorker'

const TopBar = ({site, weekEnding, sites}) => {
    const [workersForCompany, setWrC] = useState([])
    const [formClass, setClass] = useState('none')

    useEffect(() => {
        setWrC(site.companyName)
    }, [site])

    // GENERATE INVOICE FOR SITE FUNCTION

    const generateInvoice = (sites, type) => {
        let site
        if(type === 'site') {
            site = sites
        } else {
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
            type
        })
        .then(res=> {
            res.data.map(data=> {
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

    // GENERATE PAYSLIPS

    const generatePayslip = (site) => {
        site.workers.map(worker => {
            worker.weekEnding = weekEnding
            axios.post('/api/generate-payslip', { worker })
            .then(async res=> {
                console.log(res)
                function arrayBufferToBase64(buffer) {
                  let binary = '';
                  let bytes = new Uint8Array(buffer);
                  let len = bytes.byteLength;
                  for (let i = 0; i < len; i++) {
                      binary += String.fromCharCode(bytes[i]);
                  }
                  return window.btoa(binary);
                }
                let b64 = arrayBufferToBase64( await res.data[1].data)

                let link = document.createElement('a');
                link.innerHTML = `${res.data[0].Name}`;
                link.download = `Payslip-week-ending-${res.data[0].Date}-${res.data[0].Name}.pdf`;
                link.href = 'data:application/octet-stream;base64,' + b64;
                document.body.appendChild(link);
                link.click()
                link.remove()
            })
            .catch(err=> {
			  generatePDF(worker)
              console.log(err)
            })
            return true
        })
        
    }

    // MAKE PAYMETN

    const makePayment = (site) => {
        console.log(site)
        axios.post('/api/make-payment', { data: site, weekEnding })
        .then(res => 'window.location.reload(true)')
        .catch(err=> console.error(err))
    }

    const addWorkerToSite = () => {
        setClass('')
    }

    const closeAddWorker = () => {
        setClass('none')
    }

    return (
        <div className='topbar-wr'>
            <div className='topbar-btns'>
                <div onClick={ e => generateInvoice(site, 'site') }>Generate Invoice for Site</div>
                <div onClick={ e => generateInvoice(sites, 'client') }>Generate Invoice for Client</div>
                <div onClick={ e => generatePayslip(site) }>Generate Payslip for Site</div>
                <div onClick={ e => makePayment(site) } >Make Payment</div>
                <div onClick={ e => addWorkerToSite() }>Add Worker</div>
            </div>
            <ul>
                <div><li>Client</li></div>
                <div><li>Site</li></div>
                <div><li>Worker Name</li></div>
                <div><li>CIS</li></div>
                <div><li>Trade</li></div>
                <div><li>Checked</li></div>
                <div><li>Rate Got</li></div>
                <div><li>Rate paid</li></div>
                <div><li>Margin</li></div>
                <div><li>Hours</li></div>
                <div><li>OT Got</li></div>
                <div><li>OT Paid</li></div>
                <div><li>Margin</li></div>
                <div><li>OT Hours</li></div>
                <div><li>Invoiced</li></div>
                <div><li>Margin</li></div>
                <div><li>Worker</li></div>
                <div><li>Avans</li></div>
                <div><li>Paid</li></div>
                <div><li>Payslip via</li></div>
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

export default connect (mapStateToProps)(TopBar)

const generatePDF = (data) => {
    axios({
    method: 'POST',
    url: `/api/generate-payslip`,
    data: data,
    responseType: 'stream'
    })
    .then(async res=> {
        console.log(res)
        function arrayBufferToBase64(buffer) {
            let binary = '';
            let bytes = new Uint8Array(buffer);
            let len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary);
        }
        let b64 = arrayBufferToBase64( await res.data[1].data)

        let link = document.createElement('a');
        link.innerHTML = `${res.data[0].Name}`;
        link.download = `Payslip-week-ending-${res.data[0].Date}-${res.data[0].Name}.pdf`;
        link.href = 'data:application/octet-stream;base64,' + b64;
        document.body.appendChild(link);
        link.click()
        link.remove()
    })
    .catch(err=> {
        generatePDF(data)
        console.log(err)
    })
}
