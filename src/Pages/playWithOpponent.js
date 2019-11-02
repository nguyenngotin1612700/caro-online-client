import { connect } from 'react-redux';
import GameOnline from '../components/GameOnline';

import {
  changeAllHistory,
  addCheck,
  changeStepNumber,
  addWin,
  addWasWin,
  toggleSortMove,
  chooseMove,
  toggleYourTurn,
  setYourTurn,
  setSortMoveAsc
} from '../actions';

const mapStateToProps = state => ({
  history: state.history,
  user: state.user,
  stepNumber: state.stepNumber,
  yourTurn: state.yourTurn,
  winner: state.winner,
  wasWin: state.wasWin,
  sortMovesAsc: state.sortMovesAsc,
  moveChoose: state.moveChoose
});

const mapDispatchToProps = dispatch => ({
  changeAllHistory: history => dispatch(changeAllHistory(history)),
  addCheck: (squares, type, position) =>
    dispatch(addCheck(squares, type, position)),
  changeStepNumber: stepNumber => dispatch(changeStepNumber(stepNumber)),
  addWin: winner => dispatch(addWin(winner)),
  addWasWin: wasWin => dispatch(addWasWin(wasWin)),
  toggleSortMove: () => dispatch(toggleSortMove()),
  setSortMoveAsc: () => dispatch(setSortMoveAsc()),
  chooseMove: step => dispatch(chooseMove(step)),
  toggleYourTurn: () => dispatch(toggleYourTurn()),
  setYourTurn: yourTurn => dispatch(setYourTurn(yourTurn))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameOnline);
