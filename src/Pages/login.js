import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { requestLogin } from '../actions';

class Login extends React.Component {
  handleSubmit = e => {
    const { login } = this.props;
    e.preventDefault();
    const email = e.target.formGroupEmail.value;
    const password = e.target.formGroupPassword.value;
    login(email, password);
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
        <this.AlertDismissibleExample />
        <Form onSubmit={e => this.handleSubmit(e)}>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </div>
    );
  };
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  login: (email, password) => dispatch(requestLogin(email, password))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
