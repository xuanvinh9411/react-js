/*
 * Created by TrungPhat on 14/02/2017
 */
import React, {PropTypes} from 'react';
import PostListRowPage from './PostListRowPage';

const PostListPage=(props)=>{
  let messages=props.messages;
  return(
    <div className="manage-product">
      {
        messages.map(message=>
          <PostListRowPage
            action = {props.action == false ? false : null}
            pathname={props.pathname?props.pathname:'k'}
            key={message.id}
            message={message}
            lng={props.lng}
            onTrackingFriend = {props.onTrackingFriend?props.onTrackingFriend.bind(this):null}
            url={props.url?props.url:null}
            onHideShowPhone={props.onHideShowPhone?props.onHideShowPhone.bind(this):null}
            onDeletePost={props.onDeletePost?props.onDeletePost.bind(this):null}
            trv = {props.trv ? props.trv : null}
          />
        )
      }
    </div>
  );
};

PostListPage.propTypes = {
  messages: PropTypes.array.isRequired
};

export default PostListPage
