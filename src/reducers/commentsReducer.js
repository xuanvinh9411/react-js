/**
 * Created by TrungPhat on 15/02/2017.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
let Aes=require('../services/httpRequest');
export  default function commentReducer(state=initialState.listMsgUser,action){
  switch (action.type){
    /*case types.LOAD_COMMENTS_SUCCESS:{console.log(action)
      if(!jQuery.isEmptyObject(state) && state.type==types.LOAD_COMMENTS_SUCCESS){
        if(action.dataPost.page==0){
          state={};
        }else{
          let dataMsg=state.dataPost.data.socials;
          action.dataPost.data.socials=dataMsg.concat(action.dataPost.data.socials);
        }
      }
      return action;
    }*/
    case types.COMMENTS_SUCCESS: {
      state=initialState.newsFeed;
      return Object.assign({}, state, action);
    }

    case types.LOAD_COMMENTS_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }
    case types.LIKE_POST_SUCCESS: {
      state=initialState.post;
      return Object.assign({},state, action);
    }
    case types.UNLIKE_SUCCESS: {
      state=initialState.post;
      return Object.assign({},state, action);
    }
    default:
      return state;

  }
}
