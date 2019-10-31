/**
 * Created by TrungPhat on 16/02/2017.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
let Aes=require('../services/httpRequest');
export  default function notificationReducer(state=initialState.notification,action){
  switch (action.type){
    case types.LOAD_NOTIFICATION_SUCCESS: {
      state=initialState.notification;
      return Object.assign({}, state, action);
    }

    default:
      return state;

  }
}
