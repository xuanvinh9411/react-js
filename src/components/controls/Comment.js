/**
 * Created by THIPHUNG on 12/5/2016.
 */

import React, {PropTypes} from 'react';
let Constants=require('../../services/Constants');
let _=require('../../utils/Utils');
export const Comment =(props)=> {
  let messages=props.messages;
  return (

    <div>
      {messages.map(message =>

          <div className="box-comment" key={message.id}>

            <img className="img-circle img-sm" src={message.user_id.avatar?Constants.linkApi+'/images/'+message.user_id.avatar:Constants.linkServerImage+'no_user.png'} alt="User Image"/>

            <div className="comment-text">
                      <span className="username">
                        {message.user_id.fullname}
                        <span className="text-muted pull-right">{message.createdAt}</span>
                      </span>
              {message.message}
              {(_.getUserByKey('id')==message.user_id.id)?(<a href="#" onClick={(event)=>props.deleteComment(event,message.id)} className="pull-right red"> <i className="fa fa-remove"></i></a>):''}
            </div>
          </div>)}
    </div>

  );
};

Comment.propTypes = {
  messages: PropTypes.array.isRequired
};

export default Comment;
