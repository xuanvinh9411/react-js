/*
 * Created by TrungPhat on 1/20/2017
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';
let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');

const MessagesListRow =(props)=>{
  let message=props.message;
  let userCurrent=Aes.aesDecrypt(localStorage.getItem('user'));
  let cpmMessageTo='';
  if(message.id){
    if(userCurrent.id==message.userFrom.id){
      cpmMessageTo=
        <div className="_1t_p clearfix">
          <div className="_41ud">
            <div className="clearfix _o46 _3erg _3i_m _nd_ direction_ltr text_align_ltr">
              <div className="_3058 _ui9 _hh7 _s1- _52mr _43by _3oh-">
                <div className="_aok">
                  <span className="_3oh- _58nk">{message.message}</span>
                  <div className="card-send-time">
                    <span className="card-send-time__sendTime" style={{color:'#fff'}}>{message.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    }else{
      let linkImg=message.userFrom.avatar?Constants.linkApi+"/images/"+message.userFrom.avatar:Constants.linkServerImage+"no_user.png";
      cpmMessageTo=
        <div className="_1t_p clearfix">
          <div className="_1t_q">
            <div className="_4ldz _1t_r" data-hover="tooltip" data-tooltip-position="left" style={{width: '32px', height: '32px'}}>
              <div className="_4ld- bg-shop"
                   onClick={( ) => props.onTrackingFriend ? props.onTrackingFriend(message.userFrom.id) : null}
                   style={{
                     width: '32px',
                     height: '32px',
                     background:"url("+linkImg+")",
                     backgroundRepeat:'no-repeat',
                     cursor: 'pointer',
                     backgroundSize:'cover', backgroundPosition:'50% 50%',
                     borderRadius: '50%'
                   }}>
                {/*<img className="_4ldz _1t_r" src={message.userFrom.avatar?
                Constants.linkApi+"/images/"+message.userFrom.avatar:Constants.linkServerImage+"no_user.png"} style={{width: '32px', height: '32px'}}/>*/}
              </div>
            </div>
          </div>
          <div className="_41ud">
            {/*<h5 className="_ih3 _-ne"><span className="_3oh-">Duoc</span></h5>*/}
            <div className="clearfix _o46 _3erg _29_7 direction_ltr text_align_ltr">
              <div className="_3058 _ui9 _hh7 _s1- _52mr _3oh-"
                   id="js_1d0">
                <div className="_aok">
                  <span className="_3oh- _58nk">{message.message}</span>
                  <div className="card-send-time">
                    <span className="card-send-time__sendTime" style={{color:'#666'}}>{message.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    }
  }
  return(
    <div>
      {cpmMessageTo}
    </div>
  );
}

MessagesListRow.propTypes = {
  message: PropTypes.object.isRequired
};

export default MessagesListRow;
