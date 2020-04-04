import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import SignIn from './pages/SignIn/';
import Dashboard from './pages/Dashboard/';
import WeeklyStatemnt from './components/WeeklyStatements';

const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
        <Route exact path='/' component={SignIn} />
        <Route exact path='/dashboard' component={Dashboard} />
        <Route exact path='/dashboard/weekly-statement' component={WeeklyStatemnt} />
    </Router>
  );
}

export default App;
