/**
 * Created by TrungPhat on 16/02/2017.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
let Aes=require('../services/httpRequest');
export  default function searchReducer(state=initialState.search,action){
  switch (action.type){
    case types.SEARCH_SUCCESS: {
      state={};
      return Object.assign({}, state, action);
    }

    case types.GET_GOOGLE_SUCCESS: {
      state=initialState.search;
      return Object.assign({}, state, action);
    }
    case types.TRACKING_FRIEND_SUCCESS:{
      state=initialState.search;
      return Object.assign({}, action);
    }
    case types.SEARCH_POST_SUCCESS: {
      state=initialState.search;
      return Object.assign({}, state, action);
    }
    case types.SEARCH_NEW_POST_SUCCESS: {
      state=initialState.search;
      return Object.assign({}, state, action);
    }

    case types.GET_CATEGORY_SUCCESS: {
      state=initialState.search;
      return Object.assign({}, state, action);
    }

    default:
      return state;

  }
}
