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
        <Typography classes={{ root: classes.link }} >{`${item.firstname} ${item.lastname}`}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.phone}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{`${item.category}`}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>{item.tickets.map( (data, i) => {
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
