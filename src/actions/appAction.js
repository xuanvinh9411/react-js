/**
 * Created by TrungPhat on 19/05/2017
 */

import * as types from './actionTypes';
import CryptoJS from 'crypto-js';
let httpRequest = require('../services/httpRequest');
let Session = require('../utils/Utils');
var Constants = require('../services/Constants');
const urlRequestApi = require('../url/urlRequestApi');

export function processingSuccess(data, type) {
  return {type: type, data: data};
}
export function processingError(err, type) {
  return {type: type, error: err};
}
export function getNotification() {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    httpRequest.post(urlRequestApi.user.userNotification, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.GET_NOTIFICATION_ERROR));
      } else {
        dispatch(processingSuccess(res, types.GET_NOTIFICATION_SUCCESS));
      }
    });
  };
}
export function updateNotification() {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    httpRequest.post(urlRequestApi.user.userNotificationUpdate, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.UPDATE_NOTIFICATION_ERROR));
      } else {
        dispatch(processingSuccess(res, types.UPDATE_NOTIFICATION_SUCCESS));
      }
    });
  };
}
export function loadMessageCountNew() {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    httpRequest.post(urlRequestApi.userInbox.userInboxCountNew, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.MESSAGE_COUNT_NEW_ERROR));
      } else {
        dispatch(processingSuccess(res, types.MESSAGE_COUNT_NEW_SUCCESS));
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
    params.shopinfo && params.shopinfo == Constants.STATUS_SHOP_INFO ?
      data['shopinfo'] = Constants.STATUS_SHOP_INFO : null;
    console.log(data);
    httpRequest.post(urlRequestApi.common.cmTrackingFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.TRACKING_FRIEND_APP_ERROR));
      } else {
        console.log(res);
        dispatch(processingSuccess(res, types.TRACKING_FRIEND_APP_SUCCESS));
      }
    });
  }
}

export function loadBannerWeb() {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    httpRequest.post(urlRequestApi.adsVideo.adsBannerWebAdsFrontEnd, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.BANNER_WEB_ERROR));
      } else {
        dispatch(processingSuccess(res, types.BANNER_WEB_SUCCESS));
      }
    });
  };
}
