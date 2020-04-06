const router = require('express').Router()
const jwt = require('jsonwebtoken')
const path = require('path')
const { exec } = require('child_process')
const uuid = require('uuid-v4')
const fs = require('fs')
const { Payments } = require('../models/payments')
const axios = require('axios')

// JWT 

const getJwt = () => {
    const issuer = 'github.com' // Issuer for JWT, should be derived from your redirect URL
    const client_id = 's11wugRLNjsDL2Zir8RGfahevuSaAac9VTqry4j6StE' // Your client ID
    const aud = 'https://revolut.com' // Constant
    const payload = {
        "iss": issuer,
        "sub": client_id,
        "aud": aud
    }
    const privateKey = fs.readFileSync(path.resolve(`${__dirname}/privatekey.pem`))
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: 60 * 60})
    //console.log(token)
    return token
}

const getJwtToken = getJwt()
let accessToken 
let account
const counterparties = []
let currency

// LOAD PAYMENTS HISTORY

router.get('/get-payments', async (req, res)=> {
    const payments = await Payments.find().sort({_id : -1})
    res.send(payments)
})

// MAKE PAYMENT

router.post('/make-payment', async (req, res)=> {
	await loadData()
	let workersList = req.body.workers
	//console.log('worker list from the table',workersList)

    let paymentlist = []
    let oks = 0
	let notoks = 0
	
    paymentlist = await Promise.all( workersList.map(async workers=>{
      let paymentResponse =  await Promise.all( counterparties.map(async (data)=> {
			
		  let sortCode 
		  workers.sortCode ? sortCode = workers.sortCode.replace(/-/g, '') : null
		  let paymentResponse 

		  // CHECKING THE ACCOUNT AND THE SORT CODE
		  console.log('should be a worker',sortCode, data.accounts[0].sort_code, data.accounts[0].account_no, workers.account)
          if(data.accounts[0].account_no == workers.account &&  data.accounts[0].sort_code==sortCode){
			const requestId = uuid()
			let { rate, otRate } = getRates(workers)
			let payableAmount = (rate*data.hours+ otRate*data.hoursOT)*0.8
			console.log('3 ok', payableAmount)

            paymentResponse = new Promise((resolve, reject)=> {
                exec(`curl -X POST https://b2b.revolut.com/api/1.0/pay \
                -H "Authorization: ${accessToken}2" \
                --data @- << EOF
                
                {
                  "request_id": "${requestId}",
                  "account_id": "${account}",
                  "receiver": {
                    "counterparty_id": "${data.id}",
                    "account_id": "${data.accounts[0].id}"
                  },
                  "amount": ${payableAmount},
                  "currency": "GBP",
                  "reference": "Week Ending ${process.env.WEEK_ENDING}"
                }
                
                EOF`, (error, stdout, stderr)=> {
                  if(error) {
                      console.log('error thrown by revolut:', error)
                      reject(error)
                  }
                  console.log('stdout: ', stdout)
                  console.log('sterr: ',stderr)
                  resolve(stdout)    
                })
            })
          }
          return await paymentResponse
      }))

        // GMT+0000 (Coordinated Universal Time)
      let date = new Date().getFullYear().toString()
      date = `${date  }-${ new Date().toLocaleString()[0]}`
      date = `${date  }-${ new Date().getDate().toString()}`
      date = `${date  }_${ new Date().toTimeString().replace(/GMT\+0000 \(Coordinated Universal Time\)/, '')}`


      try{
        paymentResponse =  JSON.parse(paymentResponse.filter(el => el !== undefined))
      }catch(error ) {
          console.log(error)
	  }

      let clientRes

      if(paymentResponse.state == 'completed' || paymentResponse.state == 'created' || paymentResponse.state == 'pending') {
          clientRes = {
            "date": date,
            "name": workers.firstname+' '+workers.lastname,
            "amount": workers.Amount,
            "status": 'OK' 
          }
          oks +=1
      } else {
          clientRes = {
            "date": date,
            "name": workers.firstname+' '+workers.lastname,
            "amount": workers.Amount,
            "status": 'NOTOK' 
          }
          notoks +=1
      }

    //   let payDB = new Payments(clientRes)
    //   payDB = await payDB.save()

      console.log('result after pyament attempt: ', workers.firstname+' '+workers.lastname, paymentResponse )
      return clientRes
    }))

    paymentlist.push({ 'oks': oks, 'notoks': notoks })
    console.log(paymentlist)

    res.send(paymentlist)
})

module.exports = router





const loadData = () => {
	function getResult(result) {
		accessToken = `Bearer ${result}`
	}
	  
	return new Promise((resolve, reject) => {
		if(getJwtToken && counterparties.length === 0) {
			exec(`curl https://b2b.revolut.com/api/1.0/auth/token \
			-H "Content-Type: application/x-www-form-urlencoded"\
			--data "grant_type=refresh_token"\
			--data "refresh_token=oa_prod_rAiq7l4PMebJf5PfGEVNUbL5ptu0NRXiT9PCdSV-TdU"\
			--data "client_id=s11wugRLNjsDL2Zir8RGfahevuSaAac9VTqry4j6StE"\
			--data "client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer"\
			--data "client_assertion=${getJwtToken}"`, (error, stdout, stderr)=>{
				if(error) {
					console.log('error recieved after curl request', error)
				}
	  
				response = JSON.parse(stdout)
				getResult(response.access_token)
	  
				// LOAD DATA FROM REVOLUT
	  
				axios({
				  method: 'GET',
				  url: 'https://b2b.revolut.com/api/1.0/accounts',
				  headers: {
					'Authorization': accessToken
				  }
				})
				.then( res => res.data.map(accounts=> {
					if(accounts.currency === 'GBP' && accounts.balance > 0) {
						account = accounts.id
						currency = accounts.currency
					}
					console.log('account, currency loaded...', account, currency)
				}))
				.catch( error => console.log(error) )
	  
				axios({
				  method: 'GET',
				  url: 'https://b2b.revolut.com/api/1.0/counterparties',
				  headers: {
					'Authorization': accessToken
				  }
				})
				.then( res => {
					res.data.map(data=> {
						counterparties.push(data)
						// console.log(data.accounts)
						resolve(true)
					})
					console.log('counterparties loaded...')
				})
				.catch( error => {
					console.log(error)
					reject(error)
				})
			})
	  }
	})
}

// LOAD RATES

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



