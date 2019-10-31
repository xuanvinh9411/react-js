/*
 * Created by TrungPhat on 1/17/2017
 */
import React, {PropTypes} from 'react';
import * as shopAction from '../../actions/shopAction';
import * as actionType from '../../actions/actionTypes';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {browserHistory, Link} from 'react-router';
import {ToastContainer, ToastMessage} from "react-toastr";
import Lightbox from 'react-image-lightbox';
import {Button, Modal, Pagination} from 'react-bootstrap';
//import Pagination from '../controls/Pagination';
import LoadingTable from '../controls/LoadingTable';
import {AroundMap} from '../controls/AroundMap';
import PostListPage from '../post/PostListPage';
import DirectionsAroundGoogleMap from '../controls/DirectionsAroundGoogleMaps';
const urlRequestApi = require('../../url/urlRequestApi');

let httpRequest = require('../../services/httpRequest');
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
import {Helmet} from "react-helmet";
let Session = require('../../utils/Utils');
let Constant = require('../../services/Constants');
let Aes = require('../../services/httpRequest');
let _ = require('../../utils/Utils');
let urlOnPage = require('../../url/urlOnPage');
var Constants = require('../../services/Constants');
let functionCommon = require('../common/FunctionCommon');
var request = require('superagent')
let polyline = require('polyline'),
  geojson = require('geojson'),
  util = require('util');
class StorePageAdmin extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      store: {},
      photoIndex: 0,
      isOpen: false,
      isReady: false,
      isReadyPost: false,
      style: {},
      markers: [
        {
          position: {
            lat: 0.0,
            lng: 0.0,
          },
          key: Date.now(),
        }
      ],
      statusMap: false,
      posts: {
        post: {},
        data: {},
        error: {},
        messages: [],
        total: 0,
        totalItemPaging: 0,
        isLoad: true,
        isSubmit: false,
        showTab: false,
        markers: [
          {
            position: {
              lat: 0,
              lng: 0,
            },
            key: Date.now(),
          }
        ],
        statusMap: false,
        onHidePhone: false,
        pageNumber: 1,
        activePage: 1,
        isChangeState: false
      },
      userCurrent: typeof localStorage != 'undefined' ? Aes.aesDecrypt(localStorage.getItem('user')) : null,

      directions: null,
      isLocationCurrent: false,
      adsSys: {
        small: {},
        big: {},
        kind: 0,
        idAdsClick: ''
      },
      isClick: false
    }
    this._onLoad = this._onLoad.bind(this);
    this.onShowGoogleMap = this.onShowGoogleMap.bind(this);
    this.onChat = this.onChat.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.onLoadAdsSys = this.onLoadAdsSys.bind(this);
    this.clickAdsSys = this.clickAdsSys.bind(this);
  }

  componentDidMount() {
    console.log("this.props.location", this.props.location);
    let location = _.getTemporaryData('locationUser');
    this.setState({
      origin: new google.maps.LatLng(10.8230989, 106.6296638),
      destination: new google.maps.LatLng(10.8230989, 106.6296638),
    })
    navigator.geolocation.getCurrentPosition(function (location) {
      this.setState({
        isLocationCurrent: true,
        origin: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
      })
    }.bind(this));
    // if(!Session.checkSession()){
    //   browserHistory.push("/login");
    // }else{
    this.props.actions.getShopById(this.props.params.id);
    this.checkQuery();
    window.scrollTo(0, 0);
    this.onLoadAdsSys(Constant.KIND_BANNER_NHO);
    this.onLoadAdsSys(Constant.KIND_BANNER_LON);



  }


  componentWillUnmount() {
    Session.removeTemporaryData(Constant.locationCheckPoint);
  }

  loadData(page) {
    this.setState({isReadyPost: true});
    this.props.actions.listPostByShop({idShop: this.props.params.id, page: page});
  }

  checkQuery() {
    if (_.isEmpty(this.props.location.query)) {
      this.loadData(0);
    } else {
      let queryPage = this.props.location.query.page ? this.props.location.query.page : 1;
      let newActivePage = _.isInt(queryPage) ? queryPage : this.state.activePage;
      this.setState({activePage: parseInt(newActivePage)});
      this.loadData(newActivePage - 1);
    }
  }

  // componentDidMount() {
  //   window.scrollTo(0, 0);
  //   this.onLoadAdsSys(Constant.KIND_BANNER_NHO);
  //   this.onLoadAdsSys(Constant.KIND_BANNER_LON);
  // }

  onLoadAdsSys(kind) {
    let adsSys = this.state.adsSys;
    adsSys.kind = kind;
    this.setState({adsSys: adsSys});
    this.props.actions.requestSystemAds({kind: kind, idShop: this.props.params.id});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataMessage) {
      let type = nextProps.dataMessage.type;
      let result = '';
      switch (type) {
        case actionType.GET_SHOP_SUCCESS:
          result = nextProps.dataMessage.dataShops;
          if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
            if (this.props.location.query.utm == 'map') {
              let dataRp = {
                userId: result.data.shop.userId.id ? result.data.shop.userId.id : null,
                platform: Constants.platform,
              }
              httpRequest.post(urlRequestApi.shop.reportLogoThuongHieu, dataRp,function cb(errr, ressss) {});
            }

            let markers = [{
              position: {
                lat: result.data.shop.location[1],
                lng: result.data.shop.location[0],
              },
              key: result.data.shop.id,
              icon: result.data.shop.userId
            }]
            localStorage.setItem('iS', Aes.aesEncrypt(result.data.shop));
            let destination = this.state.destination;
            /*destination.latitude=result.data.shop.location[1];
             destination.longitude=result.data.shop.location[0];*/
            destination = new google.maps.LatLng(result.data.shop.location[1], result.data.shop.location[0]);
            this.setState({store: result.data.shop, isReady: true, markers: markers, destination: destination});
          } else {
            if (result.code == 5) {
              this.props.actions.getShopById(this.props.params.id);
            } else {
              this.setState({isReady: true});
            }
          }
          break;
        case actionType.LOAD_POST_SUCCESS:
          result = nextProps.dataMessage.dataPost;
          if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
            if (result.data.posts.length > 0) {
              let data = [];
              for (let i = 0; i < result.data.posts.length; i++) {
                data.push({
                  position: {
                    lat: result.data.posts[i].location[1],
                    lng: result.data.posts[i].location[0],
                  },
                  key: result.data.posts[i].id,
                })
              }
              let posts = this.state.posts;
              posts.markers = data;
              posts.total = result.data.total;
              posts.totalItemPaging = result.data.totalItemPaging;
              posts.messages = result.data.posts;
              this.setState({
                posts: posts,
                isReadyPost: false,
                pageNumber: Math.ceil(result.data.total / result.data.totalItemPaging),
              });
            } else {
              let posts = this.state.posts;
              posts.messages = result.data.posts;
              this.setState({posts: posts});
            }
          } else {
            if (result.code == Constant.RESPONSE_CODE_OTP_INVALID) {
              this.checkQuery();
            }
          }
          break;
        case actionType.UPDATE_POST_SUCCESS:
          result = nextProps.dataMessage.dataPost;
          if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
            let page = location.search.split('page=')[1];
            this.loadData(parseInt(page) - 1);
            if (this.state.posts.onHidePhone == false) {
              this.refs.container.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
                closeButton: true,
              });
            } else {
              let posts = this.state.posts;
              posts.onHidePhone = false;
              this.setState({posts: posts});
            }
          } else {
            this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
              closeButton: true,
            });
          }
          break;
        case actionType.DELETE_POST_SUCCESS:
          result = nextProps.dataMessage.dataPost;
          if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
            let queryPage = this.props.location.query.page ? this.props.location.query.page : 1;
            let newActivePage = _.isInt(queryPage) ? queryPage : this.state.activePage;
            this.setState({activePage: parseInt(newActivePage)});
            if (this.state.posts.messages) {
              if (this.state.posts.isChangeState) {
                if (this.state.posts.messages.length == 1) {
                  let query = this.props.location.query;
                  if ((parseInt(newActivePage) - 1) == 1)
                    delete query.page;
                  else
                    query.page = newActivePage - 1;
                  browserHistory.push({pathname: this.props.location.pathname, query: query});
                } else {
                  if (this.state.posts.messages.length > 1) {
                    this.loadData(newActivePage - 1);
                  }
                }
                let posts = this.state.posts;
                posts.isChangeState = false;
                this.setState({posts: posts});
              }
            }
            let store = this.state.store;
            store.totalPost -= 1;
            this.setState({store: store});
            this.refs.container.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
          } else {
            if (result.code == Constant.RESPONSE_CODE_OTP_INVALID) {
              this.refs.container.error(this.props.lng.FAIL_OTP, `Thông báo.`, {
                closeButton: true,
              });
            } else {
              this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
        case actionType.ADS_SYS_SUCCESS:
          result = nextProps.dataMessage.dataShops;
          if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
            let adsSys = this.state.adsSys;
            if (result.kind == Constant.KIND_BANNER_NHO) {
              adsSys.small = result.data.ad;
            } else if (result.kind == Constant.KIND_BANNER_LON) {
              adsSys.big = result.data.ad;
            }
            this.setState({adsSys: adsSys});
          } else if (result.code == Constant.RESPONSE_CODE_OTP_INVALID) {
            this.onLoadAdsSys(this.state.adsSys.kind);
          }
          /*else{
           this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
           closeButton: true,
           });
           }*/
          break;
        case actionType.REPORT_SHOP_SUCCESS:
          result = nextProps.dataMessage.dataShops;
          if (this.state.isClick) {
            if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
              this.refs.container.success(this.props.lng.SHOP_REPORT_SUCCESS, `Thông báo.`, {
                closeButton: true,
              });
            } else {
              this.refs.container.error(this.props.lng.SHOP_REPORT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
            this.setState({isClick: false})
          }
          break;
        case actionType.CLICK_ADS_SUCCESS:
          result = nextProps.dataMessage.dataShops;
          if (this.state.isClick) {
            if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
              let adsSys = this.state.adsSys;
              let url = '';
              if (adsSys.idAdsClick == adsSys.big.id) {
                url = adsSys.big.targetUrl;
              } else {
                url = adsSys.small.targetUrl;
              }
            } else {
              if (result.code == Constant.RESPONSE_CODE_OTP_INVALID) {
                this.clickAdsSys(this.state.adsSys.idAdsClick);
              }
            }
            this.setState({isClick: false})
          }
          break;
        case actionType.TRACKING_FRIEND_SUCCESS:
          result = nextProps.dataMessage.dataShops;
          if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
            Session.setTemporaryData('infoFriend', result.data);
            browserHistory.push('/detail/' + result.data.user.id);
          } else {
            this.onTrackingFriend(this.state.idFriend);
          }
          break;
      }
    }
    if (nextProps.location.key != this.props.location.key) {
      let queryPage = nextProps.location.query.page ? nextProps.location.query.page : 1;
      let newActivePage = _.isInt(queryPage) ? queryPage : this.state.activePage;
      this.setState({activePage: parseInt(newActivePage)});
      this.loadData(newActivePage - 1);
    }
  }

  clickAdsSys(id) {
    let adsSys = this.state.adsSys;
    adsSys.idAdsClick = id;
    this.setState({adsSys: adsSys, isClick: true});
    this.props.actions.clickAds({idAds: id});
  }

  onChat() {
    if (this.state.userCurrent && this.state.store.userId.id != this.state.userCurrent.id) {
      browserHistory.push(urlOnPage.messages.messagesSendMessages + this.state.store.userId.id);
    }
  }

  _onLoad(e) {
    let style = this.state.style;
    if (e.target.offsetHeight < 400) {
      style.top = '0px !important';
      style.minHeight = '250px';
      style.width = '100%';
      style.marginTop = '0px !important';
    } else {
      style.minHeight = '250px';
      style.top = '50% !important';
      style.width = '100%';
      style.marginTop = '-50% !important';
    }
    this.setState({style: style});
  }

  onShowGoogleMap() {
    let origin = this.state.origin;
    if (this.state.isLocationCurrent == false) {
      origin = new google.maps.LatLng(this.state.store.location[1], this.state.store.location[0]);
    }
    let latlng = Session.getTemporaryData(Constant.locationCheckPoint);
    if (!_.isEmpty(latlng)) {
      origin = new google.maps.LatLng(parseFloat(latlng.lat), parseFloat(latlng.lng));
    }
    this.setState({origin: origin});
    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route({
      origin: origin,
      destination: this.state.destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result,
        });
      } else {
        this.refs.container.error('Chỉ đường hiện không khả dụng', `Thông báo.`, {
          closeButton: true,
        });
      }
    });
    this.setState({statusMap: true});
  }

  handleSelect(eventKey) {
    let query = this.props.location.query;
    if (eventKey == 1)
      delete query.page;
    else
      query.page = eventKey;
    browserHistory.push({pathname: this.props.location.pathname, query: query});
  }

  handleMapClick() {
  }

  onClickMarker() {
  }

  onHideShowPhone(data) {
    let posts = this.state.posts
    posts.onHidePhone = true;
    this.setState({posts: posts});
    if (data.showPhone == 1) {
      data.showPhone = 0;
    } else {
      data.showPhone = 1;
    }
    this.props.actions.updatePostHiddenPhone(data);
  }

  onDeletePost(data) {
    let posts = this.state.posts;
    posts.isChangeState = true;
    this.setState({posts: posts});
    data.status = -2;
    if (confirm(this.props.lng.CONFIRM_DELETE)) {
      this.props.actions.deletePost(data);
    }
  }

  reportShop() {
    this.setState({isClick: true});
    this.props.actions.reportShop(this.props.params.id);
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

  render() {
    let listItem = this.state.store.decorate;
    let cpmImg = '';
    let lgClose = () => this.setState({statusMap: false});
    let listImg = this.state.store.avatar;
    if (this.state.store.avatar) {
      cpmImg = listImg.map(item =>
        <div className="item-img-desc"
             key={item}
             onClick={() => this.setState({isOpen: true})}
             style={{
               background: "url(" + Constant.linkApi + "/images/" + item + ")",
               backgroundRepeat: 'no-repeat',
               backgroundPosition: '50% 50%',
               backgroundSize: 'cover'
             }}>
        </div>)
    }
    let cpmTime = '';
    /* Hiển thị giời gian mở cửa */
    if (this.state.store.openCloseTime) {
      if (!(_.isEmpty(this.state.store.openCloseTime.t2_t6) && _.isEmpty(this.state.store.openCloseTime.t7) && _.isEmpty(this.state.store.openCloseTime.cn))) {
        if (this.state.store.openCloseTime.t2_t6.open != '' || this.state.store.openCloseTime.t2_t6.close != '' || this.state.store.openCloseTime.t7.open != '' || this.state.store.openCloseTime.t7.close != '' || this.state.store.openCloseTime.cn.open != '' || this.state.store.openCloseTime.cn.close != '') {
          let t2t6 = '', t7 = '', cn = '', t2t6o, t2t6c, t7o, t7c, cno, cnc, chart = '|';
          /* T2 - T6 */
          if (!_.isEmpty(this.state.store.openCloseTime.t2_t6)) {
            if (this.state.store.openCloseTime.t2_t6.open == '' && this.state.store.openCloseTime.t2_t6.close == '') {
              t2t6 = '';
              chart = '';
            } else {
              if (this.state.store.openCloseTime.t2_t6.open != '' && this.state.store.openCloseTime.t2_t6.close != '') {
                t2t6o = this.state.store.openCloseTime.t2_t6.open + ' - ';
                t2t6c = this.state.store.openCloseTime.t2_t6.close;
              } else {
                if (this.state.store.openCloseTime.t2_t6.open == '' && this.state.store.openCloseTime.t2_t6.close != '') {
                  t2t6o = '';
                  t2t6c = this.state.store.openCloseTime.t2_t6.close;
                } else {
                  t2t6o = this.state.store.openCloseTime.t2_t6.open;
                  t2t6c = '';
                }
              }
              t2t6 = <span>
              <span style={{fontWeight: 600}}>{this.props.lng.SHOP_CREATE_TIME_T2_TITLE}</span>
              <span>{' ' + t2t6o + t2t6c + ' '}</span>
            </span>
            }
          }
          /* T7 */
          if (!_.isEmpty(this.state.store.openCloseTime.t7)) {
            if (this.state.store.openCloseTime.t7.open == '' && this.state.store.openCloseTime.t7.close == '') {
              t7 = '';
              chart = '';
            } else {
              if (this.state.store.openCloseTime.t7.open != '' && this.state.store.openCloseTime.t7.close != '') {
                t7o = this.state.store.openCloseTime.t7.open + ' - ';
                t7c = this.state.store.openCloseTime.t7.close;
              } else {
                if (this.state.store.openCloseTime.t7.open == '' && this.state.store.openCloseTime.t7.close != '') {
                  t7o = '';
                  t7c = this.state.store.openCloseTime.t7.close;
                } else {

                  t7o = this.state.store.openCloseTime.t7.open;
                  t7c = '';
                }
              }
              t7 = <span>
              <span
                style={{fontWeight: 600}}>{ t2t6 != ' ' ? chart + ' ' + this.props.lng.SHOP_CREATE_TIME_T7_TITLE : this.props.lng.SHOP_CREATE_TIME_T7_TITLE}</span>
              <span>{' ' + t7o + t7c + ' '}</span>
            </span>
            }
          }

          /* CN */
          if (!_.isEmpty(this.state.store.openCloseTime.cn)) {
            if (this.state.store.openCloseTime.cn.open == '' && this.state.store.openCloseTime.cn.close == '') {
              cn = '';
            } else {
              if (this.state.store.openCloseTime.cn.open != '' && this.state.store.openCloseTime.cn.close != '') {
                cno = this.state.store.openCloseTime.cn.open + ' - ';
                cnc = this.state.store.openCloseTime.cn.close;
              } else {
                if (this.state.store.openCloseTime.cn.open == '' && this.state.store.openCloseTime.cn.close != '') {
                  cno = '';
                  cnc = this.state.store.openCloseTime.cn.close;
                } else {

                  cno = this.state.store.openCloseTime.cn.open;
                  cnc = '';
                }
              }
              cn = <span>
              <span
                style={{fontWeight: 600}}>{ t7 != '' ? chart + ' ' + this.props.lng.SHOP_CREATE_TIME_CN_TITLE : this.props.lng.SHOP_CREATE_TIME_CN_TITLE}</span>
              <span>{' ' + cno + cnc}</span>
            </span>
            }
          }
          cpmTime = <p>
            {t2t6}
            {t7}
            {cn}
          </p>;
        } else {
          cpmTime = <p style={{margin: 0}}><span
            style={{fontStyle: 'italic', fontSize: '14px'}}>{this.props.lng.SHOP_NOT_TIME_WORK}</span></p>
        }
      } else {
        cpmTime = <p style={{margin: 0}}><span
          style={{fontStyle: 'italic', fontSize: '14px'}}>{this.props.lng.SHOP_NOT_TIME_WORK}</span></p>
      }
    }
    let cpnCreate = '', cpnAd = '', style = {};
    let userCurrent = this.state.userCurrent;
    if (listItem) {
      if (listItem.length > 0) {
        style = {marginTop: '5px', border: 0};
      } else {
        style = {border: 0};
      }
    }
    if (this.state.store.userId) {
      if (userCurrent && userCurrent.id) {
        if (userCurrent.id == this.state.store.userId.id) {
          cpnCreate = <div className="create-store mar-bot-5">
            <Link className="primary-color" to={urlOnPage.post.postCreateUpdate + this.state.store.id}><
              img src={Constant.linkServerImage + "/common/create-store.png"}/>{this.props.lng.SHOP_BUTTON_CREATE_POST}
            </Link>
          </div>
          cpnAd = <div className="list-item-on-store">
            <Link to={'/' + this.state.store.id + '/items/parent'}>
              <img src={Constant.linkServerImage + "/common/create_action.png"} style={style}/>
            </Link>
          </div>
        }
      }
    }
    let img = this.state.store.avatar, images = [];
    for (let key in img) {
      images.push(Constant.linkApi + '/images/' + img[key]);
    }
    let website = this.state.store.website;
    if (website) {
      if (website.indexOf('https') != -1) {
        website = website.slice(8);
      } else {
        if (website.indexOf('http') != -1) {
          website = website.slice(7);
        }
      }
    }
    let cpnListItem = [], cpn = '';
    if (listItem) {
      if (listItem.length > 0)
        for (let i = 0; i < listItem.length; i++) {
          cpn = <div className="list-item-on-store item" key={i}>
            {listItem[i].productItem ? <img src={Constant.linkApi + "/images/" + listItem[i].productItem}/> : null}
          </div>
          cpnListItem.push(cpn);
        }
      else {
        if (this.state.store.userId )
          if (this.state.store.userId.id != (this.state.userCurrent ? this.state.userCurrent.id : null) ) {
            cpn = <div className="list-item-on-store item" key={'b'}>
              <img src={Constant.linkServerImage + "/common/action-img.png"}/>
            </div>
            cpnListItem.push(cpn);
          }
      }
    } else {
      cpn = <div className="list-item-on-store item" key={'a'}>
        <img src={Constant.linkServerImage + "/common/action-img.png"}/>
      </div>
      cpnListItem.push(cpn);
    }
    let cmpPostNull = '';
    if (this.state.posts.messages.length == 0) {
      cmpPostNull = <div className="no-result-data">
        <p className="primary-color">{this.props.lng.SHOP_NOT_HAVE_POSTS}</p>
      </div>
    }
    let linkImg = this.state.store.coverImage ? Constant.linkApi + '/images/' + this.state.store.coverImage : Constant.linkServerImage + "/common/bg-place.png";
    return (
      <div className="places view-store cmp-viewstore">
        <Helmet
          title="Xem chi tiết cửa hàng"
        />
        {cpnCreate}
        <div className="place-content-ad">
          {this.state.isReady == false ? <LoadingTable/> :
            <div style={{
              position: 'relative'
            }}>
              <div className="place-img"
                   style={{
                     background: "url(" + linkImg + ")",
                     backgroundRepeat: 'no-repeat',
                     position: 'relative',
                     backgroundSize: 'cover', backgroundPosition: '50% 50%'
                   }}
              />
              <div className="place-img" style={{
                display: this.state.store.userId.id != (this.state.userCurrent ? this.state.userCurrent.id : null) ?
                  !_.isEmpty(this.state.adsSys.big) ?
                    'block'
                    :
                    'none'
                  :
                  'none',
                position: 'absolute',
                top: 0,
                left: 0
              }}>
                {
                  this.state.store.userId ?
                    this.state.store.userId.id != (this.state.userCurrent ? this.state.userCurrent.id : null) ?
                      !_.isEmpty(this.state.adsSys.big) ?
                        <a onClick={() => this.clickAdsSys(this.state.adsSys.big.id)}
                           href={this.state.adsSys.big.targetUrl} target="_blank">
                          <img
                            style={{width: '100%', height: '305px'}}
                            src={Constant.linkApi + '/images/' + this.state.adsSys.big.image}
                          />
                        </a>
                        :
                        ''
                      :
                      ''
                    :
                    ''
                }
              </div>
              <div className="box-store">
                <div className="info">
                  <div className="info-title"
                       style={{
                         height: this.state.store.userId ?
                           this.state.store.userId.id != (this.state.userCurrent ? this.state.userCurrent.id : null) ?
                             !_.isEmpty(this.state.adsSys.small) ?
                               '95.6px'
                               : ''
                             :
                             ''
                           :
                           ''
                       }}>
                    {
                      this.state.store.userId ?
                        this.state.store.userId.id != (this.state.userCurrent ? this.state.userCurrent.id : null) ?
                          !_.isEmpty(this.state.adsSys.small) ?
                            <a onClick={() => this.clickAdsSys(this.state.adsSys.small.id)}
                               href={this.state.adsSys.small.targetUrl} target="_blank"
                            >
                              <img src={Constant.linkApi + '/images/' + this.state.adsSys.small.image}/>
                            </a>
                            :
                            ''
                          :
                          ''
                        :
                        ''
                    }
                  </div>
                  <div className="info-content">
                    <div>
                      <a className="pull-left" href="#" style={{marginTop: '5px'}}>
                        <iframe
                          src={ "https://www.facebook.com/plugins/share_button.php?href=https://around.com.vn/xem-cua-hang/" +
                          functionCommon.createSlug(this.state.store.name) + "-" + this.state.store.id
                          + ".html&layout=button_count&size=small&mobile_iframe=true&appId=595121690592812&width=111&height=20"}

                          style={{border: 'none', overflow: 'hidden', width: "111px",
                            height: "20px",float: "right"}}
                          scrolling="no" frameborder="0" allowTransparency="true">

                        </iframe>
                      </a>
                      {
                        this.state.store.userId ? this.state.store.userId.id != (this.state.userCurrent ? this.state.userCurrent.id : null) ?
                          <a className="pull-right" href="#">
                            <img className="info-content-img"
                                 title="Báo cáo"
                                 src={Constant.linkServerImage + "/common/icon-report.png"}
                                 data-toggle="tooltip" data-placement="top"
                                 onClick={() => this.reportShop()}/>
                          </a> : '' : ''
                      }
                      {
                        this.state.store.userId ? this.state.store.userId.id != (this.state.userCurrent ? this.state.userCurrent.id : null) ?
                          <a className="pull-right">
                            <img className="info-content-img"
                                 src={Constant.linkServerImage + "/common/icon_point.png"}
                                 data-toggle="tooltip" data-placement="top"
                                 onClick={() => this.onShowGoogleMap()}/>
                          </a> : '' : ''
                      }
                      {
                        this.state.store.userId ? this.state.store.userId.id != (this.state.userCurrent ? this.state.userCurrent.id : null) ?
                          <a className="pull-right" href="#">
                            <img className="info-content-img" src={Constant.linkServerImage + "/common/chat.png"}
                                 onClick={this.onChat}/>
                          </a> : '' : ''
                      }
                    </div>
                    <Modal show={this.state.statusMap} onHide={lgClose} bsSize="large"
                           aria-labelledby="contained-modal-title-lg">
                      <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">{this.props.lng.GOOLE_MAPS}</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <center>
                          <div style={{height: `500px`, width: '900px'}}>
                            <DirectionsAroundGoogleMap
                              containerElement={
                                <div style={{height: `100%`}}/>
                              }
                              mapElement={
                                <div style={{height: `100%`}}/>
                              }
                              center={this.state.origin}
                              directions={this.state.directions}
                            />
                          </div>
                        </center>
                      </Modal.Body>
                    </Modal>
                    <table className="table table-borderless">
                      <tbody>
                      <tr>
                        <td className="col3 fw600">{this.props.lng.SHOP_NAME}</td>
                        <td className="strong-title">{this.state.store.name}</td>
                      </tr>
                      <tr>
                        <td className="col3 fw600">{this.props.lng.SHOP_PHONE}</td>
                        <td>{this.state.store.phone}</td>
                      </tr>
                      <tr>
                        <td className="col3 fw600">{this.props.lng.SHOP_ADDRESS}</td>
                        <td>{this.state.store.address}</td>
                      </tr>
                      <tr>
                        <td className="col3 fw600">{this.props.lng.SHOP_TIME_WORK}</td>
                        <td>{cpmTime}</td>
                      </tr>
                      <tr>
                        <td className="col3 fw600">{this.props.lng.SHOP_CREATE_WEBSITE_HINT}</td>
                        <td>
                          {
                            this.state.store.website ? this.state.store.website.length > 0 ?
                              <a href={'http://' + website} target="_blank">
                                {this.state.store.website}
                              </a>
                              : 'Chưa có dữ liệu' : 'Chưa có dữ liệu'
                          }
                        </td>
                      </tr>
                      <tr>
                        <td className="col3 fw600">{this.props.lng.SHOP_COUNT_POST}</td>
                        <td>
                          {
                            this.state.store.totalPost > 0 ?
                              this.state.store.totalPost
                              :
                              0
                          }
                          {this.props.lng.SHOP_NUMBER_POST}
                        </td>
                      </tr>
                      <tr>
                        <td className="col3 fw600">{this.props.lng.SHOP_PHOTOS}</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td colSpan="2" className="list-img-view">{cpmImg}</td>
                      </tr>
                      </tbody>
                    </table>
                    <div style={{overflow: 'hidden'}}>
                      <div className="action-border">
                        {/*<div className="frame-item">*/}
                        <div className="scroll-wrapper">
                          {cpnListItem}
                          {cpnAd}
                        </div>
                        {/*</div>*/}
                      </div>
                    </div>
                    <span>{this.state.store.description ? this.state.store.description : ''}</span>
                  </div>
                </div>
              </div>
            </div>}
        </div>
        {this.state.isOpen &&
        <Lightbox
          mainSrc={images[this.state.photoIndex]}
          nextSrc={images[(this.state.photoIndex + 1) % images.length]}
          prevSrc={images[(this.state.photoIndex + images.length - 1) % images.length]}

          onCloseRequest={() => this.setState({isOpen: false})}
          onMovePrevRequest={() => this.setState({
            photoIndex: (this.state.photoIndex + images.length - 1) % images.length,
          })}
          onMoveNextRequest={() => this.setState({
            photoIndex: (this.state.photoIndex + 1) % images.length,
          })}
          enableZoom={true}
        />
        }
        <div id="store-ad-view">
          {cmpPostNull}
          <PostListPage
            messages={this.state.posts.messages}
            lng={this.props.lng}
            pathname={this.props.location.pathname}
            onHideShowPhone={this.onHideShowPhone.bind(this)}
            onDeletePost={this.onDeletePost.bind(this)}
            onTrackingFriend={this.onTrackingFriend.bind(this)}
          />
          <div className="center-btn">
            {this.state.pageNumber > 1 ?
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                bsSize="normal"
                maxButtons={Constant.MAX_BUTTON_PAGGING}
                items={this.state.pageNumber}
                activePage={this.state.activePage}
                onSelect={this.handleSelect}/>
              :
              null}
          </div>
        </div>
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
      </div>
    );
  }
}

StorePageAdmin.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.shopReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(shopAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(StorePageAdmin);
