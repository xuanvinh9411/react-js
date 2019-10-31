/*
 * Created by TrungPhat on 15/02/2017
 */
import React, {PropTypes} from 'react';
import CommentsListRowPage from './CommentsListRowPage';

const CommentsListPage = (props) => {
  let messages = props.messages;
  var cpnComments = [];
  let num = messages.length - 1;
  if (messages != '') {
    for (var i = 0; i < messages.length; i++) {
      if (num >= 0) {
        cpnComments[i] = <CommentsListRowPage
          error={props.error}
          comment={props.comment}
          loadListReply={props.loadListReply.bind(this)}
          onSubmitReplyForComment={props.onSubmitReplyForComment.bind(this)}
          updateStateSubComment={props.updateStateSubComment.bind(this)}
          onShowFormReply={props.onShowFormReply.bind(this)}
          onTrackingFriend={props.onTrackingFriend ? props.onTrackingFriend.bind(this) : null}
          lng={props.lng ? props.lng : null}
          message={messages[num]}
          key={i}
        />
        num--;
      }
    }
  }
  return (
    <div style={{
      display: props.display,
      width: '100%',
      minHeight: '1px',
      overflow: 'hidden',
      borderTop: props.comment.length > 0 ? '2px solid #e9e9e9' : ''
    }}>
      {cpnComments}
    </div>
  );
};

CommentsListPage.propTypes = {
  messages: PropTypes.array.isRequired
};

export default CommentsListPage
