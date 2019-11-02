// eslint-disable-next-line import/no-unresolved
import io from 'socket.io-client';
import React from 'react';
import { ListGroup, Alert } from 'react-bootstrap';
import Board from './Board';
import { toggleYourTurn } from '../actions';

class GameOnline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFindingOpponent: false,
      yourOpponent: null
    };
    this.socket = null;
  }

  //   handlePlayAgain = () => {
  //     const {
  //       changeAllHistory,
  //       changeStepNumber,
  //       addWin,
  //       addWasWin,
  //       setSortMoveAsc,
  //       chooseMove,
  //       setYourTurn
  //     } = this.props;
  //     changeAllHistory([
  //       {
  //         squares: Array(400).fill(null),
  //         type: null,
  //         pos: -1
  //       }
  //     ]);
  //     changeStepNumber(0);
  //     addWin(null);
  //     addWasWin(null);
  //     setSortMoveAsc();
  //     chooseMove(-1);
  //     setYourTurn(true);
  //   };

  // handleSortMove = () => {
  //     const { toggleSortMove } = this.props;
  //     toggleSortMove();
  // };

  handleFindComponent = () => {
    const { user, toggleYourTurn } = this.props;
    this.socket = io('localhost:3000');
    this.socket.emit('find-opponent', user.name);
    this.setState({
      isFindingOpponent: true
    });

    this.socket.on('get-your-opponent', data => {
      console.log('------', data);
      this.setState({
        isFindingOpponent: false,
        yourOpponent: data
      });
      if (!data.firstTurn) {
        console.log('mmmmm');
        toggleYourTurn();
      }
    });
    this.socket.on('get-your-opponent-check', data => {
      console.log('-xx----', data);
      this.handleClick(data, true);
    });
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
    let { history } = this.props;
    const initLength = history.length;
    history = history.slice(0, stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (!opponentCheck) {
      // player check
      if (squares[i] || winner || !yourTurn) {
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

  render() {
    const {
      history,
      stepNumber,
      winner,
      yourTurn,
      moveChoose,
      sortMovesAsc
    } = this.props;
    const current = history[stepNumber];
    let status;
    if (winner) {
      status = ` ${winner.winner}, Click play again to continues `;
    } else {
      status = ` ${
        yourTurn ? 'Your Turn' : 'Bot Turn, click "Bot Play" to active the bot'
      }`;
    }
    const moves = history.map((move, idx) => {
      const desc = idx
        ? `go to move ${idx} -- ${move.type} check in (${Math.floor(
            move.pos / 20
          ) + 1}, ${(move.pos % 20) + 1}) `
        : 'go to game start';
      const fontWeight = moveChoose === idx ? 'bold' : 'normal';
      return (
        <ListGroup.Item
          variant="primary"
          style={{ fontWeight }}
          onClick={() => this.jumpTo(idx)}
        >
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
          <Alert variant="info">{status}</Alert>
          <button
            type="button"
            style={{ margin: '10px' }}
            className="btn btn-primary"
            disabled={this.state.isFindingOpponent || this.state.yourOpponent}
            onClick={this.handleFindComponent}
          >
            Tìm Đối Thủ
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.handleClick(-1)}
          >
            Bot Play
          </button>
          <br />
          <ListGroup>{moves}</ListGroup>
          <br />
          <button
            type="button"
            className="btn btn-danger"
            onClick={this.handlePlayAgain}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }
}
export default GameOnline;
