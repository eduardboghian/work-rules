import React, { useEffect, useState } from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Typography } from "@material-ui/core";
import './style.css'

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
  }
});

const WorkerRow = props => {
  const { item, openDialog, setActionType, even } = props;
  const classes = useStyles();
  const [filtratedTrades, setTrades] = useState([])
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    if (item) {
      let trades = JSON.parse(JSON.stringify(item.trades))
      //console.log(trades)

      trades = trades.slice().sort((a, b) => new Date(b.weekEnding) - new Date(a.weekEnding))
      // console.log('sortata', trades)

      var obj = {};

      for (var i = 0, len = trades.length; i < len; i++)
        obj[trades[i]['value']] = trades[i];

      trades = new Array();
      for (var key in obj)
        trades.push(obj[key]);

      setTrades(trades)
    }
  }, [props])

  const deleteWorker = () => {
    axios.delete('/worker/delete', {
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
    <TableRow style={even ? { backgroundColor: "#ecececb0" } : {}}>
      <TableCell
        classes={{ root: classes.cell }}
        onClick={() => {
          setActionType("edit");
          openDialog(item);
        }}
      >
        <Typography classes={{ root: classes.link }} >{item.type === 'company' ? item.companyName : item.firstname + ' ' + item.lastname}</Typography>
      </TableCell>

      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.phone}</Typography>
      </TableCell>

      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.uniqueID}</Typography>
      </TableCell>

      <TableCell classes={{ root: classes.cell }}>
        {filtratedTrades.map((data, i) => {
          if (i > 2) return

          return <p style={{ display: 'inline-block', margin: '0 3px', fontWeight: '500', fontSize: '16px' }} key={i}>{data.value}{i === 2 ? null : ','} </p>
        })}
      </TableCell>

      <TableCell classes={{ root: classes.cell }}>{item.tickets.map((data, i) => {
        return <p style={{ display: 'inline-block', margin: '0 3px', fontWeight: '500', fontSize: '16px' }} key={i}>{data}, </p>
      })}
      </TableCell>

      <TableCell classes={{ root: classes.cell }}>
        <Typography>{`${item.comment}`}</Typography>
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

    </TableRow>
  );
};

export default WorkerRow;
