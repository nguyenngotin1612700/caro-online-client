const initialState = true;

const sortMovesAsc = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_MOVE_SORT':
      return !state;
    case 'SET_SORT_MOVE_ASC':
      return true;
    default:
      return state;
  }
};
export default sortMovesAsc;
