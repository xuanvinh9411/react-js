/*
 * Created by TrungPhat on 1/20/2017
 */
import React, {PropTypes} from 'react';
import MessagesListRow from './MessagesListRow';

const MessagesList=(props)=>{
  let messages=props.messages;
  return(
    <div id="messagewindow">
      {
        messages.map((item, index)=>
          <MessagesListRow
            message={item}
            key={index}
            onTrackingFriend = {props.onTrackingFriend ?  props.onTrackingFriend.bind(this) : null}
          />
        )
      }
    </div>
  );
};

MessagesList.propTypes = {
  messages: PropTypes.array.isRequired
};

export default MessagesList
