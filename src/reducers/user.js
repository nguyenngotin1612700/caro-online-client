const user = (state = {}, action) => {
  switch (action.type) {
    case 'RECEIVE_USER':
      return action.payload.user;
    case 'LOGIN_FAILED':
      return { message: action.payload.message };
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
};
export default user;
