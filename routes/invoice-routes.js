const router = require('express').Router()
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const moment = require('moment');
const mondays = require('mondays');

const Clients = require('../models/clients');

// GENERATE INVOICE API 
router.post('/generate-invoice', async (req, res) => {
    // [ ] STORE THE BUFFER TO DB

    console.log('request informations', req.body.site)
    let site = req.body.site
    let client = await Clients.findOne({ companyName: site.companyName })

    let data = []
    let totalNetAmount = 0;
    let totalTaxAmount = 0;
    let dueDate;
    let weekEnding = req.body.weekEnding;
    const invoiceStatus = [];
  
    site.workers.map((item, i) => {
        let ot = isNaN(parseFloat(item.rates.otRate)*parseFloat(item.worker.hoursOT)) ? 0 : parseFloat(item.rates.otRate)*parseFloat(item.worker.hoursOT)
        let payload = {
            Worker: item.worker.firstname+' '+item.worker.lastname,
            UnitCost: parseFloat(item.rates.rateGot).toFixed(1),
            WorkedHours:parseFloat(item.worker.hours).toFixed(1),
            NetAmount: ( parseFloat(item.rates.rateGot)*parseFloat(item.worker.hours) + ot ).toFixed(2), //+ worker.overtimeGot*worker.hoursOT,
            CIS: ((parseFloat(item.rates.rateGot)*parseFloat(item.worker.hours)) *0.2).toFixed(2),
            VAT: ((parseFloat(item.rates.rateGot)*parseFloat(item.worker.hours)) *0.2).toFixed(2),
        }
        data.push(payload)
        totalTaxAmount = totalTaxAmount + ((parseFloat(item.rates.rateGot)*parseFloat(item.worker.hours)) *0.2)
        totalNetAmount = totalNetAmount + ( parseFloat(item.rates.rateGot)*parseFloat(item.worker.hours) + ot )

    });
  
    date = new Date(weekEnding);
    let issueDateCode = date.setDate(date.getDate() + 7)
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    let issueDate = new Date(issueDateCode).getFullYear()+' '+monthNames[new Date(issueDateCode).getMonth()] +' '+new Date(issueDateCode).getDate()
    
    dueDate = mondays.getNextMonday(new Date(issueDateCode)).toDateString();
    
    if(req.body.type === 'site') {
        console.log(req.body.type, site)
        data[0].siteAddress = {
            add1: site.address1,
            add2: site.address2,
            city: site.city,
            zipCode: site.zipCode
        }
    } 

    data[0].Company = site.companyName
    data[0].Address1 = client.firstPost ? client.firstPost : null ,
    data[0].Address2 = client.secondPost ? client.secondPost : null,
    data[0].city = client.city ? client.city : null 
    data[0].zipCode = client.zipCode ? client.zipCode : null 
    data[0].dueDate = dueDate;
    data[0].Week_Ending = weekEnding
    data[0].issueDate = issueDate 
    data[0].INVOICE_NUMBER = process.env.INVOICE_NUMBER
    data[0].Site_Address = process.env.SITE_ADDRESS
    data[0].Account_Reference = process.env.ACCT_REF
    data[0].totalTaxAmount = totalTaxAmount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    data[0].totalNetAmount = totalNetAmount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

	//console.log('data before pdf', data)
	invoiceStatus.push(await generatePDF(data));
	console.log(invoiceStatus)
    res.send(invoiceStatus);
});




// HANDLEBARS AND PDF GENERATOR

const compile = async function(templateName, data) {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    return hbs.compile(html)(data);
};

hbs.registerHelper('dateFormat', function(value, format) {
    return moment(value).format(format);
});

async function generatePDF(data) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox'],
        ignoreDefaultArgs: ['--disable-extensions'],
    });
    const page = await browser.newPage();

    const content = await compile('invoice', data);

    await page.setContent(content);
    await page.emulateMedia('screen');
    const response = await page.pdf({
        format: 'A4',
        printBackground: true,
    });

    console.log('done');
    await browser.close();
    return response;
}


// HANDLEBARS HELPERS

const Handlebars = require('handlebars');

let fstFooter = 0;
let scndFooter = 0;
Handlebars.registerHelper('checkIndex', function(index) {
    if (index == 30) {
        fstFooter = index;
        return new Handlebars.SafeString('<div class="separator"></div><div class="grey"></div>');
    }

    if (index == 80) {
        scndFooter = index;
        return new Handlebars.SafeString('<div class="separator"></div><div class="grey"></div>');
    }
});

Handlebars.registerHelper('addFooter', function() {
    if (fstFooter == 30) {
        fstFooter = 0;
        return new Handlebars.SafeString(
            '<div class="footer-2">BANK REVOLUT<br />Account Holder WORK RULES LTD<br />Account Number: 34 53 21 96<br />Sort Code: 04-00-75<br /></div>'
        );
    }
});

Handlebars.registerHelper('scndFooter', function() {
    if (scndFooter == 80) {
        scndFooter = 0;
        return new Handlebars.SafeString(
            '<div class="footer-3">BANK REVOLUT<br />Account Holder WORK RULES LTD<br />Account Number: 34 53 21 96<br />Sort Code: 04-00-75<br /></div>'
        );
    }
});

Handlebars.registerHelper('logo', function() {
    return new Handlebars.SafeString(
        '<div class="logo"> <img src="https://drive.google.com/open?id=1276O8llFemH6kRwo2iKK5um0BfH9nYGl" alt="no" /> </div>'
    );
});

// GET WORKER'S RATES

const getRates = (worker) => {
    if (!!worker.sitesData  ) {
        let site = worker.sitesData.find(item => item._id === worker.site._id);
        if(!!site) {
          if(site.gotClient !== '0') {
              rate = site.gotClient
              otRate =  site.overtimeGot
          } else if( site.gotClient === '0' ) {
              let site = worker.site
              rate = site.gotClient
              otRate =  site.overtimeGot
          }
          
        } else {
            let site = worker.site
            rate = site.gotClient
            otRate =  site.overtimeGot
        }   
    }

    return { rate, otRate }
}


module.exports = router