/**
 * Created by TrungPhat on 19/05/2017
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
export function getNotification(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      page:params
    };
    httpRequest.post(urlRequestApi.user.userNotification,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_NOTIFICATION_ERROR));
      }else{
        res.params=data;
        dispatch(processingSuccess(res,types.LOAD_NOTIFICATION_SUCCESS));
      }
    });
  };
}
