/**
 * Created by huynhngoctam on 11/14/16.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
export  default function friendProfileReducer(state=initialState.friendProfile,action){
  switch (action.type){
    case types.LOAD_SHOP_ON_PROFILE_SUCCESS:{
      state=initialState.friendProfile;
      return Object.assign({}, action);
    }
    case types.TRACKING_FRIEND_SUCCESS:{
      state=initialState.friendProfile;
      return Object.assign({}, action);
    }

    case types.GET_FRIEND_SUCCESS:{
      state=initialState.friendProfile;
      return Object.assign({}, action);
    }
    case types.FIND_FRIEND_SUCCESS:{
      state=initialState.friendProfile;
      return Object.assign({}, action);
    }
    case types.ADD_FRIEND_SUCCESS:{
      state=initialState.friendProfile;
      return Object.assign({}, action);
    }
    case types.ACCEPT_FRIEND_SUCCESS:{
      state=initialState.friendProfile;
      return Object.assign({}, action);
    }
    default:
      return state;

  }
}
