/**
 * Created by TrungPhat on 16/02/2017.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
let Aes=require('../services/httpRequest');
export  default function searchReducer(state=initialState.newsFeed,action){
  switch (action.type){
    case types.LOAD_NEWSFEED_SUCCESS: {
      state=initialState.newsFeed;
      return Object.assign({}, state, action);
    }

    case types.TRACKING_FRIEND_SUCCESS:{
      state=initialState.newsFeed;
      return Object.assign({}, action);
    }

    case types.GET_FRIEND_SUCCESS:{
      state=initialState.newsFeed;
      return Object.assign({}, action);
    }

    case types.LIKE_POST_SUCCESS: {
      state=initialState.newsFeed;
      return Object.assign({},state, action);
    }

    case types.LOAD_COMMENTS_SUCCESS: {
      state=initialState.newsFeed;
      return Object.assign({}, state, action);
    }
    case types.COMMENTS_SUCCESS: {
      state=initialState.newsFeed;
      return Object.assign({}, state, action);
    }
    case types.UNLIKE_SUCCESS: {
      state=initialState.newsFeed;
      return Object.assign({}, state, action);
    }
    case types.LOAD_LIST_LIKER_SUCCESS: {
      state=initialState.newsFeed;
      return Object.assign({}, state, action);
    }
    default:
      return state;

  }
}
