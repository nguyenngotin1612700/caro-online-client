const initialState = null;

const winner = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_WINNER':
      return action.payload.winner;
    default:
      return state;
  }
};
export default winner;
