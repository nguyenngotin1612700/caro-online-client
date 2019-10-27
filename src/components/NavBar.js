import React from 'react';
import { BrowserRouter as Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';

export default () => {
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
