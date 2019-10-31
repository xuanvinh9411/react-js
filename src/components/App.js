// This component handles the App template used on every page.
import React, {PropTypes} from 'react';
import {Sidebar} from './common/Sidebar';
import {browserHistory, Link, hashHistory} from 'react-router';
import {ToastContainer, ToastMessage} from "react-toastr";
import * as types from '../actions/actionTypes';
import * as appAction from '../actions/appAction';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Footer from './common/Footer';
import Banner from './banner/Banner';
let Constants = require('../services/Constants');
let Session = require('../utils/Utils');
let urlOnPage = require('../url/urlOnPage');
let Aes = require('../services/httpRequest');
let functionCommon = require('./common/FunctionCommon');
const urlRequestApi = require('../url/urlRequestApi');
let httpRequest = require('../services/httpRequest');

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

class App extends React.Component {
  initialStateStatus() {
    return {
      isLoadMessageNew: false,
      isLoadNotification: false
    }
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      nameHeader: "Trang Chủ",
      messages: [],
      total: 0,
      data: {},
      isClick: false,
      countUnreadNotification: 0,
      totalItemPaging: 0,
      unMount: '',
      unMount2: '',
      displayUl: 'none',
      style: {},
      totalMessage: 0,
      idFriend: '',
      status: this.initialStateStatus(),
      arrBannerWeb: [],
      isLoginState: true,
      arrClickBanner: [],
      arrViewBanner: []
    }
    this.onLoadNotification = this.onLoadNotification.bind(this);
    this.onClickSignout = this.onClickSignout.bind(this);
    this.onSetStyle = this.onSetStyle.bind(this);
    this.onLoadMessageNew = this.onLoadMessageNew.bind(this);
    // this.onClickBanner = this.onClickBanner.bind(this);
    // this.onViewBanner = this.onViewBanner.bind(this);
  }

  componentDidMount() {
    this.onSetStyle();
    this.checkVersion();
    if (!Session.checkSession()) {
      // browserHistory.push("/cho-rao-vat");
      // hashHistory.push('/cho-rao-vat');
     this.setState({isLoginState: false});
    }
    else {
      let status = this.state.status;
      status.isLoadMessageNew = true;
      status.isLoadNotification = true;
      this.setState({status: status});
      this.props.actions.getNotification();
      var data = setInterval(this.onLoadNotification, Constants.TIME_RELOAD);
      this.props.actions.loadMessageCountNew();
      var count_new = setInterval(this.onLoadMessageNew, Constants.TIME_RELOAD);
      this.setState({unMount: data, unMount2: count_new});
     }
     this.props.actions.loadBannerWeb();
    $(function () {
      var timer;
      $(window).resize(function () {
        clearTimeout(timer)
        timer = setTimeout(function () {
          $('.main-body').css("min-height", ($(window).height()) + "px");
        }, 40);
      }).resize();
    });
  }

  checkVersion() {
    let version = localStorage.getItem('version');
    if (!version) {
      localStorage.setItem('version', Session.aesEncrypt(Constants.VERSON_APP));
      window.location.reload(true);
    } else {
      let vs = Session.aesDecrypt(version);
      if (vs != Constants.VERSON_APP) {
        localStorage.setItem('version', Session.aesEncrypt(Constants.VERSON_APP));
        window.location.reload(true);
      }
    }
  }

  onSetStyle() {
    let style = {};
    if (Session.isMobile.any() != null) {
      style = {minHeight: Session.getHeight()};
    } else {
      style = {minHeight: window.innerHeight + 'px'}
    }
    this.setState({style: style});
  }

  componentWillUnmount() {
    clearInterval(this.state.unMount);
    clearInterval(this.state.unMount2);
  }

  onLoadNotification() {
    let status = this.state.status;
    status.isLoadNotification = true;
    this.setState({status: status});
    this.props.actions.getNotification();
  }

  onLoadMessageNew() {
    let status = this.state.status;
    status.isLoadMessageNew = true;
    this.setState({status: status});
    this.props.actions.loadMessageCountNew();
  }

  componentWillReceiveProps(nextProps) {
    this.onSetStyle();
    if (nextProps.dataMessage) {
      let type = nextProps.dataMessage.type;
      let result = nextProps.dataMessage.data;
      switch (type) {
        case types.TRACKING_FRIEND_APP_SUCCESS:
          result = nextProps.dataMessage.data;
          if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
            Session.setTemporaryData('infoFriend', result.data);
            browserHistory.push('/detail/' + result.data.user.id);
          } else {
            this.onTrackingFriend(this.state.idFriend);
          }
          break;
        case types.GET_NOTIFICATION_SUCCESS:
          if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
            if (this.state.status.isLoadNotification) {
              let data = result.data.notifications;
              let count = 0;
              if (data.length > 0) {
                for (let i in data) {
                  if (data[i].status == 0) {
                    count++;
                  }
                }
              }
              this.setState({
                isLoading: false,
                messages: result.data.notifications,
                total: result.data.total,
                countUnreadNotification: count,
                totalItemPaging: result.data.totalItemPaging
              });
              let status = this.state.status;
              status.isLoadNotification = false;
              this.setState({status: status});
            }
          }
          break;
        case types.BANNER_WEB_SUCCESS:
          if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
            this.setState({arrBannerWeb: result.data});
          }
          break
        case types.MESSAGE_COUNT_NEW_SUCCESS:
          if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
            if (this.state.status.isLoadMessageNew) {
              let status = this.state.status;
              status.isLoadMessageNew = false;
              this.setState({totalMessage: result.data.total, status: status});
            }
          } else {
            this.props.actions.loadMessageCountNew();
          }
          break;
        case types.UPDATE_NOTIFICATION_SUCCESS:
          if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
            this.onLoadNotification();
          }
          break;
      }
    }
  }

  onUpdateNotification() {
    this.setState({isClick: true});
    this.props.actions.updateNotification();
  }

  onClickSignout() {
    this.setState({displayUl: 'none'});
    sessionStorage.clear();
    localStorage.removeItem('sessionAround');
    localStorage.removeItem('user');
    Session.removeTemporaryData('dataResultSearchPost');
    window.location.href = urlOnPage.loginRegister.lrLogin;
  }

  onGotoMobile(url) {
    this.setState({displayUl: 'none'});
    browserHistory.push(url);
  }

  onChangeTotalMessageNew(click) {
    let totalMessage = this.state.totalMessage;
    if (click == true) {
      if (totalMessage > 1) {
        totalMessage -= 1;
      } else {
        totalMessage = 0;
      }
    }
    this.setState({totalMessage: totalMessage});
  }

  onTrackingFriend(id) {
    let user = Aes.aesDecrypt(localStorage.getItem('user'));
    if (user.id == id) {
      browserHistory.push(urlOnPage.user.userMyProfile);
    } else {
      this.setState({idFriend: id});
      this.props.actions.trackingFriend({userIdFriend: id, shopinfo: 1});
    }
  }


  onClickBanner(val) {
    let arrClickBanner = this.state.arrClickBanner;
    if (arrClickBanner.indexOf(val.id) == -1) {
      console.log(" onClickBanner banner roi", val);
      let dataRp = {
        idAds: val.id,
        platform: Constants.platform,
        type: 1
      }
      httpRequest.post(urlRequestApi.adsVideo.addActionBannerWeb, dataRp, function cb(errr, ressss) {
        console.log("errr errr errr", errr, ressss);
      });

      arrClickBanner.push(val.id);
      this.setState({arrClickBanner});
    }
  }

  onViewBanner(val) {
    console.log(" onViewBanner banner roi", val);
    let arrViewBanner = this.state.arrViewBanner;
    if (arrViewBanner.indexOf(val.id) == -1) {
      let dataRp = {
        idAds: val.id,
        platform: Constants.platform,
        type: 0
      }
      httpRequest.post(urlRequestApi.adsVideo.addActionBannerWeb, dataRp, function cb(errr, ressss) {
        console.log("errr errr errr", errr, ressss);
      });
      arrViewBanner.push(val.id);
      this.setState({arrViewBanner});
    }
  }


  render() {
    let lng = Session.changLanguage();

    let str = this.props.location.pathname;
    let { arrBannerWeb, isLoginState } = this.state;

    return (
      <div className="wrapper">
        <div className="heaer-main">
          <header className="main-header">
            <nav className="navbar navbar-static-top">
              <div className="container-head">
                <div className="navbar-header">
                  <Link
                    to={ urlOnPage.default }
                    onClick={() => str != urlOnPage.default ? browserHistory.push(urlOnPage.default) : location.reload()}
                    className="navbar-logo"><img src={Constants.linkServerImage + "/logo.png"}/></Link>
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                          data-target="#navbar-collapse">
                    <i className="fa fa-bars"/>
                  </button>
                </div>
                <div className="collapse navbar-collapse pull-left" id="navbar-collapse">
                </div>
                <div className="navbar-custom-menu">
                  <ul className="nav navbar-nav nav-top">

                      <li className="dropdown">
                        <Link
                          to={ urlOnPage.user.userNewsFeed ? urlOnPage.user.userNewsFeed : '' }
                          onClick={() => str != urlOnPage.user.userNewsFeed ? browserHistory.push(urlOnPage.user.userNewsFeed) : ''}
                          className="dropdown-toggle">
                          <img title="Tin mới" src={Constants.linkServerImage + "/global.png"}/>
                        </Link>
                      </li>

                    <li className="dropdown">
                      <Link
                        to={urlOnPage.search.searchIndex ? urlOnPage.search.searchIndex : ''}
                        onClick={() => str != urlOnPage.search.searchIndex ? browserHistory.push(urlOnPage.search.searchIndex) : ''}
                        className="dropdown-toggle">{/**/}
                        <img title="Tìm kiếm" src={Constants.linkServerImage + "/search.png"}/>
                      </Link>
                    </li>
                    <li className="dropdown">
                      <Link
                        to={urlOnPage.shop.shopManages ? urlOnPage.shop.shopManages : ''}
                        onClick={() => str != urlOnPage.shop.shopManages ? browserHistory.push(urlOnPage.shop.shopManages) : ''}
                        className="dropdown-toggle">{/**/}
                        <img  title="Cửa hàng" src={Constants.linkServerImage + "/shop.png"}/>
                      </Link>
                    </li>
                    <li className="dropdown">
                      <Link
                        to={urlOnPage.messages.messagesManage ? urlOnPage.messages.messagesManage : ''}
                        onClick={() => str != urlOnPage.messages.messagesManage ? browserHistory.push(urlOnPage.messages.messagesManage) : ''}
                        className="dropdown-toggle">
                        <img title="Tin nhắn" src={Constants.linkServerImage + 'ic_menu_message.png'} alt=""/>
                        {
                          this.state.totalMessage > 0 ?
                            <span className="jewelCount" id="u_0_e">
                          <span className="_51lp _3z_5 _5ugh" id="totalMessage">{this.state.totalMessage}</span>
                        </span> : ''
                        }

                      </Link>
                    </li>
                    <li className="dropdown notifications-menu" onClick={() => this.onUpdateNotification()}>
                      <a href="#" className="dropdown-toggle" data-toggle="dropdown" style={{position: 'relative'}}>
                        <img title="Thông báo" src={Constants.linkServerImage + "/notifycation.png"}/>
                        {
                          this.state.countUnreadNotification > 0 ?
                            <span className="jewelCount" id="u_0_e">
                            <span className="_51lp _3z_5 _5ugh"
                                  id="mercurymessagesCountValue">{this.state.countUnreadNotification}</span>
                          </span>
                            :
                            ''
                        }

                      </a>
                      <ul className="dropdown-menu">
                        <li
                          className="header">{this.state.total > 0 ? lng.NOTIFICATION_TITLE_WEB : lng.NOTIFICATION_NULL}</li>
                        <li>
                          <ul className="menu">
                            {
                              this.state.messages.map((item, index) =>
                                <li key={index} style={{background: item.status == 0 ? '#edf2fa' : '#fff'}}>
                                  <div className="_dre anchorContainer">
                                    <div className="">
                                      <Link
                                        className="_33e _1_0e"
                                        onClick={() => {
                                          let query = this.props.location.query;
                                          query.ref = item.id;
                                          browserHistory.push(
                                            {
                                              pathname: item.kind == 1 ?
                                                urlOnPage.post.postViewPage + functionCommon.createSlug(item.post.name) + '-' + item.post.id+ '.html'
                                                :
                                                item.subKind == 1 ?
                                                  urlOnPage.friends.friendRequest
                                                  :
                                                  urlOnPage.friends.friendList,
                                              query: query
                                            }
                                          )
                                        }}
                                      >
                                        <div className="clearfix" direction="left">
                                          <div className="_ohe lfloat">
                                            {
                                              (item.userId && item.userId.avatar ) ?
                                                <div className="_33h img" style={{
                                                  background: "url(" + Constants.linkApi + '/images/' + item.userId.avatar + ")",
                                                  backgroundRepeat: 'no-repeat',
                                                  backgroundSize: 'cover', backgroundPosition: '50% 50%'
                                                }}/>
                                                :
                                                <div className="_33h img" style={{
                                                  background: "url(" + Constants.linkServerImage + 'no_user.png' + ")",
                                                  backgroundRepeat: 'no-repeat',
                                                  backgroundSize: 'cover', backgroundPosition: '50% 50%'
                                                }}/>
                                            }
                                          </div>
                                          <div className="">
                                            <div className="_42ef _8u">
                                              <div className="clearfix" direction="right">
                                                <div className="_ohf rfloat">
                                                  <span/>
                                                </div>
                                                <div className="">
                                                  <div className="_42ef">
                                                    <div className="_4l_v">
                                                    <span>
                                                      <span className="fwb"
                                                      >{item.userId ? item.userId.fullname : ''}</span>
                                                      <span className="ix-st">
                                                        {
                                                          item && item.kind == 1 ?
                                                            item.subKind == 1 ?
                                                              lng.NOTIFICATION_LIKE_POST_WEB + item.post.name
                                                              :
                                                              item.subKind == 2 ?
                                                                lng.NOTIFICATION_COMMENT_POST_WEB + item.post.name
                                                                :
                                                                lng.NOTIFICATION_REPLY_POST_WEB + item.post.name
                                                            :
                                                            item.subKind == 1 ?
                                                              lng.NOTIFICATION_FRIEND_REQUEST
                                                              :
                                                              lng.NOTIFICATION_FRIEND_ACCEPT
                                                        }
                                                      </span>
                                                    </span>
                                                      <p>{item.createdAt}</p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                </li>
                              )
                            }
                          </ul>
                        </li>
                        {this.state.total > this.state.totalItemPaging ? <li className="footer"><Link
                          to={urlOnPage.notification.notificationIndex}>{lng.LOAD_MORES}</Link></li> : ''}
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </header>
        </div>

        <div className="main-body">
          <div>
            { (arrBannerWeb && arrBannerWeb.length > 0 ) ?
              <Banner arrBannerWeb={arrBannerWeb} onViewBanner={this.onViewBanner.bind(this)} onClickBannerAction={this.onClickBanner.bind(this)}  />
              : ''
            }
            <Sidebar lng={Session.changLanguage()} pathname={this.props.location.pathname}/>
            <section className="panel-right">
              <ToastContainer
                toastMessageFactory={ToastMessageFactory}
                ref="container"
                className="toast-top-right"
              />
              {React.cloneElement(
                this.props.children,
                {
                  lng: Session.changLanguage(),
                  toastMessage: this.refs.container,
                  onChangeTotalMessageNew: this.onChangeTotalMessageNew.bind(this)
                }
              )}
            </section>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

App.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.appReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(appAction, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
