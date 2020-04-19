import React, { useState, useEffect } from "react";
import axios from 'axios'
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Select from "@material-ui/core/Select";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import Input from "@material-ui/core/Input";

import { createClient, createSite } from "../../utils/api";

import SitesTable from "./sitesTable";

import { editCreateStyles } from "../../utils/styles";

const useStyles = makeStyles(editCreateStyles);

const EditCreate = props => {
  const [temporaryData, setData] = useState({ ...props.data });
  const [newSiteName, setSiteName] = useState("");
  const [sites, setSites] = useState([]);
  const [companyNameError, setCompanyNameError] = useState(false);
  const [peerError, setPeerError] = useState(false);
  const [firstPostError, setFirstPostError] = useState(false);
  const [secondPostError, setSecondPostError] = useState(false);
  const [utrError, setUtrError] = useState(false);
  const [vatError, setVatError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [commChannelError, setCommChannelError] = useState(false);
  const [sitesError, setSitesError] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    findSites();
  }, [props]);

  const findSites = async () => {
    setSites(props.data.sites);
  };
  
  const closePage = () => {
    props.isDialogOpened(false);
    props.setEditData({
      companyName: "",
      peer: "",
      id: "",
      firstPost: "",
      secondPost: "",
      city: '',
      zipCode: '',
      utr: "",
      vat: "GB ",
      cis: false,
      phone: "+44",
      email: "",
      communicationChannel: "",
      sites: [],
      status: ""
    });
  };
  const validation = async () => {
    if (temporaryData.companyName.length < 6) {
      setCompanyNameError(true);
      let timer = setTimeout(() => setCompanyNameError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (temporaryData.status.length === 0) {
      setStatusError(true);
      let timer = setTimeout(() => setStatusError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (temporaryData.peer.length < 3) {
      setPeerError(true);
      let timer = setTimeout(() => setPeerError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (temporaryData.firstPost.length === 0) {
      setFirstPostError(true);
      let timer = setTimeout(() => setFirstPostError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (temporaryData.secondPost.length === 0) {
      setSecondPostError(true);
      let timer = setTimeout(() => setSecondPostError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }

    if(temporaryData.utr.length < 1) {}
    else if (/[0-9]{10}/g.test(temporaryData.utr) === false) {
      setUtrError(true);
      let timer = setTimeout(() => setUtrError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }

    if (/([G])([B]\s)([0-9]{9})(\s*)/g.test(temporaryData.vat) === false) {
      setVatError(true);
      let timer = setTimeout(() => setVatError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }

    if(temporaryData.phone.length < 4) {}
    else if (/\+[4][4]([1234567890]{10})/g.test(temporaryData.phone) === false) {
      setPhoneError(true);
      let timer = setTimeout(() => setPhoneError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }

    if(temporaryData.email.length < 1) {}
    else if (
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        temporaryData.email
      ) === false
    ) {
      setEmailError(true);
      let timer = setTimeout(() => setEmailError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }


    if (temporaryData.communicationChannel.length === 0) {}
    else {
      setCommChannelError(true);
      let timer = setTimeout(() => setCommChannelError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (temporaryData.sites.length === 0) {
      setSitesError(true);
      let timer = setTimeout(() => setSitesError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    setPending(true);
    await createClient({ ...temporaryData }, props.actionType);
    props.update();
    closePage();
  };
  const inputHadnler = (data, fieldName) => {
    switch (fieldName) {
      case "peer":
        if (data.length <= 50) {
          let checked = data.replace(/[^a-zA-Z\s\-]/g, "");
          setData({ ...temporaryData, peer: checked });
        }
        break;
      case "utr":
        if (data.length <= 11) {
          let checked = data.replace(/[^0-9\s]/g, "");
          setData({ ...temporaryData, utr: checked });
        }
        break;
      case "vat":
        if (data.length <= 12) {
          if (data === "GB") {
            setData({ ...temporaryData, vat: `${data} ` });
            break;
          }
          let checked = data.slice(3);
          checked = checked.replace(/[^0-9]/g, "");
          setData({ ...temporaryData, vat: `GB ${checked}` });
        }
        break;
      case "phone":
        if (data.length <= 13) {
          if (data === "+4") {
            setData({ ...temporaryData, phone: "+44" });
            break;
          }
          let checked = data.slice(3);
          checked = checked.replace(/[^0-9]/g, "");
          setData({ ...temporaryData, phone: `+44${checked}` });
        }
        break;
      default:
        break;
    }
  };
  const deleteSite = id => {
    
    let a = temporaryData.sites.filter(item => item._id !== id);
    let b = sites.filter(item => item._id !== id);
    setData({ ...temporaryData, sites: a });
    setSites(b);

    axios.delete('http://localhost:3001/site/delete', { 
      headers: {
        authorization: "Bearer " + localStorage.getItem("token")
      },
      data: {
        _id: id
      }
    })
    .then( res=> console.log('delete site response', res))
    .catch( err => console.log(err))
  };
  const classes = useStyles();

  return (
    <>
      <Grid container direction="row" justify="space-between" classes={{ root: classes.editContainer }}>
        <Typography>{props.actionType === "edit" ? "Edit Client" : "Create Client"}</Typography>
        <Button classes={{ root: classes.button }} onClick={closePage}>
          Back
        </Button>
      </Grid>
      <Grid container direction="column" classes={{ root: classes.editContainer }}>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Company Name</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={companyNameError} title="Please enter Company Name" classes={{ tooltip: classes.errorTooltip }} placement="top">
              <FormControl fullWidth error={companyNameError}>
                <Input
                  value={temporaryData.companyName}
                  placeholder="Torchwood"
                  classes={{ input: classes.input }}
                  onChange={e => {
                    setCompanyNameError(false);
                    setData({ ...temporaryData, companyName: e.target.value });
                  }}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Status</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={statusError} title="Please select Status" classes={{ tooltip: classes.errorTooltip }} placement="top">
              <FormControl fullWidth classes={{ root: classes.inputContainer }} error={statusError}>
                <Select
                  value={temporaryData.status}
                  onChange={e => {
                    setStatusError(false);
                    setData({ ...temporaryData, status: e.target.value });
                  }}
                >
                  <MenuItem value={"active"}>Active</MenuItem>
                  <MenuItem value={"archived"}>Not Active</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Peer</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={peerError} title="Please enter at least 3 symbols" classes={{ tooltip: classes.errorTooltip }} placement="top">
              <FormControl fullWidth error={peerError}>
                <Input
                  value={temporaryData.peer}
                  placeholder="John Smith"
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, "peer")}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>ID</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input
                disabled
                value={temporaryData.id}
                placeholder="TRCHWD"
                classes={{ input: classes.input }}
                onChange={e => setData({ ...temporaryData, id: e.target.value })}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Postal adress 1</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={firstPostError} title="Please enter first Postal adress" classes={{ tooltip: classes.errorTooltip }} placement="top">
              <FormControl fullWidth error={firstPostError}>
                <Input
                  value={temporaryData.firstPost}
                  placeholder="Postal adress 1"
                  classes={{ input: classes.input }}
                  onChange={e => {
                    setFirstPostError(false);
                    setData({ ...temporaryData, firstPost: e.target.value });
                  }}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Postal adress 2</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={secondPostError} title="Please enter second Postal adress" classes={{ tooltip: classes.errorTooltip }} placement="top">
              <FormControl fullWidth error={secondPostError}>
                <Input
                  value={temporaryData.secondPost}
                  placeholder="Postal adress 2"
                  classes={{ input: classes.input }}
                  onChange={e => {
                    setSecondPostError(false);
                    setData({ ...temporaryData, secondPost: e.target.value });
                  }}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>City</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input
                value={temporaryData.city}
                placeholder='City'
                classes={{ input: classes.input }}
                onChange={e => setData({ ...temporaryData, city: e.target.value })}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Zip Code</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input
                value={temporaryData.zipCode}
                placeholder='Zip Code'
                classes={{ input: classes.input }}
                onChange={e => setData({ ...temporaryData, zipCode: e.target.value })}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Uniq Taxpayer Reference</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={utrError} title="Please enter valit UTR" classes={{ tooltip: classes.errorTooltip }} placement="top">
              <FormControl fullWidth error={utrError}>
                <Input
                  value={temporaryData.utr}
                  placeholder="12345 67890"
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, "utr")}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>VAT Number</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={vatError} title="Please provide a valid VAT" classes={{ tooltip: classes.errorTooltip }} placement="top">
              <FormControl fullWidth error={vatError}>
                <Input
                  value={temporaryData.vat}
                  placeholder="GB 123456789"
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, "vat")}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>CIS</Typography>
          </Grid>
          <Grid item xs={9}>
            <Switch checked={temporaryData.cis} onChange={setData.bind(null, { ...temporaryData, cis: !temporaryData.cis })} />
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Phone Number</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={phoneError} title="Please provide a valid phone number" classes={{ tooltip: classes.errorTooltip }} placement="top">
              <FormControl fullWidth error={phoneError}>
                <Input
                  value={temporaryData.phone}
                  placeholder="+44"
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, "phone")}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Email</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={emailError} title="Please provide a valid Email" classes={{ tooltip: classes.errorTooltip }} placement="top">
              <FormControl fullWidth error={emailError}>
                <Input
                  value={temporaryData.email}
                  placeholder="user@mail.com"
                  classes={{ input: classes.input }}
                  onChange={e => {
                    setEmailError(false);
                    setData({ ...temporaryData, email: e.target.value });
                  }}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Preferred communication channel</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={commChannelError} title="Please select communication channel" classes={{ tooltip: classes.errorTooltip }} placement="top">
              <FormControl fullWidth classes={{ root: classes.inputContainer }} error={commChannelError}>
                <Select
                  placeholder="Choose preferred communication channel"
                  value={temporaryData.communicationChannel}
                  onChange={e => setData({ ...temporaryData, communicationChannel: e.target.value })}
                >
                  <MenuItem value={"whatsapp"}>WhatsApp</MenuItem>
                  <MenuItem value={"viber"}>Viber</MenuItem>
                  <MenuItem value={"telegram"}>Telegram</MenuItem>
                  <MenuItem value={"email"}>Email</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>

                  {/* =========SITE FORM=========== */}

        <Grid container direction="row" classes={{ root: classes.inputContainer }}  style={{ margin: '20px 0 5px' }}>
          <Grid item xs={3}>
            <Typography>Sites</Typography>
          </Grid>
          <Grid item xs={8}>
            <Tooltip open={sitesError} title="Please add at least one Site" classes={{ tooltip: classes.errorTooltip }} placement="top">
              <FormControl fullWidth error={sitesError}>
                <Input value={newSiteName} placeholder="Site Name" classes={{ input: classes.input }} onChange={e => setSiteName(e.target.value)} />
              </FormControl>
            </Tooltip>
          </Grid>
          
          <Grid item xs={1}>
            <Button
              onClick={async (e) => {
                e.preventDefault()
                let a = await createSite({ 
                  siteName: newSiteName, 
                  companyName: temporaryData.companyName ,
                  address1: temporaryData.siteAddress1,
                  address2: temporaryData.siteAddress2,
                  city: temporaryData.siteCity,
                  zipCode: temporaryData.siteZipCode
                
                });
                setData({ ...temporaryData, sites: [...temporaryData.sites, { 
                    _id: a.data._id, 
                    siteName: a.data.siteName,
                    address1:  a.data.address2,
                    address2:  a.data.address1,
                    city:  a.data.city,
                    zipCode:  a.data.zipCode
                }] });
                setSites([...sites, a.data]);
              }}
            >
              Create
            </Button>
          </Grid>

          <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Postal adress 1</Typography>
          </Grid>
          <Grid item xs={9}>
              <FormControl fullWidth>
                <Input
                  value={temporaryData.siteAddress1}
                  placeholder="Postal adress 1"
                  classes={{ input: classes.input }}
                  onChange={e => {
                    setFirstPostError(false);
                    setData({ ...temporaryData, siteAddress1: e.target.value });
                  }}
                />
              </FormControl>
          </Grid>
        </Grid>
        <Grid container direction="row" classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Postal adress 2</Typography>
          </Grid>
          <Grid item xs={9}>
              <FormControl fullWidth >
                <Input
                  value={temporaryData.siteAddress2}
                  placeholder="Postal adress 2"
                  classes={{ input: classes.input }}
                  onChange={e => {
                    setSecondPostError(false);
                    setData({ ...temporaryData, siteAddress2: e.target.value });
                  }}
                />
              </FormControl>
          </Grid>
        </Grid>

        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>City</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input
                value={temporaryData.siteCity}
                placeholder='City'
                classes={{ input: classes.input }}
                onChange={e => setData({ ...temporaryData, siteCity: e.target.value })}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Zip Code</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input
                value={temporaryData.siteZipCode}
                placeholder='Zip Code'
                classes={{ input: classes.input }}
                onChange={e => setData({ ...temporaryData, siteZipCode: e.target.value })}
              />
            </FormControl>
          </Grid>
        </Grid>

        </Grid>


        <Grid container style={{ margin: '20px 0' }}>
          <Grid item xs={3} />
          <Grid item xs={9}>
            <SitesTable sites={temporaryData.sites} deleteSite={deleteSite} />
          </Grid>
        </Grid>
        <Grid container justify="space-around">
          <Button
            classes={{ root: classes.button }}
            disabled={pending}
            onClick={async () => {
              validation();
            }}
          >
            SAVE
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default EditCreate;
