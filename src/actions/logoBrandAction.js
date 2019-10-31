/**
 * Created by TrungPhat on 24/05/2017
 */

import * as types from './actionTypes';
import CryptoJS from 'crypto-js';
let httpRequest = require('../services/httpRequest');
let Session=require('../utils/Utils');
var Constants=require('../services/Constants');
const urlRequestApi = require('../url/urlRequestApi');

export function processingSuccess(data,type){
  return {type: type, data: data};
}
export function processingError(err,type){
  return {type: type, error: err};
}
export function getLogo(){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    httpRequest.post(urlRequestApi.user.userGetLogo,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_LOGO_ERROR));
      }else{
        dispatch(processingSuccess(res,types.GET_LOGO_SUCCESS));
      }
    });
  };
}
export function uploadImage(file){
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
export function updateLogo(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      logoMoney:params.priceLogo,
      logo:params.logo.name,
      image_deletes:[params.image_deletes],
      password:httpRequest.aesDecrypt(localStorage.getItem('user')).password
    };
    httpRequest.post(urlRequestApi.user.userUpdateLogo,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.UPDATE_LOGO_ERROR));
      }else{
        dispatch(processingSuccess(res,types.UPDATE_LOGO_SUCCESS));
      }
    });
  };
}
