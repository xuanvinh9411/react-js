/**
 * Created by TrungPhat on 22/03/16.
 */

import * as types from './actionTypes';
import CryptoJS from 'crypto-js';
let httpRequest = require('../services/httpRequest');
let Session=require('../utils/Utils');
var Constants=require('../services/Constants');
const urlRequestApi=require('../url/urlRequestApi');

export function processingSuccess(data,type){
  switch (type){
    case types.GET_JOBS_SUCCESS:
      return{type: types.GET_JOBS_SUCCESS, userData:data};
    case types.GET_POST_SUCCESS:
      return{type: types.GET_POST_SUCCESS, dataPost: data};
    case types.ADS_QUERY_SUCCESS:
      return{type: types.ADS_QUERY_SUCCESS, dataAds: data};
    case types.GET_PRICE_ADS_SUCCESS:
      return{type: types.GET_PRICE_ADS_SUCCESS, dataAds: data};
    case types.ADD_ADS_SUCCESS:
      return{type: types.ADD_ADS_SUCCESS, dataAds: data};
    case types.LOAD_ADS_SUCCESS:
      return{type: types.LOAD_ADS_SUCCESS, dataAds: data};
    case types.GET_ADS_SUCCESS:
      return{type: types.GET_ADS_SUCCESS, dataAds: data};
    case types.UPDATE_ADS_SUCCESS:
      return{type: types.UPDATE_ADS_SUCCESS, dataAds: data};
    case types.CHANGE_STATE_ADS_SUCCESS:
      return{type: types.CHANGE_STATE_ADS_SUCCESS, dataAds: data};
    case types.LOAD_ADS_VIDEO_SUCCESS:
      return{type: types.LOAD_ADS_VIDEO_SUCCESS, dataAds: data};
    case types.GET_ADS_VIDEO_SUCCESS:
      return{type: types.GET_ADS_VIDEO_SUCCESS, dataAds: data};
    case types.ADS_VIDEO_CREDIT_SUCCESS:
      return{type: types.ADS_VIDEO_CREDIT_SUCCESS, dataAds: data};
    default:
      return null;
  }

}

export function processingError(err,type){
  return {type: type, error: err};
}
export function getJobs(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      type: Constants.TYPE_JOBS,
      status: Constants.STATUS_ACTIVE
    };
    httpRequest.post(urlRequestApi.common.cmTypeList,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_JOBS_ERROR));
      }else{
        dispatch(processingSuccess(res,types.GET_JOBS_SUCCESS));
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
    httpRequest.post(urlRequestApi.shopPost.spGet,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_POST_ERROR));
      }else{
        dispatch(processingSuccess(res,types.GET_POST_SUCCESS));
      }
    });
  };
}
export function getAdsById(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idAds:params.idAds
    };
    httpRequest.post(urlRequestApi.postAds.postAdsGet,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_ADS_ERROR));
      }else{
        dispatch(processingSuccess(res,types.GET_ADS_SUCCESS));
      }
    });
  };
}
export function adsQuery(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      location:params.location,
      radius:params.km,
      gender:parseInt(params.gender),
      ageMin:parseInt(params.oldMin),
      ageMax:parseInt(params.oldMax)
    };
    if(params.job != ''){
      data.job = params.job;
    }
    httpRequest.post(urlRequestApi.postAds.postAdsQuery,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.ADS_QUERY_ERROR));
      }else{
        dispatch(processingSuccess(res,types.ADS_QUERY_SUCCESS));
      }
    });
  };
}
export function listAdsByPost(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idPost:params.idPost
    };
    httpRequest.post(urlRequestApi.postAds.postAdsList,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_ADS_ERROR));
      }else{
        dispatch(processingSuccess(res,types.LOAD_ADS_SUCCESS));
      }
    });
  };
}
export function getPriceAds(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    httpRequest.post(urlRequestApi.setting.settingGetAdsPrice,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_PRICE_ADS_ERROR));
      }else{
        dispatch(processingSuccess(res,types.GET_PRICE_ADS_SUCCESS));
      }
    });
  };
}
export function addAds(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      dateStart:params.dateStart,
      budget:params.budget,
      radius:params.km,
      gender:parseInt(params.gender),
      job:params.job,
      ageMin:parseInt(params.oldMin),
      ageMax:parseInt(params.oldMax),
      location:params.location,
      totalAds:params.total,
      state: Constants.STATUS_PENDING,
      idPost:params.idPost,
      name:params.name
    };
    httpRequest.post(urlRequestApi.postAds.postAdsCreate,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.ADD__ADS_ERROR));
      }else{
        dispatch(processingSuccess(res,types.ADD_ADS_SUCCESS));
      }
    });
  };
}
export function updateAds(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      dateStart:params.dateStart,
      budget:params.budget,
      radius:params.km,
      gender:parseInt(params.gender),
      job:params.job,
      ageMin:parseInt(params.oldMin),
      ageMax:parseInt(params.oldMax),
      location:params.location,
      totalAds:params.total,
      state: Constants.STATUS_PENDING,
      idPost:params.idPost,
      name:params.name,
      idAds:params.id
    };
    httpRequest.post(urlRequestApi.postAds.postAdsUpdate,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.UPDATE_ADS_ERROR));
      }else{
        dispatch(processingSuccess(res,types.UPDATE_ADS_SUCCESS));
      }
    });
  };
}
export function changStateAds(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idAds:params.id
    };
    if(params.state== Constants.STATE_ACTIVE||params.state==Constants.STATE_PENDING){
      data['state']=params.state;
    }
    if(params.status==Constants.STATUS_DELETE){
      data['status']=params.status;
    }
    httpRequest.post(urlRequestApi.postAds.postAdsUpdate,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.CHANGE_STATE_ADS_ERROR));
      }else{
        dispatch(processingSuccess(res,types.CHANGE_STATE_ADS_SUCCESS));
      }
    });
  };
}
export function listVideoAds(params){
  if (!params.isView) params.isView = 0;

  console.log("isView isViewisView",params.isView);
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      page:params.page,
      isView: params.isView
    };
      httpRequest.post(urlRequestApi.adsVideo.adsVideoList,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_ADS_VIDEO_ERROR));
      }else{
        dispatch(processingSuccess(res,types.LOAD_ADS_VIDEO_SUCCESS));
      }
    });
  };
}
export function getAdsVideo(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idAdvertise:params.id
    };
    httpRequest.post(urlRequestApi.adsVideo.adsVideoGet,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_ADS_VIDEO_ERROR));
      }else{
        dispatch(processingSuccess(res,types.GET_ADS_VIDEO_SUCCESS));
      }
    });
  };
}
export function creditAdsVideo(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idAdvertise:params.id,
      time:params.time
    };
    httpRequest.post(urlRequestApi.adsVideo.adsVideoCredit,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.ADS_VIDEO_CREDIT_ERROR));
      }else{
        dispatch(processingSuccess(res,types.ADS_VIDEO_CREDIT_SUCCESS));
      }
    });
  };
}
