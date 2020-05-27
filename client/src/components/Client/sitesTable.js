import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DeleteIcon from '@material-ui/icons/Delete';

import EditIcon from '../../media/edit-regular.svg'
import PowerButton from '../../media/power-off-solid.svg'

import axios from 'axios';

const useStyles = makeStyles({
  cellHeader: {
    padding: '5px',
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '10px',
    fontWeight: 500
  },
  cell: {
    padding: '0'
  },
  tooltip: {
    backgroundColor: '#fff',
    color: 'black',
    boxShadow: '0 0 5px -1px grey'
  }
});

const SitesTable = props => {
  const classes = useStyles();
  const { sites } = props;
  const [clientId, setCliId] = useState('')
  const [sitesList, setSites] = useState([])

  useEffect(() => {
    setCliId( props.clinetId )
    let filtratedSites
    if(sites) {
      if(props.type === 'active') {
        filtratedSites = sites.filter(site => site.status === 'Active')
        setSites(filtratedSites)
      } else {
        filtratedSites = sites.filter(site => site.status !== 'Active')
        setSites(filtratedSites)
      }
    }

  }, [props])
  
  const updateStatusDB = (value, site) => {
    axios.put('/site/update-status', {
      id: site._id,
      value
    })
    .then(res => {})
    .catch(err => console.error(err))


    axios.put('/client/site-status', {
      clientId: clientId,
      siteId: site._id,
      value
    })
    .then(res => {})
    .catch(err => console.error(err))
    window.location.reload(true)
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell classes={{ root: classes.cellHeader }}>
              {props.type === 'active' ? 
                <Typography>Active Sites</Typography> :
                <Typography>Closed Sites</Typography>
              }
              </TableCell>
            <TableCell classes={{ root: classes.cellHeader }}></TableCell>
          </TableRow>
        </TableHead>


        <TableBody style={{ overflowY: 'scroll', height: '400px !important' }}>
          {sitesList.map((site,i) => (
            <TableRow key={i}>
              <TableCell classes={{ root: classes.cell }}>
                <Typography>{site.siteName}</Typography>
              </TableCell>

              {props.type === 'active' ?  
              
                <TableCell style={{ width: '30px' }} classes={{ root: classes.cell }}>
                  <img src={EditIcon} onClick={ e => props.editSite(site._id) } className='edit-icon' />
                </TableCell>:

                <TableCell style={{ width: '30px' }} classes={{ root: classes.cell }}>
                  <img src={PowerButton} onClick={ e => updateStatusDB( 'Active', site ) }  className='edit-icon' />
                </TableCell>

              }

              <TableCell classes={{ root: classes.cell }}>
              {props.type === 'active' ? 
                <DeleteIcon onClick={ e => updateStatusDB( 'Not Active', site) } />:
                <DeleteIcon onClick={ e => props.deleteSite(site._id) } />
              }  
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SitesTable;
