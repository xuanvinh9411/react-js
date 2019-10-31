/**
 * Created by TrungPhat on 1/23/17.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
let Aes=require('../services/httpRequest');
export  default function shopReducer(state=initialState.shop,action){
  switch (action.type){
    case types.LOAD_SHOP_SUCCESS:{
      state=initialState.shop;
      return Object.assign({}, state, action);
    }
    case types.GET_CATEGORY_SUCCESS: {
      state=initialState.shop;
      return Object.assign({}, state, action);
    }
    case types.UPLOAD_BASE64_SUCCESS:{
      state=initialState.shop;
      return Object.assign({}, state, action);
    }
    case types.GET_GOOGLE_FIRST_SUCCESS: {
      state=initialState.shop;
      return Object.assign({}, state, action);
    }
    case types.UPLOAD_BASE64_2_SUCCESS:{
      state=initialState.shop;
      return Object.assign({}, state, action);
    }

    case types.UPIMAGE_SUCCESS: {
      return Object.assign({}, state, action);
    }

    case types.UPLOAD_MUTI_IMAGE_SUCCESS: {
      return Object.assign({}, state, action);
    }

    case types.GET_CATEGORY_SUCCESS: {
      state=initialState.shop;
      return Object.assign({}, state, action);
    }
    case types.CLICK_ADS_SUCCESS: {
      state=initialState.shop;
      return Object.assign({}, state, action);
    }
    case types.CREATE_SHOP_SUCCESS: {
      state=initialState.shop;
      return Object.assign({}, state, action);
    }

    case types.UPDATE_SHOP_SUCCESS: {
      state=initialState.shop;
      return Object.assign({}, state, action);
    }

    case types.DELETE_SHOP_SUCCESS: {
      state=initialState.shop;
      return Object.assign({}, state, action);
    }

    case types.GET_SHOP_SUCCESS: {
      state=initialState.shop;
      return Object.assign({}, state, action);
    }

    case types.GET_GOOGLE_SUCCESS: {
      state=initialState.shop;
      return Object.assign({}, state, action);
    }

    case types.TRACKING_FRIEND_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }
    /*POST*/
    case types.LOAD_POST_SUCCESS: {
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

    case types.GET_DES_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }
    case types.ADS_SYS_SUCCESS: {
      state=initialState.shop;
      return Object.assign({}, state, action);
    }
    case types.REPORT_SHOP_SUCCESS: {
      state=initialState.shop;
      return Object.assign({}, state, action);
    }
    default:
      return state;
  }
}
