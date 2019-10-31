/**
 * Created by TrungPhat on 13/02/2017.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
let Aes=require('../services/httpRequest');
export  default function postReducer(state=initialState.post,action){
  switch (action.type){
    case types.GET_CATEGORY_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }

    case types.GET_GOOGLE_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }
    case types.GET_GOOGLE_FIRST_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }
    case types.UPLOAD_MUTI_IMAGE_SUCCESS: {
      return Object.assign({}, state, action);
    }

    case types.GET_SHOP_SUCCESS: {
      state=initialState.shop;
      return Object.assign({}, state, action);
    }

    case types.CREATE_POST_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }

    case types.LOAD_POST_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }

    case types.GET_POST_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }
    case types.UPLOAD_BASE64_2_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }
    case types.UPDATE_POST_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }

    case types.DELETE_POST_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }

    case types.LIKE_POST_SUCCESS: {
      state=initialState.post;
      return Object.assign({},state, action);
    }

    case types.COMMENTS_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }

    case types.TRACKING_FRIEND_SUCCESS:{
      state=initialState.newsFeed;
      return Object.assign({}, action);
    }
    case types.LOAD_COMMENTS_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }
    case types.UNLIKE_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }
    case types.LOAD_LIST_LIKER_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }
    default:
      return state;
  }
}
