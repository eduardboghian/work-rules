const router = require('express').Router()
const jwt = require('jsonwebtoken')
const path = require('path')
const { exec } = require('child_process')
const uuid = require('uuid-v4')
const fs = require('fs')
const { Payments } = require('../models/payments')
const WeeklyStatements = require('../models/weeklyStatement')
const Sites = require('../models/sites')
const moment = require('moment')
const axios = require('axios')

// JWT 

const getJwt = () => {
    const issuer = 'github.com' // Issuer for JWT, should be derived from your redirect URL
    const client_id = 's11wugRLNjsDL2Zir8RGfahevuSaAac9VTqry4j6StE' // Your client ID
    const aud = 'https://revolut.com' // Constant
    const payload = {
        'iss': issuer,
        'sub': client_id,
        'aud': aud
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
    let data = req.body.data
    //console.log('worker list from the table',workersList)

    let paymentlist = []
    let oks = 0
	  let notoks = 0
	
    paymentlist = await Promise.all( data.workers.map(async item=>{
      //console.log('reallllly imp', data)+parseFloat(item.worker.others)
      const rate = item.rates.ratePaid
      const otRate = item.rates.otPaid
      let ot = otRate ? otRate*item.worker.hoursOT : 0
      let others = parseFloat(item.worker.others) ? parseFloat(item.worker.others) : 0
      
      console.log('avans amount', others, item.worker.others, req.body)

      let payableAmount = (parseFloat(rate*item.worker.hours + ot)*0.8 + others ).toFixed(2)

      let paymentResponse =  await Promise.all( counterparties.map(async (data)=> {
			
          let sortCode 
          item.worker.sortCode ? sortCode = item.worker.sortCode.replace(/-/g, '') : null
          let paymentResponse 

		      // CHECKING THE ACCOUNT AND THE SORT CODE
          if(data.accounts[0].account_no == item.worker.account &&  data.accounts[0].sort_code==sortCode && item.worker.paymentStatus !== 'Yes' ){
            const requestId = uuid()

            const fallBackFunction = async () => {
              const requestId = uuid()
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
                  "reference": "Week Ending ${req.body.weekEnding.weekEnding}"
                }
                
                EOF`, async (error, stdout, stderr)=> {
                  if(error) {
                      console.log('error thrown by revolut:', error)
                      reject(error)
                  }
                  
                  console.log('stdout2: ', stdout)
                  console.log('sterr2: ',stderr)
                  resolve(stdout)    
                })
              })

              return await paymentResponse
            }

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
                  "reference": "Week Ending ${req.body.weekEnding.weekEnding}"
                }
                
                EOF`, async (error, stdout, stderr)=> {
                  if(error) {
                      console.log('error thrown by revolut:', error)
                      reject(error)
                  }

                  console.log('stdout: ', stdout)
                  console.log('sterr: ',stderr)
                  console.log('it got here now 2')
                  if( stdout.state !== 'completed' ||   stdout.state !== 'created' ||  stdout.state !== 'pending') {
                      console.log('it got here now')
                      resolve( await fallBackFunction() )
                  }
                  
                  resolve(stdout)    
                })
            })
          }

          return await paymentResponse
      }))

      try{
        paymentResponse =  paymentResponse.filter(el => el !== undefined)
      }catch(error ) {
          console.log(error)
	    }

      let clientRes
      let date = new Date().getDay() === 0 ? moment().day(-7).format('YYYY MMMM DD') : moment().day(0).format('YYYY MMMM DD')

      if(paymentResponse.state == 'completed' || paymentResponse.state == 'created' || paymentResponse.state == 'pending') {
          // UPDATE PAYMENT STATUS
          
          
          if( req.body.weekEnding.weekEnding === date ) {
            let site = req.body.data
            if(!site) console.log('no site with this id was found', site)
            let newWorkers = site.workers
  
            let worker = site.workers.find( wr => wr.worker._id === item.worker._id )
            let index = site.workers.indexOf(worker)
            worker.worker.paymentStatus = 'Yes'
  
            newWorkers[index] = worker                  
            await Sites.findOneAndUpdate({ _id: site._id }, { workers: newWorkers }, { new: true })
          }else  {
            let we = await WeeklyStatements.find({ weekEnding: req.body.weekEnding.weekEnding  })
            console.log('asta', we)
            if(!we) return console.log('no site with this id was found')
            let site = we[0].data.find(item => item._id == req.body.data._id)
            let siteIndex = we[0].data.indexOf(site)

            let worker = site.workers.find( item => item.worker._id === item.worker._id )
            let index = site.workers.indexOf(worker)
            worker.worker.paymentStatus = 'Yes'

            site.workers[index] = worker

            we[0].data[siteIndex] = site
            let response = await WeeklyStatements.findOneAndUpdate({ weekEnding: req.body.weekEnding.weekEnding }, we[0], { new: true })
            console.log(response)
          }

          clientRes = {
            '_id': item.worker._id,
            'date': moment().format('YYYY MMMM DD, h:mm:ss a'),
            'name': item.worker.firstname+' '+item.worker.lastname,
            'amount': payableAmount,
            'status': 'OK' 
          }
          oks +=1
      } else {
            

          clientRes = {
            '_id': item.worker._id,
            'date': moment().format('YYYY MMMM DD, h:mm:ss a'),
            'name': item.worker.firstname+' '+item.worker.lastname,
            'amount': payableAmount,
            'status': 'NOTOK' 
          }
          notoks +=1
      }

      // let payDB = new Payments(clientRes)
      // payDB = await payDB.save()

      console.log('result after pyament attempt: ', item.worker.firstname+' '+item.worker.lastname, paymentResponse )
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




