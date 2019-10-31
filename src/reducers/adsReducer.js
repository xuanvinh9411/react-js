/**
 * Created by TrungPhat on 22/03/16.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
export  default function userReducer(state=initialState.ads,action){

  switch (action.type){
    case types.GET_JOBS_SUCCESS:
      state=initialState.ads;
      return Object.assign({}, action);
    case types.GET_POST_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }
    case types.ADS_QUERY_SUCCESS: {
      state=initialState.ads;
      return Object.assign({}, state, action);
    }
    case types.LOAD_ADS_VIDEO_SUCCESS: {
      state=initialState.ads;
      return Object.assign({}, state, action);
    }
    case types.GET_ADS_VIDEO_SUCCESS: {
      state=initialState.ads;
      return Object.assign({}, state, action);
    }
    case types.ADS_VIDEO_CREDIT_SUCCESS: {
      state=initialState.ads;
      return Object.assign({}, state, action);
    }
    case types.GET_PRICE_ADS_SUCCESS: {
      state=initialState.ads;
      return Object.assign({}, state, action);
    }
    case types.ADD_ADS_SUCCESS: {
      state=initialState.ads;
      return Object.assign({}, state, action);
    }
    case types.LOAD_ADS_SUCCESS: {
      state=initialState.ads;
      return Object.assign({}, state, action);
    }
    case types.GET_ADS_SUCCESS: {
      state=initialState.ads;
      return Object.assign({}, state, action);
    }
    case types.UPDATE_ADS_SUCCESS: {
      state=initialState.ads;
      return Object.assign({}, state, action);
    }
    case types.CHANGE_STATE_ADS_SUCCESS: {
      state=initialState.ads;
      return Object.assign({}, state, action);
    }
    default:
      return state;

  }
}
