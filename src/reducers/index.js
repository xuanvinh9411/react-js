import {combineReducers} from 'redux';
import userReducer from './userReducer';
import messageReducer from './messageReducer';
import listMessageByThreadIdReducer from './listMessageByThreadIdReducer';
import listMessageUserByIdReducer from './listMessageUserByIdReducer';
import shopReducer from './shopReducer';
import postReducer from './postReducer';
import commentReducer from './commentsReducer';
import searchReducer from './searchReducer';
import newFeedReducer from './newFeedReducer';
import itemReducer from './itemReducer';
import adsReducer from './adsReducer';
import transactionReducer from './transactionReducer';
import appReducer from './appReducer';
import notificationReducer from './notificationReducer';
import logoBrandReducer from './logoBrandReducer';
import friendProfileReducer from './friendProfileReducer';
import acoinReducer from './acoinReducer';

const rootReducer = combineReducers({
  userReducer,
  messageReducer,
  listMessageByThreadIdReducer,
  listMessageUserByIdReducer,
  shopReducer,
  postReducer,
  commentReducer,
  searchReducer,
  newFeedReducer,
  itemReducer,
  adsReducer,
  transactionReducer,
  appReducer,
  notificationReducer,
  logoBrandReducer,
  friendProfileReducer,
  acoinReducer
});

export default rootReducer;
