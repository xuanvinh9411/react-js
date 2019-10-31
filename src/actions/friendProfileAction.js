/**
 * Created by huynhngoctam on 11/14/16.
 */

import * as types from './actionTypes';
import CryptoJS from 'crypto-js';
let httpRequest = require('../services/httpRequest');
let Session=require('../utils/Utils');
var Constants=require('../services/Constants');
const urlRequestApi = require('../url/urlRequestApi');
export function processingSuccess(data,type){
  switch (type){
    case types.LOAD_SHOP_ON_PROFILE_SUCCESS:
      return{type: types.LOAD_SHOP_ON_PROFILE_SUCCESS, dataUser: data};
    case types.GET_FRIEND_SUCCESS:
      return{type: types.GET_FRIEND_SUCCESS, dataUser: data};
    case types.FIND_FRIEND_SUCCESS:
      return{type: types.FIND_FRIEND_SUCCESS, dataUser: data};
    case types.ADD_FRIEND_SUCCESS:
      return{type: types.ADD_FRIEND_SUCCESS, dataUser: data};
    case types.ACCEPT_FRIEND_SUCCESS:
      return{type: types.ACCEPT_FRIEND_SUCCESS, dataFriend: data};
    case types.TRACKING_FRIEND_SUCCESS:
      return{type: types.TRACKING_FRIEND_SUCCESS, dataShops: data};
    default:
      return null;
  }

}

export function processingError(err,type){
  return {type: type, error: err};
}

export function friendFeed(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idUserFriend: params.userIdFriend,
      page:params.page
    };
    httpRequest.post(urlRequestApi.user.userFriendFeed, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.GET_FRIEND_ERROR));
      } else {
        dispatch(processingSuccess(res, types.GET_FRIEND_SUCCESS));
      }
    });
  }
}
export function loadListShop(params){
  return function(dispatch) {
    let data ={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      page:params.page,
      status: Constants.STATUS_ACTIVE
    };
    if(params.userId!=''){
      data['userId']=params.userId;
    }
    httpRequest.post(urlRequestApi.shop.shopList,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_SHOP_ON_PROFILE_ERROR));
      }else{
        dispatch(processingSuccess(res,types.LOAD_SHOP_ON_PROFILE_SUCCESS));
      }
    });
  };
}
export function findFriend(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      phone:params
    };
    httpRequest.post(urlRequestApi.user.userFindFriend,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.FIND_FRIEND_ERROR));
      }else{
        dispatch(processingSuccess(res,types.FIND_FRIEND_SUCCESS));
      }
    });
  };
}
export function addFriend(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      userIdFriend:params
    };
    httpRequest.post(urlRequestApi.user.userAddFriend,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.ADD_FRIEND_ERROR));
      }else{
        dispatch(processingSuccess(res,types.ADD_FRIEND_SUCCESS));
      }
    });
  };
}
export function acceptFriend(params){
  let data={
    platform:Constants.platform,
    session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
    ref:params
  };
  return function(dispatch) {
    httpRequest.post(urlRequestApi.user.userAcceptFriend,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.ACCEPT_FRIEND_ERROR));
      }else{
        dispatch(processingSuccess(res,types.ACCEPT_FRIEND_SUCCESS));
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
