/**
 * Created by TrungPhat on 1/23/17.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
let Aes=require('../services/httpRequest');
export  default function messageReducer(state=initialState.messages,action){
  switch (action.type){
    case types.LOAD_INBOX_ERROR:{
      state=initialState.messages;
      return Object.assign({}, action);
    }

    case types.GET_USER_SUCCESS:
      state=initialState.messages;
      return Object.assign({}, action);

    case types.LOAD_INBOX_SUCCESS:{
      if(!jQuery.isEmptyObject(state) && state.type==types.LOAD_INBOX_SUCCESS){
        if(action.dataUser.data.page==0){
          state={};
        }else{
          let dataMsg=state.dataUser.data.messages;
          action.dataUser.data.messages=dataMsg.concat(action.dataUser.data.messages);
        }
      }
      return action;
    }

    case types.SEND_MESSAGE_SUCCESS:{
      state=initialState.messages;
      return Object.assign({}, state, action);
    }

    case types.TRACKING_FRIEND_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }

    case types.SEND_MESSAGE_FAILURE:{
      state=initialState.messages;
      return Object.assign({}, state, action);
    }

    case types.DELETE_MESSAGE_SUCCESS:{
      state=initialState.messages;
      return Object.assign({}, state, action);
    }

    default:
      return state;

  }
}
