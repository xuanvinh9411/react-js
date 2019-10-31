/**
 * Created by TrungPhat on 20/02/17.
 */

import * as types from './actionTypes';
import CryptoJS from 'crypto-js';
let httpRequest = require('../services/httpRequest');
let Session=require('../utils/Utils');
var Constants=require('../services/Constants');
const urlRequestApi = require('../url/urlRequestApi');
export function processingSuccess(data,type){
  switch (type){
    case types.LOAD_NEWSFEED_SUCCESS:
      return{type: types.LOAD_NEWSFEED_SUCCESS, dataList: data};
    case types.TRACKING_FRIEND_SUCCESS:
      return{type: types.TRACKING_FRIEND_SUCCESS, dataShops: data};
    case types.GET_FRIEND_SUCCESS:
      return{type: types.GET_FRIEND_SUCCESS, dataUser: data};
    case types.LIKE_POST_SUCCESS:
      return{type: types.LIKE_POST_SUCCESS, dataPosts: data};
    case types.LOAD_COMMENTS_SUCCESS:
      return{type: types.LOAD_COMMENTS_SUCCESS, dataPost: data};
    case types.COMMENTS_SUCCESS:
      return{type: types.COMMENTS_SUCCESS, dataPost: data};
    case types.UNLIKE_SUCCESS:
      return{type: types.UNLIKE_SUCCESS, dataPost: data};
    case types.LOAD_LIST_LIKER_SUCCESS:
      return{type: types.LOAD_LIST_LIKER_SUCCESS, dataPost: data};
    default:
      return null;
  }
}

export function processingError(err,type){
  return {type: type, error: err};
}

export function listNewsFeed(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      page:params.page
    };

    httpRequest.post(urlRequestApi.user.userNewsFeed,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_NEWSFEED_ERROR));
      }else{
        res.params=data
        dispatch(processingSuccess(res,types.LOAD_NEWSFEED_SUCCESS));
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
export function socialAddLike(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idPost:params.idPost,
      kind:params.kind
    };
    httpRequest.post(urlRequestApi.shopPost.spAddLikeAndComment,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LIKE_POST_ERROR));
      }else{
        dispatch(processingSuccess(res,types.LIKE_POST_SUCCESS));
      }
    });
  };
}
export function socialList(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idPost:params.idPost,
      kind:params.kind,
      page:params.page
    };
    if(params.parent && params.parent !=''){
      data['parent'] = params.parent;
    }
    httpRequest.post(urlRequestApi.shopPost.spListComments,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_COMMENTS_ERROR));
      }else{
        res.params=params;
        dispatch(processingSuccess(res,types.LOAD_COMMENTS_SUCCESS));
      }
    });
  };
}
export function socialAdd(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idPost:params.idPost,
      kind:params.kind,
      message:params.message
    };
    if(params.parent && params.parent.length > 0){
      data['parent'] = params.parent;
    }
    httpRequest.post(urlRequestApi.shopPost.spAddLikeAndComment,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.COMMENTS_ERROR));
      }else{
        res.parent = params.parent;
        dispatch(processingSuccess(res,types.COMMENTS_SUCCESS));
      }
    });
  };
}
export function socialUnLike(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idPost:params.idPost,
      kind:params.kind
    };
    httpRequest.post(urlRequestApi.shopPost.spUnLike,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.UNLIKE_ERROR));
      }else{
        dispatch(processingSuccess(res,types.UNLIKE_SUCCESS));
      }
    });
  };
}
export function listLiker(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idPost:params.idPost,
      kind:Constants.KIND_LIKE,
      page:params.page
    };
    httpRequest.post(urlRequestApi.shopPost.spListComments,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_LIST_LIKER_ERROR));
      }else{
        res.params=params;
        dispatch(processingSuccess(res,types.LOAD_LIST_LIKER_SUCCESS));
      }
    });
  };
}
