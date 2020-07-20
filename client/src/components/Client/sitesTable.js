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
  const [sites, setSites] = useState([])
  const [activeSites, setActiveSites] = useState([])
  const [sitesList, setFiltratedSites] = useState([])
  const [reloader, setReloader] = useState()

  useEffect(() => {
    if (props.newSite.length !== reloader) {
      // LOAD SITES FOR THE COMPANY
      axios.get('/site/all', {
        headers: {
          authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(res => {
          let filter = res.data.filter(site => site.companyName === props.companyName)
          setSites(filter)
        })
        .catch(err => console.error(err))
      setReloader(props.newSite.length)
    }
  }, [props])

  useEffect(() => {
    // FILTER ACTIVE/ INACTIVE SITES
    let filtratedSites
    if (sites) {
      filtratedSites = sites.filter(site => site.status === 'Active')
      filtratedSites.sort(function (a, b) {
        var nameA = a.companyName + ' ' + a.siteName
        var nameB = b.companyName + ' ' + b.siteName
        nameA = nameA.toUpperCase()
        nameB = nameB.toUpperCase()
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
      setActiveSites(filtratedSites)

      filtratedSites = sites.filter(site => site.status !== 'Active')
      filtratedSites.sort(function (a, b) {
        var nameA = a.companyName + ' ' + a.siteName
        var nameB = b.companyName + ' ' + b.siteName
        nameA = nameA.toUpperCase()
        nameB = nameB.toUpperCase()
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
      setFiltratedSites(filtratedSites)

    }
  }, [sites])

  const updateSiteStatus = (status, site) => {
    axios.put('/site/update-status', {
      id: site._id,
      value: status
    })
      .then(res => {
        let filter = res.data.filter(site => site.companyName === props.companyName)
        setSites(filter)
      })
      .catch(err => console.error(err))
  }

  const deleteSite = (siteId) => {
    axios.delete('/site/delete', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      },
      data: {
        _id: siteId
      }
    })
      .then(res => {
        let filter = res.data.filter(site => site.companyName === props.companyName)
        setSites(filter)
      })
      .catch(err => console.error(err))
  }

  return (
    <div className='sites-prim'>
      <TableContainer className='active-wr'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: classes.cellHeader }}>
                <Typography>Active Sites</Typography>
              </TableCell>
              <TableCell classes={{ root: classes.cellHeader }}></TableCell>
            </TableRow>
          </TableHead>


          <TableBody style={{ overflowY: 'scroll', height: '400px !important' }}>
            {activeSites.map((site, i) => (
              <TableRow key={i}>
                <TableCell classes={{ root: classes.cell }}>
                  <Typography>{site.siteName}</Typography>
                </TableCell>

                <TableCell style={{ width: '30px' }} classes={{ root: classes.cell }}>
                  <img src={EditIcon} onClick={e => props.editSite(site._id)} className='edit-icon' />
                </TableCell>

                <TableCell classes={{ root: classes.cell }}>
                  <DeleteIcon onClick={e => updateSiteStatus('Not Active', site)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer className='inactive-wr'>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell classes={{ root: classes.cellHeader }}>
                <Typography>Closed Sites</Typography>
              </TableCell>
              <TableCell classes={{ root: classes.cellHeader }}></TableCell>
            </TableRow>
          </TableHead>


          <TableBody style={{ overflowY: 'scroll', height: '400px !important' }}>
            {sitesList.map((site, i) => (
              <TableRow key={i}>
                <TableCell classes={{ root: classes.cell }}>
                  <Typography>{site.siteName}</Typography>
                </TableCell>

                <TableCell style={{ width: '30px' }} classes={{ root: classes.cell }}>
                  <img src={PowerButton} onClick={e => updateSiteStatus('Active', site)} className='edit-icon' />
                </TableCell>

                <TableCell classes={{ root: classes.cell }}>
                  <DeleteIcon onClick={e => deleteSite(site._id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>

  );
};

export default SitesTable;
