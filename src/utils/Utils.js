/**
 * Created by THIPHUNG on 11/25/2016.
 */
import CryptoJS from 'crypto-js';
let Constant=require('../services/Constants');
let httpRequest=require('../services/httpRequest');
let en=require('../translate/en');
let vi=require('../translate/vi');
export function isInt(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
}
export function format_date(strdate)
{
  if(strdate){
    if(strdate.length>0) {
      var date=strdate.split("/");
      return date[2]+'-'+date[1]+'-'+date[0];
    }
  }
  return null;
}

export function isEmpty(obj) {
  if (obj == null) return true;
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;
  if (typeof obj !== "object") return true;
  for (let key in obj) {
    // if (hasOwnProperty.call(obj, key)) return false;
    if(obj[key].length!='') return false;
  }

  return true;
}
export function format_price(number)
{
  var array = [];
  var result = "";
  var count = 0;
  var number = number.toString();
  if(number.length <3){return number}
  for(var i = number.length-1; i>=0; i--){
    count+=1;
    array.push(number[i]);
    if(count==3 && i>=1){ array.push(",");
      count = 0;
    }
  }
  for(var i = array.length -1; i>=0; i--){
    result += array[i];
  }
  return result;
}

export function checkSession() {
  if (typeof localStorage  != 'undefined') {
    if (localStorage.getItem('user') == null) {
      return false;
    }
  }
  return true;
}
export function getUserByKey(key) {
  if(checkSession()) {
    let user = httpRequest.aesDecrypt(localStorage.getItem('user'));
    return user[key];
  }
  return '';
}
export function compareTwoDate(data){
  let dateInput=data[0];
  let dateCurrent=data[1];
  let check=false;
  dateInput=dateInput.split('/');
  dateCurrent=dateCurrent.split('/');
  if(parseInt(dateInput[2])>parseInt(dateCurrent[2])){
    check=false;
  }else{
    if(parseInt(dateInput[2])<parseInt(dateCurrent[2])){
      check=true;
    }else{
      if(dateInput[1]>dateCurrent[1]){
        check=false;
      }else{
        if(parseInt(dateInput[1])<parseInt(dateCurrent[1])){
          check=true;
        }else{
          if(dateInput[0]>dateCurrent[0]){
            check=false;
          }else{
            if(parseInt(dateInput[0])<parseInt(dateCurrent[0])||parseInt(dateInput[0])==parseInt(dateCurrent[0])) {
              check = true;
            }else{
              check=false;
            }
          }
        }
      }
    }
  }
  return check;
}
export function setTemporaryData(key,value) {
  let tempData =
    localStorage.getItem('temporaryData')!=null?
      httpRequest.aesDecrypt(localStorage.getItem('temporaryData'))
    :
      {};
  tempData[key]=value;
  localStorage.setItem('temporaryData',httpRequest.aesEncrypt(tempData));
}
export function changLanguage() {
  try {
    if(localStorage.getItem('lng')==null) {
      return vi;
    }else{
      if(localStorage.getItem('lng')=='vi'){
        return vi;
      }else{
        return en;
      }
    }
  }
  catch (e) {
    return false;
  }
  return false;
}
export function getTemporaryData(key) {
  try {
    if(localStorage.getItem('temporaryData')!=null) {
      let tempData = httpRequest.aesDecrypt(localStorage.getItem('temporaryData'));
      return tempData[key];
    }
  }
  catch (e) {
    return false;
  }
  return false;
}
export function aesDecrypt(str) {
  return JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(str, CryptoJS.enc.Base64.parse(Constant.encryptKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })));
}
export function aesEncrypt(data) {

  return CryptoJS.AES.encrypt(JSON.stringify(data),CryptoJS.enc.Base64.parse(Constant.encryptKey),{ mode: CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
}
export function removeTemporaryData(key) {
  let tempData = localStorage.getItem('temporaryData')!=null?aesDecrypt(localStorage.getItem('temporaryData')):{};
  delete tempData[key];
  localStorage.setItem('temporaryData',aesEncrypt(tempData));
}
export function getHeight(){
  var body = document.body;
  var html = document.documentElement;
  var bodyH = Math.min(
    body.scrollHeight,
    body.offsetHeight,
    body.getBoundingClientRect().height,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );
 /* console.log('body.scrollHeigh: '+body.scrollHeight);
  console.log('body.offsetHeight: '+body.offsetHeight);
  console.log('body.getBoundingClientRect().height: '+body.getBoundingClientRect().height);
  console.log('html.clientHeight: '+html.clientHeight);
  console.log('html.scrollHeight: '+html.scrollHeight);
  console.log('html.offsetHeight: '+html.offsetHeight);*/
  return bodyH;
}

export const isMobile = {
    Android: function() { return navigator.userAgent.match(/Android/i); },
    BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },
    Windows: function() { return navigator.userAgent.match(/IEMobile/i); },
    any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

export function isEmail(s) {
  const email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.test(s);
}

export function checkChartEmail(s) {
  var str = "abcdefghijklmnopqrstuvwxyz@._0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (var j = 0; j < s.length; j++) {
    if (str.indexOf(s.charAt(j)) == -1)
      return false;
  }
  return true;
}
export function findAndSliceString(str, txt) {
  let rs = '';
  for( let i = 0; i < str.length; i++){
    if(str[i] != txt){
      rs += str[i];
    }
  }
  return rs;
}
export function checkPhone(phone) {
  const rex=/^(088|089|086|098|097|096|0169|0168|0167|0166|0165|0164|0163|0162|091|094|0123|0124|0125|0127|0129|090|093|0120|0121|0122|0126|0128|092|0188|0993|0994|0995|0996|099|095)\d{7}/;
  return rex.test(phone);
}

export function validatePhoneNumber(phone) {
  let string='0123456789';
  for(let i=0; i<phone.length;i++){
    if(string.indexOf(phone.charAt(i))==-1){
      return false;
    }
  }
  return true;
}

export function checkChartPhoneNumber(phone) {
  let string='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for(let i=0; i<phone.length;i++){
    if(string.indexOf(phone.charAt(i))==-1){
      return false;
    }
  }
  return true;
}

export function reverseArray(arr) {
  let tmp = [];
  for(let i = arr.length; i >= 0; i--){
    if(arr[i]){
      tmp.push(arr[i]);
    }
  }
  return tmp;
}
export function sliceStringByLength(string, pos) {
  if(string.length > pos){
    let str = string.slice(0, pos);
    let posLast = str.lastIndexOf(' ');
    return str.slice(0, posLast) + '...';
  }else{
    return string;
  }
}
export function chuckArray(a){
  var arrays = [], size = 4;
  while (a.length > 0)
    arrays.push(a.splice(0, size));
  return arrays;
}
export function checkImagesArray(arr) {
  let total = 0;
  for(let i in arr){
    if(arr[i] != ''){
      total += 1;
    }
  }
  return total;
}
