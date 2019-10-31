/*
 * Created by TrungPhat on 18/02/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';
import moment from 'moment';
import CommentsListPage from '../post/CommentsListPage';
let Constant = require('../../services/Constants');
let Aes = require('../../services/httpRequest');
let _ = require('../../utils/Utils');
const urlOnPage = require('../../url/urlOnPage');
import  FrameImages  from './FrameImages' ;
let functionCommon = require('../common/FunctionCommon');
/*const PostListRowPage =(props)=>{

 }*/
class HomeListRow extends React.Component {
  constructor(context, props) {
    super(context, props);
  }

  onFieldChange(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    this.props.updateState(fieldName, fieldValue);
  }

  onSendMessage(e) {
    this.props.onSubmitComment(e.target.name);
  }

  search(e) {
    this.onSendMessage(e);
  }

  onSubmitReplyForComment(e) {
    this.props.onSubmitReplyForComment(e);
  }



  render() {
    let message = this.props.message;
    let userCurrent = Aes.aesDecrypt(localStorage.getItem('user'));
    let url = message.isAds ? urlOnPage.post.postViewPage + functionCommon.createSlug(message.name) + '-' + message.id + '.html' + '?n=1' :
      urlOnPage.post.postViewPage + functionCommon.createSlug(message.name) + '-' + message.id + '.html';
    let img = message.userId.avatar ?
      Constant.linkApi + '/images/' + message.userId.avatar :
      Constant.linkServerImage + 'no_user.png';
    let imgCmt = userCurrent ? userCurrent.avatar ? Constant.linkApi + '/images/' + userCurrent.avatar : Constant.linkServerImage + 'no_user.png' :
      Constant.linkServerImage + 'no_user.png';
    let cpnMores = '', cpnBack = '';
    if (message.comments) {
      if (message.totalComment > message.comments.length) {
        cpnMores =
          <a className="more-cmt"
             onClick={() => {
               if (this.props.idPost != message.id) {
                 !this.props.comment.isLoading ? this.props.loadComments(message.id, 0) : null
               } else {
                 if (!this.props.comment.totalItemPaging || this.props.comment.totalItemPaging == 0) {
                   !this.props.comment.isLoading ? this.props.loadComments(message.id, 0) : null
                 } else {
                   !this.props.comment.isLoading ? this.props.loadMoresComment(message.id, parseInt(this.props.comment.page + 1)) : null
                 }
               }
             }}
             disabled={this.props.comment.isLoading}>
            {
              this.props.comment.isLoading == 'true' ?
                this.props.lng.LOADING + '...' :
                this.props.lng.POST_VIEW_LOAD_MORE_COMMENTS
            }
          </a>;
      }
    }
    return (
      <div className="user-content-wraper">
        <div className="user-content" style={{border: 0}}>
          <div className="content-user-header clearfix">
            <div className="header-avatar">
              <div className="pull-left"
                   onClick={() => this.props.onTrackingFriend(message.userId.id)}
              >
                <img src={img} className="avatar-user" title={message.userId.fullname}/>
              </div>
            </div>
            <div className="user-title" style={{paddingTop: '0'}}>
              <div className="news-feed-list-item">
                <span>
                    <Link
                      onClick={() => this.props.onTrackingFriend(message.userId.id)}>{message.userId.fullname}</Link>
                </span>
                <span className="dangtrenClass"> đăng trên </span>
                <span className="nameShopClassNewsfeed">
                    <Link
                      to={message.idShop ? urlOnPage.shop.shopView + functionCommon.createSlug(message.idShop.name) + '-' + message.idShop.id + '.html' : url}>
                        {message.idShop ? message.idShop.name : this.props.lng.NEWS_FEED_RAOVAT}
                    </Link>
                </span>
              </div>
              <div className="time"><span> <img height="18"
                                                src={Constant.linkServerImage + "/icon-thoi-gian-newsfeed.png"}/></span> {message.createdAt}
              </div>
              <div className="time"><img height="18"
                                         src={Constant.linkServerImage + "/icon-thoi-dia-chi-newsfeed.png"}/> {message.idShop ? message.idShop.address : message.address}
              </div>
            </div>
            {
              userCurrent ? userCurrent.id != message.userId.id ?
                <div className="help-box">
                  <a className="help-box-a-hover">
                    <img src={Constant.linkServerImage + '/dotdotdot.png'}
                         width="30px" height="30px" alt="Inbox"/>
                    <ul className='helpbox-item'>
                      {
                        message.showPhone == Constant.SHOW_PHONE ?
                          <li className="call">
                            <a href="javascript:void(0)" onClick={() => alert(message.phone)}>
                              <img style={{width: '25px', height: '25px' }}
                                   src={Constant.linkServerImage + '/call-help-box.png'} alt="Call"/>
                              <span className="span-detail-help-box-newsfeed"> Gọi điện cho Shop </span>
                            </a>
                          </li>
                          :
                          ''
                      }
                      <li className="inbox-icon">
                        <Link to={urlOnPage.messages.messagesSendMessages + message.userId.id}>
                          <img style={{width: '25px', height: '25px'}} src={Constant.linkServerImage + '/messge-help-box.png'} alt="Inbox"/>
                          <span className="span-detail-help-box-newsfeed"> Nhắn tin cho Shop </span>
                        </Link>
                      </li>
                      <li className="map">
                        <img src={Constant.linkServerImage + '/location-help-box.png'}
                             style={{width: '25px', height: '25px'}}
                             onClick={() => this.props.onDefinePosition(message.location)}
                             alt="Map"/>
                          <span onClick={() => this.props.onDefinePosition(message.location)} className="span-detail-help-box-newsfeed"> Địa chỉ của Shop </span>
                      </li>
                    </ul>
                  </a>

                </div>
                : '' : ''
            }
          </div>
          <div className="user-detail clearfix">
            <div className="detail">
            </div>
            {/*<div className="status primary-color">
             <p>Đang mở cửa</p>
             </div>*/}
          </div>
          <div className="user-post-content">
            <Link to={url} className="primary-color">{message.name}</Link>
            <div className="shortDescription">
              <p>{_.sliceStringByLength(message.description, 225)}</p>
            </div>
          </div>
        </div>
        <div className="user-post-image" onClick={() => browserHistory.push(url)}>
          <FrameImages totalImages={_.checkImagesArray(message.images)} arrImages={message.images} />
        </div>
        <div className="like-cmt">
          <div className="left-like">
            <Link>
              <span className={message.isLike == 1 ? 'fa fa-heart' : 'fa fa-heart-o'}
                    style={{color: message.isLike == 1 ? 'red' : '#000'}}
                    disabled={_.getTemporaryData('blockOnClickLike')}
                    onClick={() => this.props.onLikePost({id: message.id, isLike: message.isLike})}/>
              <p className="total-like-home"
                 onClick={() => this.props.onLoadListLiker(message.id, 0)}>{message.totalLike}</p>
            </Link>
          </div>
          <div className="right-cmt">
            <div className="cmt-link">
              Bình luận {message.totalComment}
            </div>
          </div>
          <div className="seller-cmt"
               id="list-cmt-home"
               style={{
                 padding: 0
               }}>
            {cpnMores}
            <CommentsListPage
              lng={this.props.lng}
              error={this.props.error}
              loadListReply={this.props.loadListReply.bind(this)}
              onSubmitReplyForComment={this.onSubmitReplyForComment.bind(this)}
              comment={this.props.comment}
              updateStateSubComment={this.props.updateStateSubComment.bind(this)}
              onShowFormReply={this.props.onShowFormReply.bind(this)}
              onTrackingFriend={this.props.onTrackingFriend.bind(this)}
              messages={message.comments ? message.comments : []}
            />
            <div className="seller-form-cmt" style={{padding: '5px 0 10px 0'}}>
              <div className="cmt-avatar" style={{
                background: "url(" + imgCmt + ")",
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover', backgroundPosition: '50% 50%'
              }}>
              </div>
              <input type="text"
                     className="form-control"
                     name={message.id}
                     style={{
                       width: 'calc(100% - 70px)',
                       marginBottom: 0,
                       background: '#fff',
                       borderRight: 0,
                       border: this.props.error.cmt ? '1px solid #dd4b39' : ''
                     }}
                     onKeyPress={event => {
                       if (event.key === "Enter") {
                         this.search(event);
                       }
                     }}
                     placeholder={this.props.lng.POST_VIEW_COMMENT_PLACEHOLDER}
                     value={this.props.comment.idPost == message.id ? this.props.comment.cmt : ''}
                     onChange={this.onFieldChange.bind(this)}
              />
              <button type="button" className="btn bg cl3f btn-flat btn-cmt btn-submit-cmt"
                      name={message.id}
                      onClick={ !this.props.comment.isLoading ? this.onSendMessage.bind(this) : null}
                      disabled={this.props.comment.isLoading}>{this.props.lng.POST_VIEW_COMMENT_SEND}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HomeListRow.propTypes = {
  message: PropTypes.object.isRequired
};

export default HomeListRow;
