/**
 * Created by TrungPhat on 16/02/2017.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
let Aes=require('../services/httpRequest');
export  default function appReducer (state=initialState.notification,action){
  switch (action.type){
    case types.GET_NOTIFICATION_SUCCESS: {
      state={};
      return Object.assign({}, state, action);
    }
    case types.UPDATE_NOTIFICATION_SUCCESS: {
      state={};
      return Object.assign({}, state, action);
    }
    case types.MESSAGE_COUNT_NEW_SUCCESS: {
      state={};
      return Object.assign({}, state, action);
    }

    case types.BANNER_WEB_SUCCESS: {
      state={};
      return Object.assign({}, state, action);
    }
    case types.TRACKING_FRIEND_APP_SUCCESS: {
      state={};
      return Object.assign({}, state, action);
    }
    default:
      return state;

  }
}
