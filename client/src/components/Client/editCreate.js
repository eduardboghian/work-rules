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
import './style.css'

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
  const [firstnameError, setFirstnameError] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);
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
  const [clientId, setCliId] = useState('')
  const [categoryError, setCategoryError] = useState(false);
  const [ninoError, setNinoError] = useState(false);
  const [newSite, setNewSite] = useState({})
  const [editCreateSiteButton, setSiteButton] = useState('Save New Site')

  useEffect(() => {
    findSites();
    setNewSite({ ...newSite, companyName: temporaryData.companyName })
  }, [props]);


  useEffect(() => {
    setCliId( props.companyId )
  }, [props])

  const findSites = async () => {
    setSites(props.data.sites);
  };

  const closePage = () => {
    props.isDialogOpened(false);
    props.setEditData({
      companyName: "",
      peer: '',
      name: '',
      lastName: '',
      firstPost: "",
      secondPost: "",
      city: '',
      zipCode: '',
      utr: "",
      vat: "GB ",
      cis: '',
      phone: "+44",
      phoneSncd: '+44',
      comment: '',
      companyComment: '',
      email: "",
      communicationChannel: "",
      sites: [],
      status: ""
    });
  };

  const validation = async () => {
    setPending(true);
    await createClient({ ...temporaryData }, props.actionType);
    props.update();
    closePage();
    window.location.reload()
  }

  const validation2 = async () => {
    if (temporaryData.type === 'physical') {
      if (temporaryData.firstname.length < 3) {
        setFirstnameError(true);
        let timer = setTimeout(() => setFirstnameError(false), 3000);
        return () => {
          clearTimeout(timer);
          return false;
        };
      }
      if (temporaryData.lastname.length < 3) {
        setLastnameError(true);
        let timer = setTimeout(() => setLastnameError(false), 3000);
        return () => {
          clearTimeout(timer);
          return false;
        };
      }
    } else if (temporaryData.type === 'company') {
      if (temporaryData.companyName.length < 6) {
        setCompanyNameError(true);
        let timer = setTimeout(() => setCompanyNameError(false), 3000);
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
    }

    if (temporaryData.utr.length === 0) {
    } else if (/[0-9]{10}/g.test(temporaryData.utr) === false) {
      setUtrError(true);
      let timer = setTimeout(() => setUtrError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (temporaryData.vat.length < 4 ) {

    } else if (/([G])([B]\s)([0-9]{9})(\s*)/g.test(temporaryData.vat) === false) {

      setVatError(true);
      let timer = setTimeout(() => setVatError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (temporaryData.nino.length === 0) {
    } else if (/[A-Z][A-Z][0-9]{6}[A-Z]/g.test(temporaryData.nino) === false) {
      setNinoError(true);
      let timer = setTimeout(() => setNinoError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }

    if(temporaryData.phone.length < 4) {}
    else if (/\+[4][4]([1234567890]{10})/g.test(temporaryData.phone) === false) {
      console.log(temporaryData.phone.length)
      setPhoneError(true);
      let timer = setTimeout(() => setPhoneError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }

    if(temporaryData.email.length < 1) {}
    else if (
      /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
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

    if (temporaryData.category.length === 0) {
      setCategoryError(true);
      let timer = setTimeout(() => setCategoryError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }

    setPending(true);
    await createClient({ ...temporaryData }, props.actionType);
    await props.update();
    closePage();
  };

  const inputHadnler = (data, fieldName) => {
    switch (fieldName) {
      case "name":
      case 'lastName':
        if (data.length <= 50) {
          setData({ ...temporaryData, [fieldName]: data });
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
      case "phoneScnd":  
        if (data.length <= 13) {
          if (data === "+4") {
            setData({ ...temporaryData, [fieldName]: "+44" });
            break;
          }
          let checked = data.slice(3);
          checked = checked.replace(/[^0-9]/g, "");
          setData({ ...temporaryData, [fieldName]: `+44${checked}` });
        }
        break;
      default:
        break;
    }
  }

  const deleteSite = id => {
    axios.delete('/client/delete-site', {
      headers: {
        authorization: "Bearer " + localStorage.getItem("token")
      },
      data: {
        siteId: id,
        clientId
      }
    })
    .then( res=> console.log('delete site response', res))
    .catch( err => console.log(err))

    axios.put('site/update-status', {
      id,
      value: 'Not Active'
    })
    .then(res => console.log(res))
    .catch(err => console.error(err))

    let a = temporaryData.sites.filter(item => item._id !== id);
    let b = sites.filter(item => item._id !== id);
    setData({ ...temporaryData, sites: a });
    setSites(b);

  }

  const createNewSite = () => {
    let newList = temporaryData.sites;
    newList.push(newSite)

    setData({ ...temporaryData, sites: newList });
    setSites(newList);
    

    axios.post('/site/add', {
      action: 'create',
      data: newSite
    }, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(res => console.log(sites))
    .catch(err => console.log(err))
  }
  
  const editSite = async (siteId) => {
    console.log(siteId)
    setSiteButton('Save Changes')
    axios.get('/site/get', {
      params: {
        id: siteId
      }
    })
    .then( site => {
      console.log(site.data[0])
      setNewSite(site.data[0]) 
    })
    .catch(err => console.log(err))
  }

  const saveSiteChanges = () => {
    axios.post('/site/add', {
      action: 'edit',
      data: newSite   
    }, {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    .then(res => setNewSite({ }))
    .catch(err => console.log(err))
  }

  const classes = useStyles();

  return (
    <>

        <Grid container justify='space-between' className='client-topbar'>
            <Grid>
              <Typography>Company Name</Typography>
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
            <Grid>
              <Typography>Status</Typography>
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
            <Grid>
              <Button
                className='create-btn'
                disabled={pending}
                onClick={async () => {
                  validation();
                  setPending(false);
                }}
              >
                SAVE
              </Button>
            </Grid>
            <Grid>
              <Button className='create-btn' onClick={closePage}>
                Back
              </Button>
            </Grid>
        </Grid>

        <div className='contact-person'>Contact Person</div>
        <div className='company-address'>Company Address and HMTRC Registration Numers</div>
        <Grid className='content-cl'>

          <div className='content-client'>
            <Grid classes={{ root: classes.inputContainer }}>
                  <Grid>
                    <Typography>First Name</Typography>
                    <Tooltip
                      open={firstnameError}
                      title='Firstname should be at least 3 symbols length'
                      classes={{ tooltip: classes.errorTooltip }}
                      placement='top'
                  >
                    <FormControl  error={firstnameError}>
                      <Input
                        value={temporaryData.name}
                        classes={{ input: classes.input }}
                        onChange={e => inputHadnler(e.target.value, 'name')}
                      />
                    </FormControl>
                  </Tooltip>
                </Grid>
              </Grid>

              <Grid classes={{ root: classes.inputContainer }}>
                <Grid>
                  <Typography>Last Name</Typography>
                  <Tooltip
                    open={lastnameError}
                    title='Lastname should be at least 3 symbols length'
                    classes={{ tooltip: classes.errorTooltip }}
                    placement='top'
                  >
                    <FormControl  error={lastnameError}>
                      <Input
                        value={temporaryData.lastName}
                        classes={{ input: classes.input }}
                        onChange={e => inputHadnler(e.target.value, 'lastName')}
                      />
                    </FormControl>
                  </Tooltip>
                </Grid>
              </Grid>

              <Grid classes={{ root: classes.inputContainer }}>
                <Grid>
                <Typography>Mobile Phone Number</Typography>
                  <Tooltip open={phoneError} title='Please provide valid Phone Number' classes={{ tooltip: classes.errorTooltip }} placement='top'>
                    <FormControl  error={phoneError}>
                      <Input
                        value={temporaryData.phone}
                        classes={{ input: classes.input }}
                        onChange={e => inputHadnler(e.target.value, 'phone')}
                      />
                    </FormControl>
                  </Tooltip>
                </Grid>
              </Grid>

              <Grid classes={{ root: classes.inputContainer }}>
                <Grid>
                <Typography>Alternative Phone Number</Typography>
                  <Tooltip open={phoneError} title='Please provide valid Phone Number' classes={{ tooltip: classes.errorTooltip }} placement='top'>
                    <FormControl  error={phoneError}>
                      <Input
                        value={temporaryData.phone2}
                        classes={{ input: classes.input }}
                        onChange={e => inputHadnler(e.target.value, 'phone2')}
                      />
                    </FormControl>
                  </Tooltip>
                </Grid>
              </Grid>

              <Grid classes={{ root: classes.inputContainer }}>
                <Grid>
                  <Typography>Email</Typography>
                  <Tooltip open={emailError} title='Please provide valid Email' classes={{ tooltip: classes.errorTooltip }} placement='top'>
                    <FormControl  error={emailError}>
                      <Input
                        value={temporaryData.email}
                        classes={{ input: classes.input }}
                        onChange={e => setData({ ...temporaryData, email: e.target.value })}
                      />
                    </FormControl>
                  </Tooltip>
                </Grid>
              </Grid>

              <Grid classes={{ root: classes.inputContainer }}>
                <Grid className='select-wr'>
                <Typography>Preferred Communication Channel</Typography>
                    <FormControl  classes={{ root: classes.inputContainer }} >
                      <Select
                        value={temporaryData.communicationChannel}
                        onChange={e => setData({ ...temporaryData, communicationChannel: e.target.value })}
                      >
                        <MenuItem value={'whatsapp'}>WhatsApp</MenuItem>
                        <MenuItem value={'viber'}>Viber</MenuItem>
                        <MenuItem value={'telegram'}>Telegram</MenuItem>
                        <MenuItem value={'email'}>Email</MenuItem>
                      </Select>
                    </FormControl>
                </Grid>
              </Grid>

              <Grid classes={{ root: classes.inputContainer }} className='comment' >
                <Grid>
                  <Typography>Comment</Typography>
                  <Tooltip title='Please enter a valid commit'>
                    <FormControl>
                      <Input
                        value={temporaryData.comment}
                        classes={{ input: classes.input }}
                        onChange={e => setData({ ...temporaryData, comment: e.target.value })}
                      />
                    </FormControl>
                  </Tooltip>
                </Grid>
              </Grid>
          </div>

          <div className='content-info'>
            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
                <Typography>Adress Line 1</Typography>
                <Tooltip open={firstPostError} title="Please enter your first adress line" classes={{ tooltip: classes.errorTooltip }} placement="top">
                  <FormControl fullWidth error={firstPostError}>
                    <Input
                      value={temporaryData.firstPost}
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

            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
                <Typography>Uniq Taxpayer Reference (UTR)</Typography>
                <Tooltip open={utrError} title="Please enter valit UTR" classes={{ tooltip: classes.errorTooltip }} placement="top">
                  <FormControl fullWidth error={utrError}>
                    <Input
                      value={temporaryData.utr}
                      classes={{ input: classes.input }}
                      onChange={e => inputHadnler(e.target.value, "utr")}
                    />
                  </FormControl>
                </Tooltip>
              </Grid>
            </Grid>

            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
                <Typography>Adress Line 2</Typography>
                <Tooltip open={secondPostError} title="Please enter second adress line" classes={{ tooltip: classes.errorTooltip }} placement="top">
                  <FormControl fullWidth error={secondPostError}>
                    <Input
                      value={temporaryData.secondPost}
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

            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
                <Typography>VAT Registration Number</Typography>
                <Tooltip open={vatError} title="Please provide a valid VAT" classes={{ tooltip: classes.errorTooltip }} placement="top">
                  <FormControl fullWidth error={vatError}>
                    <Input
                      value={temporaryData.vat}
                      classes={{ input: classes.input }}
                      onChange={e => inputHadnler(e.target.value, "vat")}
                    />
                  </FormControl>
                </Tooltip>
              </Grid>
            </Grid>

            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
                <Typography>City</Typography>
                <FormControl fullWidth>
                  <Input
                    value={temporaryData.city}
                    classes={{ input: classes.input }}
                    onChange={e => setData({ ...temporaryData, city: e.target.value })}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
                <Typography>CIS Registration Number</Typography>
                <FormControl fullWidth>
                  <Input
                    value={temporaryData.cis}
                    classes={{ input: classes.input }}
                    onChange={e => setData({ ...temporaryData, cis: e.target.value })}
                  />
                </FormControl>      
              </Grid>
            </Grid>

            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
                <Typography>Zip Code</Typography>
                <FormControl fullWidth>
                  <Input
                    value={temporaryData.zipCode}
                    classes={{ input: classes.input }}
                    onChange={e => setData({ ...temporaryData, zipCode: e.target.value })}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid classes={{ root: classes.inputContainer }} className='comment2' >
              <Grid>
                <Typography>Comment</Typography>
                <Tooltip title='Please enter a vaild comment'>
                  <FormControl>
                    <Input
                      value={temporaryData.companyComment}
                      classes={{ input: classes.input }}
                      onChange={e => setData({ ...temporaryData, companyComment: e.target.value })}
                    />
                  </FormControl>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
        </Grid>
                      {/* =========SITE FORM=========== */}

        <Grid className='site-orange'>
          <Grid className='site-nametag'>
            <Typography>Site</Typography>
          </Grid>
          <Grid>
            { editCreateSiteButton === 'Save New Site' ?
              <Button className='save-btn' onClick={async () => {createNewSite()}}>
                Save New Site
              </Button>:

              <Button className='save-btn' onClick={async () => {saveSiteChanges()}}>
                Save Changes
              </Button>
            }
          </Grid>
        </Grid>

        <Grid className='content-site'>
          <div className='site-info'>
          <Grid className='sitename-wr'>
              <Grid>
                <Typography>Site Name</Typography>
                  <FormControl>
                    <Input
                      value={newSite.siteName}
                      classes={{ input: classes.input }}
                      onChange={e => {
                        setNewSite({ ...newSite, siteName: e.target.value });
                      }}
                    />
                  </FormControl>
              </Grid>
            </Grid>

            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
                <Typography>Address Line 1</Typography>
                  <FormControl>
                    <Input
                      value={newSite.address1}
                      classes={{ input: classes.input }}
                      onChange={e => {
                        setFirstPostError(false);
                        setNewSite({ ...newSite, address1: e.target.value });
                      }}
                    />
                  </FormControl>
              </Grid>
            </Grid>

            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
                <Typography>Address Line 2</Typography>
                  <FormControl fullWidth >
                    <Input
                      value={newSite.address2}
                      classes={{ input: classes.input }}
                      onChange={e => {
                        setSecondPostError(false);
                        setNewSite({ ...newSite, address2: e.target.value });
                      }}
                    />
                  </FormControl>
              </Grid>
            </Grid>

            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
                <Typography>City</Typography>
                <FormControl fullWidth>
                  <Input
                    value={newSite.city}
                    classes={{ input: classes.input }}
                    onChange={e => setNewSite({ ...newSite, city: e.target.value })}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
                <Typography>Zip Code</Typography>
                <FormControl fullWidth>
                  <Input
                    value={newSite.zipCode}
                    classes={{ input: classes.input }}
                    onChange={e => setNewSite({ ...newSite, zipCode: e.target.value })}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid classes={{ root: classes.inputContainer }} className='comment' >
              <Grid>
                <Typography>Comment</Typography>
                <Tooltip title='Please enter a vaild comment'>
                  <FormControl>
                    <Input
                      value={newSite.comment}
                      classes={{ input: classes.input }}
                      onChange={e => setNewSite({ ...newSite, comment: e.target.value })}
                    />
                  </FormControl>
                </Tooltip>
              </Grid>
            </Grid>

          </div>


          <div className='sites-table'>
            <Grid className='active-sites'>
              <Grid>
                <SitesTable 
                  sites={temporaryData.sites} 
                  clinetId={clientId} 
                  editSite={editSite} 
                  type={'active'} 
                />
              </Grid>
            </Grid>

            <Grid className='inactive-sites'>
              <Grid>
                <SitesTable 
                  sites={temporaryData.sites} 
                  clinetId={clientId} 
                  deleteSite={deleteSite} 
                  type={'inactive'} 
                />
              </Grid>
            </Grid>
          </div>

      </Grid>

    </>
  );
};

export default EditCreate;
