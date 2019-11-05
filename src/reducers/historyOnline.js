const initialState = [
  {
    squares: Array(400).fill(null),
    type: null,
    pos: -1
  }
];
const historyOnline = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CHECK_ONLINE':
      return [
        ...state,
        {
          squares: action.payload.squares,
          type: action.payload.type,
          pos: action.payload.position
        }
      ];
    case 'CHANGE_HISTORY_ONLINE':
      return action.payload.history;
    default:
      return state;
  }
};

export default historyOnline;
