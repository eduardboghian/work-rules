const XLSX = require('xlsx')
const moment = require('moment')

// [x] WRAP IN A FUNCTION AND GET SITES AS PARAM
// [ ] CHECK THE KIND OF THE REQ
// [x] SET NAMES OF SHEETS

const generateXlsx = async (list, type, weekEnding) => {
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

  let wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "WorkRules",
    Subject: "Statement",
    Author: "WorkRules",
    CreatedDate: moment().format('YYYY MM DD')
  };

  // IMPORT FIRST SHEET
  wb.SheetNames.push('Weekly statement');
  let ws_data = weeklyStatement(sites, weekEnding);

  let ws = XLSX.utils.json_to_sheet(ws_data, { origin: "A2" });
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }]
  wb.Sheets['Weekly statement'] = ws;
  let editSheet = wb.Sheets['Weekly statement']
  editSheet['A1'] = { t: 's', v: `${title(weekEnding)}` }

  let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  function s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  let b64 = arrayBufferToBase64(s2ab(wbout))

  // Insert a link that allows the user to download the PDF file
  let link = document.createElement('a');
  link.innerHTML = 'Download PDF file';
  link.download = fileName(type, weekEnding);
  link.href = 'data:application/octet-stream;base64,' + b64;
  document.body.appendChild(link);
  link.click()
  link.remove()



  //IMPORT SECOND SHEET
  let wb2 = XLSX.utils.book_new()
  wb2.Props = {
    Title: "WorkRules",
    Subject: "New Joiners",
    Author: "WorkRules",
    CreatedDate: moment().format('YYYY MM DD')
  }

  wb2.SheetNames.push('New Joiners')
  ws_data = newJoiners(sites)

  ws = XLSX.utils.json_to_sheet(ws_data)
  wb2.Sheets['New Joiners'] = ws

  wbout = XLSX.write(wb2, { bookType: 'xlsx', type: 'binary' });

  function s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  b64 = arrayBufferToBase64(s2ab(wbout))

  // Insert a link that allows the user to download the PDF file
  link = document.createElement('a');
  link.innerHTML = 'Download PDF file';
  link.download = `WorkRules New Joiners - Weekending ${moment(weekEnding).format('YYYY MMMM DD')}.xlsx`;
  link.href = 'data:application/octet-stream;base64,' + b64;
  document.body.appendChild(link);
  link.click()
  link.remove()
}

export default generateXlsx

const weeklyStatement = (sites, weekEnding) => {
  let excelData = []
  sites.map((site, i) => {
    site.workers.map(worker => {
      let rateGot = isNaN(parseFloat(worker.rates.rateGot)) ? '0.00' : parseFloat(worker.rates.rateGot).toFixed(2)
      let hours = isNaN(parseFloat(worker.worker.hours)) ? '0.0' : parseFloat(worker.worker.hours).toFixed(1)

      excelData.push({
        Name: worker.worker.lastname + ' ' + worker.worker.firstname,
        'Unique ID': worker.worker.uniqueID,
        NINO: worker.worker.nino,
        Trade: worker.worker.category,
        Hours: hours,
        Rate: rateGot,
        TotalSum: totalSum(worker)
      })
    })
  })

  return excelData
}

const newJoiners = (sites) => {
  let excelData = []
  sites.map((site, i) => {
    let idList = []
    site.workers.map(worker => {
      if (idList.find(item => item === worker.worker._id)) return
      let status
      let dif = moment(worker.worker.date, "YYYYMMDD").fromNow()

      if (worker.worker.date) {
        if (parseFloat(dif) < 7 || dif.includes('hours')) {
          status = 'New Joiner'
        } else { status = 'Old' }
      } else { status = 'Old' }

      excelData.push({
        "Last Name": worker.worker.lastname,
        "First Name": worker.worker.firstname,
        Phone: worker.worker.phone,
        Status: status
      })
      idList.push(worker.worker._id)
      return true
    })
  })

  return excelData
}

const totalSum = (worker) => {
  const sum = worker.rates.rateGot * worker.worker.hours
  return isNaN(parseFloat(sum)) ? '0.00' : (parseFloat(sum) * 0.8).toFixed(2)
}


const fileName = (type, weekEnding) => {
  let currentTime = moment(weekEnding).add(12, 'days').format('YYYY MMMM DD')

  return `Weekending-${moment(weekEnding).format('YYYY MMMM DD')} - Payrates to be paid ${currentTime}.xlsx`
}


const title = (weekEnding) => {
  let currentTime = moment(weekEnding).add(7, 'days').format('YYYY MMMM DD')

  return `Invoice issued ${currentTime} ----- Week Ending ${weekEnding}`
}