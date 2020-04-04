import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  cell: {
    padding: "10px"
  },
  statusActiveCell: {
    backgroundColor: "lightgreen"
  },
  statusArchivedCell: {
    backgroundColor: "lightcoral"
  },
  link: {
    textDecoration: "underline",
    color: "darkorange",
    cursor: "pointer"
  }
});

const AgentSourcerRow = props => {
  const { item, openDialog, setActionType, even } = props;
  const data = {
    role: item.role,
    firstname: item.firstname,
    lastname: item.lastname,
    email: item.email,
    password: item.password,
    status: item.status
  };
  const classes = useStyles();
  return (
    <TableRow style={even ? { backgroundColor: "#ececec" } : {}}>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.role[0].toUpperCase() + item.role.slice(1)}</Typography>
      </TableCell>
      <TableCell
        classes={{ root: classes.cell }}
        onClick={() => {
          setActionType("edit");
          openDialog(data);
        }}
      >
        <Typography classes={{ root: classes.link }}>{`${item.firstname} ${item.lastname}`}</Typography>
      </TableCell>
      {/* <TableCell classes={{ root: classes.cell }}>
        <Typography>{`${item.email}/${item.username}`} </Typography>
      </TableCell> */}
      {item.status === "active" ? (
        <TableCell align="center" classes={{ root: classes.cell }}>
          <Typography classes={{ root: classes.statusActiveCell }}>{item.status}</Typography>
        </TableCell>
      ) : (
        <TableCell align="center" classes={{ root: classes.cell }}>
          <Typography classes={{ root: classes.statusArchivedCell }}>{item.status}</Typography>
        </TableCell>
      )}
    </TableRow>
  );
};

export default AgentSourcerRow;
