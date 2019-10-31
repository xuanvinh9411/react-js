/*
 * Created by TrungPhat on 09/01/2017
 */
import React, {PropTypes} from 'react';
import SendMessagesListRow from './SendMessagesListRow';

const SendMessagesList=(props)=>{
  let messages=props.messages;
  return(
    <div>
      {
        messages.map(item=>
          <SendMessagesListRow
            message={item}
            key={item.id}
            onTrackingFriend = {props.onTrackingFriend ?  props.onTrackingFriend.bind(this) : null}
          />
        )
      }
    </div>
  );
};

SendMessagesList.propTypes = {
  messages: PropTypes.array.isRequired
};

export default SendMessagesList
