const initialState = null;

const wasWin = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_WAS_WIN':
      return action.payload.wasWin;
    default:
      return state;
  }
};
export default wasWin;
