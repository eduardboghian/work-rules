import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DeleteIcon from '@material-ui/icons/Delete';
import { Tooltip } from '@material-ui/core';
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
  
  const updateStatusDB = (value, site) => {
    axios.put('site/update-status', {
      id: site._id,
      value
    })
    .then(res => {})
    .catch(err => console.error(err))

  }

  useEffect(() => {
    console.log(sites)
  }, [props])

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell classes={{ root: classes.cellHeader }}>
              <Typography>Site Name</Typography>
            </TableCell>
            <TableCell classes={{ root: classes.cellHeader }}>
              <Typography>Last Invoice</Typography>
            </TableCell>
            <TableCell classes={{ root: classes.cellHeader }}>
              <Typography style={{ textAlign: 'center' }}>Workers</Typography>
            </TableCell>
            <TableCell classes={{ root: classes.cellHeader }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sites.map(site => (
            <TableRow>
              <TableCell classes={{ root: classes.cell }}>
                <Typography>{site.siteName}</Typography>
              </TableCell>
              <TableCell classes={{ root: classes.cell }}>
                <Typography>{!!site.lastInvoice && site.lastInvoice}</Typography>
              </TableCell>
              <TableCell classes={{ root: classes.cell }}>
                {site.workers ? site.workers.length > 0 ? (
                  <Tooltip
                    placement='top'
                    classes={{ tooltip: classes.tooltip }}
                    title={
                      <Grid container>
                        {site.workers.map(worker => (
                          <Typography>{`${worker.firstname} ${worker.lastname}`}</Typography>
                        ))}
                      </Grid>
                    }
                  >
                    <Typography style={{ textAlign: 'center', textDecoration: 'underline', cursor: 'pointer', color: 'darkorange' }}>
                      {site.workers.length}
                    </Typography>
                  </Tooltip>
                ) : null : null}
                <Typography>{!!site.workers && site.workers.length}</Typography>
              </TableCell>
              <TableCell classes={{ root: classes.cell }}>
                <DeleteIcon onClick={props.deleteSite.bind(null, site._id)} />
              </TableCell>
              <TableCell style={{ width: '150px' }} classes={{ root: classes.cell }}>
                <FormControl style={{ width: '150px' }} fullWidth classes={{ root: classes.inputContainer }}>
                  <Select
                    style={{ width: '150px' }}
                    renderValue={()=> {
                        return site.status
                    }}
                    defaultValue={'John'}
                    onChange={e => {
                        updateStatusDB(e.target.value, site)
                        site.status = e.target.value
                    }}
                  >
                    <MenuItem value={'Active'}>Active</MenuItem>
                    <MenuItem value={'Not Active'}>Not Active</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SitesTable;
