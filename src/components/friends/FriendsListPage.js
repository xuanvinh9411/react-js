/*
* Created by TrungPhat on 1/18/2017
*/
import React, {PropTypes} from 'react';
import FriendsListRowPage from './FriendsListRowPage';

const FriendsListPage=(props)=>{
  let messages=props.messages;
  let user=props.user;
  return(
  <div>
    {
      messages.map((message, index)=>
        <FriendsListRowPage
          key={index}
          message={message}
          lng={props.lng}
          onTrackingFriend = {props.onTrackingFriend.bind(this)}
          unFriend={props.unFriend.bind(this)}
          blockFriend={props.blockFriend.bind(this)}
          user={props.user}
          rsSearch={props.rsSearch}
        />
      )
    }
  </div>
  );
};

FriendsListPage.propTypes = {
  messages: PropTypes.array.isRequired
};

export default FriendsListPage
