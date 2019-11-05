import io from 'socket.io-client';
import React from 'react';
import {
  ListGroup,
  Alert,
  InputGroup,
  FormControl,
  Button,
  Form,
  Modal
} from 'react-bootstrap';
import Board from './Board';

class GameOnline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFindingOpponent: false,
      wantDraw: false,
      wantReturn: false,
      yourOpponent: null,
      listMessage: [
        // {
        //   isYourMessage: true,
        //   content: 'hello'
        // },
        // {
        //   isYourMessage: false,
        //   content: 'hi'
        // },
      ]
    };
    this.socket = null;
    this.socket = io('localhost:3000');
  }

  componentDidMount() {
    const { toggleYourTurn, addWin } = this.props;
    this.socket.on('get-your-opponent', data => {
      this.setState({
        isFindingOpponent: false,
        yourOpponent: data
      });
      if (!data.firstTurn) {
        toggleYourTurn();
      }
    });
    this.socket.on('get-your-opponent-check', data => {
      this.handleClick(data, true);
    });
    this.socket.on('get-opponent-message', data => {
      this.handleGetMessage(data);
    });
    this.socket.on('get-request-match-draw', () => {
      this.setState({
        wantDraw: true
      });
    });

    this.socket.on('get-accept-match-draw', () => {
      addWin({
        winner: 'Match Draw'
      });
    });

    this.socket.on('opponent-abandon', () => {
      this.handleOpponentAbandon();
    });

    this.socket.on('get-request-return', () => {
      this.setState({
        wantReturn: true
      });
    });

    this.socket.on('get-accept-return', () => {
      this.handleGetAcceptReturn();
    });
  }

  handlePlayAgain = () => {
    const {
      changeAllHistory,
      changeStepNumber,
      addWin,
      chooseMove,
      setYourTurn
    } = this.props;
    changeAllHistory([
      {
        squares: Array(400).fill(null),
        type: null,
        pos: -1
      }
    ]);
    changeStepNumber(0);
    addWin(null);
    chooseMove(-1);
    setYourTurn(true);
    this.setState({
      isFindingOpponent: false,
      yourOpponent: null
    });
  };

  handleFindComponent = () => {
    const { user } = this.props;
    this.socket.emit('find-opponent', user.name);
    this.setState({
      isFindingOpponent: true
    });
  };

  handleSendChat = e => {
    e.preventDefault();
    const { yourOpponent, listMessage } = this.state;
    if (yourOpponent) {
      const message = e.target.formGroupMessage.value;
      this.socket.emit('send-message', {
        opponentId: yourOpponent.id,
        message
      });
      this.setState({
        listMessage: [
          ...listMessage,
          {
            isYourMessage: true,
            content: message
          }
        ]
      });
    }
    e.target.formGroupMessage.value = '';
  };

  handleAbandon = () => {
    const { yourOpponent } = this.state;
    const { addWin } = this.props;
    if (yourOpponent) {
      this.socket.emit('send-abandon', yourOpponent.id);
      addWin({
        winner: 'You Abandon, You Lose :(((('
      });
    }
  };

  handleOpponentAbandon = () => {
    const { addWin } = this.props;
    addWin({
      winner: 'Your Opponent Abandon, You Win ^-^'
    });
  };

  ModalMatchDraw = props => {
    return (
      <>
        <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Thông báo</Modal.Title>
          </Modal.Header>
          <Modal.Body>Đối thủ muốn cầu hoà, bạn có đồng ý không</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={props.denyMatchDraw}>
              Không đồng ý
            </Button>
            <Button variant="success" onClick={props.acceptMatchDraw}>
              Đồng ý
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  ModalReturn = props => {
    return (
      <>
        <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Thông báo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Đối thủ muốn xin đánh lại nước vừa rồi, bạn có đồng ý không
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={props.denyReturn}>
              Không đồng ý
            </Button>
            <Button variant="success" onClick={props.acceptReturn}>
              Đồng ý
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  closeModal = () => {
    this.setState({
      wantDraw: false
    });
  };

  closeModalReturn = () => {
    this.setState({
      wantReturn: false
    });
  };

  handleRequestReturn = () => {
    const { yourOpponent } = this.state;
    if (yourOpponent) {
      this.socket.emit('request-return', yourOpponent.id);
    }
  };

  handleRequestMatchDraw = () => {
    const { yourOpponent } = this.state;
    if (yourOpponent) {
      this.socket.emit('request-match-draw', yourOpponent.id);
    }
  };

  acceptMatchDraw = () => {
    const { yourOpponent } = this.state;
    this.socket.emit('accept-match-draw', yourOpponent.id);
    const { addWin } = this.props;
    addWin({
      winner: 'Match Draw'
    });
    this.closeModal();
  };

  denyMatchDraw = () => {
    this.closeModal();
  };

  acceptReturn = () => {
    const { changeStepNumber, stepNumber, setYourTurn } = this.props;
    const { yourOpponent } = this.state;
    changeStepNumber(stepNumber - 1);
    setYourTurn(false);
    this.socket.emit('accept-return', yourOpponent.id);
    this.closeModalReturn();
  };

  handleGetAcceptReturn = () => {
    const { changeStepNumber, stepNumber, setYourTurn } = this.props;
    changeStepNumber(stepNumber - 1);
    setYourTurn(true);
  };

  denyReturn = () => {
    this.closeModalReturn();
  };

  handleGetMessage(data) {
    const { listMessage } = this.state;
    this.setState({
      listMessage: [
        ...listMessage,
        {
          isYourMessage: false,
          content: data
        }
      ]
    });
  }

  renderChat = () => {
    const { listMessage, yourOpponent } = this.state;
    const { user } = this.props;
    if (yourOpponent) {
      const renderChat = listMessage.map(message => {
        if (message.isYourMessage) {
          return (
            <div className="chat-box chat-box-r w100 fl">
              <div className="tc fr">
                <div className="tc vb chat-txt">
                  <div className="txt-r txt-id">{user.name}</div>
                  <div className="bubble-r">{message.content}</div>
                </div>
                <div className="tc vt" style={{ paddingRight: '10px' }} />
              </div>
            </div>
          );
        }
        return (
          <div className="chat-box chat-box-l  w100 fl">
            <div className="tc">
              <div className="tc vt" />
              <div className="tc vt chat-txt">
                <div className="txt-id">{yourOpponent.name}</div>
                <div className="bubble-l">{message.content}</div>
              </div>
            </div>
          </div>
        );
      });
      return renderChat;
    }
    return null;
  };

  handleClick(i, opponentCheck = false) {
    const {
      winner,
      yourTurn,
      stepNumber,
      changeAllHistory,
      addCheck,
      changeStepNumber,
      chooseMove,
      addWin,
      addWasWin,
      toggleYourTurn
    } = this.props;
    const { yourOpponent } = this.state;
    let { history } = this.props;
    const initLength = history.length;
    history = history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (!opponentCheck) {
      // player check
      if (!yourOpponent || squares[i] || winner || !yourTurn) {
        return;
      }
      squares[i] = 'X';
    } else {
      if (winner || yourTurn) {
        return;
      }
      squares[i] = 'O';
    }
    const checkWin = this.calculateWinner(squares, i);
    if (stepNumber < initLength - 1) {
      changeAllHistory(history);
    }
    addCheck(squares, squares[i], i);
    changeStepNumber(history.length);
    chooseMove(-1);
    if (checkWin) {
      if (checkWin.winner === 'X') {
        checkWin.winner = 'You Win ^-^';
      } else {
        checkWin.winner = 'You Lose :((';
      }
      addWin(checkWin);
      addWasWin(checkWin);
    } else {
      addWasWin(null);
      toggleYourTurn();
    }
    if (!opponentCheck) {
      this.socket.emit('send-check', {
        position: i,
        // eslint-disable-next-line react/destructuring-assignment
        opponentId: this.state.yourOpponent.id
      });
    }
  }

  calculateWinner(squares, lastNode) {
    return (
      this.checkNgang(squares, lastNode) ||
      this.checkDoc(squares, lastNode) ||
      this.checkCheoChinh(squares, lastNode) ||
      this.checkCheoPhu(squares, lastNode)
    );
  }

  // eslint-disable-next-line class-methods-use-this
  checkNgang(squares, lastNode) {
    const hang = parseInt(lastNode / 20, 10);
    const cot = lastNode % 20;
    let count = 0;
    let chanTrai = false;
    let chanPhai = false;
    const posWin = [lastNode];
    // check Trái
    for (let i = cot - 1; i >= 0; i -= 1) {
      if (squares[hang * 20 + i] === squares[lastNode]) {
        count += 1;
        posWin.push(hang * 20 + i);
      } else if (squares[hang * 20 + i] !== null) {
        chanTrai = true;
        break;
      } else {
        break;
      }
    }

    // check Phải
    for (let i = cot + 1; i <= 19; i += 1) {
      if (squares[hang * 20 + i] === squares[lastNode]) {
        count += 1;
        posWin.push(hang * 20 + i);
      } else if (squares[hang * 20 + i] !== null) {
        chanPhai = true;
        break;
      } else {
        break;
      }
    }
    if (count >= 4 && (!chanTrai || !chanPhai)) {
      return {
        winner: squares[lastNode],
        posWin
      };
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  checkDoc(squares, lastNode) {
    const hang = parseInt(lastNode / 20, 10);
    const cot = lastNode % 20;
    let count = 0;
    let chanTren = false;
    const chanDuoi = false;
    const posWin = [lastNode];
    // check Trên
    for (let i = hang + 1; i <= 19; i += 1) {
      if (squares[i * 20 + cot] === squares[lastNode]) {
        count += 1;
        posWin.push(i * 20 + cot);
      } else if (squares[i * 20 + cot] !== null) {
        chanTren = true;
        break;
      } else {
        break;
      }
    }
    // check Dưới
    for (let i = hang - 1; i >= 0; i -= 1) {
      if (squares[i * 20 + cot] === squares[lastNode]) {
        count += 1;
        posWin.push(i * 20 + cot);
      } else if (squares[i * 20 + cot] !== null) {
        chanTren = true;
        break;
      } else {
        break;
      }
    }
    if (count >= 4 && (!chanTren || !chanDuoi)) {
      return {
        winner: squares[lastNode],
        posWin
      };
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  checkCheoChinh(squares, lastNode) {
    const hang = parseInt(lastNode / 20, 10);
    let cot = lastNode % 20;
    let count = 0;
    let chanTren = false;
    let chanDuoi = false;
    const posWin = [lastNode];
    // check dưới
    for (let temp = hang - 1; temp >= 0; temp -= 1) {
      cot -= 1;
      if (squares[temp * 20 + cot] === squares[lastNode]) {
        count += 1;
        posWin.push(temp * 20 + cot);
      } else if (squares[temp * 20 + cot] !== null) {
        chanDuoi = true;
        cot = lastNode % 20;
        break;
      } else {
        cot = lastNode % 20;
        break;
      }
    }

    // check trên
    for (let temp = hang + 1; temp <= 20; temp += 1) {
      cot += 1;
      if (squares[temp * 20 + cot] === squares[lastNode]) {
        count += 1;
        posWin.push(temp * 20 + cot);
      } else if (squares[temp * 20 + cot] != null) {
        chanTren = true;
        cot = lastNode % 20;
        break;
      } else {
        cot = lastNode % 20;
        break;
      }
    }

    if (count >= 4 && (!chanTren || !chanDuoi)) {
      return {
        winner: squares[lastNode],
        posWin
      };
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  checkCheoPhu(squares, lastNode) {
    const hang = parseInt(lastNode / 20, 10);
    let cot = lastNode % 20;
    let count = 0;
    let chanTren = false;
    let chanDuoi = false;
    const posWin = [lastNode];
    // check dưới
    for (let temp = hang - 1; temp >= 0; temp -= 1) {
      cot += 1;
      if (squares[temp * 20 + cot] === squares[lastNode]) {
        count += 1;
        posWin.push(temp * 20 + cot);
      } else if (squares[temp * 20 + cot] != null) {
        chanDuoi = true;
        cot = lastNode % 20;
        break;
      } else {
        cot = lastNode % 20;
        break;
      }
    }
    // check trên
    for (let temp = hang + 1; temp <= 20; temp += 1) {
      cot -= 1;
      if (squares[temp * 20 + cot] === squares[lastNode]) {
        count += 1;
        posWin.push(temp * 20 + cot);
      } else if (squares[temp * 20 + cot] != null) {
        chanTren = true;
        cot = lastNode % 20;
        break;
      } else {
        cot = lastNode % 20;
        break;
      }
    }
    if (count >= 4 && (!chanTren || !chanDuoi)) {
      return {
        winner: squares[lastNode],
        posWin
      };
    }
    return null;
  }

  renderPlayAgain = () => {
    const { winner } = this.props;
    if (winner) {
      return (
        <button
          type="button"
          className="btn btn-danger"
          onClick={this.handlePlayAgain}
        >
          Play Again
        </button>
      );
    }
    return null;
  };

  render() {
    const {
      history,
      stepNumber,
      winner,
      yourTurn,
      moveChoose,
      sortMovesAsc
    } = this.props;
    const { yourOpponent } = this.state;
    const current = history[stepNumber];
    let status;
    if (!yourOpponent) {
      status = 'Chưa kết nối';
    } else if (winner) {
      status = ` ${winner.winner}, Click play again to play new game with another opponent `;
    } else {
      status = ` ${yourTurn ? 'Your Turn' : 'Opponent Turn'}`;
    }

    const moves = history.map((move, idx) => {
      const desc = idx
        ? `move ${idx} -- ${move.type} check in (${Math.floor(move.pos / 20) +
            1}, ${(move.pos % 20) + 1}) `
        : 'game start';
      const fontWeight = moveChoose === idx ? 'bold' : 'normal';
      return (
        <ListGroup.Item variant="primary" style={{ fontWeight }}>
          {desc}
        </ListGroup.Item>
      );
    });
    if (!sortMovesAsc) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            posWin={winner ? winner.posWin : null}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <Alert style={{ marginTop: '10px' }} variant="info">
            {status}
          </Alert>
          <button
            type="button"
            style={{ margin: '10px' }}
            className="btn btn-primary"
            // eslint-disable-next-line react/destructuring-assignment
            disabled={this.state.isFindingOpponent || this.state.yourOpponent}
            onClick={this.handleFindComponent}
          >
            Tìm Đối Thủ
          </button>
          <button
            type="button"
            className="btn btn-primary"
            // eslint-disable-next-line react/destructuring-assignment
            disabled={this.props.winner}
            onClick={() => this.handleAbandon()}
          >
            Đầu hàng
          </button>
          <button
            type="button"
            style={{ margin: '10px' }}
            // eslint-disable-next-line react/destructuring-assignment
            disabled={this.props.winner}
            className="btn btn-primary"
            onClick={() => this.handleRequestMatchDraw()}
          >
            Cầu hoà
          </button>
          <button
            type="button"
            className="btn btn-primary"
            // eslint-disable-next-line react/destructuring-assignment
            disabled={this.props.yourTurn}
            onClick={() => this.handleRequestReturn()}
          >
            Xin đánh lại
          </button>
          {/* eslint-disable-next-line react/destructuring-assignment */}
          <this.ModalMatchDraw
            // eslint-disable-next-line react/destructuring-assignment
            show={this.state.wantDraw}
            acceptMatchDraw={() => this.acceptMatchDraw()}
            denyMatchDraw={() => this.denyMatchDraw()}
          />
          {/* eslint-disable-next-line react/destructuring-assignment */}
          <this.ModalReturn
            // eslint-disable-next-line react/destructuring-assignment
            show={this.state.wantReturn}
            acceptReturn={() => this.acceptReturn()}
            denyReturn={() => this.denyReturn()}
          />
          <br />
          <ListGroup>{moves}</ListGroup>
          <br />
          {this.renderPlayAgain()}
        </div>
        <div className="box-chat">
          <div className="container">
            {/* chat area */}
            <div className="body chat-area">{this.renderChat()}</div>
            {/* chat area // */}
            <div>
              <Form onSubmit={e => this.handleSendChat(e)}>
                <InputGroup className="mb-3">
                  {/* eslint-disable-next-line no-return-assign */}
                  <FormControl id="formGroupMessage" placeholder="Message" />
                  <InputGroup.Append>
                    <Button variant="outline-primary" type="submit">
                      Gửi
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default GameOnline;
