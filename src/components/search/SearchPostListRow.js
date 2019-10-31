/*
 * Created by TrungPhat on 17/02/2017
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';
let Constant=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let _=require('../../utils/Utils');
let urlOnPage = require('../../url/urlOnPage');
let functionCommon = require('../common/FunctionCommon');


const SearchPostListRow =(props)=> {
  let message = props.message;
  const levelCat = props.levelCat;
  let cpnComment = "";
  if(message.comments && message.comments.length > 0){
    if(message.comments[0]){
      let img = message.comments[0].idUser.avatar ? Constant.linkApi + '/images/' + message.comments[0].idUser.avatar : Constant.linkServerImage+'no_user.png';
      cpnComment=
        <div className="bottom-comments">
          <div className="cmt-avatar"
               onClick={() => props.onTrackingFriend(message.comments[0].idUser.id)}
               style={{
                 background: 'url(' + img + ') 50% 50% / cover no-repeat'
               }}/>
          <div className="cmt-content">
            <div className="nd-cmt">
              <span className="name-user no-action user-fullname"
                    onClick={() => props.onTrackingFriend(message.comments[0].idUser.id)}
              >
                {message.comments[0].idUser.fullname + ': '}
              </span>
              <span>{message.comments[0].message}</span>
            </div>
            <div className="btn-reply">
              <span className="pull-left">{message.comments[0].createdAt}</span>
            </div>
          </div>
        </div>
    }
  }
  return(
    <div className="list-status-user">
      <div className="list-status-content">
        <div className="left-status">
          <Link
            to={urlOnPage.post.postViewPage + functionCommon.createSlug(message.name) + '-' + message.id + '.html'}
            onClick={() => props.onClickToPost(message.id)} className="primary-color"
          >
            <div className="status-img" style={{
              background:"url("+Constant.linkApi+"/images/"+message.images[0]+"?w=190&h=170)",
              backgroundRepeat:'no-repeat',
              backgroundPosition:'50% 50%',
              backgroundSize:'cover'}}>
            </div>
          </Link>
          <div className="status-img-more">
            {message.images.length>1?
              <Link to="">
              <span>+{_.checkImagesArray(message.images) - 1}</span>
              <img src={Constant.linkServerImage+"/common/icon-img.png"} alt="Image"/>
            </Link>:''}
          </div>
        </div>
        <div className="right-status-wrap">
          <div className="right-status">
            <div style={{width: '100%'}} >
              <h3 style={{float: 'left'}}>
                <Link
                  to={urlOnPage.post.postViewPage + functionCommon.createSlug(message.name) + '-' + message.id + '.html'}
                  onClick={() => props.onClickToPost(functionCommon.createSlug(message.name) + '-' + message.id + '.html')}
                  className="primary-color">{message.name ? message.name : ''}
                </Link>
              </h3>
              { (message.kindPush && message.kindPush == 1  && message.kindCatePush && message.kindCatePush.indexOf(levelCat)  != -1 )  ?
                <img width="30px" height="30px" src={Constant.linkServerImage + '/icon-rv-top.png'} alt="Image"/>
                :
                ''
              }
            </div>
            <div className="price" style={{clear: 'both'}}>{message.price==-1?props.lng.POST_TYPE_CALL:message.price==-2?props.lng.POST_TYPE_NEWS_FEED_NOTIFY:message.price>0?_.format_price(message.price):message.price}</div>
            <div className="status-desc">
              <span>{message.createdAt}</span>
            </div>
            <div className="status-desc">
              <span>{message.address}</span>
            </div>
            <div className="status-address">
              <a className="user-fullname"
                 onClick={() => props.onTrackingFriend(message.userId.id)}
              >{message.userId?message.userId.fullname:'Chưa có dữ liệu'}</a>
            </div>
            {/*<div className="status-address">
              <p>{message.address}</p>
              <p>{props.lng.POST_CREATE_PHONE_HINT} <span>{message.showPhone==1?message.phone:props.lng.HIDDEN_PHONE}</span></p>
            </div>*/}
            <div className="status-desc">
              <p>{_.sliceStringByLength(message.description, 130)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="comments-post">
        <div className="comment-post-header">
          <div className="comments-post-left pull-left">
            <ul>
              <li>{props.lng.POST_LIKE + ' '+message.totalLike}</li>
              <li>{props.lng.POST_COMMENT + ' '+message.totalComment}</li>
            </ul>
          </div>
          {
            message.totalComment > 1 ?
              <div className="comments-post-right pull-right">
                <Link onClick={() => props.onClickToPost(functionCommon.createSlug(message.name) + '-' + message.id + '.html')}>Xem tất cả</Link>
              </div> : ''
          }
        </div>
        <div className="comment-post-body seller-cmt" style={{marginLeft: '-10px',width:'calc(100% + 10px)'}}>
          <div style={{
            width: '100%', minHeight: '1px', overflow: 'hidden', borderTop: message.totalComment > 0 ? '2px solid rgb(233, 233, 233)' :''
          }}>{cpnComment}</div>
        </div>
      </div>
    </div>
  );
}

SearchPostListRow.propTypes = {
  message: PropTypes.object.isRequired
};

export default SearchPostListRow;
