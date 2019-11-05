const initialState = true;

const yourTurnOnline = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_YOURTURN_ONLINE':
      return !state;
    case 'SET_YOURTURN_ONLINE':
      return action.payload.yourTurn;
    default:
      return state;
  }
};
export default yourTurnOnline;
