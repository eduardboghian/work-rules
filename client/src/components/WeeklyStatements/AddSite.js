import React, { useState, useEffect } from 'react'
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Grid from "@material-ui/core/Grid";
import axios from 'axios'

import './css/add-site.css'
import { editCreateStyles } from "../../utils/styles";
const useStyles = makeStyles(editCreateStyles);

export default function AddSite(props) {
  const classes = useStyles();
  const [newSite, setNewSite] = useState({
    status: 'Active'
  })
  const [clientList, setClientList] = useState([])

  useEffect(() => {
    axios.get('/client/get', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        setClientList(res.data)
        // setNewSite({ ...newSite, companyName: res.data[0].companyName })
        setNewSite(data =>  { return { ...data, companyName: res.data[0].companyName } })
      })
      .catch(err => console.error(err))
  }, [])


  const createNewSite = () => {
    axios.post('/site/add', {
      action: 'create',
      data: newSite
    }, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        console.log(res)
        props.setSelectedSite(res.data)
        props.setPopup(false)
      })
      .catch(err => console.error(err))
  }

  return (
    <div className='add-site-popup' id='add-site-popup' style={props.popup ? {} : { display: 'none' }}>

      <div
        style={{
          gridColumnStart: '1',
          gridColumnEnd: '3',
          justifySelf: 'right',
          marginRight: '20px'
        }}
        className="close-btn"
        onClick={e => props.setPopup(false)}
      >X</div>

      <Grid
        style={{
          width: '318px',
          height: '45px',
          borderWidth: '2px !important'
        }}>
        <Grid>
          <Typography>Site Name  *</Typography>
          <FormControl>
            <Input
              value={newSite.siteName}
              style={{
                width: '318px',
                height: '45px',
                borderWidth: '2px !important'
              }}
              classes={{ input: classes.input }}
              onChange={e => setNewSite({ ...newSite, 'siteName': e.target.value })}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid>
        <Typography>Company Name  *</Typography>
        <FormControl>
          <Select
            variant="outlined"
            value={newSite.companyName}
            onChange={e => setNewSite({ ...newSite, 'companyName': e.target.value })}
            style={{
              width: '318px',
              height: '45px',
              borderWidth: '2px !important'
            }}
          >
            {clientList.map((cl, i) => {
              return <MenuItem key={i} value={cl.companyName} > {cl.companyName} </MenuItem>
            })}
          </Select>
        </FormControl>
      </Grid>

      <Grid classes={{ root: classes.inputContainer }} id='address1' className='address1'>
        <Grid>
          <Typography>Address Line 1</Typography>
          <FormControl>
            <Input
              style={{ width: '100% !important' }}
              value={newSite.address1}
              classes={{ input: classes.input }}
              onChange={e => setNewSite({ ...newSite, 'address1-site': e.target.value })}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid classes={{ root: classes.inputContainer }}>
        <Grid>
          <Typography>Address Line 2</Typography>
          <FormControl fullWidth >
            <Input
              value={newSite.address2}
              classes={{ input: classes.input }}
              onChange={e => setNewSite({ ...newSite, 'address2-site': e.target.value })}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid classes={{ root: classes.inputContainer }}>
        <Grid>
          <Typography>City</Typography>
          <FormControl fullWidth>
            <Input
              value={newSite.city}
              classes={{ input: classes.input }}
              onChange={e => setNewSite({ ...newSite, 'city-site': e.target.value })}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid classes={{ root: classes.inputContainer }}>
        <Grid>
          <Typography>Zip Code</Typography>
          <FormControl fullWidth>
            <Input
              value={newSite.zipCode}
              classes={{ input: classes.input }}
              onChange={e => setNewSite({ ...newSite, 'zip-site': e.target.value })}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid classes={{ root: classes.inputContainer }} className='comment' >
        <Grid>
          <Typography>Comment</Typography>
          <FormControl>
            <Input
              value={newSite.comment}
              classes={{ input: classes.input }}
              onChange={e => setNewSite({ ...newSite, 'comment-site': e.target.value })}
            />
          </FormControl>
        </Grid>
      </Grid>

      <Grid className='new-site-btn' id='new-site-btn'>
        <Button className='save-btn' onClick={async () => { createNewSite() }}>
          Save New Site
        </Button>
      </Grid>
    </div>
  )
}
