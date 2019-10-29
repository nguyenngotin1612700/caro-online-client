import fetch from 'cross-fetch';

export const addCheck = (squares, type, position) => ({
  type: 'ADD_CHECK',
  payload: {
    squares,
    type,
    position
  }
});

export const changeAllHistory = history => ({
  type: 'CHANGE_HISTORY',
  payload: {
    history
  }
});

export const changeStepNumber = stepNumber => ({
  type: 'CHANGE_STEPNUMBER',
  payload: {
    stepNumber
  }
});

export const addWin = winner => ({
  type: 'ADD_WINNER',
  payload: {
    winner
  }
});

export const addWasWin = wasWin => ({
  type: 'ADD_WAS_WIN',
  payload: {
    wasWin
  }
});

export const toggleSortMove = () => ({
  type: 'TOGGLE_MOVE_SORT',
  payload: {}
});

export const setSortMoveAsc = () => ({
  type: 'SET_SORT_MOVE_ASC',
  payload: {}
});

export const chooseMove = step => ({
  type: 'CHOOSE_MOVE',
  payload: {
    step
  }
});

export const toggleXIsNext = () => ({
  type: 'TOGGLE_XISNEXT',
  payload: {}
});

export const setXIsNext = xIsNext => ({
  type: 'SET_XISNEXT',
  payload: {
    xIsNext
  }
});

export const receiveUser = user => ({
  type: 'RECEIVE_USER',
  payload: {
    user
  }
});

export const loginFailed = message => ({
  type: 'LOGIN_FAILED',
  payload: {
    message
  }
});

export const requestLogin = (email, password, cb) => {
  let check = true;
  return dispatch => {
    fetch('https://api-jwt-1612700.herokuapp.com/users/login', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        email,
        password
      })
    })
      .then(response => {
        if (response.status !== 200) {
          check = false;
        }
        return response.json();
      })
      .then(response => {
        // eslint-disable-next-line no-console
        if (check) {
          dispatch(receiveUser(response));
          cb();
        } else {
          dispatch(loginFailed(response.message));
          cb();
        }
      });
  };
};

export const logoutAction = () => ({
  type: 'LOGOUT',
  payload: {}
});
