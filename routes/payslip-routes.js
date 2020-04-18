const router = require('express').Router();
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const moment = require('moment');

router.post('/generate-payslip', async (req, res) => {
    // [ ] STORE BUFFER TO DB
    console.log(req.body.worker)
    const data = req.body.worker.rates ? req.body.worker : req.body;
    const rate = data.rates.ratePaid
    const otRate = data.rates.otPaid
    let ot = isNaN(otRate) ? 0 : otRate*data.worker.hoursOT
    let amount = rate*data.worker.hours + ot

    data.Amount = amount.toFixed(2);
    data.B = amount * 0.2;
    data.B = data.B.toFixed(2);
    data.AB = amount - data.B;
    data.AB = data.AB.toFixed(2);
    data.Name = data.worker.firstname+' '+data.worker.lastname
    data.UTR = data.worker.utr
    data.Date = data.weekEnding.weekEnding

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

    res.send(responsePDF);
});

module.exports = router;
