/*
 * Created by TrungPhat on 14/02/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
let Constant=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let _=require('../../utils/Utils');
let urlOnPage=require('../../url/urlOnPage');
let functionCommon = require('../common/FunctionCommon');

const noAction = 'javascript:void(0)';
const PostListRowPage =(props)=>{
  let message=props.message;
  let userCurrent=Aes.aesDecrypt(localStorage.getItem('user'));
  let cpnComment ="";
  if(message.comments && message.comments.length > 0){
    if(message.comments[0]){
      let img = message.comments[0].idUser.avatar ? Constant.linkApi + '/images/' + message.comments[0].idUser.avatar : Constant.linkServerImage+'no_user.png';
      cpnComment=
        <div className="bottom-comments">
          <div className="cmt-avatar"
               onClick={() => props.onTrackingFriend?props.onTrackingFriend(message.comments[0].idUser.id):null}
               style={{
                 background: 'url(' + img + ') 50% 50% / cover no-repeat'
               }}/>
          <div className="cmt-content">
            <div className="nd-cmt">
              <span className="name-user" onClick={() => props.onTrackingFriend?props.onTrackingFriend(message.comments[0].idUser.id):null}>
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
    <div id="list-post-u">
      <div className="list-status-user">
        <div className="list-status-content">
          <div className="left-status">
            <Link  to={"/san-pham/"+ functionCommon.createSlug(message.name) + '-' + message.id + '.html'} className="primary-color">{/*<img src={Constant.linkApi+"/images/"+message.images[0]}/>*/}
              <div className="status-img" style={{
                background:"url("+Constant.linkApi+"/images/"+message.images[0]+")",
                backgroundRepeat:'no-repeat',
                backgroundSize:'cover'}}>
              </div>
            </Link>
            <div className="status-img-more">
              {message.images.length>1? <a href="#"><span>+{_.checkImagesArray(message.images) - 1}</span>
                <img src={Constant.linkServerImage+"/common/icon-img.png"}/></a>:''}
            </div>
          </div>
          <div className="right-status-wrap">
            <div className="right-status">
              <h3><Link  to={"/san-pham/"+ functionCommon.createSlug(message.name) + '-' + message.id + '.html'}
                         className="primary-color text-overflow" title={message.name} style={{width:'95%'}}>{message.name}</Link></h3>
              <div className="price">{message.price==-1?props.lng.POST_TYPE_CALL:message.price==-2?
                props.lng.POST_TYPE_NEWS_FEED_NOTIFY:message.price>0?_.format_price(message.price):message.price}</div>
              <div className="status-desc">
                <span>{message.createdAt}</span>
                <p>
                  <a style={{cursor: 'pointer',color: '#8b8b8b',fontWeight: 600}}
                     onClick={
                       () =>
                         props.pathname.indexOf(urlOnPage.shop.shopView) < 0 ?
                           !props.trv ?
                             props.message.idShop ?
                               browserHistory.push(urlOnPage.shop.shopView + functionCommon.createSlug(message.idShop.name) + '-' + message.idShop.id + '.html')
                               :
                               null
                             :
                             null
                           :
                           null
                     }
                     target="_blank"
                  >{
                    !props.trv ?
                      message.idShop ?
                        message.idShop.name
                        : props.lng.NEWS_FEED_RAOVAT
                      /*message.userId ?
                        message.userId.fullname
                      :
                        ''*/
                      : props.lng.NEWS_FEED_RAOVAT}</a>
                </p>
              </div>
              <div className="status-desc">
                <p>{_.sliceStringByLength(message.description, 130)}</p>
              </div>
              {props.pathname!="/thong-tin-ca-nhan" ? message.userId.id == (userCurrent && userCurrent.id ? userCurrent.id : null )?<div className="status-ads">
                <p><Link to={"/advertisement/"+message.id} className="primary-color">{props.lng.POST_BUTTON_ADS}</Link></p>
              </div>:'':''
              }
              {
                message.userId.id == (userCurrent && userCurrent.id ? userCurrent.id : null ) ?
                  <div className="icon-report" style={{
                    display: props.action == false ? 'none' : ''
                  }}>
                    <img src={Constant.linkServerImage+"/userPost/icon-more.png"}/>
                    <div className="status-report text-center">
                      {message.idShop?<li><Link to={"/post/"+message.idShop.id+"/edit/"+message.id}>{props.lng.POST_ACTION_EDIT}</Link></li>:
                        <li><Link to={"/user/post/"+message.id}>{props.lng.POST_ACTION_EDIT}</Link></li>
                      }
                      {/*<li><Button onClick={()=>props.onHideShowPhone(message)}>Ẩn/hiện số ĐT</Button></li>*/}
                      <li><a  className="" onClick={()=>props.onDeletePost(message)}>{props.lng.POST_ACTION_DELETE}</a></li>
                    </div>
                  </div>:''
              }
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
                  <Link to={"/san-pham/"+ functionCommon.createSlug(message.name) + '-' + message.id + '.html'}>Xem tất cả</Link>
                </div> : ''
            }
          </div>
          <div className="comment-post-body seller-cmt" style={{marginLeft: '-10px', width:'calc(100% + 10px)'}}>
            <div style={{
              width: '100%', minHeight: '1px', overflow: 'hidden', borderTop: message.totalComment > 0 ? '2px solid rgb(233, 233, 233)' :''
            }}>{cpnComment}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

PostListRowPage.propTypes = {
  message: PropTypes.object.isRequired
};

export default PostListRowPage;
