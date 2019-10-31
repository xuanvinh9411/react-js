/*
 * Created by TrungPhat on 1/17/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';
let Constants =require('../../services/Constants');
let Aes=require('../../services/httpRequest');

const FriendsListRowPage =(props)=>{
  let message=props.message;
  let user=props.user;
  let userId=message.userId;
  let userIdFriend=message.userIdFriend;
  let userCurrent=Aes.aesDecrypt(localStorage.getItem('user'));
  let frName='', btnMess;
  let nameImg='', idUser='',sexUser='';
  if(userId){
    if(userId.id!=user.id){
      frName=userId.fullname;
      idUser=userId.id;
      sexUser=userId.phone
      if(userId.avatar){
        nameImg=Constants.linkApi+"/images/"+userId.avatar;
      }else{
        nameImg=Constants.linkServerImage+'no_user.png';
      }
    }else{
      if(userIdFriend){
        frName=userIdFriend.fullname;
        idUser=userIdFriend.id;
        sexUser=userIdFriend.phone;
        if(userIdFriend.avatar){
          nameImg=Constants.linkApi+"/images/"+userIdFriend.avatar;
        }else{
          nameImg=Constants.linkServerImage+'no_user.png';
        }
      }
    }
  }
  /*ab*/
  btnMess=<div className="btn-unfriend mg1" id="message">
    <Link to={"/messages/"+idUser}>{props.lng.FRIEND_MENU_MESSAGE}</Link>
  </div>
  let id='';
  if(userId){
    if(userCurrent.id==userId.id){
      if(userIdFriend){
        id=userIdFriend.id;
      }
    }else{
      id=userId.id;
    }
  }
  return(
    <div className="list-friend-suggest btn-add" style={{display: props.rsSearch > 0 ? 'none' : 'block'}}>
      <div onClick={() => props.onTrackingFriend(idUser)} className="friend-avatar-img css-bg-df" style={{width:'55px', cursor: 'pointer',height:'55px', overflow:'hidden', float:'left', borderRadius:'50%',background:"url("+nameImg+")",
        backgroundRepeat:'no-repeat',
        backgroundSize:'cover',
        backgroundPosition:'50% 50%'}}>
      </div>
      <div className="suggest-address">
        <p style={{margin:'0px'}}><Link onClick={() => props.onTrackingFriend(idUser)}>{frName}</Link></p>
        <span>{sexUser}</span>
      </div>
      <div className="list-btn-action btn-messages">
        {btnMess}
        <div className="f-action-more">
          <img src={Constants.linkServerImage+"icon-more-2.png"}/>
          <div className="f-action text-center">
            <li>
              <a
                onClick={()=>browserHistory.push('/acoin-transfer/'+id)}
              >{props.lng.FRIEND_MENU_MOVE_COIN}</a></li>
            <li><a onClick={()=>props.unFriend(message.id)}>{props.lng.FRIEND_MENU_CANCEL_FRIEND}</a></li>
            <li><a  onClick={()=>props.blockFriend(message.id)}>{props.lng.FRIEND_MENU_BLOCK}</a></li>
          </div>
        </div>
      </div>
    </div>
  );
}

FriendsListRowPage.propTypes = {
  message: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default FriendsListRowPage;
