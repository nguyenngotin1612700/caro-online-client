import { combineReducers } from 'redux';
import user from './user';
import history from './history';
import moveChoose from './moveChoose';
import sortMovesAsc from './sortMovesAsc';
import stepNumber from './stepNumber';
import wasWin from './wasWin';
import winner from './winner';
import yourTurn from './yourTurn';
import historyOnline from './historyOnline';
import stepNumberOnline from './stepNumberOnline';
import winnerOnline from './winnerOnline';
import yourTurnOnline from './yourTurnOnline';

export default combineReducers({
  history,
  moveChoose,
  sortMovesAsc,
  stepNumber,
  wasWin,
  winner,
  yourTurn,
  user,
  historyOnline,
  stepNumberOnline,
  yourTurnOnline,
  winnerOnline
});
