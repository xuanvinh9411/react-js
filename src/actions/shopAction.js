/**
 * Created by TrungPhat on 1/23/17.
 */

import * as types from './actionTypes';
import CryptoJS from 'crypto-js';
let httpRequest = require('../services/httpRequest');
let Session=require('../utils/Utils');
var Constants=require('../services/Constants');
const urlRequestApi=require('../url/urlRequestApi');
export function processingSuccess(data,type){
  switch (type){
    case types.LOAD_SHOP_SUCCESS:
      return{type: types.LOAD_SHOP_SUCCESS, dataShops: data};
    case types.UPIMAGE_SUCCESS:
      return{type: types.UPIMAGE_SUCCESS, dataUpload: data};
    case types.UPLOAD_MUTI_IMAGE_SUCCESS:
      return{type: types.UPLOAD_MUTI_IMAGE_SUCCESS, dataUpload: data};
    case types.GET_CATEGORY_SUCCESS:
      return{type: types.GET_CATEGORY_SUCCESS, dataShops: data};
    case types.CREATE_SHOP_SUCCESS:
      return{type: types.CREATE_SHOP_SUCCESS, dataShops: data};
    case types.UPDATE_SHOP_SUCCESS:
      return{type: types.UPDATE_SHOP_SUCCESS, dataShops: data};
    case types.DELETE_SHOP_SUCCESS:
      return{type: types.DELETE_SHOP_SUCCESS, dataShops: data};
    case types.GET_SHOP_SUCCESS:
      return{type: types.GET_SHOP_SUCCESS, dataShops: data};
    case types.GET_GOOGLE_SUCCESS:
      return{type: types.GET_GOOGLE_SUCCESS, dataShops: data};
    case types.GET_GOOGLE_FIRST_SUCCESS:
      return{type: types.GET_GOOGLE_FIRST_SUCCESS, dataPost: data};
    case types.TRACKING_FRIEND_SUCCESS:
      return{type: types.TRACKING_FRIEND_SUCCESS, dataShops: data};
    case types.UPLOAD_BASE64_SUCCESS:
      return{type: types.UPLOAD_BASE64_SUCCESS, dataBase64: data};
    case types.UPLOAD_BASE64_2_SUCCESS:
      return{type: types.UPLOAD_BASE64_2_SUCCESS, dataBase64: data};
    case types.LOAD_POST_SUCCESS:
      return{type: types.LOAD_POST_SUCCESS, dataPost: data};
    case types.UPDATE_POST_SUCCESS:
      return{type: types.UPDATE_POST_SUCCESS, dataPost: data};
    case types.DELETE_POST_SUCCESS:
      return{type: types.DELETE_POST_SUCCESS, dataPost: data};
    case types.GET_DES_SUCCESS:
      return{type: types.GET_DES_SUCCESS, dataShops: data};
    case types.ADS_SYS_SUCCESS:
      return{type: types.ADS_SYS_SUCCESS, dataShops: data};
    case types.REPORT_SHOP_SUCCESS:
      return{type: types.REPORT_SHOP_SUCCESS, dataShops: data};
    case types.CLICK_ADS_SUCCESS:
      return{type: types.CLICK_ADS_SUCCESS, dataShops: data};
    default:
      return null;
  }
}
export function processingError(err,type){
  return {type: type, error: err};
}
export function loadCategory(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      type: Constants.TYPE_CATEGORY,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      parentId: params.parentId,
      status:Constants.STATUS_ACTIVE
    };
    httpRequest.post(urlRequestApi.common.cmTypeList,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_CATEGORY_ERROR));
      }else{
        dispatch(processingSuccess(res,types.GET_CATEGORY_SUCCESS));
      }
    });
  };
}
export function loadListShop(params){
  return function(dispatch) {
    let data ={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      page:params.page,
      status:Constants.STATUS_ACTIVE
    };
    if(params.userId && params.userId!=''){
      data['userId']=params.userId;
    }
    httpRequest.post(urlRequestApi.shop.shopList,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_SHOP_ERROR));
      }else{
        dispatch(processingSuccess(res,types.LOAD_SHOP_SUCCESS));
      }
    });
  };
}
export function createShop(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      name:params.name,
      location:[params.location[1],params.location[0]],
      phone:params.phone,
      address:params.address,
      avatar:params.avatar,
      coverImage:params.coverImage,
      image_deletes: params.image_delete,
      email:params.email,
      website:params.linkwebsite,
      description:params.description,
      openCloseTime:params.time,
      primaryCategory:params.categoryParent,
      secondCategory:params.categorySub
    };
    if(params.identifyNumber.length > 0){
      data.identifyNumber = params.identifyNumber;
    }
    if(params.tags.length > 0){
      data.keywords = params.tags;
    }

    console.log("data lacreateShop ", data);

    httpRequest.post(urlRequestApi.shop.shopCreate,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.CREATE_SHOP_ERROR));
      }else{
        dispatch(processingSuccess(res,types.CREATE_SHOP_SUCCESS));
      }
    });
  };
}
export function updateShop(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      name:params.name,
      location:[params.location[1],params.location[0]],
      phone:params.phone,
      address:params.address,
      avatar:params.arrAvatar,
      coverImage:params.coverImage,
      image_deletes: params.image_delete,
      email:params.email,
      website:params.website,
      description:params.description,
      openCloseTime:params.time,
      id:params.id,
      primaryCategory:params.categoryParent,
      secondCategory:params.categorySub
    };
    if(params.identifyNumber.length > 0){
      data.identifyNumber = params.identifyNumber;
    }
    if(params.keywords.length > 0){
      data.keywords = params.keywords;
    }
    httpRequest.post(urlRequestApi.shop.shopUpdate,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.UPDATE_SHOP_ERROR));
      }else{
        dispatch(processingSuccess(res,types.UPDATE_SHOP_SUCCESS));
      }
    });
  };
}
export function deleteShop(params){
  return function(dispatch) {
    let data ={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      id:params,
      status:Constants.STATUS_DELETE
    };
    httpRequest.post(urlRequestApi.shop.shopUpdate,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.DELETE_SHOP_ERROR));
      }else{
        dispatch(processingSuccess(res,types.DELETE_SHOP_SUCCESS));
      }
    });
  };
}
export function getShopById(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      id:params
    };
    httpRequest.post(urlRequestApi.shop.shopGet,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_SHOP_ERROR));
      }else{
        dispatch(processingSuccess(res,types.GET_SHOP_SUCCESS));
      }
    });
  };
}
export function getAddress(address) {
  return function (dispatch) {
    httpRequest.googleApiGet(urlRequestApi.common.googleApiGet + address +'&key=' + Constants.GOOGLE_API_KEY,
      function (err, res) {
        if (err) {
          dispatch(processingError(err, types.GET_GOOGLE_ERROR));
        }else{
          dispatch(processingSuccess(res, types.GET_GOOGLE_SUCCESS));
        }
      });
  }
}
export function getAddressFirst(address) {
  return function (dispatch) {
    let add=address.replace(/\s/g, '');
    httpRequest.googleApiGet(urlRequestApi.common.googleApiGet + add +'&key=' + Constants.GOOGLE_API_KEY,
      function (err, res) {
        if (err) {
          dispatch(processingError(err, types.GET_GOOGLE_FIRST_ERROR));
        }else{
          dispatch(processingSuccess(res, types.GET_GOOGLE_FIRST_SUCCESS));
        }
      });
  }
}
export function trackingFriend(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      userIdFriend: params.userIdFriend
    };
    params.shopinfo && params.shopinfo == Constants.STATUS_SHOP_INFO?
      data['shopinfo'] = Constants.STATUS_SHOP_INFO : null;
    httpRequest.post(urlRequestApi.common.cmTrackingFriend,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.TRACKING_FRIEND_ERROR));
      }else{
        dispatch(processingSuccess(res,types.TRACKING_FRIEND_SUCCESS));
      }
    });
  };
}
/*export function uploadImage(file){
  return function(dispatch) {
    httpRequest.postImage(file,function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.UPIMAGE_ERROR));
      } else {
        dispatch(processingSuccess(res,types.UPIMAGE_SUCCESS));
      }
    });
  }
}

export function uploadMutiImages(file){
  return function(dispatch) {
    httpRequest.postImage(file,function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.UPLOAD_MUTI_IMAGE_ERROR));
      } else {
        dispatch(processingSuccess(res,types.UPLOAD_MUTI_IMAGE_SUCCESS));
      }
    });
  }
}*/
export function uploadBase64(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      images: params
    };
    httpRequest.post(urlRequestApi.common.uploadBase64,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.UPLOAD_BASE64_ERROR));
      }else{
        dispatch(processingSuccess(res,types.UPLOAD_BASE64_SUCCESS));
      }
    });
  }
}
export function uploadBase642(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      images: params
    };
    httpRequest.post(urlRequestApi.common.uploadBase64,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.UPLOAD_BASE64_2_ERROR));
      }else{
        dispatch(processingSuccess(res,types.UPLOAD_BASE64_2_SUCCESS));
      }
    });
  }
}
/*POST*/
export function listPostByShop(params){
  return function(dispatch) {
    let data={
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      platform:Constants.platform,
      idShop:params.idShop,
      page:params.page
    };
    httpRequest.post(urlRequestApi.shopPost.spList,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_POST_ERROR));
      }else{
        dispatch(processingSuccess(res,types.LOAD_POST_SUCCESS));
      }
    });
  };
}
export function updatePostHiddenPhone(params){
  return function(dispatch) {
    let data={
      id:params.id,
      showPhone:params.showPhone,
      session:localStorage.getItem('sessionAround'),
      platform:Constants.platform
    };
    httpRequest.post(urlRequestApi.shopPost.spUpdate,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.UPDATE_POST_ERROR));
      }else{
        dispatch(processingSuccess(res,types.UPDATE_POST_SUCCESS));
      }
    });
  };
}
export function deletePost(params){
  return function(dispatch) {
    let data={
      id:params.id,
      idShop:params.idShop.id,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      platform:Constants.platform
    };
    if(params.status==Constants.STATUS_DELETE){
      data['status']=params.status;
    }
    httpRequest.post(urlRequestApi.shopPost.spUpdate,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.DELETE_POST_ERROR));
      }else{
        dispatch(processingSuccess(res,types.DELETE_POST_SUCCESS));
      }
    });
  };
}
export function getDirectionsUrl(url) {
  return function (dispatch) {
    httpRequest.getDes(url,
      function (err, res) {
        if (err) {
          dispatch(processingError(err, types.GET_DES_ERROR));
        }else{
          dispatch(processingSuccess(res, types.GET_DES_SUCCESS));
        }
      });
  }
}
export function requestSystemAds(params) {
  return function(dispatch) {
    let data={
      kind: params.kind,
      idShop: params.idShop,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      platform:Constants.platform
    };
    httpRequest.post(urlRequestApi.adsVideo.adsRequestSysAds,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.ADS_SYS_ERROR));
      }else{
        res.kind = params.kind;
        dispatch(processingSuccess(res,types.ADS_SYS_SUCCESS));
      }
    });
  };
}
export function reportShop(params) {
  return function(dispatch) {
    let data={
      id: params,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      platform:Constants.platform
    };
    httpRequest.post(urlRequestApi.shop.shopReport,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.REPORT_SHOP_ERROR));
      }else{
        dispatch(processingSuccess(res,types.REPORT_SHOP_SUCCESS));
      }
    });
  };
}
export function clickAds(params) {
  return function(dispatch) {
    let data={
      idAds: params.idAds,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      platform:Constants.platform
    };
    httpRequest.post(urlRequestApi.adsVideo.adsClickSysAds,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.CLICK_ADS_ERROR));
      }else{
        dispatch(processingSuccess(res,types.CLICK_ADS_SUCCESS));
      }
    });
  };
}
