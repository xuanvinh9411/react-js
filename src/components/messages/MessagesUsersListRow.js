/*
 * Created by TrungPhat on 1/20/2017
 */
import React, {PropTypes} from 'react';
let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');

const MessagesUsersListRow =(props)=>{
  let messages=props.messages;
  let userCurrent=Aes.aesDecrypt(localStorage.getItem('user'));
  let cpmUserListRow='';
  let styleState={};
  if(messages){
    if(messages.state==1){
      styleState={backgroundColor:'#fff'};
    }else {
      if(messages.userModify){
        if (messages.state == 0 && messages.userModify.id == userCurrent.id) {
          styleState = {backgroundColor: '#fff'};
        } else {
          styleState = {backgroundColor: '#d0f0e4'};
        }
      }
    }
  }
  let cpmDeleteMessage = <div onClick={()=>props.onDeleteMessage(messages.threadId)} className="fa fa-trash btn-trash"/>;
  if(messages.id){
    if(messages.userTo){
      if(userCurrent.id==messages.userTo.id){/* HIEN TAI LA NHAN */
        let linkImgUserFrom="";
        if(messages.userFrom){
          linkImgUserFrom=messages.userFrom.avatar?Constants.linkApi+"/images/"+messages.userFrom.avatar:Constants.linkServerImage+"no_user.png";
        }
        cpmUserListRow=
          <div className="item-user" style={styleState}>
            <a href="javascript:void(0)"
               title={messages.userFrom?messages.userFrom.fullname:''}
               onClick={()=>props.onClickMessages({
                threadId:messages.threadId,
                idTo:messages.userFrom.id,
                state:messages.state,
                increments: messages.increments,
                title:messages.userFrom.fullname})}>
              <div className="friend-avatar-img "
                   style={{
                     width:'43px',
                     height:'43px',
                     overflow:'hidden',
                     float:'left',
                     background:"url("+linkImgUserFrom+")",
                     backgroundRepeat:'no-repeat',
                     backgroundSize:'cover', backgroundPosition:'50% 50%',
                     borderRadius:'50%'}}>
                {/*<img src={messages.userFrom.avatar?Constants.linkApi+"/images/"+messages.userFrom.avatar:Constants.linkServerImage+"no_user.png"}/>*/}
              </div>
              <div className="item-detail-r">
                <h4 className="text-overflow">{messages.userFrom?messages.userFrom.fullname:''}</h4>{/*messages.userFrom.fullname.length>=19?messages.userFrom.fullname.slice(0,16)+'...':*/}
                <p className="text-overflow">{messages.message}</p>
              </div>
            </a>
            {cpmDeleteMessage}
          </div>
      }else{/* HIEN TAI LA GUI*/
        let linkImgUserTo="";
        if(messages.userTo){
          linkImgUserTo=messages.userTo.avatar?Constants.linkApi+"/images/"+messages.userTo.avatar:Constants.linkServerImage+"no_user.png";
        }
        cpmUserListRow=
          <div className="item-user" style={styleState}>
            <a href="javascript:void(0)"
               title={messages.userTo?messages.userTo.fullname:''}
               onClick={()=>props.onClickMessages({
                 threadId:messages.threadId,
                 idTo:messages.userTo.id,
                 state:messages.state,
                 increments:messages.increments,
                 title:messages.userTo.fullname})}>
              <div className="friend-avatar-img"
                   style={{
                     width:'43px',
                     height:'43px',
                     overflow:'hidden',
                     float:'left',
                     background:"url("+linkImgUserTo+")",
                     backgroundRepeat:'no-repeat',
                     backgroundSize:'cover', backgroundPosition:'50% 50%',
                     borderRadius:'50%'}}>
                {/*<img src={messages.userTo.avatar?Constants.linkApi+"/images/"+messages.userTo.avatar:Constants.linkServerImage+"no_user.png"}/>*/}
              </div>
              <div className="item-detail-r">
                <h4 className="text-overflow">{messages.userTo?messages.userTo.fullname:''}</h4>{/*messages.userTo.fullname.length>=19?messages.userTo.fullname.slice(0,16)+'...':*/}
                <p className="text-overflow">{messages.message}</p>
              </div>
            </a>
            {cpmDeleteMessage}
          </div>
      }
    }
  }
  return(
    <div>
      {cpmUserListRow}
    </div>
  );
}

MessagesUsersListRow.propTypes = {
  messages: PropTypes.object.isRequired
};

export default MessagesUsersListRow;
