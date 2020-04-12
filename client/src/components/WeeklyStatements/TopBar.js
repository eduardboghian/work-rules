import React, { useEffect, useState } from 'react'
import  { connect } from 'react-redux'
import axios from 'axios'
import AddWorker from './AddWorker'

const TopBar = ({site, workers}) => {
    const [workersForCompany, setWrC] = useState([])
    const [formClass, setClass] = useState('none')

    useEffect(() => {
        setWrC(site.companyName)
    }, [site])

    // GENERATE INVOICE FOR SITE FUNCTION

    const generateInvoice = (workersList, site) => {
        axios.post('/api/generate-invoice', {
            workersList,
            site
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


                // Embed the PDF into the HTML page and show it to the user
                let obj = document.createElement('object');
                obj.style.width = '70%';
                obj.style.height = '842pt';
                obj.style.float = 'right'
                obj.type = 'application/pdf';
                obj.data = 'data:application/pdf;base64,' + b64;
                document.body.appendChild(obj);

                // Insert a link that allows the user to download the PDF file
                let link = document.createElement('a');
                link.innerHTML = 'Download PDF file';
                link.download = 'file.pdf';
                link.href = 'data:application/octet-stream;base64,' + b64;
                document.body.appendChild(link);

                return true
            })

        })
        .catch(err => console.log(err))
    }

    // GENERATE PAYSLIPS

    const generatePayslip = (site) => {
        site.workers.map(worker => {
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
        axios.post('/api/make-payment', { data: site })
        .then(res => window.location.reload(true))
        .catch(err=> console.error(err))
    }

    const addWorkerToSite = () => {
        setClass('')
    }

    return (
        <div className='topbar-wr'>
            <div className='topbar-btns'>
                <div onClick={ e => generateInvoice(workers, site) }>Generate Invoice for Site</div>
                <div onClick={ e=> generateInvoice(workersForCompany) }>Generate Invoice for Client</div>
                <div onClick={ e => generatePayslip(site) }>Generate Payslip for Site</div>
                <div onClick={ e => makePayment(site) } >Make Payment</div>
                <div onClick={ e => addWorkerToSite() }>Add Worker</div>
            </div>
            <ul>
                <div><li>Client</li></div>
                <div><li>Site</li></div>
                <div><li>Worker Name</li></div>
                <div><li>CIS</li></div>
                <div><li>Category</li></div>
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
                <div><li>Others</li></div>
                <div><li>Paid</li></div>
                <div><li>Payslip via</li></div>
            </ul>
            <AddWorker formClass={formClass} siteId={site._id} />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        workers: state.workersReducer.workers
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
