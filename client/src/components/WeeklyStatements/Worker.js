import React, { useEffect, useState } from 'react'
import { updateHours, updateRatesAction, addSites } from '../../actions/siteActions'
import { connect } from 'react-redux'
import moment from 'moment'
import './css/index.css'
import axios from 'axios'

import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { removeWr, addWr, loadData } from '../../actions/listActions'

import { floatFormat } from '../../utils/floatFormatting'

function Worker({ dispatch, worker, site, weekEnding, rowNumber }) {
  const [ratesData, setData] = useState({
    rateGot: '',
    ratePaid: ''
  })
  const [hours, setHours] = useState('')
  const [trade, setTrade] = useState('')
  const [popStyle, setPopStyle] = useState('none')

  useEffect(() => {
    setHours(worker.worker.hours)
    setData(worker.rates)
    setTrade(worker.worker.category)
  }, [worker])

  useEffect(() => {
    let date = new Date().getDay() === 0 ? moment().day(0).format('YYYY MMMM DD') : moment().day(7).format('YYYY MMMM DD')

    if (weekEnding === date) {
      if (hours.includes(',')) {
        axios.put('/site/add-hours', {
          siteId: site._id,
          id: worker.worker.weId,
          hours,

        })
          .then(res => { })
          .catch(err => console.log(err))

      }
    } else {
      if (hours.includes(',')) {
        axios.put('/weekly/add-hours', {
          siteId: site._id,
          id: worker.worker.weId,
          hours,
          weekEnding
        })
          .then(res => { })
          .catch(err => console.log(err))

      }
    }
  }, [hours])

  useEffect(() => {
    let date = new Date().getDay() === 0 ? moment().day(0).format('YYYY MMMM DD') : moment().day(7).format('YYYY MMMM DD')
    if (weekEnding === date) {
      if (ratesData.rateGot && ratesData.ratePaid) {
        axios.put('/site/update-rates', {
          siteId: site._id,
          id: worker.worker.weId,
          ratesData
        })
          .then(res => { })
          .catch(err => console.log(err))
      }
    } else {
      if (ratesData.rateGot && ratesData.ratePaid) {
        axios.put('/weekly/update-rates', {
          siteId: site._id,
          id: worker.worker.weId,
          ratesData,
          weekEnding
        })
          .then(res => { })
          .catch(err => console.log(err))
      }
    }
  }, [ratesData])

  const makeFloat = (nr) => {
    let test = nr.split('.').join('')
    test = test.replace('\,', '.')

    return test
  }

  const invoiced = () => {
    let rate = ratesData.rateGot.replace(/\./, '');
    rate = rate.replace('\,', '.')
    rate = parseFloat(rate)

    let hr = hours.replace('\,', '.')
    hr = parseFloat(hr)

    let res = (rate * hr) * 0.8
    res = isNaN(res) ? 0 : res.toFixed(1)
    return res
  }
  const workerAmount = () => {
    let rate = ratesData.ratePaid.replace(/\./, '');
    rate = rate.replace('\,', '.')
    rate = parseFloat(rate)

    let hr = hours.replace('\,', '.')
    hr = parseFloat(hr)

    let res = (rate * hr) * 0.8
    res = isNaN(res) ? 0 : res.toFixed(1)
    return res
  }

  const getMargin = () => {
    let margin = invoiced(worker.worker) - workerAmount(worker.worker)

    margin = isNaN(margin) ? 0 : margin.toFixed(1)
    return margin
  }

  const updateRates = async (value, worker, field) => {
    switch (field) {
      case 'hours':
        value = value.toString().replace(/[^0-9\,]/g, "")
        if (value === undefined) value = 0
        setHours(value)
        console.log(await hours)
        worker[field] = value
        dispatch(updateHours(site._id, worker.worker._id, value))
        break

      case 'rateGot':
      case 'ratePaid':
        if (value === undefined) value = 0
        value = value.toString().replace(/[^0-9\,\.]/g, "")
        //value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

        // const parts = value.split(",");
        // const result = `${parts[0]},${parts[1][0] || "0"}`;
        // value = result

        setData({ ...ratesData, [field]: value })
        dispatch(updateRatesAction(site._id, worker.worker._id, { ...ratesData, [field]: value }))
        break
      default:
        break
    }
  }

  const removeWorkerFromSite = (siteId, uid, weId) => {
    let date = new Date().getDay() === 0 ? moment().day(0).format('YYYY MMMM DD') : moment().day(7).format('YYYY MMMM DD')

    if (weekEnding === date) {
      axios.post('/site/remove-worker', {
        siteId,
        uid,
        weId
      })
        .then(res => {
          console.log(res.data)
          dispatch(addSites([res.data]))
          dispatch(loadData([res.data]))
        })
        .catch(err => console.log(err))
    } else {
      axios.put('/weekly/remove-worker', {
        siteId,
        uid,
        weekEnding,
        weId
      })
        .then(res => dispatch(addSites(res.data.data)))
        .catch(err => console.log(err))
    }

    setPopStyle('none')
  }

  const updateTrade = (trade, siteId, uid, weId) => {
    let date = new Date().getDay() === 0 ? moment().day(0).format('YYYY MMMM DD') : moment().day(7).format('YYYY MMMM DD')

    if (weekEnding === date) {
      axios.put('/site/add-category', {
        category: trade,
        siteId,
        uid,
        weId
      })
        .then(res => console.log(res))
        .catch(err => console.error(err))

      axios.put('/worker/add-trade', {
        trade,
        siteId,
        uid,
        weId
      })
        .then(res => console.log(res))
        .catch(err => console.error(err))
    } else {
      axios.put('/weekly/add-category', {
        weekEnding,
        category: trade,
        siteId,
        uid,
        weId
      })
        .then(res => console.log(res))
        .catch(err => console.error(err))
    }
  }

  const even = (nr) => {
    if (nr % 2 === 0) return true
    return false
  }

  const updateSelected = (e, siteId, worker) => {
    if (e.target.checked) {
      dispatch(addWr(siteId, worker))
    }
    else {
      dispatch(removeWr(siteId, worker))
    }
  }

  const updateOnBlur = (value) => {
    if (value.length === 0) value = '0'
    value = value.split('.').join("")
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

    if (!value.includes(',')) {
      return value.concat(',0')
    } else {
      let arr = value.split(',')
      let val

      val = arr[0].concat(`,${arr[1].charAt(0)}`)
      console.log('teeest', val)
      return val
    }
  }

  return (
    <div className={`worker-wr`}>
      <ul className={`${even(rowNumber) ? '' : 'grey'} test`}>

        {/* GENERAL INFO */}
        <div><li>{worker ? worker.worker.firstname + ' ' + worker.worker.lastname : null}</li></div>

        <Grid item className='select-trade'>
          <Select
            xs={9}
            placeholder='Choose percentage tax paid '
            value={trade}
            onChange={e => {
              updateTrade(e.target.value, site._id, worker.worker._id, worker.worker.weId)
              setTrade(e.target.value)
            }}
          >
            <MenuItem value={'1st Fix Carpenter'}>1st Fix Carpenter</MenuItem>
            <MenuItem value={'2nd Fix Carpenter'}>2nd Fix Carpenter</MenuItem>
            <MenuItem value={'360 Excavator'}>360 Excavator</MenuItem>
            <MenuItem value={'Basic Groundworker'}>Basic Groundworker</MenuItem>
            <MenuItem value={'Bricklayer'}>Bricklayer</MenuItem>
            <MenuItem value={'CCDO Labourer'}>CCDO Labourer</MenuItem>
            <MenuItem value={'Cleaner'}>Cleaner</MenuItem>
            <MenuItem value={'Crane Opertor'}>Crane Opertor</MenuItem>
            <MenuItem value={'Crane Supervisor'}>Crane Supervisor</MenuItem>
            <MenuItem value={'Demolition Labourer'}>Demolition Labourer</MenuItem>
            <MenuItem value={'Dry Liner/Ceiling Fixer'}>Dry Liner/Ceiling Fixer</MenuItem>
            <MenuItem value={'Forklift Telehandler'}>Forklift Telehandler</MenuItem>
            <MenuItem value={'FTD/Forward Tipping Dumper'}>FTD/Forward Tipping Dumper</MenuItem>
            <MenuItem value={'General Labourer'}>General Labourer</MenuItem>
            <MenuItem value={'Handyman'}>Handyman</MenuItem>
            <MenuItem value={'Nip Hand'}>Nip Hand</MenuItem>
            <MenuItem value={'Painter'}>Painter</MenuItem>
            <MenuItem value={'Plasterer'}>Plasterer</MenuItem>
            <MenuItem value={'Scaffolder Adv'}>Scaffolder Adv</MenuItem>
            <MenuItem value={'Scaffolder Part1'}>Scaffolder Part1</MenuItem>
            <MenuItem value={'Scaffolder Part2'}>Scaffolder Part2</MenuItem>
            <MenuItem value={'Shuttering Carpenter'}>Shuttering Carpenter</MenuItem>
            <MenuItem value={'Skilled Groundworker'}>Skilled Groundworker</MenuItem>
            <MenuItem value={'Skilled Labourer'}>Skilled Labourer</MenuItem>
            <MenuItem value={'Slinger Banksman'}>Slinger Banksman</MenuItem>
            <MenuItem value={'Steel Fixer'}>Steel Fixer</MenuItem>
            <MenuItem value={'Striker'}>Striker</MenuItem>
            <MenuItem value={'Tiler'}>Tiler</MenuItem>
          </Select>
        </Grid>

        {/* TRADE DROPDOWN */}

        <div><li className='small-text'>upload timesheet</li></div>

        {/* RATES  floatFormat(ratesData.rateGot, '')*/}
        <div><li><input
          value={ratesData.rateGot}
          onBlur={e => {
            let newVal = updateOnBlur(e.target.value)
            updateRates(newVal, worker, 'rateGot')
          }}
          onChange={e => { updateRates(e.target.value, worker, 'rateGot') }}
        /></li></div>

        <div><li><input
          value={ratesData.ratePaid}
          onBlur={e => {
            let newVal = updateOnBlur(e.target.value)
            updateRates(newVal, worker, 'ratePaid')
          }}
          onChange={e => updateRates(e.target.value, worker, 'ratePaid')}
        /></li></div>

        <div><li>{ratesData ? `${floatFormat(makeFloat(ratesData.rateGot) - makeFloat(ratesData.ratePaid), 'one')}` : null}</li></div>

        <div><li><input
          value={hours}
          onBlur={e => {
            let newVal = updateOnBlur(e.target.value)
            updateRates(newVal, worker, 'hours')
          }}
          onChange={e => { updateRates(e.target.value, worker, 'hours') }}
        /></li></div>

        {/* AMOUNTS AND OTHERS */}
        <div><li>{worker ? invoiced(worker.worker) === NaN ? null : floatFormat(invoiced(worker.worker), ' ') : null}</li></div>
        <div><li>{worker ? floatFormat(getMargin(), ' ') : null}</li></div>
        <div className='last-cell'><li>{worker ? workerAmount(worker) === NaN ? null : floatFormat(workerAmount(worker.worker), '') : null}</li></div>

        <section className={`remove-btn-wr`}> <li className='remove-btn' onClick={e => setPopStyle('')}>X</li> </section>
        <section className={`${popStyle} pop-out`}>
          Do you want DELETE<br /> {worker ? worker.worker.firstname + ' ' + worker.worker.lastname : null}
          <button className='ok' onClick={e => removeWorkerFromSite(site._id, worker.worker._id, worker.worker.weId)}>OK</button>
          <button className='cancel' onClick={e => setPopStyle('none')}>Cancel</button>
        </section>
        <label className="container">
          <input type="checkbox" defaultChecked onChange={e => updateSelected(e, site._id, worker)} />
          <span className="checkmark"></span>
        </label>
      </ul>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    weekEnding: state.weekEndingReducers.weekEnding
  }
}

export default connect(mapStateToProps)(Worker)
