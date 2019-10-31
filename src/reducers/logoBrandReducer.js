/**
 * Created by TrungPhat on 24/05/2017
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
let Aes=require('../services/httpRequest');
export  default function logoBrandReducer (state=initialState.logo,action){
  switch (action.type){
    case types.GET_LOGO_SUCCESS: {
      state=initialState.logo;
      return Object.assign({}, state, action);
    }
    case types.UPDATE_LOGO_SUCCESS: {
      state=initialState.logo;
      return Object.assign({}, state, action);
    }
    case types.UPIMAGE_SUCCESS:{
      return Object.assign({}, state, action);
    }
    default:
      return state;

  }
}
