import React, { useEffect, useState } from 'react'
import './css/PaymentResults.css'


const PaymentResults = ({data, styleRes, close}) => {

  return(
    <div className={`${styleRes} pay-res`}>
      {data.map((response, i)=> {
        return <div key={i}>
          <div className='message-wr'>
            { response.msg ? `${response.name}: ` : null }
            { response.msg ? response.msg.length > 0 ? JSON.parse(response.msg[0]).message ? JSON.parse(response.msg[0]).message : JSON.parse(response.msg[0]).state : null : <div> OKS: {response.oks}/ NOTOKS: {response.notoks} </div> }
          </div>
        </div>
      })}
      <button className='ok-btn' onClick={ e => close() }>OK</button>
    </div>
  )
}


export default PaymentResults
