/**
 * Created by THIPHUNG on 11/22/2016.
 */
import CryptoJS from 'crypto-js';
import * as types from '../actions/actionTypes';
import {browserHistory} from 'react-router';
import axios from 'axios';
var Constants=require('./Constants');
let otp = require('../utils/TOTPService');
import request from 'superagent';
const https = require('https');
let httpRequest = {

  post: function (path, data, cbs) {
    if (localStorage.getItem('time')) {
      //deltaTime=Math.floor(Date.now() / 1000) - result.data.timestamp);
      //da co thoi gian roi
      httpRequest.callHttp(Constants.linkApi + path, data, localStorage.getItem('time'), function cb(error, response) {

        if (error) {
          cbs(error, null);
        } else {
          cbs(null,response);
        }
      });
    } else {
      //get time from server
      httpRequest.getTime(function cb(err, res) {
        if (err) {
          cbs(err, null);
        } else {
          localStorage.setItem('time', Math.floor(Date.now() / 1000) - res.data.timestamp);
          //goi request
          httpRequest.callHttp(Constants.linkApi + path, data, localStorage.getItem('time'), function cb(error, response) {

            if (error) {
              cbs(error, null);
            } else {
              cbs(null, response);
            }
          });
        }
      });
      /*httpRequest.getTime(function cb(err, res){

        }
      )*/
    }

  },

  callHttp: function (link, params,time, cb,times=0) {
    let pkg = {
      app: Constants.appName,
      otp: otp.getOTP(types.OTP_KEY, time),
      data:httpRequest.aesEncrypt(params).toString()
    };
    let hash = CryptoJS.MD5(pkg.app + pkg.data + pkg.otp).toString();
    pkg.hash = hash;
    request.post(link).send(pkg)
      .end((error,res) => {
        if(error){
          cb(error);
        }
        else {
          if (res.status == 200) {
            let dataRes=httpRequest.aesDecrypt(res.text);
            if(dataRes.code==Constants.RESPONSE_CODE_OTP_INVALID){
              localStorage.setItem('time', Math.floor(Date.now() / 1000) - dataRes.data.timestamp);
              times++;
              if(times<3) {
                httpRequest.callHttp(link, params,localStorage.getItem('time'), cb,times);
              }else
                cb(null,dataRes);
            }
            else if(dataRes.code == Constants.RESPONSE_CODE_SESSION_INVALID){

              localStorage.removeItem('sessionAround');
              localStorage.removeItem('user');
              browserHistory.push('/login');
            }
            else{
              cb(null,dataRes);
            }
          }
        }
      });
  },

  getTime: function (cb) {
    let app = Constants.appName;
    let pkg = {
      app: Constants.appName,
    };
    return request.post(Constants.linkApi + '/api/time')
      .send(pkg)
      .end((error,res) => {
        if(error){
          cb(error, null);
        }
        else{
          cb(null, httpRequest.aesDecrypt(res.text));
        }
      })
  },

  postImage: function (image,cb,times=0) {

    if (!localStorage.getItem('time')) {
      httpRequest.getTime(function cb(err, res) {
        if (err) {
          console.log(err);
        } else {
          localStorage.setItem('time', Math.floor(Date.now() / 1000) - res.data.timestamp);
        }
      });
    }
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem('sessionAround')
    };
    let requestData=httpRequest.aesEncrypt(data).toString();
    let otpValue=otp.getOTP(types.OTP_KEY, localStorage.getItem("time"));
    let upload = request.post(Constants.linkApi+"/v1/storage/upload")
      .field('app', Constants.appName)
      .field('otp',otpValue)
      .field('data',requestData)
      .field('hash',CryptoJS.MD5(Constants.appName+requestData+otpValue).toString())
      .field('images', image);

    upload.end((err, response) => {
      if (err) {
        cb(err,null);
      }else{
        let dataDecrypt=httpRequest.aesDecrypt(response.text);
        if(dataDecrypt.code==Constants.RESPONSE_CODE_SESSION_INVALID){
          localStorage.removeItem('sessionAround');
          localStorage.removeItem('user');
          browserHistory.push("/login");
        }
        else if(dataDecrypt.code==Constants.RESPONSE_CODE_OTP_INVALID){
          localStorage.setItem('time', Math.floor(Date.now() / 1000) - dataDecrypt.data.timestamp);
          times++;
          if(times<3)
            httpRequest.postImage(image,cb,times);
          else
            cb(null,dataDecrypt);
        }
        else {
          cb(null,dataDecrypt);
        }
      }
    });

  },
  googleApiGet: function (link,cb) {
    return request.get(link).end((error,res) => {
      if(error){
        cb(error, null);
      }
      else{
        cb(null,res.body);
      }

    })
  },
  getDes: function (link,cb) {

    return request.get(link)
      .end((error,res) => {
      if(error){
        cb(error, null);
      }
      else{
        cb(null,res.body);
      }
    })
  },
  aesDecrypt: function (str) {
    if(str){
      return JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(str, CryptoJS.enc.Base64.parse(btoa(types.AES_KEY)), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      })));
    }
  },
  aesEncrypt: function (data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Base64.parse(btoa(types.AES_KEY)), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
  }
};
module.exports = httpRequest;
