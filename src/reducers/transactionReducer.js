/**
 * Created by TrungPhat on 28/03/16.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
export  default function transactionReducer(state=initialState.trs,action){

  switch (action.type){
    case types.LOAD_TRS_SUCCESS:
      state=initialState.trs;
      return Object.assign({}, action);
    case types.GET_MONEY_SUCCESS:
      state=initialState.trs;
      return Object.assign({}, action);
    case types.GET_USER_SUCCESS:
      state=initialState.users;
      return Object.assign({}, action);
    case types.TRANSFER_REQUEST_SUCCESS:
      state=initialState.trs;
      return Object.assign({}, action);
    case types.TRANSFER_MONEY_SUCCESS:
      state=initialState.trs;
      return Object.assign({}, action);
    default:
      return state;

  }
}
