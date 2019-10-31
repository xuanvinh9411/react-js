/**
 * Created by huynhngoctam on 11/14/16.
 */

import * as types from './actionTypes';
import CryptoJS from 'crypto-js';
let httpRequest = require('../services/httpRequest');
let Session = require('../utils/Utils');
var Constants = require('../services/Constants');
const urlRequestApi = require('../url/urlRequestApi');
export function processingSuccess(data, type) {
  switch (type) {
    case types.LOAD_SHOP_ON_PROFILE_SUCCESS:
      return {type: types.LOAD_SHOP_ON_PROFILE_SUCCESS, dataUser: data};
    case types.LOGIN_SUCCESS:
      return {type: types.LOGIN_SUCCESS, userLogin: data};
    case types.GET_MONEY_SUCCESS:
      return {type: types.GET_MONEY_SUCCESS, data: data};
    case types.REGISTER_SUCCESS:
      return {type: types.REGISTER_SUCCESS, userRegister: data};
    case types.UPDATE_PROFILE_SUCCESS:
      return {type: types.UPDATE_PROFILE_SUCCESS, userData: data};
    case types.GET_JOBS_SUCCESS:
      return {type: types.GET_JOBS_SUCCESS, userData: data};
    case types.GET_NATION_SUCCESS:
      return {type: types.GET_NATION_SUCCESS, nationData: data};
    case types.UPIMAGE_SUCCESS:
      return {type: types.UPIMAGE_SUCCESS, dataUpload: data};
    case types.FORGOT_PASSWORD_SUCCESS:
      return {type: types.FORGOT_PASSWORD_SUCCESS, dataUser: data};
    case types.CHANGE_PASSWORD_SUCCESS:
      return {type: types.CHANGE_PASSWORD_SUCCESS, dataUser: data};
    case types.FIND_FRIEND_SUCCESS:
      return {type: types.FIND_FRIEND_SUCCESS, dataUser: data};
    case types.ADD_FRIEND_SUCCESS:
      return {type: types.ADD_FRIEND_SUCCESS, dataUser: data};
    case types.LOAD_FRIEND_SUCCESS:
      return {type: types.LOAD_FRIEND_SUCCESS, dataUser: data};
    case types.LOAD_REQUEST_SUCCESS:
      return {type: types.LOAD_REQUEST_SUCCESS, dataUser: data};
    case types.ACCEPT_FRIEND_SUCCESS:
      return {type: types.ACCEPT_FRIEND_SUCCESS, dataFriend: data};
    case types.BLOCK_FRIEND_SUCCESS:
      return {type: types.BLOCK_FRIEND_SUCCESS, dataFriend: data};
    case types.UNFRIEND_SUCCESS:
      return {type: types.UNFRIEND_SUCCESS, dataFriend: data};
    case types.LOAD_BLOCK_SUCCESS:
      return {type: types.LOAD_BLOCK_SUCCESS, dataFriend: data};
    case types.UNBLOCK_FRIEND_SUCCESS:
      return {type: types.UNBLOCK_FRIEND_SUCCESS, dataFriend: data};
    case types.LOAD_INBOX_SUCCESS:
      return {type: types.LOAD_INBOX_SUCCESS, dataUser: data};
    case types.SEND_MESSAGE_SUCCESS:
      return {type: types.SEND_MESSAGE_SUCCESS, dataUser: data};
    case types.GET_USER_SUCCESS:
      return {type: types.GET_USER_SUCCESS, dataUser: data};
    case types.GET_LIST_THREAD_SUCCESS:
      return {type: types.GET_LIST_THREAD_SUCCESS, dataUser: data};
    case types.LOAD_POST_SUCCESS:
      return {type: types.LOAD_POST_SUCCESS, dataPost: data};
    case types.UPDATE_POST_SUCCESS:
      return {type: types.UPDATE_POST_SUCCESS, dataPost: data};
    case types.DELETE_POST_SUCCESS:
      return {type: types.DELETE_POST_SUCCESS, dataPost: data};
    case types.SEARCH_FRIEND_SUCCESS:
      return {type: types.SEARCH_FRIEND_SUCCESS, dataUser: data};
    case types.ACTIVE_REGISTER_SUCCESS:
      return {type: types.ACTIVE_REGISTER_SUCCESS, dataUser: data};
    case types.TRACKING_FRIEND_SUCCESS:
      return {type: types.TRACKING_FRIEND_SUCCESS, dataShops: data};
    case types.GET_FRIEND_SUCCESS:
      return {type: types.GET_FRIEND_SUCCESS, dataUser: data};
    case types.UPLOAD_BASE64_SUCCESS:
      return {type: types.UPLOAD_BASE64_SUCCESS, dataBase64: data};
    default:
      return null;
  }

}

export function processingError(err, type) {
  return {type: type, error: err};
}

export function login(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      phone: params.phoneLogin,
      password: CryptoJS.MD5(params.passwordLogin).toString(),
      session: Constants.SESSION_DEFAULT_LOGIN,
      // deviceToken: 'emczyLCTi_M:APA91bETcvGdoE1_FqYDLs5jRT8wF6t-es7yCTlakBusTtXTeKnFb_fakD7Ykqe4NfSqGbAqU2PgAYUsBUg_XsvKTxSEbYRzbpVeSDGbVRuLI9sbUN4XYHRLGwh7gIS2NCYLh9kt9mrJ',
      // deviceType: 'android'
    };
    if (params.location) {
      if (params.location[0] != 0 && params.location[1] != 0) {
        data['location'] = [params.location[1], params.location[0]]
      }
    }
    httpRequest.post(urlRequestApi.user.userLogin, data, function cb(err, res) {
      // console.log('res ====> ', res);
      if (err) {
        console.log("@@@@ err err", err);
        dispatch(processingError(err, types.LOGIN_FAILURE));
      } else {
        dispatch(processingSuccess(res, types.LOGIN_SUCCESS));
      }
    });
  };
}
export function loginFacebook(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      facebookToken: params.accessToken,
      // facebookID: params.userID,
      session: Constants.SESSION_DEFAULT_LOGIN,
    };

    httpRequest.post(urlRequestApi.user.userFacebookLogin, data, function cb(err, res) {
      // console.log('res ====> ', res);
      if (err) {
        console.log("@@@@ err err", err);
        dispatch(processingError(err, types.LOGIN_FAILURE));
      } else {
        dispatch(processingSuccess(res, types.LOGIN_SUCCESS));
      }
    });
  };
}
export function loginGoogle(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      googleToken: params.tokenId,
      session: Constants.SESSION_DEFAULT_LOGIN,
    };

    httpRequest.post(urlRequestApi.user.userGoogleLogin, data, function cb(err, res) {
      // console.log('res ====> ', res);
      if (err) {
        console.log("@@@@ err err", err);
        dispatch(processingError(err, types.LOGIN_FAILURE));
      } else {
        dispatch(processingSuccess(res, types.LOGIN_SUCCESS));
      }
    });
  };
}


export function forgotPassword(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      email: params
    };
    httpRequest.post(urlRequestApi.user.userForgotPassword, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.FORGOT_PASSWORD_ERROR));
      } else {
        dispatch(processingSuccess(res, types.FORGOT_PASSWORD_SUCCESS));
      }
    });
  };
}
export function listPostByShop(params) {
  return function (dispatch) {
    let data = {
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      platform: Constants.platform,
      page: params.page,
      show: 2
    };


    httpRequest.post(urlRequestApi.shopPost.spList, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.LOAD_POST_ERROR));
      } else {
        dispatch(processingSuccess(res, types.LOAD_POST_SUCCESS));
      }
    });
  };
}
export function updatePostHiddenPhone(params) {
  return function (dispatch) {
    let data = {
      id: params.id,
      showPhone: params.showPhone,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      platform: Constants.platform
    };
    httpRequest.post(urlRequestApi.shopPost.spUpdate, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.UPDATE_POST_ERROR));
      } else {
        dispatch(processingSuccess(res, types.UPDATE_POST_SUCCESS));
      }
    });
  };
}
export function deletePost(params) {
  return function (dispatch) {
    let data = {
      id: params.id,
      show: 2,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      platform: Constants.platform
    };
    if (params.status == Constants.STATUS_DELETE) {
      data['status'] = params.status;
    }
    httpRequest.post(urlRequestApi.shopPost.spUpdate, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.DELETE_POST_ERROR));
      } else {
        dispatch(processingSuccess(res, types.DELETE_POST_SUCCESS));
      }
    });
  };
}
export function changPassword(params) {
  return function (dispatch) {
    let data = {
      password: CryptoJS.MD5(params.password).toString(),
      platform: Constants.platform,
      email: params.email,
      temporaryPassword: params.temporaryPassword
    };
    httpRequest.post(urlRequestApi.user.userChangePassword, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.CHANGE_PASSWORD_ERROR));
      } else {
        dispatch(processingSuccess(res, types.CHANGE_PASSWORD_SUCCESS));
      }
    });
  };
}
export function registerUser(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      fullname: params.fullname,
      // address:params.address,
      password: CryptoJS.MD5(params.password).toString(),
      //  sex:parseInt(params.sex),
      // birthday:params.birthday,
      typeOtp: params.typeOtp

    };
    if (params.phone.length > 0) {
      data.phone = params.phone;
    }
    if (params.email.length > 0) {
      data.email = params.email;
    }

    // if(params.identifyNumber.length > 0){
    //   data.identifyNumber = params.identifyNumber;
    // }
    // if(params.identifyDate.length > 0){
    //   data.identifyDate = params.identifyDate;
    // }
    // if(params.identifyProvinceName.length > 0){
    //   data.identifyProvince = params.identifyProvinceName;
    // }
    httpRequest.post(urlRequestApi.user.userRegister, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.REGISTER_ERROR));
      } else {
        dispatch(processingSuccess(res, types.REGISTER_SUCCESS));
      }
    });
  };
}
export function getMoney(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
    };
    httpRequest.post(urlRequestApi.user.userGetMoney, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.GET_MONEY_ERROR));
      } else {
        dispatch(processingSuccess(res, types.GET_MONEY_SUCCESS));
      }
    });
  };
}
export function getUserById(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      userId: params,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };
    httpRequest.post(urlRequestApi.user.userGet, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.GET_USER_ERROR));
      } else {
        res.id = params;
        dispatch(processingSuccess(res, types.GET_USER_SUCCESS));
      }
    });
  };
}
export function activeRegister(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      ref: params.idUser,
      otp: params.otp
    };
    httpRequest.post(urlRequestApi.user.userActive, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.ACTIVE_REGISTER_ERROR));
      } else {
        dispatch(processingSuccess(res, types.ACTIVE_REGISTER_SUCCESS));
      }
    });
  };
}
export function updateProfile(params) {
  let data = {
    platform: Constants.platform,
    fullname: params.fullname,
    address: params.address,
    password: params.password,//CryptoJS.MD5(params.passwordSubmit).toString(),
    sex: params.sex,
    birthday: params.birthday,
    job: params.jobs.id,
    session: localStorage.getItem(Constants.SESSION_NAME_REQUEST)
  };
  if (params.avatar.length > 0) {
    data.avatar = params.avatar;
  }
  if (params.image_deletes != '') {
    data.image_deletes = params.image_deletes;
  }
  if ((params.new_password == params.re_password) && params.new_password.length > 0) {
    data['passwordNew'] = CryptoJS.MD5(params.new_password).toString();
  }
  if (params.idProvince != null) {
    data['idProvince'] = params.idProvince
  }
  if (params.idDistrict != null) {
    data['idDistrict'] = params.idDistrict
  }
  if (params.phone.length > 0) {
    data['phone'] = params.phone
  }
  if (params.email.length > 0) {
    data['email'] = params.email
  }

  return function (dispatch) {
    httpRequest.post(urlRequestApi.user.userUpdate, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.UPDATE_PROFILE_ERROR));
      } else {
        dispatch(processingSuccess(res, types.UPDATE_PROFILE_SUCCESS));
      }
    });
  };
}
export function getJobs(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      type: Constants.TYPE_JOBS,
      status: Constants.STATUS_ACTIVE
    };
    httpRequest.post(urlRequestApi.common.cmTypeList, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.GET_JOBS_ERROR));
      } else {
        dispatch(processingSuccess(res, types.GET_JOBS_SUCCESS));
      }
    });
  };
}
export function findFriend(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      phone: params
    };
    httpRequest.post(urlRequestApi.user.userFindFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.FIND_FRIEND_ERROR));
      } else {
        dispatch(processingSuccess(res, types.FIND_FRIEND_SUCCESS));
      }
    });
  };
}
export function acceptFriend(params) {
  let data = {
    platform: Constants.platform,
    session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
    ref: params
  };
  return function (dispatch) {
    httpRequest.post(urlRequestApi.user.userAcceptFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.ACCEPT_FRIEND_ERROR));
      } else {
        dispatch(processingSuccess(res, types.ACCEPT_FRIEND_SUCCESS));
      }
    });
  };
}
export function loadFriend(params) {
  let data = {
    platform: Constants.platform,
    session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
    status: Constants.STATUS_ACTIVE,
    page: params.page
  };
  return function (dispatch) {
    httpRequest.post(urlRequestApi.user.userListFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.LOAD_FRIEND_ERROR));
      } else {
        dispatch(processingSuccess(res, types.LOAD_FRIEND_SUCCESS));
      }
    });
  };
}
export function blockFriend(params) {
  let data = {
    platform: Constants.platform,
    session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
    ref: params.ref
  };

  return function (dispatch) {
    httpRequest.post(urlRequestApi.user.userBlockFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.BLOCK_FRIEND_ERROR));
      } else {
        if (params.action) {
          if (params.action.length > 0) {
            res.action = params.action;
          }
        }
        dispatch(processingSuccess(res, types.BLOCK_FRIEND_SUCCESS));
      }
    });
  };
}
export function loadBlock(params) {
  let data = {
    platform: Constants.platform,
    session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
    status: Constants.STATUS_DELETE,
    page: params.page
  };
  return function (dispatch) {
    httpRequest.post(urlRequestApi.user.userListFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.LOAD_BLOCK_ERROR));
      } else {
        dispatch(processingSuccess(res, types.LOAD_BLOCK_SUCCESS));
      }
    });
  };
}
export function loadRequest(params) {
  let data = {
    platform: Constants.platform,
    session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
    status: Constants.STATUS_PENDING,
    page: params.page
  };
  return function (dispatch) {
    httpRequest.post(urlRequestApi.user.userListFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.LOAD_REQUEST_ERROR));
      } else {
        dispatch(processingSuccess(res, types.LOAD_REQUEST_SUCCESS));
      }
    });
  };
}
export function unFriend(params) {
  let data = {
    platform: Constants.platform,
    session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
    ref: params.ref
  };
  return function (dispatch) {
    httpRequest.post(urlRequestApi.user.userDeleteFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.UNFRIEND_ERROR));
      } else {
        if (params.action) {
          if (params.action.length > 0) {
            res.action = params.action;
          }
        }
        dispatch(processingSuccess(res, types.UNFRIEND_SUCCESS));
      }
    });
  };
}
export function unBlock(params) {
  let data = {
    platform: Constants.platform,
    session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
    ref: params.id
  };
  return function (dispatch) {
    httpRequest.post(urlRequestApi.user.userUnBlockFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.UNBLOCK_FRIEND_ERROR));
      } else {
        dispatch(processingSuccess(res, types.UNBLOCK_FRIEND_SUCCESS));
      }
    });
  };
}
export function addFriend(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      userIdFriend: params
    };
    httpRequest.post(urlRequestApi.user.userAddFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.ADD_FRIEND_ERROR));
      } else {
        dispatch(processingSuccess(res, types.ADD_FRIEND_SUCCESS));
      }
    });
  };
}
export function getNation(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform
    };
    if (params != '') {
      data['parent'] = params;
    }
    httpRequest.post(urlRequestApi.nation.nationList, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.GET_NATION_ERROR));
      } else {
        dispatch(processingSuccess(res, types.GET_NATION_SUCCESS));
      }
    });
  };
}
export function uploadImage(file) {
  return function (dispatch) {
    httpRequest.postImage(file, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.UPIMAGE_ERROR));
      } else {
        dispatch(processingSuccess(res, types.UPIMAGE_SUCCESS));
      }
    });
  }
}
export function search_friend(params) {
  let data = {
    platform: Constants.platform,
    session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
    keyword: params
  };
  return function (dispatch) {
    httpRequest.post(urlRequestApi.user.userSearchFriend, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.SEARCH_FRIEND_ERROR));
      } else {
        dispatch(processingSuccess(res, types.SEARCH_FRIEND_SUCCESS));
      }
    });
  };
}
export function trackingFriend(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      userIdFriend: params.userIdFriend
    };
    params.shopinfo && params.shopinfo == Constants.STATUS_SHOP_INFO ?
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
export function friendFeed(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      idUserFriend: params.userIdFriend,
      page: params.page
    };
    httpRequest.post(urlRequestApi.user.userFriendFeed, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.GET_FRIEND_ERROR));
      } else {
        dispatch(processingSuccess(res, types.GET_FRIEND_SUCCESS));
      }
    });
  }
}
export function loadListShop(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      page: params.page,
      status: Constants.STATUS_ACTIVE
    };
    if (params.userId != '') {
      data['userId'] = params.userId;
    }
    httpRequest.post(urlRequestApi.shop.shopList, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.LOAD_SHOP_ON_PROFILE_ERROR));
      } else {
        dispatch(processingSuccess(res, types.LOAD_SHOP_ON_PROFILE_SUCCESS));
      }
    });
  };
}
export function uploadBase64(params) {
  return function (dispatch) {
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
      images: params
    };
    httpRequest.post(urlRequestApi.common.uploadBase64, data, function cb(err, res) {
      if (err) {
        dispatch(processingError(err, types.UPLOAD_BASE64_ERROR));
      } else {
        dispatch(processingSuccess(res, types.UPLOAD_BASE64_SUCCESS));
      }
    });
  }
}
