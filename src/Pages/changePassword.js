import React, { useState } from 'react';
import { connect } from 'react-redux';
import fetch from 'cross-fetch';
import { Form, Button, Alert } from 'react-bootstrap';

class ChangePassword extends React.Component {
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
    const { user } = this.props;
    this.setState({
      isLoading: true,
      alert: 'default'
    });
    const currentPassword = e.target.formGroupCurrentPassword.value;
    const newPassword = e.target.formGroupNewPassword.value;
    const confirmPassword = e.target.formGroupConfirmPassword.value;
    let check = true;
    fetch('http://localhost:3000/users/changePassword', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },

      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword
      })
    })
      .then(response => {
        // console.log('xxxxxx', response);
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

  renderChangePassword = () => {
    const { isLoading } = this.state;
    if (!isLoading) {
      return (
        <Button variant="primary" type="submit">
          Change Password
        </Button>
      );
    }
    return (
      <Button variant="primary" type="submit" disabled>
        Waiting...
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
          <p>You can change your password if you want</p>
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
          <Alert.Heading>Change password Successfully</Alert.Heading>
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
          <Form.Group controlId="formGroupCurrentPassword">
            <Form.Label>Current Password</Form.Label>
            <Form.Control type="password" placeholder="Enter current pasword" />
          </Form.Group>
          <Form.Group controlId="formGroupNewPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" placeholder="Enter new password" />
          </Form.Group>
          <Form.Group controlId="formGroupConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Confirm password" />
          </Form.Group>
          {this.renderChangePassword()}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(ChangePassword);
