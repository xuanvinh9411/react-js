/*
* Created by TrungPhat on 1/18/2017
*/
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';
let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');

const AcceptFriendListRowPage =(props)=>{
  let message=props.message;
  let user=Aes.aesDecrypt(localStorage.getItem('user'));
  let userId=message.userId;
  let userIdFriend=message.userIdFriend;
  let frName='', cpmUserID;
  let nameImg='', idUser='',sexUser='';
  if(user.id!=userId.id){
    frName=userId.fullname;
    idUser=userId.id;
    sexUser=userId.sex==1?props.lng.SEX_MALE:userId.sex==2?props.lng.SEX_FEMALE:props.lng.SEX_OTHER;
    if(userId.avatar){
      nameImg=Constants.linkApi+"/images/"+userId.avatar;
    }else{
      nameImg=Constants.linkServerImage+'no_user.png';
    }
    cpmUserID= <div className="list-friend-suggest btn-add">
      <div className="friend-avatar-img" onClick={() => props.onTrackingFriend(userId.id)} style={{width:'55px', height:'55px', overflow:'hidden', float:'left', borderRadius:'50%',background:"url("+nameImg+")",
        backgroundRepeat:'no-repeat',
        backgroundSize:'cover',
        backgroundPosition:'50% 50%'}}>
      </div>
      <div className="suggest-address">
        <p><Link onClick={() => props.onTrackingFriend(userId.id)}>
          {frName}
        </Link></p>
        <span>{sexUser}</span>
      </div>
      <div className="list-btn-action">
        <div className="btn-unfriend">
          <Button bsStyle="link" onClick={()=>props.acceptFriend(message.id)}>{props.lng.FRIEND_BUTTON_ACCEPT}</Button>
        </div>
        <div className="btn-unfriend">
          <Button bsStyle="link" onClick={()=>props.removeRequest(message.id)}>{props.lng.FRIEND_BUTTON_CANCEL}</Button>
        </div>
      </div>
    </div>
  }else{
    frName=userIdFriend.fullname;
    idUser=userIdFriend.id;
    sexUser=userIdFriend.sex==1?props.lng.SEX_MALE:userId.sex==2?props.lng.SEX_FEMALE:props.lng.SEX_OTHER;
    if(userIdFriend.avatar){
      nameImg=Constants.linkApi+"/images/"+userIdFriend.avatar;
    }else{
      nameImg=Constants.linkServerImage+'no_user.png';
    }
    cpmUserID= <div className="list-friend-suggest btn-add">
      <div className="friend-avatar-img" style={{width:'55px', height:'55px', overflow:'hidden', float:'left', borderRadius:'50%'}}>
        <div className="friend-avatar-img" onClick={() => props.onTrackingFriend(userIdFriend.id)} style={{width:'55px', height:'55px', overflow:'hidden', float:'left', borderRadius:'50%',background:"url("+nameImg+")",
          backgroundRepeat:'no-repeat',
          backgroundSize:'cover',
          backgroundPosition:'50% 50%'}}>
        </div>
      </div>
      <div className="suggest-address">
        <p><Link onClick={() => props.onTrackingFriend(userIdFriend.id)}>
          {frName}
        </Link></p>
        <span>{sexUser}</span>
      </div>
      <div className="list-btn-action">
        <div className="btn-unfriend">
          <Button bsStyle="link" onClick={()=>props.acceptFriend(message.id)}>{props.lng.FRIEND_BUTTON_ACCEPT}</Button>
        </div>
        <div className="btn-unfriend">
          <Button bsStyle="link">{props.lng.FRIEND_BUTTON_CANCEL}</Button>
        </div>
      </div>
    </div>
  }
  return(
   <div>
     {cpmUserID}
   </div>
  );
}

AcceptFriendListRowPage.propTypes = {
  message: PropTypes.object.isRequired
};

export default AcceptFriendListRowPage;
