/*
 * Created by TrungPhat on 18/02/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');

const NotificationListRow =(props)=>{
  let message=props.message;
  let bg=message.status==0?'#edf2fa':'#fff';
  return(
    <div className="_dre anchorContainer" style={{background:bg}}>
      <div>
        <Link
          className="_33e _1_0e"
          onClick={() => {
            let query = props.query;
            query.ref = message.id;
            browserHistory.push(
              {
                pathname:
                  message.kind==1?
                    '/san-pham/'+ functionCommon.createSlug(message.post.name) + '-' + message.post.id + '.html'
                      :
                      message.subKind==1?
                        '/friends-requests'
                        :
                        '/danh-sach-ban-be',
                query: query
              }
            )}}>
          <div className="clearfix" direction="left">
            <div className="_ohe lfloat">
              {
                message.userId.avatar?
                  <div className="_12u1 img bg-shop" style={{
                    background:"url("+Constants.linkApi+'/images/'+message.userId.avatar+")",
                    backgroundRepeat:'no-repeat',
                    backgroundSize:'cover', backgroundPosition:'50% 50%'}}></div>
                  :
                  <div className="_12u1 img bg-shop" style={{
                    background:"url("+Constants.linkServerImage+'no_user.png'+")",
                    backgroundRepeat:'no-repeat',
                  backgroundSize:'cover', backgroundPosition:'50% 50%'}}></div>
              }
            </div>
            <div>
              <div className="_42ef _8u">
                <div className="clearfix" direction="right">
                  <div>
                    <div className="_42ef">
                      <div className="_4l_v">
                        <span>
                          <span className="fwb">{message.userId.fullname}</span>
                          {
                            message.kind==1?
                              message.subKind==1?
                                props.lng.NOTIFICATION_LIKE_POST_WEB+message.post.name
                              :
                                message.subKind==2?
                                  props.lng.NOTIFICATION_COMMENT_POST_WEB+message.post.name
                                :
                                props.lng.NOTIFICATION_REPLY_POST_WEB+message.post.name
                            :
                              message.subKind==1?
                                props.lng.NOTIFICATION_FRIEND_REQUEST
                              :
                                props.lng.NOTIFICATION_FRIEND_ACCEPT
                          }
                        </span>
                        <p>{message.createdAt}</p>
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
  );
}

NotificationListRow.propTypes = {
  message: PropTypes.object.isRequired
};

export default NotificationListRow;
