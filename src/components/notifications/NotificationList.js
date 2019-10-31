/*
 * Created by TrungPhat on 20/05/2017
 */
import React, {PropTypes} from 'react';
import NotificationListRow from './NotificationListRow';

const NotificationList=(props)=>{
  let messages=props.messages;
  return(
    <div className="_33c jewelItemNew">
      {
        messages.map((message, index)=>
          <NotificationListRow
            key={index}
            lng={props.lng}
            message={message}
            query = {props.query}
          />
        )
      }
    </div>
  );
};

NotificationList.propTypes = {
  messages: PropTypes.array.isRequired
};

export default NotificationList
