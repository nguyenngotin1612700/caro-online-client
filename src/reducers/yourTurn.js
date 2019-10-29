const initialState = true;

const yourTurn = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_YOURTURN':
      return !state;
    case 'SET_YOURTURN':
      return action.payload.yourTurn;
    default:
      return state;
  }
};
export default yourTurn;
