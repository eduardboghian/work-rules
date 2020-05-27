import React, { useEffect } from "react";
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
    peer: item.name+ ' '+item.lastName,
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

  // useEffect(() => {
  //   setActionType("edit");
  //   openDialog(data);
  // }, [data])

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
        <Typography classes={{ root: classes.link }}>{item.name+ ' '+item.lastName}</Typography>
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
