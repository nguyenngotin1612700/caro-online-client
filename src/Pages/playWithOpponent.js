import { connect } from 'react-redux';
import GameOnline from '../components/GameOnline';

import {
  changeAllHistoryOnline,
  addCheckOnline,
  changeStepNumberOnline,
  addWinOnline,
  addWasWin,
  toggleSortMove,
  chooseMove,
  toggleYourTurnOnline,
  setYourTurnOnline,
  setSortMoveAsc
} from '../actions';

const mapStateToProps = state => ({
  history: state.historyOnline,
  user: state.user,
  stepNumber: state.stepNumberOnline,
  yourTurn: state.yourTurnOnline,
  winner: state.winnerOnline,
  wasWin: state.wasWin,
  sortMovesAsc: state.sortMovesAsc,
  moveChoose: state.moveChoose
});

const mapDispatchToProps = dispatch => ({
  changeAllHistory: history => dispatch(changeAllHistoryOnline(history)),
  addCheck: (squares, type, position) =>
    dispatch(addCheckOnline(squares, type, position)),
  changeStepNumber: stepNumber => dispatch(changeStepNumberOnline(stepNumber)),
  addWin: winner => dispatch(addWinOnline(winner)),
  addWasWin: wasWin => dispatch(addWasWin(wasWin)),
  toggleSortMove: () => dispatch(toggleSortMove()),
  setSortMoveAsc: () => dispatch(setSortMoveAsc()),
  chooseMove: step => dispatch(chooseMove(step)),
  toggleYourTurn: () => dispatch(toggleYourTurnOnline()),
  setYourTurn: yourTurn => dispatch(setYourTurnOnline(yourTurn))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameOnline);
