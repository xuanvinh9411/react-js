/*
 * Created by TrungPhat on 15/02/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';
import moment from 'moment';
let Constant=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let Session=require('../../utils/Utils');

class CommentsListRowPage extends React.Component{
  constructor (context, props) {
    super(context, props);
  }
  onFieldChange(event) {
    let idCmt = event.target.name;
    let cmt = event.target.value;
    let idPost = this.props.message.idPost;
    this.props.updateStateSubComment(idPost, idCmt, cmt);
  }
  onSendMessage(e){
    this.props.onSubmitReplyForComment();
  }
  submit(e) {
    this.onSendMessage(e);
  }
  render(){
    let message = this.props.message;
    let linkImg = '';
    let userCurrent = Aes.aesDecrypt(localStorage.getItem('user'));
    if(message != ''){
      if(message.idUser.avatar){
        linkImg = Constant.linkApi + "/images/" + message.idUser.avatar;
      }else{
        linkImg = Constant.linkServerImage+'no_user.png';
      }
    }
    let imfDF = userCurrent ? userCurrent.avatar ? Constant.linkApi + "/images/" + userCurrent.avatar : Constant.linkServerImage+'no_user.png' : Constant.linkServerImage+'no_user.png';
    return(
      <div className="bottom-comments">
        <div className="cmt-avatar" onClick={() => this.props.onTrackingFriend(message.idUser.id)} style={{
          background:"url(" + linkImg + ")",
          backgroundRepeat:'no-repeat',
          cursor: 'pointer',
          backgroundSize:'cover', backgroundPosition:'50% 50%'}}>
        </div>
        <div className="cmt-content">
          <div className="nd-cmt">
            <span className="name-user" onClick={() => this.props.onTrackingFriend(message.idUser.id)}>{message.idUser.fullname}:  </span><span>{message.message}</span>
          </div>
          <div className="btn-reply">
            <span className="pull-left">{message.createdAt}</span>
            <span className="pull-left"
                  style={{
                    display: ''
                  }}
                  onClick={() => this.props.onShowFormReply(message.id, message.idPost)}>{this.props.lng.POST_COMMENT_REPLY}</span>
          </div>
          <div className="total-reply clearfix">
            <span
              onClick={() => {
                let page = 0;
                let sub = this.props.comment.sub;
                if(message.id == sub.idCmt){
                  if(sub.listComment){
                    if(message.totalChid - sub.listComment.length > 0){
                      page = parseInt(sub.page + 1);
                    }
                  }
                }
                this.props.loadListReply(message.idPost, message.id, page);
              }}
              className="pull-left"
              style={{
                padding:'5px 0',
                display:
                  message.totalChid && message.totalChid > 0 ?
                    message.id == this.props.comment.sub.idCmt ?
                      message.totalChid - this.props.comment.sub.listComment.length > 0 ?
                        'block'
                      :
                        'none'
                    :
                      'block'
                  : 'none'
              }}
            >
              {'Xem ' + (message.id == this.props.comment.sub.idCmt ? (message.totalChid - this.props.comment.sub.listComment.length) : message.totalChid) + this.props.lng.POST_COMMENT_REPLY_TOTAL_CHILD}
            </span>
          </div>

          <div className="reply-cmt" style={{
            display: this.props.comment.sub.idCmt == message.id ? 'block' : 'none',
            width: ' 100%',
            minHeight: '1px',
            overflow: 'hidden',
            marginBottom: '5px'
          }}>
            <div className="lists-cmt-reply wrap-default">
              {
                this.props.comment.sub.idCmt == message.id ?
                  this.props.comment.sub.listComment.map((i, idx) =>
                    i.parent == message.id ?
                      <div className="row-cmt-reply wrap-default bd-bt" key={idx} style={{borderBottom: '1px solid #e9e9e9'}}>
                        <div onClick={() => this.props.onTrackingFriend(i.idUser.id)} className="img-cmt-reply pull-left" style={{marginRight: '8px', marginTop: '5px'}}>
                          {
                            i.idUser.avatar ?
                              <div   className="pull-left css-bg-df" style={{
                                background: 'url('+Constant.linkApi + '/images/' + i.idUser.avatar +')',
                                backgroundPosition: 'center center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                width:'25px',
                                height:'25px'
                              }}/>
                            :
                              <div   className="pull-left" style={{
                                background: 'url(' + Constant.linkServerImage+'no_user.png' +')',
                                backgroundPosition: 'center center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                width:'25px',
                                height:'25px'
                              }}/>
                          }
                        </div>
                        <div className="row-cmt-reply pull-left">
                          <div className="nd-reply">
                            <span className="pull-left" onClick={() => this.props.onTrackingFriend(i.idUser.id)}>{i.idUser.fullname + ':'}</span><span className="pull-left">{i.message}</span>
                          </div>
                          <div className="time-reply">
                            <span>{i.createdAt}</span>
                          </div>
                        </div>
                      </div> : null
                ) : null
              }
            </div>
            <div className="form-reply">
              <div className="rl-avatar pull-left" style={{
                background: 'url('+imfDF+')',
                width:'25px',
                height: '25px',
                marginTop:'2px',
                backgroundSize:'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
              }} />
              <input type="text"
                     onKeyPress={event => {
                       if (event.key === "Enter") {
                         this.submit(event);
                       }
                     }}
                     style={{
                       border: this.props.error.subCmt ? '1px solid #dd4b39' : ''
                     }}
                     name = {message.id}
                     value={this.props.comment.sub.cmt}
                     onChange={this.onFieldChange.bind(this)}
                     placeholder={this.props.lng.POST_COMMENT_REPLY_PLACEHOLDER}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CommentsListRowPage.propTypes = {
  message: PropTypes.object.isRequired
};

export default CommentsListRowPage;
