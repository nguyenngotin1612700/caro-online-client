import React, { useState } from 'react';
import { connect } from 'react-redux';
import fetch from 'cross-fetch';
import { Form, Button, Alert } from 'react-bootstrap';
import { receiveUser } from '../actions';

class Profile extends React.Component {
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
    const { user, saveNewUser } = this.props;
    this.setState({
      isLoading: true,
      alert: 'default'
    });
    const name = e.target.formGroupName.value;
    const phone = e.target.formGroupPhoneNumber.value;
    const gender = e.target.formGroupGender.value;
    let check = true;
    fetch('http://localhost:3000/users/changeProfile', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },

      body: JSON.stringify({
        name,
        phone,
        gender
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
          saveNewUser(response);
        }
      });
  };

  renderChangeProfile = () => {
    const { isLoading } = this.state;
    if (!isLoading) {
      return (
        <Button variant="primary" type="submit">
          Save
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
          <p>You can change your profile if you want</p>
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
          <Alert.Heading>Change profile Successfully</Alert.Heading>
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
    const { user } = this.props;
    return (
      <div className="container">
        <br />
        {this.rederAlert()}
        <Form onSubmit={e => this.handleSubmit(e)}>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder={user.email} disabled />
          </Form.Group>
          <Form.Group controlId="formGroupName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder={user.name} />
          </Form.Group>
          <Form.Group controlId="formGroupPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" placeholder={user.phone} />
          </Form.Group>
          <Form.Group controlId="formGroupGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control type="text" placeholder={user.gender} />
          </Form.Group>
          {this.renderChangeProfile()}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  saveNewUser: user => dispatch(receiveUser(user))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
