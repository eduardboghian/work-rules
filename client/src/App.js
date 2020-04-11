import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import SignIn from './pages/SignIn/';
import Dashboard from './pages/Dashboard/';
import AgentSourcer from './components/AgentSourcer';
import Client from './components/Client';
import Worker from './components/Worker';
import WeeklyStatemnt from './components/WeeklyStatements';


const history = createBrowserHistory();

function App() {
  return (
    <Router>
    {console.log(localStorage.getItem('token'))}
        <Route exact path='/' component={localStorage.getItem('token')!== null && localStorage.getItem('token')!== undefined ? Dashboard : SignIn} />
        <Route exact path='/agent-sourcer' component={AgentSourcer}/>
        <Route exact path='/client' component={Client} />
        <Route exact path='/worker' component={Worker}/>
        <Route exact path='/weekly-statement' component={WeeklyStatemnt} />
    </Router>
  );
}

export default App;
