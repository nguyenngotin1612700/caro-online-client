import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import { loadState, saveState } from './localStorage';
import './index.css';
import configStore from './configStore';
import NavBar from './components/NavBar';
import MyRouter from './components/Router';

const persistedState = loadState();
const store = configStore(persistedState);

store.subscribe(() => {
  const state = store.getState();
  const stateNeedSave = {
    user: state.user,
    history: state.history,
    moveChoose: state.moveChoose,
    sortMovesAsc: state.sortMovesAsc,
    stepNumber: state.stepNumber,
    wasWin: state.wasWin,
    winner: state.winner,
    yourTurn: state.yourTurn
  };
  saveState(stateNeedSave);
});

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
