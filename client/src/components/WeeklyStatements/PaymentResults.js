import React, { useEffect, useState } from 'react'
import './css/PaymentResults.css'


const PaymentResults = ({data, styleRes, close}) => {


  return(
    <div className={`${styleRes} pay-res`}>
      {data.map((response, i)=> {
        return <div key={i}>
          <div>
            { response.msg ? `${response.name}: ` : null }
            { response.msg ? JSON.parse(response.msg[0]).message ? JSON.parse(response.msg[0]).message : JSON.parse(response.msg[0]).state : null }
          </div>
        </div>
      })}
      <button className='' onClick={ e => close() }>OK</button>
    </div>
  )
}


export default PaymentResults
