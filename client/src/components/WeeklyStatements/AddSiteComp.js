import React, { useState, useEffect } from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { getClientData } from '../../utils/api';

import axios from 'axios'
import './css/index.css'

export default function AddSiteComp({formClass, close, sites, addSite, updateSelectSiteValue}) {
    const [clients, setClientData] = useState([])
    const [selectedClient, setSelectedClient] = useState()
    const [siteName, setSiteName] = useState('')

    useEffect(() => {
        getClientData()
        .then(res => {
            res.data.sort(function (a, b) {
                let nameA = a.companyName.toUpperCase()
                let nameB = b.companyName.toUpperCase()
                
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0;
            });
            setSelectedClient(res.data[0].companyName)
            setClientData(res.data)
        })
        .catch(err => console.error(err))
    }, [])

    const createNewSite = () => {
        axios.post('/site/add', {
            data: {
                siteName,
                companyName: selectedClient,
            },
            action: 'create'
        }, {
            headers: {
              authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(res => { 
            updateSelectSiteValue(res.data)
            addSite([...sites, res.data])
            close()
        })
        .catch(err => console.error(err))
    }

    return (
        <div className={`${formClass} addworker-wr`}>
            <p className='title-add-worker'>Create New Site</p>
            <div className="close-btn" onClick={e => close()}>X</div>

            <div className="form-wrapper">
                <div>
                    <label>
                        Site Name
                        <input 
                            type="text"
                            placeholder='Site Name' 
                            value={siteName}
                            onChange={e => setSiteName(e.target.value)}    
                        />
                    </label>
                </div>

                <div>
                    <p>Client</p>
                    <label>
                        <Select
                            style={{
                                height: '40px !important'
                            }}
                            variant="outlined"
                            size='samll'
                            renderValue={() => {
                                return selectedClient ? selectedClient : ''
                            }}
                            defaultValue={'Choose the Client'}
                            onChange={e => {
                                setSelectedClient(e.target.value)
                            }}
                        >
                            {clients.map(client => {
                                return <MenuItem key={client._id} value={client.companyName}> { client.companyName } </MenuItem>
                            })}
                        </Select>
                    </label>
                </div>
            </div>


            <button type='submit' className='add-site-button' onClick={ createNewSite }>Create Site</button>
        </div>
    )
}
