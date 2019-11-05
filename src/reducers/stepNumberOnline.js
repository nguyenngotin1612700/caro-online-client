const initialState = 0;

const stepNumberOnline = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_STEPNUMBER_ONLINE':
      return action.payload.stepNumber;
    default:
      return state;
  }
};
export default stepNumberOnline;
