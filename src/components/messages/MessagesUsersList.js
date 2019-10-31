/*
 * Created by TrungPhat on 1/20/2017
 */
import React, {PropTypes} from 'react';
import MessagesUsersListRow from './MessagesUsersListRow';

const MessagesUsersList=(props)=>{
  let messages=props.messages;
  return(
    <div>
      {
        messages.map(item=>
          <MessagesUsersListRow
            messages={item}
            onDeleteMessage={props.onDeleteMessage.bind(this)}
            key={item.id}//
            onClickMessages={props.onClickMessages.bind(this)}
          />
        )
      }
    </div>
  );
};

MessagesUsersList.propTypes = {
  messages: PropTypes.array.isRequired
};

export default MessagesUsersList;
