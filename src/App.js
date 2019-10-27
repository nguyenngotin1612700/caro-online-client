import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import './index.css';
import Register from './Pages/register';
import Login from './Pages/login';
import Home from './Pages/home';
import configStore from './configStore';

const store = configStore();

class App extends React.Component {
  renderNavbar = () => {
    return (
      <Navbar bg="dark" variant="primary">
        <Navbar.Brand href="#home">
          <Link to="/">Home</Link>
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link>
            <Link to="/register">Register</Link>
          </Nav.Link>
          <Nav.Link>
            <Link to="/login">Login</Link>
          </Nav.Link>
        </Nav>
      </Navbar>
    );
  };

  render() {
    return (
      <div>
        <Router>
          <div>
            <Provider store={store}>
              {this.renderNavbar()}
              {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}

              <Switch>
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
            </Provider>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
