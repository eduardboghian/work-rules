import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Typography } from "@material-ui/core";
import './style.css'

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
        {item.trades.map((data, i) => {
          if (i > 2) return
          if (typeof item.trades[0] === "object" && i > 0) {
            if (data.value === item.trades[i - 1].value) return
          }

          if (typeof item.trades[0] === "object" && i > 1) {
            if (data.value === item.trades[i - 2].value) return
          }

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

    </TableRow>
  );
};

export default WorkerRow;
