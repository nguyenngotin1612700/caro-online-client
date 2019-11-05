const initialState = null;

const winnerOnline = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_WINNER_ONLINE':
      return action.payload.winner;
    default:
      return state;
  }
};
export default winnerOnline;
