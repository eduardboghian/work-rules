import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Typography } from "@material-ui/core";

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
  console.log('data before edit', item)
  const data = {
    _id: item._id,
    type: item.type,
    companyName: item.companyName,
    peer: item.peer,
    firstname: item.firstname,
    lastname: item.lastname,
    id: item.id,
    firstPost: item.firstPost,
    secondPost: item.secondPost,
    utr: item.utr,
    vat: item.vat,
    cis: item.cis,
    nino: item.nino,
    crn: item.crn,
    phone: item.phone,
    email: item.email,
    communicationChannel: item.communicationChannel,
    company: item.company,
    site: item.site,
    sitesData: item.sitesData,
    gotClient: item.gotClient,
    paidWorker: item.paidWorker,
    margin: item.margin,
    overtimeGot: item.overtimeGot,
    overtimePaid: item.overtimePaid,
    marginOT: item.marginOT,
    taxPercentage: item.taxPercentage,
    category: item.category,
    status: item.status
  };
  return (
    <TableRow style={even ? { backgroundColor: "#ececec" } : {}}>
      <TableCell
        classes={{ root: classes.cell }}
        onClick={() => {
          setActionType("edit");
          openDialog(item);
        }}
      >
        <Typography classes={{ root: classes.link }}>{`${item.firstname} ${item.lastname}`}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.phone}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.communicationChannel}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.utr}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.nino}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{item.cis}</Typography>
      </TableCell>
      <TableCell classes={{ root: classes.cell }}>
        <Typography>{`${item.company.companyName} ${item.site.siteName}`}</Typography>
      </TableCell>
    </TableRow>
  );
};

export default WorkerRow;
