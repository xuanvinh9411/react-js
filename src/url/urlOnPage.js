const urlOnPage = {
  default: '/',
  shop:{
    shopView: '/xem-cua-hang/',
    shopManages: '/quan-ly-cua-hang',
    shopEdit: "/sua-cua-hang/",

  },
  search: {
    searchResult: '/tim-kiem-cua-hang',
    searchIndex: '/tim-kiem',
    searchOrther: '/tim-kiem-noi-khac',
  },
  messages:{
    messagesSendMessages:'/messages/',
    messagesManage:'/manage-messages',

  },
  post:{
    postCreateUpdate: "/post/",
    postViewPage:"/san-pham/",

  },
  user:{
    userViewProfileFriend: '/detail/',
    userMyProfile: '/thong-tin-ca-nhan',
    userCreatePost: "/user/post",
    userNewsFeed: "/newsfeed",
  },
  loginRegister:{
    lrLogin: '/login',
  },
  friends:{
    friendList: '/danh-sach-ban-be',
    friendRequest: '/friends-requests',
    friendFindFriend: "/tim-kiem-ban-be",
  },
  notification:{
    notificationIndex: '/notification'
  },
  CRV: {
    CRVIndex: "/",
    CRVResultSearch: "/tim-kiem-cho-rao-vat"
  },
  ads:{
    adsVideoSysList: "/danh-sach-quang-cao",

  },
  transaction:{
    transactionList: '/transaction',
  },
  logoBrand:{
    logoBrandIndex: "/logo-brand"
  },
  coin: {
    coinBuyCoin: '/nap-coin',
    coinListBank:'/danh-sach-ngan-hang'
  }
};
module.exports = urlOnPage;
