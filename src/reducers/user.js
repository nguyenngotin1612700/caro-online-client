const user = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_USER':
      return action.payload.user;
    default:
      return state;
  }
};
export default user;
