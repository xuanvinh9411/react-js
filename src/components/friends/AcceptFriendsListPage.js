/*
 * Created by TrungPhat on 1/18/2017
 */
import React, {PropTypes} from 'react';
import AcceptFriendListRowPage from './AcceptFriendListRowPage';

const AcceptFriendsListPage=(props)=>{
  let messages=props.message;
  return(
    <div>
      {
        messages.map(message=>
          <AcceptFriendListRowPage
            key={message.id}
            message={message}
            onTrackingFriend={props.onTrackingFriend.bind(this)}
            lng={props.lng}
            acceptFriend={props.acceptFriend.bind(this)}
            removeRequest={props.removeRequest.bind(this)}
          />
        )
      }
    </div>
  );
};

AcceptFriendsListPage.propTypes = {
  messages: PropTypes.array
};

export default AcceptFriendsListPage
