/*
 * Created by TrungPhat on 17/02/2017
 */
import React, {PropTypes} from 'react';
import SearchPostListRow from './SearchPostListRow';

const SearchPostList=(props)=>{
  let messages=props.messages;
  return(
    <div className="manage-product">
      {
        messages.map(message=>
          <SearchPostListRow
            key={message.id}
            message={message}
            lng={props.lng}
            onClickToPost = {props.onClickToPost.bind(this)}
            onTrackingFriend={props.onTrackingFriend.bind(this)}
            levelCat={props.levelCat}
          />
        )
      }
    </div>
  );
};

SearchPostList.propTypes = {
  messages: PropTypes.array.isRequired
};

export default SearchPostList
