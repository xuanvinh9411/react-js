/*
 * Created by TrungPhat on 1/17/2017
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';

const FriendListRow =(props)=>{
  let messages=props.messages;
  return(
    <div>
      {
        messages.map(item=>
          <div className="list-friend-suggest btn-add" key={item.id}>
            <img src="static/img/userPost/img-a.png"/>
            <div className="suggest-address">
              <p style={{margin:'0px'}}><Link to={'/thong-tin-ca-nhan/'+ item.id}>{item.fullname}</Link></p>
              <span>{item.sex==1?'Nam':tem.sex==2?'Nữ':'Khác'}</span>
            </div>
            <div className="btn-unfriend">
              <Button bsStyle="link" onClick={()=>props.unFriend(item.id)}>Hủy kết bạn</Button>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default FriendListRow;
