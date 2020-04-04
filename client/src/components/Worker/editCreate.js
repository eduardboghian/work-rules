import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Input from '@material-ui/core/Input';

import { getClientData, createWorker } from '../../utils/api';

import { editCreateStyles } from '../../utils/styles';
const useStyles = makeStyles(editCreateStyles);

const EditCreate = props => {
  const [temporaryData, setData] = useState({ ...props.data });
  const [clients, setClientsData] = useState([]);
  const [currentCompany, setCurrentCompany] = useState([]);
  const [sites, setSites] = useState([]);
  const [pending, setPending] = useState(false);
  const [companyNameError, setCompanyNameError] = useState(false);
  const [peerError, setPeerError] = useState(false);
  const [firstnameError, setFirstnameError] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);
  const [firstPostError, setFirstPostError] = useState(false);
  const [utrError, setUtrError] = useState(false);
  const [vatError, setVatError] = useState(false);
  const [ninoError, setNinoError] = useState(false);
  const [crnError, setCrnError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [commChanError, setCommChanError] = useState(false);
  const [companyError, setCompanyError] = useState(false);
  const [siteError, setSiteError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [statusError, setStatusError] = useState(false);

  // LOAD CLIENTS
  useEffect(() => { getClients() }, []);
  const getClients = async () => {
    let a = await getClientData();
    setClientsData(a.data);
    
    console.log('temp data',temporaryData)
    if (!!temporaryData.site.siteName) {
      setCurrentCompany(temporaryData.company.companyName);
      
      if (!!temporaryData.sitesData  ) {
        
        let site = temporaryData.sitesData.find(item => item._id === temporaryData.site._id);
        if(!!site) {
          setData({
            ...temporaryData,
            gotClient: site.gotClient,
            paidWorker: site.paidWorker,
            overtimeGot: site.overtimeGot,
            overtimePaid: site.overtimePaid
          });
        } else if( site.gotClient === '0' ) {
          let site = temporaryData.site
          setData({
            ...temporaryData,
            gotClient: site.gotClient,
            paidWorker: site.paidWorker,
            overtimeGot: site.overtimeGot,
            overtimePaid: site.overtimePaid
          });
        } else {
          setData({
            ...temporaryData,
            gotClient: site.gotClient,
            paidWorker: site.paidWorker,
            overtimeGot: site.overtimeGot,
            overtimePaid: site.overtimePaid
          });
        }
        
      } 

    }
  };

  // LOAD SITES
  useEffect(() => { getCurrentSites() }, [currentCompany]);
  const getCurrentSites = async () => {
    let company = clients.find(client => client.companyName === currentCompany);
    if (!!company) {
      setSites(company.sites);
    }
  };

  useEffect(() => {
    let sum = +temporaryData.gotClient - +temporaryData.paidWorker;
    setData({ ...temporaryData, margin: sum });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temporaryData.gotClient, temporaryData.paidWorker]);
  useEffect(() => {
    let sum = +temporaryData.overtimeGot - +temporaryData.overtimePaid;
    setData({ ...temporaryData, marginOT: sum });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temporaryData.overtimeGot, temporaryData.overtimePaid]);
  

  
  const closePage = () => {
    props.isDialogOpened(false);
    props.setEditData({
      type: 'physical',
      companyName: '',
      peer: '',
      firstname: '',
      lastname: '',
      id: '',
      firstPost: '',
      secondPost: '',
      utr: '',
      vat: 'GB ',
      cis: false,
      nino: '',
      crn: '',
      phone: '+44',
      email: '',
      communicationChannel: '',
      company: {},
      site: {},
      gotClient: '0',
      paidWorker: '0',
      margin: '0',
      overtimeGot: '0',
      overtimePaid: '0',
      marginOT: '0',
      taxPercentage: '',
      category: '',
      status: ''
    });
  };

  // VALIDATION FUNCTION
  const validation = async () => {
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
    if (temporaryData.firstPost.length === 0) {
      setFirstPostError(true);
      let timer = setTimeout(() => setFirstPostError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (temporaryData.utr.length === 0) {
    } else if (/([0-9]{5})\s[0-9]{5}/g.test(temporaryData.utr) === false) {
      setUtrError(true);
      let timer = setTimeout(() => setUtrError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (temporaryData.vat.length === 0) {
      setVatError(true);
      let timer = setTimeout(() => setVatError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
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
    if (/[0-9]{20}/g.test(temporaryData.crn) === false) {
      setCrnError(true);
      let timer = setTimeout(() => setCrnError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (/\+[4][4]([1234567890]{10})/g.test(temporaryData.phone) === false) {
      setPhoneError(true);
      let timer = setTimeout(() => setPhoneError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (
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
    if (temporaryData.communicationChannel.length === 0) {
      setCommChanError(true);
      let timer = setTimeout(() => setCommChanError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (!!temporaryData.company.companyName === false) {
      setCompanyError(true);
      let timer = setTimeout(() => setCompanyError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    if (!!temporaryData.site.siteName === false) {
      setSiteError(true);
      let timer = setTimeout(() => setSiteError(false), 3000);
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
    if (temporaryData.status.length === 0) {
      setStatusError(true);
      let timer = setTimeout(() => setStatusError(false), 3000);
      return () => {
        clearTimeout(timer);
        return false;
      };
    }
    setPending(true);
    await createWorker({ ...temporaryData }, props.actionType);
    await props.update();
    closePage();
  };

  // INPUT HANDLER
  const inputHadnler = (data, fieldName) => {
    let checked;
    switch (fieldName) {
      case 'type':
        if (data) {
          setData({ ...temporaryData, type: 'company' });
        } else {
          setData({ ...temporaryData, type: 'physical' });
        }
        break;
      case 'peer':
      case 'firstname':
      case 'lastname':
        if (data.length <= 50) {
          let checked = data.replace(/[^a-zA-Z\s-]/g, '');
          setData({ ...temporaryData, [fieldName]: checked });
        }
        break;
      case 'utr':
        if (data.length <= 11) {
          let checked = data.replace(/[^0-9\s]/g, '');
          setData({ ...temporaryData, utr: checked });
        }
        break;
      case 'vat':
        if (data.length <= 12) {
          if (data === 'GB') {
            setData({ ...temporaryData, vat: `${data} ` });
            break;
          }
          let checked = data.slice(3);
          checked = checked.replace(/[^0-9]/g, '');
          setData({ ...temporaryData, vat: `GB ${checked}` });
        }
        break;
      case 'nino':
        if (data.length <= 9) {
          if (data.length >= 2) {
            let firstLetters = data.slice(0, 2);
            firstLetters = firstLetters.replace(/[^A-Z]/g, '');
            if (data.length >= 8) {
              let numbers = data.slice(2, 8);
              numbers = numbers.replace(/[^0-9]/g, '');
              if (data.length === 9) {
                let lastLetter = data.slice(8, 9);
                lastLetter = lastLetter.replace(/[^A-Z]/g, '');
                setData({ ...temporaryData, nino: `${firstLetters}${numbers}${lastLetter}` });
                break;
              }
              setData({ ...temporaryData, nino: `${firstLetters}${numbers}` });
              break;
            } else {
              let numbers = data.slice(2, data.length);
              numbers = numbers.replace(/[^0-9]/g, '');
              setData({ ...temporaryData, nino: `${firstLetters}${numbers}` });
              break;
            }
          } else {
            let checked = data.replace(/[^A-Z]/g, '');
            setData({ ...temporaryData, nino: checked });
            break;
          }
        }
        break;
      case 'phone':
        if (data.length <= 13) {
          if (data === '+4') {
            setData({ ...temporaryData, phone: '+44' });
            break;
          }
          let checked = data.slice(3);
          checked = checked.replace(/[^0-9]/g, '');
          setData({ ...temporaryData, phone: `+44${checked}` });
          break;
        }
        break;
      case 'crn':
        if (data.length <= 20) {
          let crn = data.replace(/[^[0-9]/g, '');
          setData({ ...temporaryData, crn: crn });
          break;
        }
        break;
      case 'gotClient':
      case 'paidWorker':
      case 'overtimeGot':
      case 'overtimePaid':
        let check = data.replace(/[^0-9]/g, '');
        if (check.length > 1 && check[0] === '0') {
          check = check.slice(1);
        }
        if (!!temporaryData.site._id) {
          let site = { ...temporaryData.site };
          site[fieldName] = check;
          setData({ ...temporaryData, [fieldName]: check, site: site });
        } else {
          setData({ ...temporaryData, [fieldName]: check });
        }
        break;
      default:
        break;
    }
  };

  // UPDATE SITES ***FIX THIS SHIT***
  const sitesUpdater = newData => {
    
    let site = sites.find(site => site.siteName === newData);
    let sitesData = temporaryData.sitesData.filter(item => item._id !== temporaryData.site._id);
    
    let oldSiteData = temporaryData.sitesData.find(item => item._id === temporaryData.site._id);
    let newSiteData = temporaryData.sitesData.find(item => item._id === site._id);

    if (!!oldSiteData) {
      if (!!newSiteData) {
        setData({
          ...temporaryData,
          sitesData: [
            ...sitesData,
            {
              _id: oldSiteData._id,
              gotClient: temporaryData.gotClient,
              paidWorker: temporaryData.paidWorker,
              overtimeGot: temporaryData.overtimeGot,
              overtimePaid: temporaryData.overtimePaid
            }
          ],
          site: { _id: site._id, siteName: site.siteName },
          gotClient: newSiteData.gotClient,
          paidWorker: newSiteData.paidWorker,
          overtimeGot: newSiteData.overtimeGot,
          overtimePaid: newSiteData.overtimePaid
        });
      } else {
        setData({
          ...temporaryData,
          sitesData: [
            ...sitesData,
            {
              _id: oldSiteData._id,
              gotClient: temporaryData.gotClient,
              paidWorker: temporaryData.paidWorker,
              overtimeGot: temporaryData.overtimeGot,
              overtimePaid: temporaryData.overtimePaid
            }
          ],
          site: { _id: site._id, siteName: site.siteName },
          gotClient: '0',
          paidWorker: '0',
          overtimeGot: '0',
          overtimePaid: '0'
        });
      }
    } else if (!!newSiteData) {
      setData({
        ...temporaryData,
        site: { _id: site._id, siteName: site.siteName },
        gotClient: newSiteData.gotClient,
        paidWorker: newSiteData.paidWorker,
        overtimeGot: newSiteData.overtimeGot,
        overtimePaid: newSiteData.overtimePaid
      });
    } else {
      setData({
        ...temporaryData,
        sitesData: [
          ...sitesData,
          {
            _id: site._id,
            gotClient: '0',
            paidWorker: '0',
            overtimeGot: '0',
            overtimePaid: '0'
          }
        ],
        site: { _id: site._id, siteName: site.siteName },
        gotClient: '0',
        paidWorker: '0',
        overtimeGot: '0',
        overtimePaid: '0'
      });
    }
  };

  const classes = useStyles();
  return (
    <>
      <Grid container direction='row' justify='space-between' classes={{ root: classes.editContainer }}>
        <Typography>{props.actionType === 'edit' ? 'Edit Worker' : 'Create Worker'}</Typography>
        <Button classes={{ root: classes.button }} onClick={closePage}>
          Back
        </Button>
      </Grid>
      <Grid container direction='column' classes={{ root: classes.editContainer }}>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Type</Typography>
          </Grid>
          <Grid item xs={9} container direction='row' style={{ marginTop: '-7px' }}>
            <Typography>Physical person</Typography>
            <Switch
              classes={{ root: classes.switch }}
              checked={temporaryData.type === 'physical' ? false : true}
              onChange={e => inputHadnler(e.target.checked, 'type')}
            />
            <Typography>Company</Typography>
          </Grid>
        </Grid>
        {temporaryData.type === 'company' ? (
          <>
            <Grid container direction='row' classes={{ root: classes.inputContainer }}>
              <Grid item xs={3}>
                <Typography>Company Name</Typography>
              </Grid>
              <Grid item xs={9}>
                <Tooltip
                  open={companyNameError}
                  title='Company name must contain at least 6 symbols'
                  classes={{ tooltip: classes.errorTooltip }}
                  placement='top'
                >
                  <FormControl fullWidth error={companyNameError}>
                    <Input
                      value={temporaryData.companyName}
                      placeholder='Torchwood'
                      classes={{ input: classes.input }}
                      onChange={e => {
                        setData({ ...temporaryData, companyName: e.target.value });
                      }}
                    />
                  </FormControl>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container direction='row' classes={{ root: classes.inputContainer }}>
              <Grid item xs={3}>
                <Typography>Peer</Typography>
              </Grid>
              <Grid item xs={9}>
                <Tooltip open={peerError} title='Please enter at least 3 symbols' classes={{ tooltip: classes.errorTooltip }} placement='top'>
                  <FormControl fullWidth error={peerError}>
                    <Input
                      value={temporaryData.peer}
                      placeholder='John Smith'
                      classes={{ input: classes.input }}
                      onChange={e => inputHadnler(e.target.value, 'peer')}
                      disabled={temporaryData.type === 'physical' ? true : false}
                    />
                  </FormControl>
                </Tooltip>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            <Grid container direction='row' classes={{ root: classes.inputContainer }}>
              <Grid item xs={3}>
                <Typography>Firstname</Typography>
              </Grid>
              <Grid item xs={9}>
                <Tooltip
                  open={firstnameError}
                  title='Firstname should be at least 3 symbols length'
                  classes={{ tooltip: classes.errorTooltip }}
                  placement='top'
                >
                  <FormControl fullWidth error={firstnameError}>
                    <Input
                      value={temporaryData.firstname}
                      placeholder='John'
                      classes={{ input: classes.input }}
                      onChange={e => inputHadnler(e.target.value, 'firstname')}
                    />
                  </FormControl>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container direction='row' classes={{ root: classes.inputContainer }}>
              <Grid item xs={3}>
                <Typography>Lastname</Typography>
              </Grid>
              <Grid item xs={9}>
                <Tooltip
                  open={lastnameError}
                  title='Lastname should be at least 3 symbols length'
                  classes={{ tooltip: classes.errorTooltip }}
                  placement='top'
                >
                  <FormControl fullWidth error={lastnameError}>
                    <Input
                      value={temporaryData.lastname}
                      placeholder='Smith'
                      classes={{ input: classes.input }}
                      onChange={e => inputHadnler(e.target.value, 'lastname')}
                    />
                  </FormControl>
                </Tooltip>
              </Grid>
            </Grid>
          </>
        )}
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Postal adress 1</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={firstPostError} title='Please provide Postal adress' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl fullWidth error={firstPostError}>
                <Input
                  value={temporaryData.firstPost}
                  placeholder='Postal adress 1'
                  classes={{ input: classes.input }}
                  onChange={e => setData({ ...temporaryData, firstPost: e.target.value })}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Postal adress 2</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input
                value={temporaryData.secondPost}
                placeholder='Postal adress 2'
                classes={{ input: classes.input }}
                onChange={e => setData({ ...temporaryData, secondPost: e.target.value })}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>ID</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input disabled value={temporaryData.id} placeholder='TRCHWD' classes={{ input: classes.input }} />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>VAT Number</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={vatError} title='Please provide valid VAT Number' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl fullWidth error={vatError}>
                <Input
                  value={temporaryData.vat}
                  placeholder='GB 123456789'
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, 'vat')}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Uniq Taxpayer Reference</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={utrError} title='Please provide valid UTR' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl fullWidth error={utrError}>
                <Input
                  value={temporaryData.utr}
                  placeholder='12345 67890'
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, 'utr')}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>CIS</Typography>
          </Grid>
          <Grid item xs={9}>
            <Switch checked={temporaryData.cis} onChange={setData.bind(null, { ...temporaryData, cis: !temporaryData.cis })} />
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>NINO</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={ninoError} title='Please provide valid NINO' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl fullWidth error={ninoError}>
                <Input
                  value={temporaryData.nino}
                  placeholder='QQ123456C'
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, 'nino')}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>CRN</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={crnError} title='Please provide valid CRN' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl fullWidth error={crnError}>
                <Input value={temporaryData.crn} classes={{ input: classes.input }} onChange={e => inputHadnler(e.target.value, 'crn')} />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Phone Number</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={phoneError} title='Please provide valid Phone Number' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl fullWidth error={phoneError}>
                <Input
                  value={temporaryData.phone}
                  placeholder='+44'
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, 'phone')}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Email</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={emailError} title='Please provide valid Email' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl fullWidth error={emailError}>
                <Input
                  value={temporaryData.email}
                  placeholder='user@mail.com'
                  classes={{ input: classes.input }}
                  onChange={e => setData({ ...temporaryData, email: e.target.value })}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Preferred communication channel</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={commChanError} title='Please select communication channel' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl fullWidth classes={{ root: classes.inputContainer }} error={commChanError}>
                <Select
                  placeholder='Choose preferred communication channel'
                  value={temporaryData.communicationChannel}
                  onChange={e => setData({ ...temporaryData, communicationChannel: e.target.value })}
                >
                  <MenuItem value={'whatsapp'}>WhatsApp</MenuItem>
                  <MenuItem value={'viber'}>Viber</MenuItem>
                  <MenuItem value={'telegram'}>Telegram</MenuItem>
                  <MenuItem value={'email'}>Email</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>

        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Working for Company</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={companyError} title='Please select Company' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl fullWidth classes={{ root: classes.inputContainer }}>
                <Select
                  placeholder='Choose company working for'
                  value={!!temporaryData.company.companyName ? temporaryData.company.companyName : ''}
                  onChange={e => {
                    let client = clients.find(client => client.companyName === e.target.value);
                    setData({ ...temporaryData, company: { id: client._id, companyName: client.companyName } });
                    setCurrentCompany(e.target.value);
                  }}
                >
                  {clients.map(client => (
                    <MenuItem value={client.companyName}>{client.companyName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>

          <Grid item xs={3}>
            <Typography>Site Name</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={siteError} title='Please select Site' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl fullWidth classes={{ root: classes.inputContainer }}>
                <Select
                  value={!!temporaryData.site.siteName ? temporaryData.site.siteName : ''}
                  onChange={e => {
                    sitesUpdater(e.target.value);
                  }}
                  disabled={sites.length === 0 ? true : false}
                >
                  {sites.map(site => (
                    <MenuItem value={site.siteName}>{site.siteName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Hourly Rate got Client</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input
                value={temporaryData.gotClient}
                placeholder='Set hourly rate'
                classes={{ input: classes.input }}
                onChange={e => inputHadnler(e.target.value, 'gotClient')}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Hourly Rate paid to Worker</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input
                value={temporaryData.paidWorker}
                placeholder='Set hourly rate'
                classes={{ input: classes.input }}
                onChange={e => inputHadnler(e.target.value, 'paidWorker')}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Margin</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input value={temporaryData.margin} classes={{ input: classes.input }} disabled />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Hourly Rate Overtime got</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input
                value={temporaryData.overtimeGot}
                placeholder='Set hourly rate'
                classes={{ input: classes.input }}
                onChange={e => inputHadnler(e.target.value, 'overtimeGot')}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Hourly Rate Overtime Paid</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input
                value={temporaryData.overtimePaid}
                placeholder='Set hourly rate'
                classes={{ input: classes.input }}
                onChange={e => inputHadnler(e.target.value, 'overtimePaid')}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Margin OT</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth>
              <Input value={temporaryData.marginOT} classes={{ input: classes.input }} disabled />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Percentage Tax paid</Typography>
          </Grid>
          <Grid item xs={9}>
            <FormControl fullWidth classes={{ root: classes.inputContainer }}>
              <Select
                placeholder='Choose percentage tax paid '
                value={temporaryData.taxPercentage}
                onChange={e => setData({ ...temporaryData, taxPercentage: e.target.value })}
              >
                <MenuItem value={'nino'}>with NINO 30%</MenuItem>
                <MenuItem value={'utr+cis'}>(UTR+CIS) 20%</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Category</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={categoryError} title='Please select status' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl fullWidth classes={{ root: classes.inputContainer }}>
                <Select
                  placeholder='Choose percentage tax paid '
                  value={temporaryData.category}
                  onChange={e => setData({ ...temporaryData, category: e.target.value })}
                >
                  <MenuItem value={'General Labourer'}>General Labourer</MenuItem>
                  <MenuItem value={'Skilled Labourer'}>Skilled Labourer</MenuItem>
                  <MenuItem value={'Demolition Labourer'}>Demolition Labourer</MenuItem>
                  <MenuItem value={'CCDO Labourer'}>CCDO Labourer</MenuItem>
                  <MenuItem value={'Basic Groundworker'}>Basic Groundworker</MenuItem>
                  <MenuItem value={'Skilled Groundworker'}>Skilled Groundworker</MenuItem>
                  <MenuItem value={'Shuttering Carpenter'}>Shuttering Carpenter</MenuItem>
                  <MenuItem value={'Striker'}>Striker</MenuItem>
                  <MenuItem value={'Steel Fixer'}>Steel Fixer</MenuItem>
                  <MenuItem value={'Nip Hand'}>Nip Hand</MenuItem>
                  <MenuItem value={'Painter'}>Painter</MenuItem>
                  <MenuItem value={'1st Fix Carpenter'}>1st Fix Carpenter</MenuItem>
                  <MenuItem value={'2nd Fix Carpenter'}>2nd Fix Carpenter</MenuItem>
                  <MenuItem value={'Tiler'}>Tiler</MenuItem>
                  <MenuItem value={'Dry Liner/Ceiling Fixer'}>Dry Liner/Ceiling Fixer</MenuItem>
                  <MenuItem value={'Handyman'}>Handyman</MenuItem>
                  <MenuItem value={'Plasterer'}>Plasterer</MenuItem>
                  <MenuItem value={'Bricklayer'}>Bricklayer</MenuItem>
                  <MenuItem value={'Scaffolder Part1'}>Scaffolder Part1</MenuItem>
                  <MenuItem value={'Scaffolder Part2'}>Scaffolder Part2</MenuItem>
                  <MenuItem value={'Scaffolder Adv'}>Scaffolder Adv</MenuItem>
                  <MenuItem value={'360 Excavator'}>360 Excavator</MenuItem>
                  <MenuItem value={'Forklift Telehandler'}>Forklift Telehandler</MenuItem>
                  <MenuItem value={'FTD/Forward Tipping Dumper'}>FTD/Forward Tipping Dumper</MenuItem>
                  <MenuItem value={'Slinger Banksman'}>Slinger Banksman</MenuItem>
                  <MenuItem value={'Crane Supervisor'}>Crane Supervisor</MenuItem>
                  <MenuItem value={'Crane Opertor'}>Crane Opertor</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction='row' classes={{ root: classes.inputContainer }}>
          <Grid item xs={3}>
            <Typography>Status</Typography>
          </Grid>
          <Grid item xs={9}>
            <Tooltip open={statusError} title='Please select status' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl fullWidth classes={{ root: classes.inputContainer }} error={statusError}>
                <Select value={temporaryData.status} onChange={e => setData({ ...temporaryData, status: e.target.value })}>
                  <MenuItem value={'active'}>Active</MenuItem>
                  <MenuItem value={'archived'}>Not Active</MenuItem>
                </Select>
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container justify='space-around'>
          <Button
            style={{ marginTop: '20px' }}
            classes={{ root: classes.button }}
            disabled={pending}
            onClick={async () => {
              if (!!temporaryData.site.siteName) {
                sitesUpdater(temporaryData.site.siteName);
              }
              validation();
              setPending(false);
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