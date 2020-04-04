import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Typography, Tooltip, Grid } from "@material-ui/core";

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
    companyName: item.companyName,
    peer: item.peer,
    id: item.id,
    firstPost: item.firstPost,
    secondPost: item.secondPost,
    utr: item.utr,
    vat: item.vat,
    cis: item.cis,
    gross: item.gross,
    phone: item.phone,
    email: item.email,
    communicationChannel: item.communicationChannel,
    sites: item.sites,
    status: item.status
  };
  return (
    <TableRow style={even ? { backgroundColor: "#ececec" } : {}}>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.companyName}</Typography>
      </TableCell>
      <TableCell
        classes={{ root: classes.cell }}
        onClick={() => {
          setActionType("edit");
          openDialog(data);
        }}
      >
        <Typography classes={{ root: classes.link }}>{item.peer}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.phone}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.communicationChannel}</Typography>
      </TableCell>
      <TableCell align="center" classes={{ root: classes.cell }}>
        {item.sites.length > 0 ? (
          <Tooltip
            placement="top"
            classes={{ tooltip: classes.tooltip }}
            title={
              <Grid container direction="column">
                {item.sites.map(site => (
                  <Typography>{site.siteName}</Typography>
                ))}
              </Grid>
            }
          >
            <Typography style={{ textAlign: "center", textDecoration: "underline", cursor: "pointer", color: "darkorange" }}>
              {item.sites.length}
            </Typography>
          </Tooltip>
        ) : null}
      </TableCell>
    </TableRow>
  );
};

export default ClientRow;
