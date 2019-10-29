import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Card } from 'react-bootstrap';
import Carousel from '../components/Carousel';

class Home extends React.Component {
  renderSidebar = () => {
    const { user } = this.props;
    if (user.name) {
      return (
        <div className="col-sm-4 bg-white">
          <div className="row">
            <div className="col-sm-6">
              <Card>
                <Card.Img variant="top" src="bot.png" />
                <Card.Body>
                  <Button variant="outline-primary" block>
                    <Link to="/playwithbot">Play With Bot</Link>
                  </Button>
                </Card.Body>
              </Card>
            </div>
            <div className="col-sm-6">
              <Card>
                <Card.Img variant="top" src="hacker.png" />
                <Card.Body>
                  <Button variant="outline-primary" block>
                    <Link to="/playwithcomponent">Play With Components</Link>
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div className="">
        <div className="row">
          <div className="col-sm-8">
            <Carousel />
          </div>
          {this.renderSidebar()}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Home);
