import React, { useState, useEffect } from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Typography } from "@material-ui/core";

import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';

import Button from '@material-ui/core/Button';
import axios from "axios";

const useStyles = makeStyles({
  cell: {
    padding: "10px"
  },
  link: {
    textDecoration: "underline",
    color: "darkorange",
    cursor: "pointer"
  },
  tooltip: {
    backgroundColor: "#fff",
    color: "black",
    boxShadow: "0 0 5px -1px grey"
  }
});

const ClientRow = props => {
  const { item, openDialog, setActionType, even } = props;
  const classes = useStyles();
  const data = {
    _id: item._id,
    companyName: item.companyName,
    peer: item.name + ' ' + item.lastName,
    id: item.id,
    name: item.name,
    lastName: item.lastName,
    firstPost: item.firstPost,
    secondPost: item.secondPost,
    city: item.city,
    zipCode: item.zipCode,
    utr: item.utr,
    vat: item.vat,
    cis: item.cis,
    phone: item.phone,
    phoneScnd: item.phoneScnd,
    comment: item.comment,
    companyComment: item.companyComment,
    email: item.email,
    communicationChannel: item.communicationChannel,
    sites: item.sites,
    status: item.status
  };
  const [showDelete, setShowDelete] = useState(false)


  const deleteWorker = () => {
    axios.delete('/client/delete', {
      data: {
        userId: item._id
      }
    })
      .then(res => {
        console.log(res.data)
        setShowDelete(false)
        window.location.reload(true)
      })
      .catch(err => console.error(err))
  }

  return (
    <TableRow style={even ? { backgroundColor: "#ececec" } : {}}>
      <TableCell
        classes={{ root: classes.cell }}
        onClick={() => {
          setActionType("edit");
          openDialog(data);
        }}
      >
        <Typography classes={{ root: classes.link }}>{item.companyName}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.name + ' ' + item.lastName}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.phone}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.communicationChannel}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.email}</Typography>
      </TableCell>
      <TableCell xs={9} classes={{ root: classes.cell }}>
        <Typography>{item.status}</Typography>
      </TableCell>
      <TableCell style={{ width: '10px', position: 'relative' }} classes={{ root: classes.cell }}>
        <IconButton aria-label="settings">
          <MoreVertIcon onClick={e => setShowDelete(!showDelete)} />
        </IconButton>

        <Button
          variant="contained"
          color="secondary"
          style={showDelete ? {
            position: 'absolute',
            zIndex: 1,
            top: '15px',
            left: '-80px'
          } : { display: 'none' }}
          onClick={e => deleteWorker()}
        >
          Delete
        </Button>
      </TableCell>


      {/* <TableCell align="center" classes={{ root: classes.cell }}>
        {item.sites.length > 0 ? (
          <Tooltip
            placement="top"
            classes={{ tooltip: classes.tooltip }}
            title={
              <Grid container direction="column">
                {item.sites.map((site, index) => (
                  <Typography key={index}>{site.siteName}</Typography>
                ))}
              </Grid>
            }
          >
            <Typography style={{ textAlign: "center", textDecoration: "underline", cursor: "pointer", color: "darkorange" }}>
              {item.sites.length}
            </Typography>
          </Tooltip>
        ) : null}
      </TableCell> */}
    </TableRow>
  );
};

export default ClientRow;
