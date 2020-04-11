import React from 'react';
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import AgentSourcer from '../../components/AgentSourcer/';
import Client from '../../components/Client/';
import Worker from '../../components/Worker/';
import { Drawer, Button, Divider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

// const useStyles = makeStyles();

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offsetData: { offsetTop: window.pageYOffset, visible: true },
      currentPage: null,
      drawer: false
    };
  }
  // const [offsetData, setOffsetData] = useState();
  // const [currentPage, setCurrentPage] = useState(null);
  // const [drawer, isDrawerOpened] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  scrollHandler = () => {
    const { offsetTop } = this.state.offsetData;
    const currentOffsetTop = window.pageYOffset;

    const visible = offsetTop > currentOffsetTop;
    this.setState({ offsetData: { offsetTop: currentOffsetTop, visible: visible } });
  };
  changePage = page => {
    this.setState({ currentPage: page, drawer: false });
  };
  componentDidMount() {
    let token = localStorage.getItem('token');
    let role = localStorage.getItem('role');
    if (!!token === false || !!role === false) {
      this.props.history.push('/');
    }
    window.addEventListener('scroll', this.scrollHandler);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler);
  }
  // useEffect(() => {
  //   let token = localStorage.getItem('token');
  //   let role = localStorage.getItem('role');
  //   if (!!token === false || !!role === false) {
  //     props.history.push('/');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  // useEffect(() => {
  //   window.addEventListener('scroll', scrollHandler);
  //   return () => {
  //     window.removeEventListener('scroll', scrollHandler);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  render() {
    const styles = {
      navbarButtons: {
        cursor: 'pointer',
        margin: 10
      },
      currentPage: {
        marginLeft: '20px',
        fontWeight: 500
      }
    };
    return (
      <>
        <AppBar
          // classes={{ root: classes.navbar }}
          style={
            this.state.offsetData.visible
              ? { transition: '0.5s', backgroundColor: 'orange' }
              : { transform: 'translateY(-110%)', transition: '0.5s', backgroundColor: 'orange' }
          }
        >
          <Toolbar>
            <MenuIcon style={{ cursor: 'pointer' }} onClick={() => this.setState({ drawer: true })} />
            <Typography
              style={styles.currentPage}
              // classes={{ root: classes.currentPage }}
            >
              {this.state.currentPage}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer open={this.state.drawer}>
          <Grid container direction='column' justify='space-around'>
            <Button
              style={styles.navbarButtons}
              // classes={{ root: classes.navbarButtons }}
              onClick={() => this.setState({ drawer: false })}
            >
              Close
            </Button>
            <Divider />
            {localStorage.getItem('role') === 'superuser' ? (
              <>
                <Typography
                  style={styles.navbarButtons}
                  // classes={{ root: classes.navbarButtons }}
                  onClick={() => this.changePage('Agent/Sourcer')}
                >
                  Agent Sourcer
                </Typography>
                <Divider />
              </>
            ) : null}
            {localStorage.getItem('role') === 'superuser' || localStorage.getItem('role') === 'agent' ? (
              <>
                <Typography
                  style={styles.navbarButtons}
                  // classes={{ root: classes.navbarButtons }}
                  onClick={() => this.changePage('Client')}
                >
                  Client
                </Typography>
              </>
            ) : null}
            <Divider />
            <Divider />
            {localStorage.getItem('role') === 'superuser' ||
            localStorage.getItem('role') === 'agent' ||
            localStorage.getItem('role') === 'sourcer' ? (
              <>
                <Typography
                  style={styles.navbarButtons}
                  // classes={{ root: classes.navbarButtons }}
                  onClick={() => this.changePage('Worker')}
                >
                  Worker
                </Typography>
                <Divider />
              </>
            ) : null}
            <Typography
              style={styles.navbarButtons}
              // classes={{ root: classes.navbarButtons }}
            >
              <Link to='/weekly-statement'>Weekly Statements</Link>
            </Typography>
            <Divider />
          </Grid>
        </Drawer>
        <Grid style={{ background: '#eeeeee', minHeight: '100vh', paddingTop: '100px' }}>
          <Paper style={{ margin: '0 auto', height: '100%', width: '90%' }}>
            {this.state.currentPage === 'Agent/Sourcer' && <AgentSourcer />}
            {this.state.currentPage === 'Client' && <Client />}
            {this.state.currentPage === 'Worker' && <Worker />}
          </Paper>
        </Grid>
      </>
    );
  }
}

export default Dashboard;
