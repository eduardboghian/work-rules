 const XLSX = require('xlsx')
 
// [x] WRAP IN A FUNCTION AND GET SITES AS PARAM
// [ ] CHECK THE KIND OF THE REQ
// [x] SET NAMES OF SHEETS

const generateXlsx = (sites, type) => {
    let wb = XLSX.utils.book_new();
    wb.Props = {
            Title: "WorkRules",
            Subject: "Statement",
            Author: "WorkRules",
            CreatedDate: new Date(2017,12,19)
    };

    // IMPORT FIRST SHEET
    wb.SheetNames.push('Weekly statement');
    let ws_data = weeklyStatement(sites);

    let ws = XLSX.utils.json_to_sheet(ws_data);
    wb.Sheets['Weekly statement'] = ws;

    //IMPORT SECOND SHEET
    wb.SheetNames.push('New Joiners')
    ws_data = newJoiners()

    ws = XLSX.utils.json_to_sheet(ws_data)
    wb.Sheets['New Joiners'] = ws

    let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
   
    function s2ab(s) {
        let buf = new ArrayBuffer(s.length);
        let view = new Uint8Array(buf);
        for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
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
    link.download = 'file.xlsx';
    link.href = 'data:application/octet-stream;base64,' + b64;
    document.body.appendChild(link);
    // link.click()
    // link.remove()
}

module.exports.generateXlsx = generateXlsx

const weeklyStatement = (sites) => {
    let excelData = []
    sites.map( (site, i) => {
        site.workers.map( worker => {
            excelData.push({
                Name: worker.worker.lastname+' '+worker.worker.firstname,
                Trade: worker.worker.category,
                Hours: worker.worker.hours,
                Rate: worker.rates.rateGot,
                OTHours: worker.worker.hoursOT,
                OTRate: worker.rates.otGot,
                TotalSum: 2000
            })
        })
    })

    return excelData
}

const newJoiners = () => {
    return [{
        name: 'edi',
        data: 'el este'
    }]
}