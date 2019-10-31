/**
 * Created by TrungPhat on 27/02/17.
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

export function listAcoinSys(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      page:params.page,
      kind: Constants.KIND_LIST_ACOIN
    };
    httpRequest.post(urlRequestApi.product.productListAcoin,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_LIST_ACOIN_ERROR));
      }else{
        dispatch(processingSuccess(res,types.LOAD_LIST_ACOIN_SUCCESS));
      }
    });
  };
}
export function sendDataToNL(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idProduct:params.idProduct,
      method: params.method,
      bankCode: params.bankCode
    };
    httpRequest.post(urlRequestApi.nganluong.nganluongCheckout,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.SEND_DATA_TO_NL_ERROR));
      }else{
        dispatch(processingSuccess(res,types.SEND_DATA_TO_NL_SUCCESS));
      }
    });
  };
}
export function updatePaymentNL(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      token: params.token
    };
    httpRequest.post(urlRequestApi.nganluong.nganluongCheckoutUpdate,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.UPDATE_NL_ERROR));
      }else{
        dispatch(processingSuccess(res,types.UPDATE_NL_SUCCESS));
      }
    });
  };
}
