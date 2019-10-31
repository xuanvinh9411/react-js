/**
 * Created by TrungPhat on 22/03/16.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
export  default function acoinReducer(state=initialState.acoin, action){
  switch (action.type){
    case types.LOAD_LIST_ACOIN_SUCCESS:
      state=initialState.acoin;
      return Object.assign({}, action);
    case types.SEND_DATA_TO_NL_SUCCESS:
      state=initialState.acoin;
      return Object.assign({}, action);
    case types.UPDATE_NL_SUCCESS:
      state=initialState.acoin;
      return Object.assign({}, action);
    default:
      return state;
  }
}
