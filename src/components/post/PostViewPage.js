/*
 * Created by TrungPhat on 14/02/2017
 */

import React, {PropTypes} from 'react';
import * as postAction from '../../actions/postAction';
import * as actionType from '../../actions/actionTypes';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {browserHistory, Link} from 'react-router';
import {ToastContainer, ToastMessage} from "react-toastr";
import CommentsPostList from './CommentsListPage';
import {Button, Modal} from 'react-bootstrap';
import LoadingTable from '../controls/LoadingTable';
import {AroundMap} from '../controls/AroundMap';
import SliderBS from '../common/SliderBS';
import DirectionsAroundGoogleMap from '../controls/DirectionsAroundGoogleMaps';
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let httpRequest = require('../../services/httpRequest');
let Constants=require('../../services/Constants');
let functionCommon = require('../common/FunctionCommon');
let Session = require('../../utils/Utils');
let Constant = require('../../services/Constants');
const urlRequestApi = require('../../url/urlRequestApi');
let Aes = require('../../services/httpRequest');
let urlOnPage = require('../../url/urlOnPage');
let polyline = require('polyline'),
  geojson = require('geojson'),
  util = require('util');
const initialState = {};
class PostViewPage extends React.Component {
  initialCommentsSub() {
    return {
      cmt: '',
      idPost: '',
      idCmt: '',
      listComment: [],
      isLoading: false,
      page: 0,
      num: 1,
      totalItemPaging: 0,
      loadChild: false
    }
  }

  initialComments() {
    return {
      cmt: '',
      idPost: '',
      listComment: [],
      page: 0,
      num: 1,
      totalItemPaging: 0,
      isLoading: false,
      display: 'none',
      sub: this.initialCommentsSub()
    }
  }

  initialListLike() {
    return {
      messages: [],
      isShowModal: false,
      pageNumber: 0,
      page: 0,
      isPostCliked: '',
      total: 0,
      isClick: false
    }
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      post: {},
      user: {},
      comments: [],
      isClick: false,
      isSubmit: false,
      isLoading: false,
      isLiked: false,
      count: 0,
      page: 0,
      totalItemPaging: 0,
      clicked: false,
      message: '',
      error: {},
      num: 1,
      isReady: false,
      statusMap: false,
      statusReup: false,
      statusNapCoin: false,
      statusVip: false,
      statusTop: false,
      markers: [{position: {lat: 0.0, lng: 0.0}, key: Date.now()}],
      idPost: '',
      userCurrent: typeof localStorage != 'undefined' ? Aes.aesDecrypt(localStorage.getItem('user')) : null,

      directions: null,
      isLocationCurrent: false,
      comment: this.initialComments(),
      loadMoresComments: false,
      idFriend: '',
      isStatus: false,
      isGetPost: false,
      listLike: this.initialListLike(),
      blockRendering: false,
      kindCatePush: ["2"],
      warningNullTop: false
    }
    this.onLikePost = this.onLikePost.bind(this);
    this.updateState = this.updateState.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.loadMores = this.loadMores.bind(this);
    this.onShowGoogleMap = this.onShowGoogleMap.bind(this);
    this.onChat = this.onChat.bind(this);
    this.onShowPhone = this.onShowPhone.bind(this);
    this.onLoadListLiker = this.onLoadListLiker.bind(this);
    this.onTrackingFriend = this.onTrackingFriend.bind(this);
  }

  componentDidMount() {
    this.setState({
      origin: new google.maps.LatLng(10.8230989, 106.6296638),
      destination: new google.maps.LatLng(10.8230989, 106.6296638),
    });
    Session.setTemporaryData('blockOnClickLike', false);
    // if (!Session.checkSession()) {
    //   browserHistory.push("/login");
    // } else {
    let trackingAds = '';
    if (!Session.isEmpty(this.props.location.query)) {
      if (this.props.location.query.n) {
        trackingAds = 1;
      }
    }
    let id = this.props.params.id;
    this.setState({idPost: id});
    let user = localStorage ? Aes.aesDecrypt(localStorage.getItem('user')) : null;
    this.setState({user: user, blockRendering: true});
    this.props.actions.getPostById({
      idPost: id,
      trackingAds: trackingAds,
      notificationRef: this.props.location.query.ref ? this.props.location.query.ref : null
    });
    //}


  }

  componentWillUnmount() {
    this.setState({listLike: this.initialListLike()});
    Session.removeTemporaryData('blockOnClickLike');
    this.setState({blockRendering: false});
  }

  onLoadListLiker() {

    let listLike = this.state.listLike;
    listLike.isPostCliked = this.props.params.id;
    listLike.isClick = true;
    this.setState({listLike: listLike});
    this.props.actions.listLiker({
      idPost: this.props.params.id,
      page: this.state.listLike.page,
      kind: Constant.KIND_LIKE
    });

  }

  // componentDidMount() {
  //   window.scrollTo(0, 0);
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataMessage) {
      let type = nextProps.dataMessage.type;
      let result = '';
      switch (type) {
        case actionType.GET_POST_SUCCESS:
          result = nextProps.dataMessage.dataPost;
          if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
            if (this.state.blockRendering) {
              let markers = this.state.markers;
              markers[0].position.lat = result.data.post.location[1];
              markers[0].position.lng = result.data.post.location[0];
              let destination = this.state.destination;
              destination = new google.maps.LatLng(result.data.post.location[1], result.data.post.location[0]);
              this.setState({
                blockRendering: false,
                isGetPost: true,
                post: result.data.post,
                isReady: true,
                markers: markers,
                destination: destination
              });
              this.loadComments(this.props.params.id, 0);
              navigator.geolocation.getCurrentPosition(function (location) {
                this.setState({
                  isLocationCurrent: true,
                  origin: new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
                })
              }.bind(this));
            }
          } else {
            if (result.code == Constant.RESPONSE_CODE_OTP_INVALID) {
              this.props.actions.getPostById({idPost: this.props.params.id});
            } else {
              //this.setState({isReady:true});
              if (result.code == 705) {
                if (this.state.blockRendering) {
                  this.props.toastMessage.warning(this.props.lng.RESPONSE_CODE_POST_NOT_FOUND, `Thông báo.`, {
                    closeButton: true,
                  });
                }
                browserHistory.push('/');
              }
            }
          }
          break;
        case actionType.COMMENTS_SUCCESS:
          result = nextProps.dataMessage.dataPost;
          if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
            if (this.state.isStatus) {
              let comment = this.state.comment;
              let messages = this.state.post;
              /* Comment */
              if (!result.parent) {
                if (comment.cmt.length > 0 && comment.isLoading == true) {
                  let msg = {
                    idUser: Aes.aesDecrypt(localStorage.getItem('user')),
                    idPost: comment.idPost
                  }
                  msg = Object.assign(msg, result.data);
                  messages.totalComment += 1;
                  /*Kiểm tra đã có bình luận hay chưa*/
                  if (messages.comments) {
                    messages.comments.unshift(msg);
                  } else {
                    messages.comments = [msg];
                  }
                  comment.num++;
                  comment.cmt = '';
                  comment.isLoading = false;
                }
                this.setState({post: messages, comment: comment})
              } else {
                /*REPLY*/
                let comment = this.state.comment;
                let msg = {
                  idUser: Aes.aesDecrypt(localStorage.getItem('user')),
                  idPost: comment.idPost
                }
                msg = Object.assign(msg, result.data);
                if (comment.sub.idCmt == result.parent) {
                  comment.sub.listComment.push(msg);
                }
                comment.sub.num++;
                comment.sub.cmt = '';
                comment.sub.isLoading = false;
                this.setState({comment: comment});
              }
              this.setState({isStatus: false});
            }
          } else {
            if (result.code == Constant.RESPONSE_CODE_OTP_INVALID) {
              if (!result.parent) {
                this.onSubmitComment(this.state.comment.idPost);
              } else {
                this.onSubmitReplyForComment();
              }
            }
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
        case actionType.LOAD_COMMENTS_SUCCESS:
          result = nextProps.dataMessage.dataPost;
          if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
            let comment = this.state.comment;
            if (!result.params.parent) {
              /* COMMENTS PARENT */
              /*Bị cache*/
              let post = this.state.post;
              let data = this.state.post.comments;
              if (this.state.isStatus && this.state.isClick) {
                if (this.state.loadMoresComments == true) {
                  for (let j in result.data.socials) {
                    data.push(result.data.socials[j]);
                  }
                  this.setState({loadMoresComments: false});
                } else {
                  data = result.data.socials;
                }
                post.comments = data;
                this.setState({isStatus: false, isClick: false});
              }
              comment.page = result.data.page;
              comment.totalItemPaging = result.data.totalItemPaging;
              comment.isLoading = false;
              this.setState({comment: comment, post: post});
            } else {
              /* REPLY */
              let comment = this.state.comment;
              let data = comment.sub.listComment;
              if (this.state.isStatus && this.state.isClick) {
                if (this.state.loadMoresComments == true) {
                  for (let j in result.data.socials) {
                    data.push(result.data.socials[j]);
                  }
                  this.setState({loadMoresComments: false});
                } else {
                  data = result.data.socials;
                }
                comment.sub.listComment = Session.reverseArray(data);
                /* Đảo chiều mảng */
                this.setState({isStatus: false, isClick: false});
              }
              comment.sub.page = result.data.page;
              comment.sub.totalItemPaging = result.data.totalItemPaging;
              comment.sub.isLoading = false;
              this.setState({comment: comment});
            }
          } else {
            if (result.code == Constant.RESPONSE_CODE_OTP_INVALID) {
              if (!result.params.parent) {
                this.loadComments(this.props.params.id, 0)
              } else {
                this.loadListReply(this.props.params.id, this.state.comment.sub.idCmt, 0);
              }
            } else {
              this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
        case actionType.LOAD_LIST_LIKER_SUCCESS:
          result = nextProps.dataMessage.dataPost;
          if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
            let listLike = this.state.listLike;
            if (listLike.isClick) {
              let data = listLike.messages.concat(result.data.socials);
              listLike.messages = data;
              listLike.total = result.data.total;
              listLike.pageNumber = Math.ceil(result.data.total / result.data.totalItemPaging);
              listLike.page += 1;
            }
            listLike.isClick = false;
            this.setState({listLike: listLike});
          } else {
            if (result.code == Constant.RESPONSE_CODE_OTP_INVALID) {
              this.onLoadListLiker(this.state.listLike.isPostCliked);
            }
          }
          break;
      }
    }
    if (nextProps.dataComment) {
      let type = nextProps.dataComment.type;
      let result = '';
      switch (type) {
        case actionType.LIKE_POST_SUCCESS:
          result = nextProps.dataComment.dataPosts;
          if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
            if (Session.getTemporaryData('blockOnClickLike')) {
              let post = this.state.post;
              post.totalLike += 1;
              post.isLike = 1;
              this.setState({post: post, isStatus: false, comments: [], isLiked: true});
              Session.setTemporaryData('blockOnClickLike', false);
            }
          } else {
            if (result.code == Constant.RESPONSE_CODE_OTP_INVALID) {
              Session.setTemporaryData('blockOnClickLike', false);
              //this.onLikePost();
            } else {
             // Session.setTemporaryData('blockOnClickLike', false);
              this.onLikePost();
            }
          }
          break;
        case actionType.UNLIKE_SUCCESS:
          result = nextProps.dataComment.dataPost;
          if (result.code == Constant.RESPONSE_CODE_SUCCESS) {
            if (this.state.isStatus) {
              let post = this.state.post;
              post.isLike = 0;
              if (post.totalLike - 1 >= 0) {
                post.totalLike -= 1;
              } else {
                post.totalLike = 0;
              }
              this.setState({post: post, isStatus: false});
              Session.setTemporaryData('blockOnClickLike', false)
            }
          } else {
            if (result.code == Constant.RESPONSE_CODE_OTP_INVALID) {
              Session.setTemporaryData('blockOnClickLike', false)
              this.onLikePost();
            }
          }
          break;
      }
    }
    if (nextProps.location.key != this.props.location.key) {
      let trackingAds = '';
      if (!Session.isEmpty(this.props.location.query)) {
        if (this.props.location.query.n) {
          trackingAds = 1;
        }
      }
      this.setState({blockRendering: true});
      this.props.actions.getPostById({
        idPost: nextProps.params.id,
        trackingAds: trackingAds,
        notificationRef: nextProps.location.query.ref ? nextProps.location.query.ref : null
      });
    }
  }

  onShowGoogleMap(event) {
    event.preventDefault();
    let origin = this.state.origin;
    if (this.state.isLocationCurrent == false) {
      origin = new google.maps.LatLng(this.state.post.location[1], this.state.post.location[0]);
    }
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
        this.props.toastMessage.error('Chỉ đường hiện không khả dụng', `Thông báo.`, {
          closeButton: true,
        });
      }
    });
    this.setState({statusMap: true});
  }

  onLikePost() {
    let userCurrent = this.state.userCurrent;
    if (userCurrent && userCurrent.id) {
      if (!Session.getTemporaryData('blockOnClickLike')) {
        this.setState({isStatus: true});
        Session.setTemporaryData('blockOnClickLike', true);
        if (this.state.post.isLike == 0) {
          this.props.actions.socialAddLike({idPost: this.state.post.id, kind: 1});
        } else {
          this.props.actions.socialUnLike({idPost: this.state.post.id, kind: Constant.KIND_LIKE});
        }
      }
    }
    else {
      browserHistory.push('/login?require=true');
    }
  }

  onShowPhone() {
    alert(this.state.post.phone);
  }

  validatorForm() {
    let error = this.state.error;
    let dataForm = this.state.comment;
    let check = true;
    if (dataForm.cmt.length == 0) {
      error['cmt'] = true;
      check = false;
    }
    this.setState({error: error});
    return check;
  }

  updateState(event) {
    let value = event.target.value;
    let comment = this.state.comment;
    comment.cmt = value;
    comment.idPost = this.props.params.id;
    let error = this.state.error;
    if (value.length > 0) {
      error['cmt'] = false;
    }
    this.setState({comment: comment, error: error});
  }

  onSendMessage(e) {
    if (this.validatorForm()) {
      let comment = this.state.comment;
      comment.isLoading = true;
      comment.idPost = this.props.params.id;
      this.setState({comment: comment, isStatus: true});
      this.props.actions.socialAdd({idPost: this.props.params.id, kind: 2, message: this.state.comment.cmt});
    }
  }

  /* Load more comment */
  loadMores() {
    let page = this.state.page;
    page += 1;
    this.setState({page: page, clicked: true, isStatus: true, isClick: true});
    this.props.actions.socialList({idPost: this.state.post.id, page: page, kind: 2});
  }

  handleMapClick() {
  }

  onClickMarker() {
  }

  getMeta(url, callback) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
      callback(this.width, this.height);
    }
  }

  _crop() {

  }

  onChat() {
    if (this.state.post.userId.id != this.state.user.id) {
      browserHistory.push('/messages/' + this.state.post.userId.id);
    }
  }

  /* onpress = enter */
  search() {
    this.onSendMessage();
  }

  /*COMMENTS*/

  /* Load more comments reply */
  loadListReply(idPost, idCmt, page) {
    let comment = this.state.comment;
    comment.sub.page = page;
    comment.sub.idPost = this.props.params.id;
    comment.sub.idCmt = idCmt;
    comment.sub.isLoading = true;
    this.setState({comment: comment, loadMoresComments: page > 0, isStatus: true, isClick: true});
    this.props.actions.socialList({idPost: this.props.params.id, parent: idCmt, page: page, kind: 2});
  }

  /* Add comment reply to comment */
  onSubmitReplyForComment(e) {
    if (this.validatorFormReply()) {
      let sub = this.state.comment.sub;
      this.setState({isStatus: true, isClick: true})
      this.props.actions.socialAdd({idPost: this.props.params.id, kind: 2, message: sub.cmt, parent: sub.idCmt});
    }
  }

  updateStateSubComment(idPost, idCmt, value) {
    let comment = this.state.comment;
    comment.sub.idPost = this.props.params.id;
    comment.sub.idCmt = idCmt;
    comment.sub.cmt = value;
    let error = this.state.error;
    if (value.length > 0) {
      error['subCmt'] = false;
    }
    this.setState({comment: comment, error: error});
  }

  /* Show list comments reply, default display none */
  onShowFormReply(idCmt, idPost) {
    let comment = this.state.comment;
    comment.sub.idCmt = idCmt;
    comment.sub.listComment.length = 0;
    this.setState({comment: comment, isStatus: true, isClick: true});
    this.props.actions.socialList({idPost: this.props.params.id, parent: idCmt, page: 0, kind: 2});
  }

  /* Load comments when get post finished */
  loadComments(id, page) {
    let comment = this.state.comment;
    comment.page = page;
    comment.idPost = id;
    comment.isLoading = true;
    this.setState({comment: comment, isStatus: true, isClick: true});
    this.props.actions.socialList({idPost: id, page: page, kind: 2});
  }

  loadMoresComment(id, page) {
    let comment = this.state.comment;
    comment.page = page;
    comment.idPost = this.props.params.id;
    comment.isLoading = true;
    this.setState({comment: comment, loadMoresComments: true, isStatus: true, isClick: true});
    this.props.actions.socialList({idPost: this.props.params.id, page: page, kind: 2});
  }

  validatorFormReply() {
    let error = this.state.error;
    let dataForm = this.state.comment;
    let check = true;
    if (dataForm.sub.cmt.length == 0) {
      error['subCmt'] = true;
      check = false;
    }
    this.setState({error: error});
    return check;
  }

  onTrackingFriend(id) {
    let user = Aes.aesDecrypt(localStorage.getItem('user'));
    if (user && user.id) {
      if (user.id == id) {
        browserHistory.push(urlOnPage.user.userMyProfile);
      } else {
        this.setState({idFriend: id});
        this.props.actions.trackingFriend({userIdFriend: id, shopinfo: 1});
      }
    }
    else {
      browserHistory.push('/login?require=true');
    }
  }

  onClickReup () {
    this.setState({statusReup : true});
  }

  onClickReupAccept (id) {
    let that = this;
    that.setState({isReady : false});

    let data = {
      platform: Constants.platform,
      id: id,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };

    httpRequest.post(urlRequestApi.shopPost.reUpPost, data, function cb(err, res) {
      if (!err && res && res.code == Constant.RESPONSE_CODE_SUCCESS ) {
        that.setState({statusReup : false, isReady: true});
        that.props.toastMessage.success('Reup tin thành công', `Thông báo.`, {
          closeButton: true,
        });
      }
      else if (!err && res && res.code == Constant.RESPONSE_CODE_USER_BALANCE_NOT_ENOUGH) {
          that.setState({statusReup : false, statusNapCoin : true, isReady : true});
      }
      else {
        that.setState({statusReup : false, isReady : true});
        that.props.toastMessage.error('Reup top tin lỗi ! Xin thử lại', `Thông báo.`, {
          closeButton: true
        });
      }
    });

  }

  onClickTopCat (val) {
    let kindCatePush = this.state.kindCatePush;
    if (kindCatePush.indexOf (val) != -1 ) {
      kindCatePush.splice(kindCatePush.indexOf (val), 1 );
    }
    else {
      kindCatePush.push(val);
    }
    this.setState({kindCatePush, warningNullTop: false});
  }

  geTotalMoneyTop (kindCatePush ) {
    let total = 0 ;
    if (kindCatePush.indexOf ("-1") != -1 ) {
      total += 150;
    }
    if (kindCatePush.indexOf ("1") != -1 ) {
      total += 100;
    }
    if (kindCatePush.indexOf ("2") != -1 ) {
      total += 50;
    }
    return total;
  }


  onClickTopAccept (id) {
    let kindCatePush = this.state.kindCatePush;
    if (kindCatePush.length == 0 ) {
      this.setState({warningNullTop: true });
      return;
    }

    let that = this;
    that.setState({isReady : false});

    let data = {
      platform: Constants.platform,
      id: id,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST)
    };

    if (kindCatePush.indexOf ("-1") != -1 ) {
      data.category = 1;
    }
    if (kindCatePush.indexOf ("1") != -1 ) {
      data.category1 = 1;
    }
    if (kindCatePush.indexOf ("2") != -1 ) {
      data.category2 = 1;
    }


    httpRequest.post(urlRequestApi.shopPost.topPost, data, function cb(err, res) {
      console.log("errr", err, res);

      if (!err && res && res.code == Constant.RESPONSE_CODE_SUCCESS ) {
        that.setState({statusReup: false, isReady: true, statusTop: false});
        that.props.toastMessage.success('Up top tin thành công', `Thông báo.`, {
          closeButton: true
        });
      }
      else if (!err && res && res.code == Constant.RESPONSE_CODE_USER_BALANCE_NOT_ENOUGH) {
        console.log("vao day @@@@@@@@@@@@");
        that.setState({statusTop : false, statusNapCoin: true, isReady : true});
      }
      else {
        that.setState({statusTop : false, isReady : true});
        that.props.toastMessage.error('Up top tin lỗi ! Xin thử lại', `Thông báo.`, {
          closeButton: true,
        });
      }
    });

  }


  render() {
    const infoUser = this.state.user;
    let listLike = this.state.listLike;
    let cpnMores = '', cpnBack = '';
    if (this.state.post.comments) {
      if (this.state.post.totalComment > this.state.post.comments.length) {
        cpnMores =
          <a className="more-cmt"
             onClick={() => {
               if (!this.state.comment.isLoading) {
                 this.loadMoresComment(this.props.params.id, parseInt(this.state.comment.page + 1))
               }
             }}
             disabled={this.state.comment.isLoading}>
            {
              this.state.comment.isLoading == 'true' ?
                this.props.lng.LOADING + '...' :
                this.props.lng.POST_VIEW_LOAD_MORE_COMMENTS
            }
          </a>;
      }
    }
    let cpnUserId = '';
    let linkImg2 =
      this.state.post.userId ?
        this.state.post.userId.avatar ?
          Constant.linkApi + "/images/" + this.state.post.userId.avatar
          :
          Constant.linkServerImage + 'no_user.png'
        :
        null
    if (this.state.post.userId) {
      cpnUserId = <div>
        <div className="seller-avatar text-center" onClick={() => this.onTrackingFriend(this.state.post.userId.id)}
             style={{
               background: "url(" + linkImg2 + ")",
               backgroundRepeat: 'no-repeat',
               backgroundPosition: '50% 50%',
               backgroundSize: 'cover'
             }}>
          {/*<img src={this.state.post.userId.avatar?Constant.linkApi+"/images/"+this.state.post.userId.avatar:Constant.linkServerImage+'no_user.png'}/>*/}
        </div>
        <div className="seller-info-detail text-center">
          <p
            onClick={() => this.onTrackingFriend(this.state.post.userId.id)}>
            {this.state.post.userId.fullname.length > 30 ?
              this.state.post.userId.fullname.slice(0, 30).concat('...') : this.state.post.userId.fullname}
          </p>
          <p style={{color: '#999'}}>{this.state.post.createdAt}</p>
        </div>
      </div>
    }
    let cpnLiked = <span className='fa fa-heart'
                         style={{
                           color: this.state.post.isLike == 1 ? 'red' : '#fff',
                           fontSize: '2.5em',
                           cursor: 'pointer'
                         }} onClick={() => this.onLikePost()}/>;
    let lgClose = () => this.setState({statusMap: false});
    let lgCloseReUp = () => this.setState({statusReup: false});
    let lgCloseNapCoin = () => this.setState({statusNapCoin: false});
    let lgCloseVip = () => this.setState({statusVip: false});
    let lgCloseVipTrue = () => this.setState({statusVip: true});
    let lgCloseTopTrue = () => this.setState({statusTop: true});
    let lgCloseTopFalse = () => this.setState({statusTop: false});
    let kindCatePush = this.state.kindCatePush;
    let linkImg = (infoUser && infoUser.avatar) ? Constant.linkApi + "/images/" + infoUser.avatar : Constant.linkServerImage + 'no_user.png';
    console.log("kindCatePush", kindCatePush);
    return (
      <div>
        {this.state.post && this.state.post.images ?
          <Helmet
            title={this.state.post.name}
            meta={[
              {name: 'author', content: "around.com.vn"},

              {name: 'twitter:site', content: "around.com.vn"},
              {name: 'twitter:creator', content: "around.com.vn"},
              {name: 'twitter:title', content: this.state.post.name},
              {name: 'twitter:image', content:  Constants.linkApi +'/images/'+this.state.post.images[0]},

              {property: 'og:title', content: this.state.post.name},
              {property: 'title', content: this.state.post.name},
              {property: 'description', content: this.state.post.name},
              {property: 'og:site_name', content: "around.com.vn"},
              {property: 'og:type', content: "website"},
              {property: 'og:url', content: "https://around.com.vn/san-pham/" + functionCommon.createSlug(this.state.post.name) + '-' + this.state.post.id + '.html'},
              {property: 'og:description', content: this.state.post.description },
            { property: 'og:site_name', content: "around.com.vn" },

              ]}
          />
          : ''
        }
        {this.state.isReady == false ? <LoadingTable/> :
          <div id="view-post">
            <div className="__v-ad">
              <SliderBS
                data={this.state.post.images}
              />
              {this.state.post.userId ? this.state.post.userId.id != (this.state.userCurrent ? this.state.userCurrent.id : null ) ?
                <div className="sp-action">
                  <a className="pull-left" href="#">
                    <img className="info-content-img" src={Constant.linkServerImage + "/common/icon_point.png"}
                         onClick={this.onShowGoogleMap}/>
                  </a>
                  <a className="pull-left" href="#">
                    <img className="info-content-img" src={Constant.linkServerImage + "/common/chat.png"}
                         onClick={this.onChat}/>
                  </a>
                  {
                    this.state.post.showPhone == Constant.SHOW_PHONE ?
                      <a className="pull-left" href="#">
                        <img className="info-content-img" src={Constant.linkServerImage + "/common/call.png"}
                             onClick={() => this.onShowPhone()}/>
                      </a>
                      :
                      <a className="pull-left" href="#">
                        <img className="info-content-img" src={Constant.linkServerImage + "/common/call-dis.png"}/>
                      </a>
                  }
                </div> : '' : ''
              }
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
              <div className="__ad-title">
                <div className="__ad-like">
                  {cpnLiked}
                  <span className="total-like-of-post" onClick={(e) => {
                    let listLike11 = this.state.listLike;
                    listLike11.isShowModal = true;
                    this.setState({listLike: listLike11});
                    this.onLoadListLiker();
                  }}>{this.state.post.totalLike}</span>
                </div>
                <div className="__ad-name-pro">
                  <a className="text-center text-overflow" title={this.state.post.name}
                     href="javascript:void(0)">{this.state.post.name}</a>
                </div>
                <div className="__img-more text-right">
                  <a href="javascript:void(0)">
                    <span>{this.state.post.images ? '+' + this.state.post.images.length : '0'}</span>
                    <img src={Constant.linkServerImage + "/common/icon-img.png"}/>
                  </a>
                </div>
              </div>
            </div>
            <div className="seller">
              <div className="saleprice">
                <h3 style={{marginLeft :"111px"}}>
                  {
                  this.state.post.price == -1 ?
                    this.props.lng.POST_TYPE_CALL
                    :
                    this.state.post.price == -2 ?
                      this.props.lng.POST_TYPE_NEWS_FEED_NOTIFY
                      :
                      this.state.post.price > 0 ?
                        Session.format_price(this.state.post.price) : this.state.post.price
                  }

                  <iframe
                    src={ "https://www.facebook.com/plugins/share_button.php?href=https://around.com.vn/san-pham/" +
                    functionCommon.createSlug(this.state.post.name) + "-" + this.state.post.id
                        + ".html&layout=button_count&size=small&mobile_iframe=true&appId=595121690592812&width=111&height=20"}

                    style={{border: 'none', overflow: 'hidden', width: "111px",
                      height: "20px",float: "right"}}
                    scrolling="no" frameborder="0" allowTransparency="true">

                  </iframe>
                </h3>
                { (this.state.post.show != 1 && this.state.post.userId && this.state.post.userId.id == (this.state.userCurrent ? this.state.userCurrent.id : null ) ) ?

                  <div className="topvipreup">
                    <div className="item-topvipreup">
                       <img  src={Constant.linkServerImage + "/reup.png"}
                            onClick={this.onClickReup.bind(this)}/>
                      <div style={{color: '#9ebc5b'}}> Làm mới tin </div>
                      <Modal className="post-reup" show={this.state.statusReup} onHide={lgCloseReUp} bsSize="large"
                             aria-labelledby="contained-modal-title-lg">
                        <Modal.Body>
                          <center>
                            <div style={{height: `200px`}}>
                                <div className="title-reup">Bạn muốn làm mới tin trên trang rao vặt ?</div>
                                <div className="coin-reup"> (50 Acoin)</div>
                                <div className="btn-reup">
                                  <button onClick={this.onClickReupAccept.bind(this, this.state.post.id)}> Chấp nhận </button>
                                  <button onClick={lgCloseReUp}> Để sau </button>
                                </div>
                            </div>
                          </center>
                        </Modal.Body>
                      </Modal>
                    </div>

                    <div className="item-topvipreup">
                       <img src={Constant.linkServerImage + "/top.png"}
                            onClick={lgCloseTopTrue}/>
                      <div style={{color: '#ebbc61'}}> Đăng tin Top </div>
                        <Modal className="post-top" show={this.state.statusTop} onHide={lgCloseTopFalse} bsSize="large"
                                 aria-labelledby="contained-modal-title-lg">
                          <Modal.Body>
                            <center>
                              <div style={{height: `350px`}}>
                                  <div className="title-top">Bạn muốn đăng tin TOP trên trang rao vặt ?</div>
                                  <div className="coin-top"> ({this.geTotalMoneyTop(kindCatePush)} Acoin)</div>
                                  <div className="btn-checkbox-top">
                                       <div
                                         onClick={this.onClickTopCat.bind(this, "-1")}
                                         className={kindCatePush.indexOf("-1") != -1 ?
                                         "btn-checkbox-top-item btn-checkbox-top-item-check" : "btn-checkbox-top-item"}>
                                         <button onClick={lgCloseReUp}>
                                            Danh mục tất cả
                                           {kindCatePush.indexOf("-1") != -1 ?
                                             <img width="16px" src={Constant.linkServerImage + "/ic_checked_white.png"}/>
                                             :
                                             <img src={Constant.linkServerImage + "/none-select.png"}/>
                                           }
                                         </button>
                                        <span> 150 <img width="16px" src={Constant.linkServerImage + "/icon-acoin-check.png"} /> </span>
                                      </div>
                                      <div
                                        onClick={this.onClickTopCat.bind(this, "1")}
                                        className={kindCatePush.indexOf("1") != -1 ?
                                        "btn-checkbox-top-item btn-checkbox-top-item-check" : "btn-checkbox-top-item"} >
                                         <button onClick={lgCloseReUp}>
                                           {this.state.post.primaryCategory.name}
                                           {kindCatePush.indexOf("1") != -1 ?
                                             <img width="16px" src={Constant.linkServerImage + "/ic_checked_white.png"}/>
                                             :
                                             <img src={Constant.linkServerImage + "/none-select.png"}/>
                                           }
                                         </button>
                                        <span> 100 <img width="16px" src={Constant.linkServerImage + "/icon-acoin-check.png"} /> </span>
                                      </div>
                                      <div
                                        onClick={this.onClickTopCat.bind(this, "2")}
                                        className={kindCatePush.indexOf("2") != -1 ?
                                        "btn-checkbox-top-item btn-checkbox-top-item-check" : "btn-checkbox-top-item"}>
                                       <button onClick={lgCloseReUp}>
                                        {this.state.post.secondCategory.name}
                                         {kindCatePush.indexOf("2") != -1 ?
                                           <img width="16px" src={Constant.linkServerImage + "/ic_checked_white.png"}/>
                                           :
                                           <img src={Constant.linkServerImage + "/none-select.png"}/>
                                         }
                                       </button>
                                        < span > 50 < img width="16px" src={Constant.linkServerImage + "/icon-acoin-check.png"} /> </span>
                                      </div>
                                  </div>
                                  <div className="explainTop">
                                    Hãy <img src={Constant.linkServerImage + "/select-check.png"} /> chọn vị trí hiển thị tin
                                  </div>
                                {this.state.warningNullTop ?
                                  <div className="errorTop">
                                    Bạn phải chọn ít nhất 1 vị trí hiển thị
                                  </div>
                                  :
                                  ''
                                }

                                  <div className="btn-top">
                                    <button onClick={this.onClickTopAccept.bind(this, this.state.post.id)}> Chấp nhận </button>
                                    <button onClick={lgCloseTopFalse}> Để sau </button>
                                  </div>
                              </div>
                            </center>
                          </Modal.Body>
                        </Modal>
                    </div>
                    <div className="item-topvipreup">
                       <img src={Constant.linkServerImage + "/vip.png"}
                            onClick={lgCloseVipTrue} />
                      <div style={{color: '#f19589'}}> Đăng tin Vip </div>
                    </div>
                  </div>
                  :
                  ''
                }
              </div>
              <div className="seller-infor">
                {cpnUserId}
                <div className="seller-address text-center">{this.state.post.address}</div>
              </div>
              <div className="seller-post-content text-left">
                {this.state.post.description}
              </div>
              <div className="seller-cmt">
                <span className="text-left">{this.props.lng.POST_COMMENT} ({this.state.post.totalComment})</span>
                {cpnMores}
                <CommentsPostList
                  messages={this.state.post.comments ? this.state.post.comments : []}
                  loadListReply={this.loadListReply.bind(this)}
                  onSubmitReplyForComment={this.onSubmitReplyForComment.bind(this)}
                  updateStateSubComment={this.updateStateSubComment.bind(this)}
                  onShowFormReply={this.onShowFormReply.bind(this)}
                  onTrackingFriend={this.onTrackingFriend.bind(this)}
                  lng={this.props.lng}
                  comment={this.state.comment}
                  error={this.state.error}
                />

                <div className="seller-form-cmt">
                  <div className="cmt-avatar" style={{
                    background: "url(" + linkImg + ")",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover', backgroundPosition: '50% 50%'
                  }}
                  >
                  </div>
                  <input type="text"
                         className="form-control"
                         name="message"
                         onKeyPress={event => {
                           if (event.key === "Enter") {
                             this.search();
                           }
                         }}
                         style={{
                           border: this.state.error.cmt ? '1px solid #dd4b39' : ''
                         }}
                         placeholder={this.props.lng.POST_VIEW_COMMENT_PLACEHOLDER}
                         value={this.state.comment.cmt}
                         onChange={this.updateState}
                  />
                  <span className="input-group-btn">
                    <button type="button" className="btn bg cl3f btn-flat btn-cmt"
                            onClick={!this.state.isSubmit ? this.onSendMessage : null}
                            disabled={this.state.isSubmit}>{this.state.isSubmit ? this.props.lng.POST_VIEW_COMMENT_SENDING : this.props.lng.POST_VIEW_COMMENT_SEND}</button>
                  </span>
                </div>
                <Modal show={this.state.listLike.isShowModal} onHide={() => {
                  this.setState({listLike: this.initialListLike()});
                }} bsSize="large" aria-labelledby="contained-modal-title-lg" className="modal-like">
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">{this.props.lng.LIST_LIKE_TITLE}</Modal.Title>
                  </Modal.Header>

                  <Modal.Body>
                    <center>
                      <div style={{minHeight: `200px`, width: '100%', padding: '10px'}}>
                        {
                          listLike ?
                            listLike.messages.map((item, index) =>
                              <div className="list-friend-suggest btn-add" key={index}>
                                {
                                  item.idUser.avatar ?
                                    <div onClick={() => props.onTrackingFriend(item.idUser.id)}
                                         className="friend-avatar-img css-bg-df"
                                         style={{
                                           width: '55px',
                                           cursor: 'pointer',
                                           height: '55px',
                                           overflow: 'hidden',
                                           float: 'left',
                                           borderRadius: '50%',
                                           background: "url(" + Constant.linkApi + '/images/' + item.idUser.avatar + ")",
                                           backgroundRepeat: 'no-repeat',
                                           backgroundSize: 'cover',
                                           backgroundPosition: '50% 50%'
                                         }}>
                                    </div>
                                    :
                                    <div onClick={() => props.onTrackingFriend(item.idUser.id)}
                                         className="friend-avatar-img css-bg-df"
                                         style={{
                                           width: '55px',
                                           cursor: 'pointer',
                                           height: '55px',
                                           overflow: 'hidden',
                                           float: 'left',
                                           borderRadius: '50%',
                                           background: "url(" + Constant.linkServerImage + 'no_user.png)',
                                           backgroundRepeat: 'no-repeat',
                                           backgroundSize: 'cover',
                                           backgroundPosition: '50% 50%'
                                         }}>
                                    </div>
                                }
                                <div className="suggest-address">
                                  <p className="text-left" style={{margin: '0px'}}><Link
                                    onClick={() => this.onTrackingFriend(item.idUser.id)}>{item.idUser.fullname}</Link>
                                  </p>
                                  <p className="text-left">{item.createdAt}</p>
                                </div>
                              </div>
                            )
                            : ''
                        }
                        {
                          this.state.listLike.messages.length < this.state.listLike.total ? this.state.listLike.pageNumber > 1 ?
                            <div
                              className={this.state.listLike.isClick ? 'fa fa-spinner fa-spin load-more' : 'load-more'}
                              onClick={() => this.onLoadListLiker(this.state.listLike.isPostCliked)}>
                              Xem thêm
                            </div> : null : null
                        }
                      </div>
                    </center>
                  </Modal.Body>
                </Modal>
                <ToastContainer
                  toastMessageFactory={ToastMessageFactory}
                  ref="container"
                  className="toast-top-right"
                />
              </div>
            </div>

            <Modal className="post-napcoin" show={this.state.statusNapCoin} onHide={lgCloseNapCoin} bsSize="large"
                   aria-labelledby="contained-modal-title-lg">
              <Modal.Body>
                <center>
                  <div style={{height: `200px`}}>
                    <div className="btnCloseModal" onClick={lgCloseNapCoin}>x</div>
                    <div className="title-napcoin">Số Acoin trong tài khoản của bạn không đủ </div>
                    <div className="coin-napcoin"> bạn muốn tăng Acoin tài khoản ? </div>
                    <div className="btn-napcoin">
                      <Link
                        to={urlOnPage.coin.coinBuyCoin} >
                        <button> Nạp Acoin </button>
                      </Link>
                      <Link
                        to={urlOnPage.ads.adsVideoSysList} >
                        <button> Xem quảng cáo </button>
                      </Link>
                    </div>
                  </div>
                </center>
              </Modal.Body>
            </Modal>

            <Modal className="post-napcoin" show={this.state.statusVip} onHide={lgCloseVip} bsSize="large"
                   aria-labelledby="contained-modal-title-lg">
              <Modal.Body>
                <center>
                  <div style={{height: `150px`}}>
                    <div className="btnCloseModal" onClick={lgCloseVip}>x</div>
                    <div className="title-napcoin"> Tính năng đang được cập nhật </div>
                    <div className="btn-napcoin">
                      <button onClick={lgCloseVip}> Đóng </button>
                    </div>
                  </div>
                </center>
              </Modal.Body>
            </Modal>

          </div>
        }


      </div>
    );
  }
}

PostViewPage.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.postReducer,
    dataComment: state.commentReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(postAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(PostViewPage);
