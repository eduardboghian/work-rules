import React from 'react';
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  scrollHandler = () => {
    const { offsetTop } = this.state.offsetData;
    const currentOffsetTop = window.pageYOffset;

    const visible = offsetTop > currentOffsetTop;
    this.setState({ offsetData: { offsetTop: currentOffsetTop, visible: visible } });
  };

  changePage = () => {
    let pageName = window.location.pathname.replace(/\//g, "")
    pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1)
    this.setState({ currentPage: pageName, drawer: false });
  };

  componentDidMount() {
    let token = localStorage.getItem('token');
    let role = localStorage.getItem('role');
    if (!!token === false || !!role === false) {
      this.props.history.push('/');
    }
    this.changePage()
    window.addEventListener('scroll', this.scrollHandler);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  render() {
    const styles = {
      navbarButtons: {
        cursor: 'pointer',
        margin: 10
      },
      currentPage: {
        margin: '0 auto',
        fontWeight: 500,
        fontSize: '22px'
      }
    };
    return (
      <>
        <AppBar
          // classes={{ root: classes.navbar }}
          style={
            { transition: '0.5s', backgroundColor: 'orange', position: 'fixed', top: 0 }
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
                >
                  <Link to='/agent-sourcer'>Agent Sourcer</Link>
                </Typography>
                <Divider />
              </>
            ) : null}
            {localStorage.getItem('role') === 'superuser' || localStorage.getItem('role') === 'agent' ? (
              <>
                <Typography
                  style={styles.navbarButtons}
                // classes={{ root: classes.navbarButtons }}
                >
                  <Link to='/clients'>Client</Link>
                </Typography>
              </>
            ) : null}
            <Divider />
            {localStorage.getItem('role') === 'superuser' ||
              localStorage.getItem('role') === 'agent' ||
              localStorage.getItem('role') === 'sourcer' ? (
                <>
                  <Typography
                    style={styles.navbarButtons}
                  // classes={{ root: classes.navbarButtons }}
                  >
                    <Link to='/workers'>Workers</Link>
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
        <Grid style={{ background: 'white', minHeight: '10vh', paddingTop: '70px' }}>
        </Grid>
        {/* <img src='https://workrules.co.uk/meida/Asset%201@1.5x.png' alt='' className='wallpaper' ></img> */}
      </>
    );
  }
}

export default Dashboard;
