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
    case types.LOAD_TRS_SUCCESS:
      return{type: types.LOAD_TRS_SUCCESS, dataTrs: data};
    case types.GET_MONEY_SUCCESS:
      return{type: types.GET_MONEY_SUCCESS, data: data};
    case types.GET_USER_SUCCESS:
      return{type: types.GET_USER_SUCCESS, dataUser: data};
    case types.TRANSFER_REQUEST_SUCCESS:
      return{type: types.TRANSFER_REQUEST_SUCCESS, data: data};
    case types.TRANSFER_MONEY_SUCCESS:
      return{type: types.TRANSFER_MONEY_SUCCESS, data: data};
    default:
      return null;
  }

}
export function processingError(err,type){
  return {type: type, error: err};
}
export function getTrs(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      page:params.page
    };
    httpRequest.post(urlRequestApi.user.userGetTransaction,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_TRS_ERROR));
      }else{
        dispatch(processingSuccess(res,types.LOAD_TRS_SUCCESS));
      }
    });
  };
}

export function getMoney(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
    };
    httpRequest.post(urlRequestApi.user.userGetMoney,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_MONEY_ERROR));
      }else{
        dispatch(processingSuccess(res,types.GET_MONEY_SUCCESS));
      }
    });
  };
}
export function getUserById(idUser){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      userId:idUser,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    httpRequest.post(urlRequestApi.user.userGet,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.GET_USER_ERROR));
      }else{
        dispatch(processingSuccess(res,types.GET_USER_SUCCESS));
      }
    });
  };
}
export function tranferRequest(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      idUserReceived:params.idUserReceived,
      note:params.note,
      balance:params.balance,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    httpRequest.post(urlRequestApi.user.userTranferRequest,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.TRANSFER_REQUEST_ERROR));
      }else{
        dispatch(processingSuccess(res,types.TRANSFER_REQUEST_SUCCESS));
      }
    });
  };
}
export function tranferMoney(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      otp:params.otp,
      ref:params.ref,
      session:localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    httpRequest.post(urlRequestApi.user.userTranferMoney,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.TRANSFER_MONEY_ERROR));
      }else{
        dispatch(processingSuccess(res,types.TRANSFER_MONEY_SUCCESS));
      }
    });
  };
}
