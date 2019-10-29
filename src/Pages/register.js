import React, { useState } from 'react';
import fetch from 'cross-fetch';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      alert: 'default',
      message: ''
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      isLoading: true,
      alert: 'default'
    });
    const name = e.target.formGroupName.value;
    const email = e.target.formGroupEmail.value;
    const password = e.target.formGroupPassword.value;
    let check = true;
    fetch('https://api-jwt-1612700.herokuapp.com/users/register', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        email,
        name,
        password
      })
    })
      .then(response => {
        if (response.status !== 200) {
          check = false;
        }
        return response.json();
      })
      .then(response => {
        if (!check) {
          this.setState({
            alert: 'failed',
            isLoading: false,
            message: response.message
          });
        } else {
          this.setState({
            alert: 'success',
            isLoading: false
          });
        }
      });
  };

  renderRegister = () => {
    const { isLoading } = this.state;
    if (!isLoading) {
      return (
        <Button variant="primary" type="submit">
          Register
        </Button>
      );
    }
    return (
      <Button variant="primary" type="submit" disabled>
        Registering...
      </Button>
    );
  };

  rederAlert = () => {
    const { alert } = this.state;
    if (alert === 'default') {
      return <this.AlertDefault />;
    }
    if (alert === 'success') {
      return <this.AlertRegisterSuccess />;
    }
    return <this.AlertRegisterFailed />;
  };

  AlertDefault = () => {
    const [show] = useState(true);

    if (show) {
      return (
        <Alert variant="primary">
          <Alert.Heading>Hey, nice to see you</Alert.Heading>
          <p>
            Please fill all of fields to register your account and enjoy the
            game.
          </p>
        </Alert>
      );
    }
    return null;
  };

  AlertRegisterSuccess = () => {
    const [show] = useState(true);

    if (show) {
      return (
        <Alert variant="success">
          <Alert.Heading>Register Successfully</Alert.Heading>
          You can login here <Link to="/login">Login</Link>
        </Alert>
      );
    }
    return null;
  };

  AlertRegisterFailed = () => {
    const [show] = useState(true);
    const { message } = this.state;

    if (show) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>{message};</p>
        </Alert>
      );
    }
    return null;
  };

  render() {
    return (
      <div className="container">
        <br />
        {/* <Alert variant="success">
          <Alert.Heading>Hey, nice to see you</Alert.Heading>
          <p>
            Please fill all of fields to register your account and enjoy the game.
          </p>
          <hr />
        </Alert> */}
        {this.rederAlert()}
        <Form onSubmit={e => this.handleSubmit(e)}>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group controlId="formGroupName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Your Name" />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          {this.renderRegister()}
        </Form>
      </div>
    );
  }
}

export default Register;
