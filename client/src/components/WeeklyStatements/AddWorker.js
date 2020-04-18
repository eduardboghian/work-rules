import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { editCreateStyles } from '../../utils/styles';
import axios from 'axios'
import './css/index.css'

export default function AddWorker({formClass, close, siteId}) {
    const useStyles = makeStyles(editCreateStyles);
    const classes = useStyles();
    const [workers, setWorkers] = useState([])
    const [newWorker, setNewWorker] = useState({})

    useEffect(() => {
        getWorkersFromDB()
    }, [])

    const getWorkersFromDB = () => {
        axios.get('/worker/get')
        .then(res => setWorkers(res.data))
        .catch(error => console.error(error))
    } 
    
    const addWorker = () => {
        axios.put('/site/add-worker', {
            siteId,
            newWorker,
            rates: {
                rateGot: 0,
                ratePaid: 0,
                otGot: 0,
                otPaid: 0
            }
        })
        .then(res => {
            window.location.reload(true)
        } )
        .catch( error => console.log( error) )   
    }
    
    return (
        <div className={`${formClass} addworker-wr`}>
            <p className='title-add-worker'>Add Worker</p>
            <div className="close-btn" onClick={ e => close()}>X</div>
            <Grid className='select-wr' container direction='row' classes={{ root: classes.inputContainer }}>
                <Grid item xs={3}>
                    <Typography>Chose Worker</Typography>
                </Grid>
                <Grid item xs={9}>
                    <FormControl fullWidth classes={{ root: classes.inputContainer }}>
                        <Select
                            placeholder='workers'
                            value={newWorker ? newWorker.firstname : '' }
                            onChange={e => {
                                let worker = workers.find(worker => worker._id === e.target.value);
                                setNewWorker(worker)
                            }}
                        >
                            {workers.map((worker, i) => (
                                <MenuItem key={i} value={worker._id}>{worker.firstname+' '+worker.lastname}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <button type='submit' className='add-worker-btn' onClick={ e => addWorker(e) }>Add Worker</button>
        </div>
    )
}
