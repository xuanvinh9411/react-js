/**
 * Created by huynhngoctam on 11/14/16.
 */
import initialState from './initialState';
import * as types from '../actions/actionTypes';
export  default function userReducer(state=initialState.users,action){

  switch (action.type){
     case types.VERIFY_SUCCESS:
       state=initialState.users;
       return Object.assign({}, action);

    case types.LOAD_USER_SUCCESS:
      state=initialState.users;
      return Object.assign({}, action);
    case types.LOAD_POST_SUCCESS:
      state=initialState.users;
      return Object.assign({}, action);
    case types.LOAD_USER_ERROR:
      state=initialState.users;
      return Object.assign({}, action);
    case types.UPDATE_POST_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }

    case types.DELETE_POST_SUCCESS: {
      state=initialState.post;
      return Object.assign({}, state, action);
    }
    case types.REGISTER_SUCCESS:
      state=initialState.users;
      return Object.assign({}, action);

    case types.ADD_USER_SUCCESS:
      state=initialState.users;
      return Object.assign({}, action);

    case types.UPDATE_USER_SUCCESS:
      state=initialState.users;
      return Object.assign({}, action);

    case types.DELETE_USER_SUCCESS:
      state=initialState.users;
      return Object.assign({}, action);

    case types.CHANGE_STATE_USER_SUCCESS:
      state=initialState.users;
      return Object.assign({}, action);

    case types.GET_USER_SUCCESS:
      state=initialState.users;
      return Object.assign({}, action);

    case types.GET_JOBS_SUCCESS:
      state=initialState.users;
      return Object.assign({}, action);

    case types.GET_NATION_SUCCESS:
      state=initialState.users;
      return Object.assign({}, action);

    case types.LOGIN_SUCCESS:{
      state=initialState.users;
      return [...state, Object.assign({}, action)];
    }

    case types.FORGOT_PASSWORD_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }

    case types.CHANGE_PASSWORD_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }

    case types.FIND_FRIEND_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }

    case types.ADD_FRIEND_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }

    case types.LOAD_FRIEND_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }

    case types.LOAD_REQUEST_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }

    case types.ACCEPT_FRIEND_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }

    case types.BLOCK_FRIEND_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }
    case types.ACTIVE_REGISTER_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }
    case types.UNFRIEND_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }

    case types.GET_MONEY_SUCCESS:
      state=initialState.users;
      return Object.assign({}, action);

    case types.LOAD_BLOCK_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }
    case types.SEARCH_FRIEND_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }

    case types.UNBLOCK_FRIEND_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }

    case types.UPDATE_PROFILE_SUCCESS:{
      //khoi tao lai moi khi login de ko cache lai du lieu cu
      state=initialState.users;
      return Object.assign({}, action);
    }
    case types.UPIMAGE_SUCCESS: {
      return Object.assign({}, state, action);
    }
    case types.TRACKING_FRIEND_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, action);
    }
    case types.UPLOAD_BASE64_SUCCESS:{
      state=initialState.users;
      return Object.assign({}, state, action);
    }
    default:
        return state;

  }
}
