export const USER_RECEIVED = 'USER_RECEIVED';
export const LOG_OUT = 'LOG_OUT';
export const CHANGE_PAGE = 'CHANGE_PAGE';

export const getUserData = (data, update = true) => ({
  type: USER_RECEIVED,
  newUserData: data,
  update,
});

export const logOut = () => ({
  type: LOG_OUT,
});

export const changePage = (page) => ({
  type: CHANGE_PAGE,
  page,
});
