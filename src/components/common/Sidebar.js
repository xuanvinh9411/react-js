/**
 * Created by THIPHUNG on 11/4/2016.
 */
import React from "react";
import {Link} from "react-router";
import {browserHistory} from "react-router";
import {connect} from 'react-redux';
import * as userAction from '../../actions/userAction';
import * as actionType from '../../actions/actionTypes';
import {bindActionCreators} from 'redux';

let Constants = require('../../services/Constants');
let Session = require('../../utils/Utils');
let urlOnPage = require('../../url/urlOnPage');
export class Sidebar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      displayUl: 'none',
      displayUl2: 'none'
    }
    this.onGotoMobile = this.onGotoMobile.bind(this);
  }

  /*onClickSignout(){
   sessionStorage.clear();
   localStorage.removeItem('sessionAround');
   localStorage.removeItem('user');
   window.location.href = urlOnPage.loginRegister.lrLogin;
   }*/
  onChangDisplay() {
    this.setState({displayUl: !this.state.displayUl});
  }

  onGotoMobile(url) {
    this.setState({displayUl: 'none'});
    browserHistory.push(url);
  }

  onClickSignout() {
    sessionStorage.clear();
    localStorage.removeItem('sessionAround');
    localStorage.removeItem('user');
    Session.removeTemporaryData('dataResultSearchPost');
    window.location.href = urlOnPage.loginRegister.lrLogin;
  }

  render() {
    let str = this.props.pathname == '/' ? '/' : this.props.pathname;
    if (str.indexOf('rao-vat') != -1) {
      str = urlOnPage.CRV.CRVIndex;
    }
    return (
      <div className="panel-left">
        <ul className="nav-left">
          <li className={str == urlOnPage.user.userCreatePost ? 'li-x li-active-dis' : 'li-x'}>
            <Link
              to={urlOnPage.user.userCreatePost ? urlOnPage.user.userCreatePost : ''}
              onClick={() => str != urlOnPage.user.userCreatePost ? browserHistory.push(urlOnPage.user.userCreatePost) : ''}>
              <img src={Constants.linkServerImage + '/common/icon-post.png'} alt=""/>
              {this.props.lng.MENU_POST}
            </Link>
          </li>
          <li className={str == urlOnPage.CRV.CRVIndex ? 'li-x li-active-dis' : 'li-x'}>
            <Link
              to={urlOnPage.CRV.CRVIndex ? urlOnPage.CRV.CRVIndex : ''}
              onClick={() => str != urlOnPage.CRV.CRVIndex ? browserHistory.push(urlOnPage.CRV.CRVIndex) : ''}>
              <img src={Constants.linkServerImage + '/common/icon-cart.png'} alt=""/>{this.props.lng.MENU_CHO_RAO_VAT}
            </Link>
          </li>
          <li className={str == urlOnPage.ads.adsVideoSysList ? 'li-x li-active-dis' : 'li-x'}>
            <Link
              to={urlOnPage.ads.adsVideoSysList ? urlOnPage.ads.adsVideoSysList : ''}
              onClick={() => str != urlOnPage.ads.adsVideoSysList ? browserHistory.push(urlOnPage.ads.adsVideoSysList) : ''}>
              <img src={Constants.linkServerImage + '/common/icon-video.png'} alt=""/>
              {this.props.lng.ADVERTISE_TITLE_WEB}
            </Link>
          </li>
          <li style={{
            fontSize: '15px',
            fontWeight: 'bold',
            color: '#333',
            position: 'relative',
            borderRight: str == urlOnPage.user.userMyProfile || str == urlOnPage.transaction.transactionList ||
            str == urlOnPage.friends.friendList || str == urlOnPage.friends.friendFindFriend ? '4px solid #14b577' : '',
            cursor: 'pointer'
          }}
              onMouseOut={() => this.setState({displayUl2: 'none'})}
              onClick={() => this.setState({displayUl2: 'none'})}
              onMouseOver={() => this.setState({displayUl2: 'block'})}
              className={str == urlOnPage.user.userMyProfile || str == urlOnPage.transaction.transactionList ||
              str == urlOnPage.friends.friendList || str == urlOnPage.friends.friendFindFriend ? 'li-x li-active-dis p-xxx' : 'li-x p-xxx'}>
            <img src={Constants.linkServerImage + "/common/users.png"}/>{this.props.lng.MENU_ACCOUNT_INFO_WEB}
            { Session.checkSession() ?

              <ul className="p-sub-left" style={{
                display: this.state.displayUl2
              }}>

                <li>
                  <Link to={urlOnPage.user.userMyProfile}
                        onClick={() => this.onGotoMobile(urlOnPage.user.userMyProfile)}>
                    <img
                      src={Constants.linkServerImage + "/common/users-nav-left.png"}/>{this.props.lng.MENU_ACCOUNT_INFO}
                    <div className="sub-nav-left-menu-account">Cập nhật thông tin, giao dịch</div>
                  </Link>
                </li>
                < li >
                  < Link to={urlOnPage.transaction.transactionList}
                         onClick={() => this.setState({displayUl: 'none'})}>
                    <img
                      src={Constants.linkServerImage + '/common/icon-coin-nav-left.png'}
                      alt=""/>
                    {Session.changLanguage().MENU_TRANSACTION}
                    <div className="sub-nav-left-menu-account">Lịch sử giao dịch</div>
                  </Link>
                </li>
                <li>
                  <Link to={urlOnPage.friends.friendList}
                        onClick={() => this.onGotoMobile(urlOnPage.friends.friendList)}><img
                    src={Constants.linkServerImage + '/common/friend-nav-left.png'}
                    alt=""/>{this.props.lng.SUB_MENU_FRIEND_LIST}
                    <div className="sub-nav-left-menu-account">Nhắn tin với bạn bè</div>
                  </Link>
                </li>
                <li>
                  <Link to={urlOnPage.friends.friendFindFriend}
                        onClick={() => this.onGotoMobile(urlOnPage.friends.friendFindFriend)}><img
                    src={Constants.linkServerImage + '/common/ic_menu_find_friends-nav-left.png'}
                    alt=""/>{this.props.lng.SUB_MENU_FRIEND_SEARCH}
                    <div className="sub-nav-left-menu-account"> Kết nối với bạn bè</div>
                  </Link>
                </li>
                <li className="li-x">
                  <a href="#" onClick={this.onClickSignout}>
                    <img
                      src={Constants.linkServerImage + '/common/logout-nav-left.png'}
                      alt=""/>{this.props.lng.MENU_LOGOUT}
                    <div className="sub-nav-left-menu-account"> Thoát ứng dụng</div>
                  </a>
                </li>

              </ul>
              :
              <ul className="p-sub-left" style={{
                display: this.state.displayUl2
              }}>

                <li>
                  <Link to={urlOnPage.loginRegister.lrLogin}
                        onClick={() => this.onGotoMobile(urlOnPage.loginRegister.lrLogin)}>
                    <img
                      src={Constants.linkServerImage + "/common/users-nav-left.png"}/>ĐĂNG NHẬP, ĐĂNG KÝ
                    <div className="sub-nav-left-menu-account">Nhấn đăng nhập hoặc đăng ký</div>
                  </Link>
                </li>

              </ul>
            }
          </li>
          <li style={{fontSize: '15px', fontWeight: 'bold', color: '#333', position: 'relative', cursor: 'pointer'}}
              onMouseOut={() => this.setState({displayUl: 'none'})}
              onClick={() => this.onChangDisplay.bind(this)}
              onMouseOver={() => this.setState({displayUl: 'block'})}
              className={str == urlOnPage.logoBrand.logoBrandIndex ? 'li-x li-active-dis p-xxx' : 'li-x p-xxx'}>
            <img src={Constants.linkServerImage + "/common/icon-setting.png"}
                 alt="Icon Coin"/>{this.props.lng.MENU_HELP}
            <ul className="p-sub-left" style={{
              display: this.state.displayUl
            }}>
              <li><Link to={urlOnPage.logoBrand.logoBrandIndex}
                        onClick={() => this.onGotoMobile(urlOnPage.logoBrand.logoBrandIndex)}><img
                src={Constants.linkServerImage + "/common/logo-thuonghieu-nav-left1.png"}
                alt="Icon Coin"/>{this.props.lng.MENU_LOGO}</Link></li>
              <li><a href={Constants.linkHelp} target="_blank" onClick={() => this.setState({displayUl: 'none'})}><img
                src={Constants.linkServerImage + "/common/icon-help-nav-left1.png"}/>{this.props.lng.SUB_MENU_MANUAL_INSTRUCTION}
              </a></li>
            </ul>
          </li>

        </ul>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.userReducer
  };
}

function mapDispatchToProps(dispatch) {

  return {
    actions: bindActionCreators(userAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
