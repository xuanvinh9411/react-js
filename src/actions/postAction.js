/**
 * Created by TrungPhat on 13/02/17.
 */

import * as types from './actionTypes';
import CryptoJS from 'crypto-js';
let httpRequest = require('../services/httpRequest');
let Session=require('../utils/Utils');
var Constants=require('../services/Constants');
const urlRequestApi = require('../url/urlRequestApi');
export function processingSuccess(data,type){
  switch (type){
    case types.TRACKING_FRIEND_SUCCESS:
      return{type: types.TRACKING_FRIEND_SUCCESS, dataShops: data};
    case types.GET_GOOGLE_SUCCESS:
      return{type: types.GET_GOOGLE_SUCCESS, dataPost: data};
    case types.GET_GOOGLE_FIRST_SUCCESS:
      return{type: types.GET_GOOGLE_FIRST_SUCCESS, dataPost: data};
    case types.UPLOAD_MUTI_IMAGE_SUCCESS:
      return{type: types.UPLOAD_MUTI_IMAGE_SUCCESS, dataUpload: data};
    case types.CREATE_POST_SUCCESS:
      return{type: types.CREATE_POST_SUCCESS, dataPost: data};
    case types.LOAD_POST_SUCCESS:
      return{type: types.LOAD_POST_SUCCESS, dataPost: data};
    case types.GET_POST_SUCCESS:
      return{type: types.GET_POST_SUCCESS, dataPost: data};
    case types.UPDATE_POST_SUCCESS:
      return{type: types.UPDATE_POST_SUCCESS, dataPost: data};
    case types.DELETE_POST_SUCCESS:
      return{type: types.DELETE_POST_SUCCESS, dataPost: data};
    case types.LIKE_POST_SUCCESS:
      return{type: types.LIKE_POST_SUCCESS, dataPosts: data};
    case types.LOAD_COMMENTS_SUCCESS:
      return{type: types.LOAD_COMMENTS_SUCCESS, dataPost: data};
    case types.COMMENTS_SUCCESS:
      return{type: types.COMMENTS_SUCCESS, dataPost: data};
    case types.GET_CATEGORY_SUCCESS:
      return{type: types.GET_CATEGORY_SUCCESS, dataPost: data};
    case types.GET_SHOP_SUCCESS:
      return{type: types.GET_SHOP_SUCCESS, dataShops: data};
    case types.UPLOAD_BASE64_2_SUCCESS:
      return{type: types.UPLOAD_BASE64_2_SUCCESS, dataBase64: data};
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

export function getAddress(address) {
  return function (dispatch) {
    let add=address.replace(/\s/g, '');
    httpRequest.googleApiGet(urlRequestApi.common.googleApiGet + add +'&key=' + Constants.GOOGLE_API_KEY,
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
export function getAddressFirst(address) {
  return function (dispatch) {
    let add=address.replace(/\s/g, '');
    httpRequest.googleApiGet(urlRequestApi.common.googleApiGet + add +'&key=' + Constants.GOOGLE_API_KEY,
      function (err, res) {
        if (err) {
          dispatch(processingError(err, types.GET_GOOGLE_FIRST_ERROR));
        }
        else {
          dispatch(processingSuccess(res, types.GET_GOOGLE_FIRST_SUCCESS));
        }
      });
  }
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
export function createPost(params){
  return function(dispatch) {
    let data={
      name:params.name,
      price:params.price,
      address:params.address,
      location:[params.location[1],params.location[0]],
      phone:params.phone,
      description:params.description,
      images:params.listImages,
      primaryCategory:params.categoryParent,
      secondCategory:params.categorySub,
      tags:params.tags,
      show:params.show,
      showPhone:params.showPhone,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      platform:Constants.platform
    };
    if(params.idShop){
      data['idShop']=params.idShop;
      data['show']=params.show;
    }else{
      data['show']=2;
    }

    console.log("data data data", data);
    httpRequest.post(urlRequestApi.shopPost.spCreate,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.CREATE_POST_ERROR));
      }else{
        dispatch(processingSuccess(res,types.CREATE_POST_SUCCESS));
      }
    });
  };
}

export function updatePost(params){
  return function(dispatch) {
    let data={
      id:params.id,
      name:params.name,
      price:params.price,
      address:params.address,
      location:[params.location[1],params.location[0]],
      phone:params.phone,
      description:params.description,
      images:params.listImages,
      image_deletes:params.image_deletes,
      primaryCategory:params.categoryParent,
      secondCategory:params.categorySub,
      tags:params.tags,
      showPhone:params.showPhone,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      platform:Constants.platform
    };
    if(params.status==Constants.STATUS_DELETE){
      data['status']=params.status;
    }
    if(params.idShop){
      data['idShop']=params.idShop;
      data['show']=params.show;
    }else{
      data['show']=2;
    }
    httpRequest.post(urlRequestApi.shopPost.spUpdate,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.UPDATE_POST_ERROR));
      }else{
        dispatch(processingSuccess(res,types.UPDATE_POST_SUCCESS));
      }
    });
  };
}

export function updatePostHiddenPhone(params){
  return function(dispatch) {
    let data={
      id:params.id,
      showPhone:params.showPhone,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
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

export function listPostByShop(params){
  return function(dispatch) {
    let data={
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      platform:Constants.platform,
      page:params.page,
      idShop:params.idShop
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

export function getPostById(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      id:params.idPost
    };
    if(params.trackingAds==1||params.trackingAds!=''){
      data['trackingAds']=params.trackingAds;
    }
    if(params.notificationRef && params.notificationRef != ''){
      data.notificationRef = params.notificationRef;
    }
    httpRequest.post(urlRequestApi.shopPost.spGet,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_POST_ERROR));
      }else{
        dispatch(processingSuccess(res,types.GET_POST_SUCCESS));
      }
    });
  };
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
      console.log(" Khong error ma", err);
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

//
// export function reupPost(id, callback) {
//     let data = {
//       platform: Constants.platform,
//       id: id,
//       session: localStorage.getItem(Constants.SESSION_NAME_REQUEST)
//     };
//
//     httpRequest.post(urlRequestApi.shopPost.reUpPost, data, function cb(err, res) {
//       callback(err, res);
//     });
// }
