var version = '/v4';
var urlRequestApi = {
  common:{
    cmTrackingFriend: version + "/user/tracking_friend",
    cmTypeList:version + "/types/list",
    googleApiGet: 'https://maps.googleapis.com/maps/api/geocode/json?&components=country:VN&address=',
    uploadBase64: version + "/storage/upload_base_64",
  },
  shopPost:{
    spAddLikeAndComment:version + "/shoppost/social_add",
    spListComments: version + "/shoppost/social_list",
    spGet: version + "/shoppost/get",
    spUnLike: version + "/shoppost/social_delete",
    spCreate: version + "/shoppost/create",
    spUpdate: version + "/shoppost/update",
    spList: version + "/shoppost/list",
    spSearchPost: version + "/shoppost/search_post_forum",
    spNewestPost: version + "/shoppost/newest_post",
    reUpPost: version + "/shoppost/reup_post",
    topPost: version + "/shoppost/ontop_post",
  },
  shop:{
    shopList: version + "/shop/list",
    shopGet: version + "/shop/get",
    shopSearch: version + "/shop/search",
    shopCreate: version + "/shop/create",
    shopUpdate: version + "/shop/update",
    shopReport: version + "/shop/report",
    reportLogoThuongHieu: version + '/reportaction/addclicklogobyuser'
  },
  postAds:{
    postAdsGet: version + "/postads/get",
    postAdsQuery: version + "/postads/query",
    postAdsList: version + "/postads/list",
    postAdsCreate: version + "/postads/create",
    postAdsUpdate: version + "/postads/update",

  },
  setting:{
    settingGetAdsPrice: version + "/setting/get_ads_price"
  },
  adsVideo:{
    adsVideoList: version + "/advertise/list_ads",
    adsVideoGet: version + "/advertise/get",
    adsVideoCredit: version + "/advertise/credit",
    adsRequestSysAds: version + "/advertise/request_system_ads",
    adsClickSysAds: version + "/advertise/click_system_ads",
    adsBannerWebAdsFrontEnd: version + "/advertise/list_banner_web_ads_frontend",
    addActionBannerWeb: version + "/reportaction/addactionbannerweb"
  },
  user:{
    userNotification: version + "/user/notification",
    userNotificationUpdate: version + "/user/notification_update",
    userFriendFeed: version + "/user/friend_feed",
    userFindFriend: version + "/user/find_friend",
    userAddFriend: version + "/user/add_friend",
    userAcceptFriend: version + "/user/accept_friend",
    userListFriend: version + "/user/list_friend",
    userBlockFriend: version + "/user/block_friend",
    userDeleteFriend: version + "/user/delete_friend",
    userUnBlockFriend: version + "/user/unblock_friend",
    userSearchFriend: version + "/user/search_friend",
    userGetLogo: version + "/user/get_logo",
    userUpdateLogo: version + "/user/update_logo",
    userGet: version + "/user/get",
    userGetMoney: version + "/user/get_money",
    userGetTransaction: version + "/user/get_transaction",
    userTranferRequest: version + "/user/tranfer_request",
    userTranferMoney: version + "/user/tranfer_money",
    userLogin: version + "/user/login",
    userFacebookLogin: version + "/user/loginFacebook",
    userGoogleLogin: version + "/user/loginGoogle",
    userForgotPassword: version + "/user/forgot_password",
    userChangePassword: version + "/user/change_password",
    userRegister: version + "/user/register",
    userActive: version + "/user/active",
    userUpdate: version + "/user/update",
    userNewsFeed: version + "/user/news_feed",
    userUpdatePosition: version + '/user/update_pos',//Đưa lên location = [ long, la]
  },
  userInbox:{
    userInboxCountNew: version + "/userinbox/count_new",
    userInboxListByUserTo: version + "/userinbox/list_by_user_to",
    userInboxList: version + "/userinbox/list",
    userInboxListByTheadId: version + "/userinbox/list_by_thread",
    userInboxSendMessage: version + "/userinbox/send_message",
    userInboxDeleteMessage: version + "/userinbox/delete_message",
  },
  product:{
    productListPT: version + "/product/list_pt",
    productBuyProductPT: version + "/product/buy_product_pt",
    productListAcoin: version + "/product/list_product"
  },
  nation:{
    nationList: version + "/nation/list",
  },
  nganluong:{
    nganluongCheckout: version + '/product/nganluong_checkout',
    nganluongCheckoutUpdate: version + '/product/nganluong_checkout_update'
  }
};
module.exports = urlRequestApi;
