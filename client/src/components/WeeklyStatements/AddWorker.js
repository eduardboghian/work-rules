import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import { editCreateStyles } from '../../utils/styles';
import Input from '@material-ui/core/Input';
import axios from 'axios'
import './css/index.css'

export default function AddWorker({formClass, siteId}) {
    const useStyles = makeStyles(editCreateStyles);
    const classes = useStyles();
    const [workers, setWorkers] = useState([])
    const [newWorker, setNewWorker] = useState({})
    const [rates, setRates] = useState({
        rateGot: undefined,
        ratePaid: undefined,
        otGot: undefined,
        otPaid: undefined
    })

    useEffect(() => {
        axios.get('/worker/get')
        .then(res => setWorkers(res.data))
        .catch(error => console.error(error))
    }, [])

    const inputHadnler = (value, field) => {
        setRates({ ...rates, [field] : value })
    } 
    
    const addWorker = () => {
        axios.put('/site/add-worker', {
            siteId,
            newWorker,
            rates
        })
        .then(res => console.log(res) )
        .catch( error => console.log( error) )   
    }
    
    return (
        <div className={`${formClass} addworker-wr`}>
            <h1>Add Worker</h1>
            <Grid container direction='row' classes={{ root: classes.inputContainer }}>
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

            <Grid container direction='row' classes={{ root: classes.inputContainer }}>
            <Grid item xs={3}>
                <Typography>Hourly Rate got Client</Typography>
            </Grid>
            <Grid item xs={9}>
                <FormControl fullWidth>
                <Input
                    value={rates.rateGot}
                    placeholder='Set hourly rate'
                    classes={{ input: classes.input }}
                    onChange={e => inputHadnler(e.target.value, 'rateGot')}
                />
                </FormControl>
            </Grid>
            </Grid>
            <Grid container direction='row' classes={{ root: classes.inputContainer }}>
            <Grid item xs={3}>
                <Typography>Hourly Rate paid to Worker</Typography>
            </Grid>
            <Grid item xs={9}>
                <FormControl fullWidth>
                <Input
                    value={rates.ratePaid}
                    placeholder='Set hourly rate'
                    classes={{ input: classes.input }}
                    onChange={e => inputHadnler(e.target.value, 'ratePaid')}
                />
                </FormControl>
            </Grid>
            </Grid>
            <Grid container direction='row' classes={{ root: classes.inputContainer }}>
            <Grid item xs={3}>
                <Typography>Hourly Rate Overtime got</Typography>
            </Grid>
            <Grid item xs={9}>
                <FormControl fullWidth>
                <Input
                    value={rates.otGot}
                    placeholder='Set hourly rate'
                    classes={{ input: classes.input }}
                    onChange={e => inputHadnler(e.target.value, 'otGot')}
                />
                </FormControl>
            </Grid>
            </Grid>
            <Grid container direction='row' classes={{ root: classes.inputContainer }}>
            <Grid item xs={3}>
                <Typography>Hourly Rate Overtime Paid</Typography>
            </Grid>
            <Grid item xs={9}>
                <FormControl fullWidth>
                <Input
                    value={rates.otPaid}
                    placeholder='Set hourly rate'
                    classes={{ input: classes.input }}
                    onChange={e => inputHadnler(e.target.value, 'otPaid')}
                />
                </FormControl>
            </Grid>
            </Grid>

            <button type='submit' onClick={ e => addWorker(e) }>Add worker</button>
        </div>
    )
}
