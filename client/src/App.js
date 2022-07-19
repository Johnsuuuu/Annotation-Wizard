import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import PrivateRoute from './components/private-route/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import AddTaskPage from './components/dashboard/addTask/AddTaskPage';
import PublishedTaskPage from './components/dashboard/PublishedTaskPage';
import TaskTakenPage from './components/dashboard/TaskTakenPage';
import AnnotatePage from './components/annotate/AnnotatePage';

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = './login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Switch>
              <Route exact path="/" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/dashboard/create-task"
                component={AddTaskPage}
              />
              <PrivateRoute
                exact
                path="/dashboard/my-published-tasks"
                component={PublishedTaskPage}
              />
              <PrivateRoute
                exact
                path="/dashboard/my-taken-tasks"
                component={TaskTakenPage}
              />
              <PrivateRoute
                exact
                path="/annotate/:userId/:taskId"
                component={AnnotatePage}
              />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
