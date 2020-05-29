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
import axios from 'axios'

import { createWorker } from '../../utils/api';

import { editCreateStyles } from '../../utils/styles';
import './style.css'
import Avatar from '../common/Avatar';

const useStyles = makeStyles(editCreateStyles);

const EditCreate = props => {
  const [temporaryData, setData] = useState({ ...props.data });
  const [pending, setPending] = useState(false);
  const [companyNameError, setCompanyNameError] = useState(false);
  const [peerError, setPeerError] = useState(false);
  const [firstnameError, setFirstnameError] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);
  const [utrError, setUtrError] = useState(false);
  const [vatError, setVatError] = useState(false);
  const [ninoError, setNinoError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [ticket, setTicket] = useState('')
  const [popStyle, setPopStyle] = useState('none')


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
      peer: '',
      firstname: '',
      lastname: '',
      uniqueID: '',
      firstPost: '',
      secondPost: '',
      city: '',
      zipCode: '',
      utr: '',
      vat: ' ',
      nino: '',
      phone: '+44',
      phoneScnd: '+44',
      email: '',
      communicationChannel: '',
      account: '',
      sortCode: '',
      category: '',
      trades: [],
      tickets: [],
      documents: [],
      comment: '',
      status: ''
    });
  };

  // VALIDATION FUNCTION
  const validation = async () => {
    setPending(true);
    await createWorker({ ...temporaryData }, props.actionType);
    await props.update();
    closePage();

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
    await createWorker({ ...temporaryData }, props.actionType);
    await props.update();
    closePage();
  };

  // INPUT HANDLER
  const inputHadnler = (data, fieldName) => {
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
          setData({ ...temporaryData, vat: `${checked}` });
        }
        break;
      case 'nino':
        if (data.length <= 9) {
          setData({...temporaryData, nino: data})
        }
      break;

      case 'phone':
      case 'phoneScnd':   
        if (data.length <= 13) {
          if (data === '+4') {
            setData({ ...temporaryData, [fieldName]: '+44' });
            break;
          }
          let checked = data.slice(3);
          checked = checked.replace(/[^0-9]/g, '');
          setData({ ...temporaryData, [fieldName]: `+44${checked}` });
          break;
        }
        break;;

      case 'account':
      case 'sortCode': 
      case 'city':
      case 'zipCode':
      case 'uniqueID':
        setData({ ...temporaryData, [fieldName]: data })
        break
      default:
        break;
    }
  };

  const deleteTicket = (ticket) => {
      let newTicketsList = temporaryData.tickets
      let index = newTicketsList.indexOf(ticket)
      
     console.log(index, newTicketsList, ticket)

      newTicketsList.splice(index, 1)

      console.log(newTicketsList)
      setData({ ...temporaryData, tickets: newTicketsList })

      setPopStyle('none')
  }

  const deleteDoc = (uid, doc) => {
    axios.post('/worker/delete-document', {
       uid,
       doc
    })
  }

  const classes = useStyles();
  return (
    <>
      {/* ====== TOP BAR ======== */}

      <Grid container justify='space-between' className='worker-topbar'>
        <div className='status-wr'>
          <Grid className={ temporaryData.type === 'company' ? 'company-field' : 'none' }>
            <Typography>Company Name</Typography>
              <Tooltip
                open={companyNameError}
                title='Company name must contain at least 6 symbols'
                classes={{ tooltip: classes.errorTooltip }}
                placement='top'
              >
                <FormControl error={companyNameError}>
                  <Input
                    value={temporaryData.companyName}
                    onChange={e => {
                      setData({ ...temporaryData, companyName: e.target.value });
                    }}
                  />
              </FormControl>
            </Tooltip>
          </Grid>

          <Grid className={ temporaryData.type === 'company' ? 'right' : '' }>
            <Typography>Status</Typography>
            <FormControl classes={{ root: classes.inputContainer }} >
              <Select value={temporaryData.status} onChange={e => setData({ ...temporaryData, status: e.target.value })}>
                <MenuItem value={'active'}>Active</MenuItem>
                <MenuItem value={'archived'}>Not Active</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </div>
        
        <div></div> 

        <Grid className='uid-wr'>
          <Typography>Unique ID</Typography>
          <FormControl  error={firstnameError}>
              <Input
                value={temporaryData.uniqueID}
                classes={{ input: classes.input }}
                onChange={e => inputHadnler(e.target.value, 'uniqueID')}
              />
          </FormControl>
        </Grid>
        
        <Grid className='switcher'>
            <Typography>Person</Typography>
            <Switch
              classes={{ root: classes.switch }}
              checked={temporaryData.type === 'physical' ? false : true}
              onChange={e => inputHadnler(e.target.checked, 'type')}
            />
            <Typography>Company</Typography>
          </Grid>

          <Button className='create-btn' onClick={closePage}>
            Back
          </Button>
      </Grid>

      <Grid className='content-wr' >

        <div className="content-worker">
          <Grid classes={{ root: classes.inputContainer }}>
                <Grid>
                  <Typography>Firstname</Typography>
                  <Tooltip
                    open={firstnameError}
                    title='Firstname should be at least 3 symbols length'
                    classes={{ tooltip: classes.errorTooltip }}
                    placement='top'
                >
                  <FormControl  error={firstnameError}>
                    <Input
                      value={temporaryData.firstname}
                      classes={{ input: classes.input }}
                      onChange={e => inputHadnler(e.target.value, 'firstname')}
                    />
                  </FormControl>
                </Tooltip>
              </Grid>
            </Grid>

            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
                <Typography>Lastname</Typography>
                <Tooltip
                  open={lastnameError}
                  title='Lastname should be at least 3 symbols length'
                  classes={{ tooltip: classes.errorTooltip }}
                  placement='top'
                >
                  <FormControl  error={lastnameError}>
                    <Input
                      value={temporaryData.lastname}
                      classes={{ input: classes.input }}
                      onChange={e => inputHadnler(e.target.value, 'lastname')}
                    />
                  </FormControl>
                </Tooltip>
              </Grid>
            </Grid>

            <Grid classes={{ root: classes.inputContainer }}>
              <Grid>
              <Typography>Phone Number</Typography>
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
                      value={temporaryData.phoneScnd}
                      classes={{ input: classes.input }}
                      onChange={e => inputHadnler(e.target.value, 'phoneScnd')}
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
              <Grid>
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
                <Tooltip open={emailError} title='Please provide valid Email' classes={{ tooltip: classes.errorTooltip }} placement='top'>
                  <FormControl  error={emailError}>
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
            
        <div className="content-info">
        <Grid classes={{ root: classes.inputContainer }}>
          <Grid>
            <Typography>Adress 1</Typography>
              <FormControl  >
                <Input
                  value={temporaryData.firstPost}
                  classes={{ input: classes.input }}
                  onChange={e => setData({ ...temporaryData, firstPost: e.target.value })}
                />
              </FormControl>
          </Grid>
        </Grid>
        
        <Grid classes={{ root: classes.inputContainer }}>
          <Grid>
          <Typography>Uniq Taxpayer Reference</Typography>
            <Tooltip open={utrError} title='Please provide valid UTR' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl  error={utrError}>
                <Input
                  value={temporaryData.utr}
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, 'utr')}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>
        
        <Grid classes={{ root: classes.inputContainer }}>
          <Grid>
          <Typography>Adress 2</Typography>
            <FormControl >
              <Input
                value={temporaryData.secondPost}
                classes={{ input: classes.input }}
                onChange={e => setData({ ...temporaryData, secondPost: e.target.value })}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid classes={{ root: classes.inputContainer }} className={ temporaryData.type === 'company' ? '' : 'none' }>
          <Grid>
          <Typography>VAT Number</Typography>
            <Tooltip open={vatError} title='Please provide valid VAT Number' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl  error={vatError}>
                <Input
                  value={temporaryData.vat}
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, 'vat')}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>


        <Grid classes={{ root: classes.inputContainer }} className={ temporaryData.type === 'company' ? 'none' : '' }>
          <Grid>
          <Typography>NINO</Typography>
            <Tooltip open={ninoError} title='Please provide valid NINO' classes={{ tooltip: classes.errorTooltip }} placement='top'>
              <FormControl  error={ninoError}>
                <Input
                  value={temporaryData.nino}
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, 'nino')}
                />
              </FormControl>
            </Tooltip>
          </Grid>
        </Grid>


        <Grid classes={{ root: classes.inputContainer }}>
          <Grid>
          <Typography>City</Typography>
            <FormControl >
              <Input
                value={temporaryData.city}
                classes={{ input: classes.input }}
                onChange={e => setData({ ...temporaryData, city: e.target.value })}
              />
            </FormControl>
          </Grid>
        </Grid>

          

        {/* ACCOUNT INFORMATION */}

          <Grid classes={{ root: classes.inputContainer }}>
            <Grid>
            <Typography>Account Number</Typography>
              <FormControl >
                <Input
                  value={temporaryData.account}
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, 'account')}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid classes={{ root: classes.inputContainer }}>
            <Grid>
            <Typography>Zip Code</Typography>
              <FormControl >
                <Input
                  value={temporaryData.zipCode}
                  classes={{ input: classes.input }}
                  onChange={e => setData({ ...temporaryData, zipCode: e.target.value })}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid classes={{ root: classes.inputContainer }}>
            <Grid>
            <Typography>Sort Code</Typography>
              <FormControl >
                <Input
                  value={temporaryData.sortCode}
                  classes={{ input: classes.input }}
                  onChange={e => inputHadnler(e.target.value, 'sortCode')}
                />
              </FormControl>
            </Grid>
          </Grid>
        </div>  
      </Grid>  
    


        <Grid className='trades-list'>
          <p>Trade</p>
          <Grid className='trades-wr'>
            {temporaryData.trades.map( (trade, i) => {
              return <div key={i} className='trades-elements'>{trade}</div>
            })}
          </Grid>
        </Grid>
        
        <Grid className='tickets-wr'>
          <Grid >
            <Typography>Add Ticket</Typography>
            <FormControl className='tickets-dropdown'>
            <Select 
              value={ticket} 
              onChange={e => {
                setTicket(e.target.value)
                let newTickets = [...temporaryData.tickets]
                newTickets.push(e.target.value)
                setData({ ...temporaryData, tickets: newTickets })
              }}
            >
                <MenuItem value={'Asbestos'}>Asbestos</MenuItem>
                <MenuItem value={'CPCS BLUE'}>CPCS BLUE</MenuItem>
                <MenuItem value={'CPCS RED'}>CPCS RED</MenuItem>
                <MenuItem value={'CPCS Black'}>CPCS Black</MenuItem>
                <MenuItem value={'CPCS Blue'}>CPCS Blue</MenuItem>
                <MenuItem value={'CPCS Gold'}>CPCS Gold</MenuItem>
                <MenuItem value={'CPCS Green'}>CPCS Green</MenuItem>
                <MenuItem value={'ECS'}>ECS </MenuItem>
                <MenuItem value={'Face Fir'}>Face Fit </MenuItem>
                <MenuItem value={'First Aid'}>First Aid </MenuItem>
                <MenuItem value={'IPAF'}>IPAF </MenuItem>
                <MenuItem value={'JIB'}>JIB </MenuItem>
                <MenuItem value={'NPORS'}>NPORS </MenuItem>
                <MenuItem value={'PASMA'}>PASMA </MenuItem>
                <MenuItem value={'PTS'}>PTS </MenuItem>
                <MenuItem value={'SIA Ticket'}>SIA Ticket </MenuItem>
                <MenuItem value={'SMSTS'}>SMSTS </MenuItem>
                <MenuItem value={'SSSTS'}>SSSTS </MenuItem>
                <MenuItem value={'Traffic Banksman'}>Traffic Banksman </MenuItem>
                <MenuItem value={'Traffic Marshall'}>Traffic Marshall </MenuItem>
              </Select>
            </FormControl>
            <Grid className='tickets-list'>
              {temporaryData.tickets.map((data, i)=> {
                  return <div key={i} className='ticket-wr'>
                      <div className='ticket'> {data} </div>
                      <div className='delete-btn' onClick={ e=> deleteTicket(data) } >X</div> 
                  </div>
              })}
              
          </Grid>
        </Grid>   
      </Grid>
      
      <div className="display-docs">
        <div className='form-wr'>
            <form action={`/worker/upload-document/${temporaryData._id}`} method="post" encType="multipart/form-data">
                <input type="file" name="avatar"  className='tests' />
                <button type='submit' >Send Picture</button>
            </form>
        </div>
        <div className='docs-wr'>
          {temporaryData.documents.map( (data, i) => {
            return <div key={i} style={{position: 'relative'}}>
              <Avatar path={data} />
              <div className='delete-btn' onClick={ e=> { deleteDoc(temporaryData._id, data) } } >X</div> 
            </div>
          })}
        </div>
      </div>

      <Grid container justify='space-around'>
        <Button
          style={{ marginTop: '20px' }}
          classes={{ root: classes.button }}
          disabled={pending}
          onClick={async () => {
            validation();
            setPending(false);
          }}
        >
          SAVE
        </Button>
      </Grid>
    </> 
  );
};

export default EditCreate;

