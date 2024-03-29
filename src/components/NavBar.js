import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { logoutAction } from '../actions';

// eslint-disable-next-line react/prefer-stateless-function
class NavBar extends React.Component {
  handleLogout = () => {
    const { logout } = this.props;
    logout();
  };

  render() {
    const { user } = this.props;
    if (Object.keys(user).length <= 1) {
      return (
        <Navbar bg="dark" variant="primary">
          <Navbar.Brand href="#home">
            <Link to="/">Home</Link>
          </Navbar.Brand>
          <Nav className="mr-auto" />
          <Nav>
            <Nav.Link>
              <Link to="/register">Register</Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/login">Login</Link>
            </Nav.Link>
          </Nav>
        </Navbar>
      );
    }
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          {' '}
          <Link to="/">Home</Link>
        </Navbar.Brand>
        <Nav className="mr-auto" />
        <Nav>
          <NavDropdown
            title={`Hello ${user.name}, have a good game ^-^`}
            id="collasible-nav-dropdown"
          >
            <NavDropdown.Item></NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              <Link to="/profile">Thông tin cá nhân</Link>
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">
              <Link to="/changePassword">Đối mật khẩu</Link>
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link>
            <Button onClick={() => this.handleLogout()}>Logout</Button>
          </Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logoutAction())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);
