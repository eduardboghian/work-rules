const router = require('express').Router();
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const moment = require('moment');

router.post('/generate-payslip', async (req, res) => {
    // [ ] STORE BUFFER TO DB


    const data = req.body.worker;
    console.log('loaded data...', data);
    const { rate, otRate } = getRates(data)
    let amount = rate*data.hours+ otRate*data.hoursOT

    data.Amount = amount.toFixed(2);
    data.B = amount * 0.2;
    data.B = data.B.toFixed(2);
    data.AB = amount - data.B;
    data.AB = data.AB.toFixed(2);
    data.Name = data.firstname+' '+data.lastname
    data.UTR = data.utr
    data.Date = process.env.WEEK_ENDING

    const responsePDF = [];
    responsePDF.push(data);

    const compile = async function(templateName) {
        const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
        const html = await fs.readFile(filePath, 'utf-8');
        return hbs.compile(html)(data);
    };

    hbs.registerHelper('dateFormat', function(value, format) {
        return moment(value).format(format);
    });

    try {
        console.log('data for pdf...', data);
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox'],
            ignoreDefaultArgs: ['--disable-extensions'],
        });

        const page = await browser.newPage();

        const content = await compile('payslip', data);

        await page.setContent(content);
        await page.emulateMedia('screen');
        responsePDF.push(
            await page.pdf({
                format: 'A4',
                printBackground: true,
            })
        );

        console.log('done');
        await browser.close();
    } catch (error) {
        console.log('error thrown by puppeteer...', error);
    }

    console.log('pdf response...', responsePDF);
    res.send(responsePDF);
});

module.exports = router;

// WORKER RATES

const getRates = (worker) => {
    console.log('error: ', worker)
    if (!!worker.sitesData  ) {
        let site = worker.sitesData.find(item => item._id === worker.site._id);
        if(!!site) {
          if(site.gotClient !== '0') {
              rate = site.paidWorker
              otRate =  site.overtimePaid
          } else if( site.gotClient === '0' ) {
              let site = worker.site
              rate = site.paidWorker
              otRate =  site.overtimePaid
          }
          
        } else {
            let site = worker.site
            rate = site.paidWorker
            otRate =  site.overtimePaid
        }   
    }

    return { rate, otRate }
}