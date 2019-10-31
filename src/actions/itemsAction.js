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
  switch (type){
    case types.LOAD_ITEM_SUCCESS:
      return{type: types.LOAD_ITEM_SUCCESS, dataList: data};
    case types.BUY_ITEM_SUCCESS:
      return{type: types.BUY_ITEM_SUCCESS, dataList: data};
    case types.GET_SHOP_SUCCESS:
      return{type: types.GET_SHOP_SUCCESS, dataShops: data};
    default:
      return null;
  }
}

export function processingError(err,type){
  return {type: type, error: err};
}

export function listItem(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      page:params.page
    };
    if(params.parent && params.parent != Constants.DEFAULT_PARENT){
      data['parent']=params.parent;
    }
    httpRequest.post(urlRequestApi.product.productListPT,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.LOAD_ITEM_ERROR));
      }else{
        res.parent = params.parent;
        dispatch(processingSuccess(res,types.LOAD_ITEM_SUCCESS));
      }
    });
  };
}

export function buyItem(params){
  return function(dispatch) {
    let data={
      platform:Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idShop:params.idShop,
      idProduct:params.id,
      kind: Constants.KIND_BUY_PRODUCT_PT
    };
    httpRequest.post(urlRequestApi.product.productBuyProductPT,data,function cb(err,res){
      if(err){
        dispatch(processingError(err,types.BUY_ITEM_ERROR));
      }else{
        dispatch(processingSuccess(res,types.BUY_ITEM_SUCCESS));
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
