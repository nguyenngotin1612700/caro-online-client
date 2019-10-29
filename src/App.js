import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import './index.css';
import configStore from './configStore';
import NavBar from './components/NavBar';
import MyRouter from './components/Router';

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
              <NavBar />
              {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
              <MyRouter />
            </Provider>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
