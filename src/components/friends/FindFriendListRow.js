/*
* Created by TrungPhat on 1/16/2017
*/
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';
let Constants=require('../../services/Constants');
let Session=require('../../utils/Utils');
let Aes=require('../../services/httpRequest');

const FindFriendListRow =(props)=>{
  let messages=props.messages;
  let user=Aes.aesDecrypt(localStorage.getItem('user'));
  let cpmSuccess;
  let cpmError;
  let cpmBtn, cpmRQ;
  let linkImg=messages?messages.avatar?Constants.linkApi+"/images/"+messages.avatar:Constants.linkServerImage+"no_user.png":'';
  let span = <span>{messages.province ? messages.province.name : messages.phone}</span>;
  if(typeof messages =='string' && messages!=''){
    cpmError=
      <div className="notfound-error">
        <h4 className="text-center" style={{fontStyle:'italic', fontSize:'16px', color:'red'}}>{props.lng.FRIEND_PHONE_NOT_FOUND}</h4>
        <img src="static/img/404-not-found.png" alt="404 Not Found"/>
      </div>
  }else{
    if(messages){
      if(messages.id){
        if(messages.id!=user.id){
          if(messages.friendStatus){
            if(messages.friendStatus.from==1 && messages.friendStatus.status==0){
              cpmBtn=
                <div className="list-btn-action">
                  <div className="btn-unfriend">
                    <Button bsStyle="link" onClick={()=>props.removeRequest(messages.friendStatus.ref)}>{props.lng.FRIEND_BUTTON_CANCEL}</Button>
                  </div>
                </div>
              cpmSuccess=
                <div className="list-friend-suggest btn-add list-btn-action-search" key={messages.id}>
                  <div className="friend-avatar-img"
                       onClick={()=>props.onTrackingFriend(messages.id)}
                       style={{width:'55px', height:'55px', overflow:'hidden', float:'left', borderRadius:'50%',
                    background:"url("+linkImg+")",
                    backgroundRepeat:'no-repeat',
                    backgroundSize:'cover',
                    backgroundPosition:'50% 50%'}}>
                  </div>
                  <div className="suggest-address">
                    <p><Link onClick={()=>props.onTrackingFriend(messages.id)}>{messages.fullname}</Link></p>
                    <span>{span}</span>
                  </div>
                  {cpmBtn}
                </div>
            }else{
              if((messages.friendStatus.from==1 && messages.friendStatus.status==1)||(messages.friendStatus.from==2 && messages.friendStatus.status==1)){
                cpmBtn=
                  <div className="list-btn-action">
                    <div className="btn-unfriend">
                      <Button bsStyle="link" onClick={()=>props.blockFriend(messages.friendStatus.ref)}>{props.lng.FRIEND_BUTTON_BLOCK}</Button>
                    </div>
                    <div className="btn-unfriend">
                      <Button bsStyle="link" onClick={()=>props.unFriend(messages.friendStatus.ref)}>{props.lng.FRIEND_BUTTON_DELETE}</Button>
                    </div>
                  </div>
                cpmSuccess=
                  <div className="list-friend-suggest btn-add list-btn-action-search" key={messages.id}>
                    <div className="friend-avatar-img" onClick={()=>props.onTrackingFriend(messages.id)} style={{width:'55px', height:'55px', overflow:'hidden', float:'left', borderRadius:'50%',
                      background:"url("+linkImg+")",
                      backgroundRepeat:'no-repeat',
                      backgroundSize:'cover',
                      backgroundPosition:'50% 50%'}}>
                    </div>
                    <div className="suggest-address">
                      <p><Link onClick={()=>props.onTrackingFriend(messages.id)}>{messages.fullname}</Link></p>
                      <span>{span}</span>
                    </div>
                    {cpmBtn}
                  </div>
              }else{
                if(messages.friendStatus.blockFrom==1&&messages.friendStatus.status==-2){
                  cpmBtn=
                    <div className="list-btn-action">
                      <div className="btn-unfriend">
                        <Button bsStyle="link" onClick={()=>props.onUnBlock(messages.friendStatus.ref)}>{props.lng.FRIEND_BUTTON_UNBLOCK}</Button>
                      </div>
                    </div>
                  cpmSuccess=
                    <div className="list-friend-suggest btn-add list-btn-action-search" key={messages.id}>
                      <div className="friend-avatar-img" onClick={()=>props.onTrackingFriend(messages.id)} style={{width:'55px', height:'55px', overflow:'hidden', float:'left', borderRadius:'50%',
                        background:"url("+linkImg+")",
                        backgroundRepeat:'no-repeat',
                        backgroundSize:'cover',
                        backgroundPosition:'50% 50%'}}>
                      </div>
                      <div className="suggest-address">
                        <p><Link onClick={()=>props.onTrackingFriend(messages.id)}>{messages.fullname}</Link></p>
                        <span>{span}</span>
                      </div>
                      {cpmBtn}
                    </div>
                }else{
                  if(messages.friendStatus.blockFrom==2&&messages.friendStatus.status==-2){
                    cpmSuccess=
                      <div className="list-friend-suggest btn-add list-btn-action-search" key={messages.id}>
                        <div className="friend-avatar-img" onClick={()=>props.onTrackingFriend(messages.id)} style={{width:'55px', height:'55px', overflow:'hidden', float:'left', borderRadius:'50%',
                          background:"url("+linkImg+")",
                          backgroundRepeat:'no-repeat',
                          backgroundSize:'cover',
                          backgroundPosition:'50% 50%'}}>
                        </div>
                        <div className="suggest-address">
                          <p><Link onClick={()=>props.onTrackingFriend(messages.id)}>{messages.fullname}</Link></p>
                          <span>{span}</span>
                        </div>
                        {cpmBtn}
                      </div>
                  }else{
                    if(messages.friendStatus.from==2 && messages.friendStatus.status==0){
                      cpmBtn=
                        <div className="list-btn-action">
                          <div className="btn-unfriend">
                            <Button bsStyle="link" onClick={()=>props.acceptFriend(messages.friendStatus.ref)}>{props.lng.FRIEND_BUTTON_ACCEPT}</Button>
                          </div>
                          <div className="btn-unfriend">
                            <Button bsStyle="link" onClick={()=>props.removeRequest(messages.friendStatus.ref)}>{props.lng.FRIEND_BUTTON_CANCEL}</Button>
                          </div>
                        </div>
                      cpmSuccess=
                        <div className="list-friend-suggest btn-add list-btn-action-search" key={messages.id}>
                          <div className="friend-avatar-img" onClick={()=>props.onTrackingFriend(messages.id)} style={{width:'55px', height:'55px', overflow:'hidden', float:'left', borderRadius:'50%',
                            background:"url("+linkImg+")",
                            backgroundRepeat:'no-repeat',
                            backgroundSize:'cover',
                            backgroundPosition:'50% 50%'}}>
                          </div>
                          <div className="suggest-address">
                            <p><Link onClick={()=>props.onTrackingFriend(messages.id)}>{messages.fullname}</Link></p>
                            <span>{span}</span>
                          </div>
                          {cpmBtn}
                        </div>
                    }
                  }
                }
              }
            }
          }else{
            if(props.disabledBtn=='disabled'){
              cpmBtn=
                <div className="list-btn-action">
                  <div className="btn-unfriend">
                    <Button bsStyle="link" disabled>{props.lng.FRIEND_ADDING_WAIT_FOR_COFNIRMATION}</Button>
                  </div>
                </div>
            }else{
              cpmBtn=
                <div className="list-btn-action">
                  <div className="btn-unfriend">
                    <Button bsStyle="link"  onClick={()=>props.addFriend(messages.id)}><i className="fa fa-user-plus"/> {props.textBtn}</Button>
                  </div>
                </div>
            }
            cpmSuccess=
              <div className="list-friend-suggest btn-add list-btn-action-search" key={messages.id}>
                <div className="friend-avatar-img" onClick={()=>props.onTrackingFriend(messages.id)} style={{width:'55px', height:'55px', overflow:'hidden', float:'left', borderRadius:'50%',
                  background:"url("+linkImg+")",
                  backgroundRepeat:'no-repeat',
                  backgroundSize:'cover',
                  backgroundPosition:'50% 50%'}}>
                </div>
                <div className="suggest-address">
                  <p><Link onClick={()=>props.onTrackingFriend(messages.id)}>{messages.fullname}</Link></p>
                  <span>{span}</span>
                </div>
                {cpmBtn}
              </div>
          }
        }else{
          cpmBtn=
            <div className="list-btn-action">
            </div>
          cpmSuccess=
            <div className="list-friend-suggest btn-add list-btn-action-search" key={messages.id}>
              <div className="friend-avatar-img" onClick={()=>props.onTrackingFriend(messages.id)} style={{width:'55px', height:'55px', overflow:'hidden', float:'left', borderRadius:'50%',
                background:"url("+linkImg+")",
                backgroundRepeat:'no-repeat',
                backgroundSize:'cover',
                backgroundPosition:'50% 50%'}}>
              </div>
              <div className="suggest-address">
                <p><Link onClick={()=>props.onTrackingFriend(messages.id)}>{messages.fullname}</Link></p>
                <span>{span}</span>
              </div>
              {cpmBtn}
            </div>
        }
      }
    }
  }

  return(
    <div>
      {cpmError}
      {cpmSuccess}
    </div>
  );
}

export default FindFriendListRow;
