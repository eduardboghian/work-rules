const XLSX = require('xlsx')
const moment = require('moment')

// [x] WRAP IN A FUNCTION AND GET SITES AS PARAM
// [ ] CHECK THE KIND OF THE REQ
// [x] SET NAMES OF SHEETS

const generateXlsx = async (list, type, weekEnding) => {
  let sites = [...list]

  for (let i = 0; i < sites.length; i++) {
    for (let j = 0; j < sites[i].workers.length; j++) {
      if (sites[i].workers) {
        if (sites[i].workers[j].worker.selected === false) {
          sites[i].workers.splice(j, 1)
        }
      }
    }
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
  let ws_data = weeklyStatement(sites);

  let ws = XLSX.utils.json_to_sheet(ws_data);
  wb.Sheets['Weekly statement'] = ws;

  //IMPORT SECOND SHEET
  wb.SheetNames.push('New Joiners')
  ws_data = newJoiners(sites)

  ws = XLSX.utils.json_to_sheet(ws_data)
  wb.Sheets['New Joiners'] = ws

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
}

module.exports.generateXlsx = generateXlsx

const weeklyStatement = (sites) => {
  let excelData = []
  sites.map((site, i) => {
    site.workers.map(worker => {
      excelData.push({
        Name: worker.worker.lastname + ' ' + worker.worker.firstname,
        'Unique ID': worker.worker.uniqueId,
        NINO: worker.worker.nino,
        Trade: worker.worker.category,
        Hours: worker.worker.hours,
        Rate: worker.rates.rateGot,
        TotalSum: totalSum(worker)
      })

      if (worker.worker.hoursOT > 0) {
        excelData.push({
          Name: worker.worker.lastname + ' ' + worker.worker.firstname,
          'Unique ID': worker.worker.uniqueId,
          NINO: worker.worker.nino,
          Trade: worker.worker.category,
          Hours: worker.worker.hoursOT,
          Rate: worker.rates.otGot,
          TotalSum: totalSumOt(worker)
        })
      }
    })
  })

  return excelData
}

const newJoiners = (sites) => {
  let excelData = []
  sites.map((site, i) => {
    site.workers.map(worker => {
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
      return true
    })
  })

  return excelData
}

const totalSum = (worker) => {
  const sum = worker.rates.rateGot * worker.worker.hours
  return parseFloat(sum) * 0.8
}

const totalSumOt = (worker) => {
  const sum = worker.rates.otGot * worker.worker.hoursOT
  return parseFloat(sum) * 0.8
}

const fileName = (type, weekEnding) => {
  let currentTime = moment(weekEnding).add(7, 'days').format('YYYY MM DD')

  if (type === 'Matt') {
    return `WorkRules_CompuPay_WeeklyStatement-${currentTime}-weekending-${weekEnding}.xlsx`
  } else {
    return `WorkRules_HHC_WeeklyStatement-${currentTime}-weekending-${weekEnding}.xlsx`
  }
}