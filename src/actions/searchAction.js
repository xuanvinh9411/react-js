/**
 * Created by TrungPhat on 15/02/17.
 */

import * as types from './actionTypes';
import CryptoJS from 'crypto-js';
let httpRequest = require('../services/httpRequest');
let Session = require('../utils/Utils');
var Constants = require('../services/Constants');
const urlRequestApi = require('../url/urlRequestApi');
export const SEARCH_METHOD = 'searchPost';
export const LOAD_DATA_METHOD = 'loadData';
export function processingSuccess(data, type) {
  switch (type) {
    case types.SEARCH_SUCCESS:
      return {type: types.SEARCH_SUCCESS, dataSearch: data};
    case types.GET_GOOGLE_SUCCESS:
      return {type: types.GET_GOOGLE_SUCCESS, dataSearch: data};
    case types.SEARCH_POST_SUCCESS:
      return {type: types.SEARCH_POST_SUCCESS, dataSearch: data};
    case types.GET_CATEGORY_SUCCESS:
      return {type: types.GET_CATEGORY_SUCCESS, dataSearch: data};
    case types.SEARCH_NEW_POST_SUCCESS:
      return {type: types.SEARCH_NEW_POST_SUCCESS, dataSearch: data};
    case types.TRACKING_FRIEND_SUCCESS:
      return {type: types.TRACKING_FRIEND_SUCCESS, dataShops: data};
    default:
      return null;
  }
}

export function processingError(err, type) {
  return {type: type, error: err};
}

export function search(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    if (params.location.length != 0 && params.km != '') {
      data['longitude'] = params.location[1];
      data['latitude'] = params.location[0];
      data['km'] = params.km > 1 ? params.km : 1;
    }
    if (params.keywords != '') {
      data['keywords'] = params.keywords
    }
    httpRequest.post(urlRequestApi.shop.shopSearch, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.SEARCH_ERROR));
      } else {
        dispatch(processingSuccess(res, types.SEARCH_SUCCESS));
      }
    });
  };
}
export function searchPost(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      page: params.page
    };
    if ((params.location.length != 0 && params.km != '') && (params.km && params.km != 0)) {
      data['longitude'] = params.location[1];
      data['latitude'] = params.location[0];
      data['km'] = parseInt(params.km);
    }
    if (params.keywords != '') {
      data['keywords'] = params.keywords
    }
    if (params.category01 != Constants.DEFAULT_PARENT && params.category02 != Constants.DEFAULT_PARENT) {
      data.category01 = params.category01;
      data.category02 = params.category02;
    } else {
      if (params.category01 != Constants.DEFAULT_PARENT) {
        data.category01 = params.category01;
      }
    }
    httpRequest.post(urlRequestApi.shopPost.spSearchPost, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.SEARCH_POST_ERROR));
      } else {
        res.page = params.page;
        dispatch(processingSuccess(res, types.SEARCH_POST_SUCCESS));
      }
    });
  };
}
export function getAddress(address) {
  return function (dispatch) {
    httpRequest.googleApiGet(urlRequestApi.common.googleApiGet + address + '&key=' + Constants.GOOGLE_API_KEY,
      function (err, res) {
        if (err) {
          dispatch(processingError(err, types.GET_GOOGLE_ERROR));
        }
        else {
          dispatch(processingSuccess(res, types.GET_GOOGLE_SUCCESS));
        }
      });
  }
}
export function loadCategory(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      type: Constants.TYPE_CATEGORY,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      parentId: params.parentId,
      status: Constants.STATUS_ACTIVE
    };
    httpRequest.post(urlRequestApi.common.cmTypeList, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.GET_CATEGORY_ERROR));
      } else {
        res.parentId = params.parentId;
        dispatch(processingSuccess(res, types.GET_CATEGORY_SUCCESS));
      }
    });
  };
}
export function newest_post(params, page = 0 ) {
  if (!page) page = 0;
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      page: page
    };
    if (params && params.length > 0) {
      data['longitude'] = params[1];
      data['latitude'] = params[0];
    }


    httpRequest.post(urlRequestApi.shopPost.spNewestPost, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.SEARCH_NEW_POST_ERROR));
      } else {
        dispatch(processingSuccess(res, types.SEARCH_NEW_POST_SUCCESS));
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
    httpRequest.post(urlRequestApi.common.cmTrackingFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.TRACKING_FRIEND_ERROR));
      } else {
        dispatch(processingSuccess(res, types.TRACKING_FRIEND_SUCCESS));
      }
    });
  }
}
