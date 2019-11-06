import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Register from '../Pages/register';
import Login from '../Pages/login';
import Home from '../Pages/home';
import PlayWithBot from '../Pages/playWithBot';
import PlayWithOppoNents from '../Pages/playWithOpponent';
import ChangePassword from '../Pages/changePassword';
import Profile from '../Pages/profile';

// eslint-disable-next-line react/prefer-stateless-function
class MyRouter extends React.Component {
  isAuthenticated = () => {
    const { user } = this.props;
    if (Object.keys(user).length > 1) return true;
    return false;
  };

  PrivateRoute = ({ children }) => {
    return (
      <Route
        render={({ location }) =>
          this.isAuthenticated() ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  };

  render() {
    return (
      <Switch>
        <this.PrivateRoute path="/playwithbot">
          <PlayWithBot />
        </this.PrivateRoute>

        <this.PrivateRoute path="/playwithcomponent">
          <PlayWithOppoNents />
        </this.PrivateRoute>

        <this.PrivateRoute path="/profile">
          <Profile />
        </this.PrivateRoute>

        <this.PrivateRoute path="/changePassword">
          <ChangePassword />
        </this.PrivateRoute>

        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <br />
          <Home />
        </Route>
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(MyRouter);
