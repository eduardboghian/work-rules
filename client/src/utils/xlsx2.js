const Excel = require('exceljs')
const moment = require('moment')

const xlsxG = async (list, type, weekEnding) => {
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

  let data = weeklyStatement(sites, weekEnding)
  let lastRow = parseInt(data.length + 3)

  const workbook = new Excel.Workbook();
  workbook.creator = 'WorkRules';

  workbook.views = [
    {
      x: 0, y: 0, width: 1000, height: 2000, visibility: 'visible'
    }
  ]

  const sheet = workbook.addWorksheet('Weekly statement');
  sheet.columns = [
    { key: 'name', width: 20 },
    { key: 'id', width: 10 },
    { key: 'nino', width: 15 },
    { key: 'trade', width: 15 },
    { key: 'hrs', width: 10 },
    { key: 'rate', width: 10 },
    { key: 'sum', width: 15 }
  ]

  //FORMATS
  sheet.getColumn('G').numFmt = '#,##0.00;"-"'
  sheet.getColumn('F').numFmt = '#,##0.00;"-"'
  sheet.getColumn('E').numFmt = '##.0;"-"'

  //DATA
  sheet.mergeCells('A1:G1')
  sheet.getCell('A1').value = title(weekEnding)
  sheet.getRow('2').values = ['Name', 'Unique ID', 'NINO', 'Trade', 'Hours', 'Rate', 'Total Sum']
  sheet.addRows(data)

  let amount = netAmount(sheet, data.length)

  sheet.addRow({ name: 'Net Amount:', sum: amount })
  sheet.addRow({ name: 'No expenses or deductions for anybody', rate: 'VAT:', sum: amount * 0.2 })
  sheet.addRow({ name: 'Total Work Rules Ltd has to pay to HHC:', sum: amount * 1.2 })

  //MERGED CELLS
  sheet.mergeCells(lastRow, 1, lastRow, 6)
  sheet.mergeCells(lastRow + 1, 1, lastRow + 1, 5)
  sheet.mergeCells(lastRow + 2, 1, lastRow + 2, 6)

  //FONT
  sheet.getRow(1).font = {
    bold: true,
    color: { 'argb': '004287f5' },
    size: '12',
    name: 'Calibri'
  }
  sheet.getRow(2).font = {
    bold: true,
    name: 'Calibri'
  }
  sheet.getCell(`A${lastRow + 1}`).font = {
    color: { 'argb': '00FF0000' },
    name: 'Calibri'
  }
  sheet.getRow(lastRow + 2).font = {
    name: 'Calibri',
    bold: true
  }

  //ALIGNMENT
  sheet.getColumn(5).alignment = { horizontal: 'center' }
  sheet.getColumn(6).alignment = { horizontal: 'center' }
  sheet.getColumn(7).alignment = { horizontal: 'right' }
  sheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(2).alignment = { horizontal: 'center' }
  sheet.getRow(lastRow).alignment = { horizontal: 'right' }
  sheet.getCell(`A${lastRow + 1}`).alignment = { horizontal: 'left' }
  sheet.getCell(`F${lastRow + 1}`).alignment = { horizontal: 'right' }
  sheet.getRow(lastRow + 2).alignment = { horizontal: 'right' }



  const buffer = await workbook.xlsx.writeBuffer();

  function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  let b64 = arrayBufferToBase64(buffer)

  // Insert a link that allows the user to download the PDF file
  let link = document.createElement('a');
  link.innerHTML = 'Download PDF file';
  link.download = fileName(weekEnding);
  link.href = 'data:application/octet-stream;base64,' + b64;
  document.body.appendChild(link);
  link.click()
  link.remove()

  newJoinersExcel(sites, weekEnding)

}
export default xlsxG













const newJoinersExcel = async (sites, weekEnding) => {
  let data = newJoiners(sites, weekEnding)

  const workbook = new Excel.Workbook();
  workbook.creator = 'WorkRules';

  workbook.views = [
    {
      x: 0, y: 0, width: 1000, height: 2000, visibility: 'visible'
    }
  ]

  const sheet = workbook.addWorksheet('New Joiners');
  sheet.columns = [
    { key: 'first', width: 15 },
    { key: 'last', width: 15 },
    { key: 'phone', width: 15 },
    { key: 'status', width: 15 },
  ]


  //DATA
  sheet.getRow('1').values = ['Firstname', 'Lastname', 'Phone', 'Status']
  sheet.addRows(data)



  //FONT
  sheet.getRow(1).font = {
    bold: true,
    name: 'Calibri'
  }

  //ALIGNMENT
  sheet.getColumn(3).alignment = { horizontal: 'center' }
  sheet.getColumn(4).alignment = { horizontal: 'center' }

  const buffer = await workbook.xlsx.writeBuffer();

  function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  let b64 = arrayBufferToBase64(buffer)

  // Insert a link that allows the user to download the PDF file
  let link = document.createElement('a');
  link.innerHTML = 'Download PDF file';
  link.download = `WorkRules New Joiners - Weekending ${moment(weekEnding).format('YYYY MMMM DD')}.xlsx`;
  link.href = 'data:application/octet-stream;base64,' + b64;
  document.body.appendChild(link);
  link.click()
  link.remove()
}

const weeklyStatement = (sites, weekEnding) => {
  let excelData = []
  sites.map((site, i) => {
    site.workers.map(worker => {
      let ratePaid = worker.rates.ratePaid.length === 0 ? '0.00' : worker.rates.ratePaid
      let hours = worker.worker.hours !== undefined ? worker.worker.hours.length === 0 ? '0.0' : worker.worker.hours : '0.0'

      excelData.push({
        name: worker.worker.lastname + ' ' + worker.worker.firstname,
        id: worker.worker.uniqueID,
        nino: worker.worker.nino,
        trade: worker.worker.category,
        hrs: makeFloat(hours),
        rate: makeFloat(ratePaid),
        sum: totalSum(worker)
      })
    })
  })

  return excelData
}


const totalSum = (worker) => {
  const sum = makeFloat(worker.rates.rateGot) * makeFloat(worker.worker.hours)
  return sum
}


const fileName = (weekEnding) => {
  let currentTime = moment(weekEnding).add(14, 'days').format('YYYY MMMM DD')

  return `Weekending - ${moment(weekEnding).format('YYYY MMMM DD')} - To be paid ${currentTime}.xlsx`
}


const title = (weekEnding) => {
  let currentTime = moment(weekEnding).add(7, 'days').format('YYYY MMMM DD')

  return `Invoice issued ${currentTime} ----- Week Ending ${weekEnding}`
}

const makeFloat = (nr) => {
  if (typeof nr === 'number') nr = nr.toString()
  if (typeof nr === "undefined") nr = '0,0'
  let test = nr.split('.').join('')
  test = test.replace('\,', '.')

  return parseFloat(test)
}

const netAmount = (sheet, length) => {
  let sum = 0
  for (let index = 3; index < length + 3; index++) {
    sum = sum + sheet.getCell(`G${index}`).value
  }

  return sum
}

const newJoiners = (sites, weekEnding) => {
  let excelData = []
  sites.map((site, i) => {
    let idList = []
    site.workers.map(worker => {
      if (idList.find(item => item === worker.worker._id)) return
      let status

      if (weekEnding === worker.worker.added) {
        status = 'New Joiner'
      } else {
        status = 'Old'
      }

      excelData.push({
        last: worker.worker.lastname,
        first: worker.worker.firstname,
        phone: worker.worker.phone,
        status: status
      })
      idList.push(worker.worker._id)
      return true
    })
    excelData.sort(function (a, b) {
      var nameA = a.status.toUpperCase(); // ignore upper and lowercase
      var nameB = b.status.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  })

  return excelData
}