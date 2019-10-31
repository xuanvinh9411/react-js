/**
 * Created by TrungPhat on 1/23/17.
 */

import * as types from './actionTypes';
import CryptoJS from 'crypto-js';
let httpRequest = require('../services/httpRequest');
let Session=require('../utils/Utils');
var Constants=require('../services/Constants');
const urlRequestApi = require('../url/urlRequestApi');

export function processingSuccess(data,type){
  switch (type){
    case types.LOAD_INBOX_SUCCESS:
      return{type: types.LOAD_INBOX_SUCCESS, dataUser: data};
    case types.SEND_MESSAGE_SUCCESS:
      return{type: types.SEND_MESSAGE_SUCCESS, dataUser: data};
    case types.GET_USER_SUCCESS:
      return{type: types.GET_USER_SUCCESS, dataUser: data};
    case types.GET_LIST_THREAD_SUCCESS:
      return{type: types.GET_LIST_THREAD_SUCCESS, dataUser: data};
    case types.GET_LIST_BY_USERTO_SUCCESS:
      return{type: types.GET_LIST_BY_USERTO_SUCCESS, dataUser: data};
    case types.TRACKING_FRIEND_SUCCESS:
      return{type: types.TRACKING_FRIEND_SUCCESS, dataShops: data};
    case types.DELETE_MESSAGE_SUCCESS:
      return{type: types.DELETE_MESSAGE_SUCCESS, dataUser: data};
    default:
      return null;
  }

}

export function processingError(err,type){
  return {type: type, error: err};
}

export function getUserById(params) {
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      userId:params.id,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    httpRequest.post(urlRequestApi.user.userGet,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_USER_ERROR));
      }else{
        dispatch(processingSuccess(res,types.GET_USER_SUCCESS));
      }
    });
  };
}

export function listByUserTo(params) {
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      userTo:params.idUserTo,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    if(params.increments>=0){
      data['increments']=params.increments;
    }
    httpRequest.post(urlRequestApi.userInbox.userInboxListByUserTo,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_LIST_BY_USERTO_ERROR));
      }else{
        res.params=params;
        dispatch(processingSuccess(res,types.GET_LIST_BY_USERTO_SUCCESS));
      }
    });
  };
}

export function loadMessage(params){
  return function(dispatch) {
    let data ={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      page:params.page
    };
    httpRequest.post(urlRequestApi.userInbox.userInboxList,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_INBOX_ERROR));
      }else{
        res.params=params;
        dispatch(processingSuccess(res,types.LOAD_INBOX_SUCCESS));
      }
    });
  };
}

export function listByThread(params){
  return function(dispatch) {
    let data ={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      threadId:params.threadId
    };
    if(params.increments > 0){
      data['increments']=params.increments;
    }
    httpRequest.post(urlRequestApi.userInbox.userInboxListByTheadId,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_LIST_THREAD_ERROR));
      }else{
        res.params=params;
        dispatch(processingSuccess(res,types.GET_LIST_THREAD_SUCCESS));
      }
    });
  };
}

export function sendMessage(params){
  return function(dispatch) {
    let data ={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      user_from:Session.getUserByKey('id'),
      userTo: params.idTo,
      title:params.title,
      message: params.message,
    };
    if(params.threadId){
      data['threadId']=params.threadId;
    }
    httpRequest.post(urlRequestApi.userInbox.userInboxSendMessage,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.SEND_MESSAGE_FAILURE));
      }else{
        dispatch(processingSuccess(res,types.SEND_MESSAGE_SUCCESS));
      }
    });
  };
}

export function deleteMessage(params){
  return function(dispatch) {
    let data ={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      threadId:params.threadId
    };

    httpRequest.post(urlRequestApi.userInbox.userInboxDeleteMessage,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.DELETE_MESSAGE_ERROR));
      }else{
        dispatch(processingSuccess(res,types.DELETE_MESSAGE_SUCCESS));
      }
    });
  };
}
export function trackingFriend(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      userIdFriend: params.userIdFriend
    };
    params.shopinfo && params.shopinfo == Constants.STATUS_SHOP_INFO?
      data['shopinfo'] = Constants.STATUS_SHOP_INFO : null;
    httpRequest.post(urlRequestApi.common.cmTrackingFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.TRACKING_FRIEND_ERROR));
      } else {
        dispatch(processingSuccess(res, types.TRACKING_FRIEND_SUCCESS));
      }
    });
  }
}
