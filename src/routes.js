/**
 * Created by huynhngoctam on 11/12/16.
 */
import React from 'react';
import { Router,Route, IndexRoute,browserHistory, hashHistory } from 'react-router';
import App from './components/App';
import HomePage from './components/home/HomePage';
import ProfilePage from './components/profile/ProfilePage';
import ManageStorePage from './components/store/ManageAllStoresPage';
import SearchPage from './components/search/SearchShopsPage';
import CreateShop from './components/store/CreateShop';
import RegisterLoginPage from './components/login_register/RegisterLoginPage';
import RegisterActive from './components/login_register/RegisterActive';
import UpdateProfile from './components/profile/UpdateProfile';
import ForgotPassword from './components/login_register/ForgotPassword';
import ResetPassword from './components/login_register/ResetPassword';
import FindFriendPage from './components/friends/FindFriendPage';
import FriendPage from './components/friends/FriendsPage';
import CoinPage from './components/coin/CoinPage';
import StorePageAdmin from './components/store/StorePageAdmin';
import AcceptFriendPage from './components/friends/AcceptFriendPage';
import ManageMessagesPage from './components/messages/ManageMessagesPage';
import SendMessagesPage from './components/messages/SendMessagesPage';
import SendMessagesOneUser from './components/messages/SendMessagesOneUser';
import UpdateShop from './components/store/UpdateShop';
import CreatePost from './components/post/CreateUpdatePost';
import PostViewPage from './components/post/PostViewPage';
import ItemsPage from './components/items/ItemsPage';
import ListAdsByPost from './components/advertisement/ManageAdsByPost';
import CreateUpdateAdsPost from './components/advertisement/CreateUpdateAdsPost';
import Transaction from './components/transaction/Transaction';
import ACoinTransfer from './components/transaction/ACoinTransfer';
import CreateUpdatePost from './components/profile/ProfileCreateUpdatePost';
import AdsVideoPage from './components/advertisement/AdsVideoPage';
import AdsVideoView from './components/advertisement/AdsVideoView';
import Notifications from './components/notifications/Notifications';
import LogoBrand from './components/logobrand/LogoBrand';
import ChoRaoVat from './components/search/ChoRaoVat';
import ChoRaoVatV2 from './components/search/ChoRaoVatV2';
import ChoRaoVatChild from './components/search/ChoRaoVatChild';
import SearchShopResult from './components/search/SearchShopResult';
import InfoUserById from './components/profile/InfoUserById';
import SearchOrther from './components/search/SearchOrther';
import BuyCoinResult from './components/coin/BuyCoinResult';

let Session = require('./utils/Utils');

var ReactGA = require('react-ga'); // require the react-ga module
ReactGA.initialize('UA-104700607-1'); // add your UA code
function logPageView() { // add this function to your component
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
}

function checkLogin () {
  if (!Session.checkSession()) {
    browserHistory.push("/login?require=login");
  }
}


export default (
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route path="/login" component={RegisterLoginPage}/>
    <Route path="/register-active" component={RegisterActive}/>
    <Route path="/login-identify" component={ForgotPassword}/>
    <Route path="/recover-password" component={ResetPassword}/>

    <Route path="/" component={App}>
      <IndexRoute components={ChoRaoVatV2}/>
      <Route path="rao-vat/:title-:id.html" component={ChoRaoVatChild}/>
      <Route path="tim-kiem" component={SearchPage} />
      <Route path="tim-kiem-noi-khac" component={SearchOrther}/>
      <Route path="tim-kiem-cua-hang" component={SearchShopResult}/>
      <Route path="san-pham/:title-:id.html" component={PostViewPage}/>
      <Route path="xem-cua-hang/:title-:id.html" component={StorePageAdmin}/>

      <Route onEnter={checkLogin}>
        <Route path="/newsfeed" component={HomePage}/>
        <Route path="thong-tin-ca-nhan" component={ProfilePage}/>
          <Route path="detail/:id" component={InfoUserById}/>
          <Route path="xem-tin-rao/:id" component={HomePage}/>
          <Route path="quan-ly-cua-hang" component={ManageStorePage}/>
          <Route path="tao-cua-hang" component={CreateShop}/>
          <Route path="sua-cua-hang/:id" component={UpdateShop}/>
          <Route path="cap-nhat-thong-tin" component={UpdateProfile}/>
          <Route path="tim-kiem-ban-be" component={FindFriendPage}/>
          <Route path="danh-sach-ban-be" component={FriendPage}/>
          <Route path="nap-coin" component={CoinPage}/>
          <Route path="/friends-requests" component={AcceptFriendPage}/>
          <Route path="/manage-messages" component={ManageMessagesPage}/>
          <Route path="/messages/:id" component={SendMessagesPage}/>
          <Route path="/message/:id" component={SendMessagesOneUser}/>
          <Route path="/post/:id" component={CreatePost}/>
          <Route path="/post/:id/edit/:id" component={CreatePost}/>
          <Route path="/:id/items/parent" component={ItemsPage}/>
          <Route path="/:id/items/child" component={ItemsPage}/>
          <Route path="/advertisement/:id" component={ListAdsByPost}/>
          <Route path="/advertisement/:id/create" component={CreateUpdateAdsPost}/>
          <Route path="/advertisement/:id/update" component={CreateUpdateAdsPost}/>
          <Route path="/transaction" component={Transaction}/>
          <Route path="/acoin-transfer/:id" component={ACoinTransfer}/>
          <Route path="/acoin-transfer/:id/confirm" component={ACoinTransfer}/>
          <Route path="/acoin-transfer/:id/success" component={ACoinTransfer}/>
          <Route path="/user/post" component={CreateUpdatePost}/>
          <Route path="/user/post/:id" component={CreateUpdatePost}/>
          <Route path="/danh-sach-quang-cao" component={AdsVideoPage}/>
          <Route path="/xem-quang-cao/:id" component={AdsVideoView}/>
          <Route path="/notification" component={Notifications}/>
          <Route path="/logo-brand" component={LogoBrand}/>
          <Route path="/tim-kiem-cho-rao-vat" component={ChoRaoVat}/>
          <Route path="/payment/nl/success/:id" component={BuyCoinResult}/>
          <Route path="/payment/nl/error/:id" component={BuyCoinResult}/>
        </Route>


    </Route>
  </Router>
);
