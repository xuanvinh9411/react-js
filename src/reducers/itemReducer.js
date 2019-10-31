/**
 * Created by TrungPhat on 27/02/2017.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
let Aes=require('../services/httpRequest');
export  default function searchReducer(state=initialState.item,action){
  switch (action.type){
    case types.LOAD_ITEM_SUCCESS: {
      state=initialState.item;
      return Object.assign({}, state, action);
    }

    case types.BUY_ITEM_SUCCESS: {
      state=initialState.item;
      return Object.assign({}, state, action);
    }

    case types.GET_SHOP_SUCCESS: {
      state=initialState.item;
      return Object.assign({}, state, action);
    }
    default:
      return state;

  }
}
