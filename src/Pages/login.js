import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { requestLogin } from '../actions';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    };
  }

  handleSubmit = e => {
    const { login } = this.props;
    this.setState({
      isLoading: true
    });
    e.preventDefault();
    const email = e.target.formGroupEmail.value;
    const password = e.target.formGroupPassword.value;
    login(email, password, () => {
      this.setState({
        isLoading: false
      });
    });
  };

  renderLogin = () => {
    const { isLoading } = this.state;
    if (!isLoading) {
      return (
        <Button variant="primary" type="submit">
          Login
        </Button>
      );
    }
    return (
      <Button variant="primary" type="submit" disabled>
        Logining...
      </Button>
    );
  };

  rederAlert = () => {
    const { user } = this.props;
    if (Object.keys(user).length === 0) {
      return <this.AlertDefault />;
    }
    if (Object.keys(user).length === 1) {
      return <this.AlertLoginFailed />;
    }
    return <this.AlertLoginSuccess />;
  };

  AlertDefault = () => {
    const [show] = useState(true);

    if (show) {
      return (
        <Alert variant="primary">
          <Alert.Heading>Hey, nice to see you</Alert.Heading>
          <p>Please fill your account and enjoy the game.</p>
        </Alert>
      );
    }
    return null;
  };

  AlertLoginSuccess = () => {
    const [show] = useState(true);

    if (show) {
      return (
        <Alert variant="success">
          <Alert.Heading>Login Successfully</Alert.Heading>
          Back To Home <Link to="/">HomePage</Link>
        </Alert>
      );
    }
    return null;
  };

  AlertLoginFailed = () => {
    const [show] = useState(true);
    const { user } = this.props;

    if (show) {
      return (
        <Alert variant="danger">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>{user.message};</p>
        </Alert>
      );
    }
    return null;
  };

  AlertDismissibleExample = () => {
    const [show, setShow] = useState(true);

    if (show) {
      return (
        <Alert variant="primary">
          <Alert.Heading>Hey, nice to see you</Alert.Heading>
          <p>Please fill your account and enjoy the game.</p>
        </Alert>
      );
    }
    return <Button onClick={() => setShow(true)}>Show Alert</Button>;
  };

  render = () => {
    return (
      <div className="container">
        <br />
        {this.rederAlert()}
        <Form onSubmit={e => this.handleSubmit(e)}>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          {this.renderLogin()}
        </Form>
      </div>
    );
  };
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  login: (email, password, cb) => dispatch(requestLogin(email, password, cb))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
