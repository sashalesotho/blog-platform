import { combineReducers } from 'redux';
import pageData from './pageData';
import userData from './userData';

const reducer = combineReducers({
  pageData,
  userData,
});

export default reducer;
