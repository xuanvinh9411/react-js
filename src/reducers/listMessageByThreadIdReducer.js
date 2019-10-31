/**
 * Created by TrungPhat on 1/23/17.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
let Aes=require('../services/httpRequest');
export  default function listMessageByThreadIdReducer(state=initialState.listMsg,action){
  switch (action.type){
    case types.GET_LIST_THREAD_SUCCESS:{
      /*if(!jQuery.isEmptyObject(state) && state.type==types.GET_LIST_THREAD_SUCCESS){
        if(action.dataUser.params.increments==0){
          state={};
        }else{
          let dataMsg=state.dataUser.data.messages;
          action.dataUser.data.messages=dataMsg.concat(action.dataUser.data.messages);
        }
      }
      return action;*/
      state=initialState.messages;
      return Object.assign({}, state, action);
    }

    case types.SEND_MESSAGE_SUCCESS:{
      state=initialState.messages;
      return Object.assign({}, state, action);
    }

    default:
      return state;

  }
}
