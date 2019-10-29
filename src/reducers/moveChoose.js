const initialState = -1;

const moveChoose = (state = initialState, action) => {
  switch (action.type) {
    case 'CHOOSE_MOVE':
      return action.payload.step;
    default:
      return state;
  }
};
export default moveChoose;
