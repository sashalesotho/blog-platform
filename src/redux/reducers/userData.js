import { LOG_OUT, USER_RECEIVED } from '../actions';

const userState = {
  isFetch: false,
};

const userData = (state = userState, action = 'ACTION') => {
  const { type, newUserData, update } = action;
  switch (type) {
    case USER_RECEIVED:
      return {
        isFetch: true,
        username: newUserData.username,
        email: newUserData.email,
        token: newUserData.token,
        image: newUserData.image,
        update,
      };
    case LOG_OUT:
      return {
        isFetch: false,
      };
    default:
      return state;
  }
};

export default userData;
