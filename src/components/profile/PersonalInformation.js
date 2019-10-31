/*
* Created by TrungPhat on 1/10/2016
*/

import React, {PropTypes} from 'react';
import {Link} from 'react-router';
let Constants=require('../../services/Constants');
let Session=require('../../utils/Utils');
let Aes=require('../../services/httpRequest');

const PersonalInformation=(props)=>{
  let user=props.user;
  let linkImg=user.avatar?Constants.linkApi+"/images/"+user.avatar:Constants.linkServerImage+"/no_user.png";
  return(
    <div className="profile" >
      <h3 className="primary-color">{props.lng.PROFILE_TITLE_WEB}</h3>
      <div className="profile-content">
        <div className="profile-left">
          <div className="profile-avatar">
            <div className="img-overflow primary-bg" style={{
              background:"url("+linkImg+")",
              backgroundRepeat:'no-repeat',
              backgroundSize:'cover',
              backgroundPosition:'center center'
            }}>
              {/*<img src={user.avatar?Constants.linkApi+"/images/"+user.avatar:Constants.linkServerImage+"/no_user.png"} alt="Avatar"/>*/}
              <div className="sub-img caption" data-toggle="tooltip" data-placement="left">
                <img src={Constants.linkServerImage+"/userPost/icon-img-profile.png"} alt="Img"/>
              </div>
            </div>
          </div>
          <div className="account" style={{display: 'none'}}>
            {/*<p>Số cửa hàng (05)</p>
            <p>Số tin rao ({props.total<10&&props.total>0?'0'+props.total:props.total})</p>*/}
          </div>
        </div>
        <table className="profile-detail">
          <tbody>
            <tr>
              <td className="profile-title">
                <h4>{props.lng.PROFILE_NAME_WEB}</h4>
              </td>
              <td className="profile-address">{user.fullname}</td>
            </tr>
            {
              user.phone ?
                <tr>
                  <td className="profile-title"><h4>{props.lng.PROFILE_PHONE}</h4></td>
                  <td className="profile-address">{user.phone}</td>
                </tr>
              :
                null
            }
            {/*{
              user.email?
                <tr>
                  <td className="profile-title"><h4>{props.lng.REGISTER_HINT_EMAIL}</h4></td>
                  <td className="profile-address">{user.email}</td>
                </tr>
                :
                null
            }*/}
            <tr>
              <td className="profile-title"><h4>{props.lng.PROFILE_HINT_ADDRESS}</h4></td>
              <td className="profile-address">{user.address ? user.address : '-'}</td>
            </tr>
            {
              props.update==true ?
                <tr>
                  <td className="profile-title">&nbsp;</td>
                  <td><p className="profile-update primary-color"><Link to="/cap-nhat-thong-tin" className="primary-color">{props.lng.MY_ACCOUNT_BUTTON_EDIT}</Link></p></td>
                </tr>:null
            }
            <tr>
              <td className="profile-title">&nbsp;</td>
              <td style={{paddingTop:'75px'}}>
                {
                  props.update==true ?
                    ''
                  :
                  props.hiddenButton != true ?
                    props.friend != null ?
                      props.friend.from ==1 && props.friend.status == 0?
                        props.disabledBtn=='disabled' ?
                          <p className="profile-update primary-color">
                            <Link  className="primary-color btn-add-profile">{props.lng.FRIEND_ADDING_WAIT_FOR_COFNIRMATION}</Link>
                          </p>:''
                        :
                        props.friend.from ==2 && props.friend.status == 0?
                          <p className="profile-update primary-color">
                            <Link  className="primary-color btn-add-profile" onClick={()=>props.onAcceptFriend(props.friend.ref)}>{props.lng.FRIEND_BUTTON_ACCEPT}</Link>
                          </p>
                          :
                          ''
                    :
                      props.disabledBtn=='disabled' ?
                        <p className="profile-update primary-color">
                          <Link  className="primary-color btn-add-profile">{props.lng.FRIEND_ADDING_WAIT_FOR_COFNIRMATION}</Link>
                        </p>:
                        <p className="profile-update primary-color">
                          <Link  className="primary-color btn-add-profile" onClick={()=>props.onAddFriend(user.id)}>{props.lng.FRIEND_BUTTON_MAKE_FRIEND}</Link>
                        </p>
                  :
                    ''
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PersonalInformation;
