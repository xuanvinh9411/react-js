/*
*  Created by TrungPhat on 1/16/2017
*/
import React,{PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as userAction from '../../actions/userAction';
import * as actionType from '../../actions/actionTypes';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';
import FindFriendListRow from './FindFriendListRow';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Helmet} from "react-helmet";
import {ToastContainer, ToastMessage} from "react-toastr";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let utils=require('../../utils/Utils')

class FindFriendPage extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state= {
      phone: '',
      error: {},
      isSubmit: false,
      isAccept:false,
      message:{},
      user: Aes.aesDecrypt(localStorage.getItem('user')),
      textBtn:this.props.lng.FRIEND_BUTTON_MAKE_FRIEND,
      disabledBtn:'',
      isAddFriend: false,
      isBlock:false,
      isUnFriend:false
    }
    this.submitFind=this.submitFind.bind(this);
    this.updateState=this.updateState.bind(this);
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  updateState(e){
    let field=e.target.name;
    let valueField=e.target.value;
    let phone=this.state.phone;
    let error=this.state.error;
    if(field=='phone'){
      if(valueField.length==0){
        error[field]=true;
        error[field+'2']=false;
      }else{
        error[field]=false;
        if(utils.checkPhone(valueField)!=true){
          error[field+'2']=true;
        }else{
          error[field+'2']=false;
        }
      }
    }
    phone=valueField;
    this.setState({phone:phone,error:error});
  }

  validatorForm() {
    let error=this.state.error;
    let dataForm=this.state.phone;
    let check=true;

    if(dataForm.length==0){
      error['phone']=true;
      check=false;
    }else{
      if(utils.checkPhone(dataForm)==false){
        error['phone2']=true;
        check=false;
      }
    }
    this.setState({error:error});
    return check;
  }

  submitFind(e){
    e.preventDefault();
    if(this.validatorForm()){
      this.setState({isSubmit:true, disabledBtn:'', textBtn:this.props.lng.FRIEND_BUTTON_MAKE_FRIEND});
      this.props.actions.findFriend(this.state.phone);
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result={};
      switch (type){
        case actionType.FIND_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataUser;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
              this.setState({message: result.data, isSubmit: false});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.actions.findFriend(this.state.phone);
            }else{
              this.setState({message: this.props.lng.FRIEND_NO_RESULT, isSubmit: false});
            }
          }
          break;
        case actionType.ADD_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataUser;
          if(result.code==204){
            if(this.state.isAddFriend){
              this.props.toastMessage.error(this.props.lng.FRIEND_ADDING_WAIT_FOR_COFNIRMATION, `Thông báo.`, {
                closeButton: true,
              });
              this.setState({isAddFriend:false});
            }
          }else{
            if(result.code==Constants.RESPONSE_CODE_SUCCESS){
              if(this.state.isAddFriend){
                this.props.toastMessage.success(this.props.lng.FRIEND_ADD_SUCCESS, `Thông báo.`, {
                  closeButton: true,
                });
                this.setState({isAddFriend:false});
              }
              this.setState({textBtn:'', disabledBtn:'disabled'})
            }else{
              if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
                this.props.toastMessage.success(this.props.lng.FAIL_OTP, `Thông báo.`, {
                  closeButton: true,
                });
              }
            }
          }
          break;
        case actionType.UNFRIEND_SUCCESS:
          result=nextProps.dataMessage.dataFriend;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(this.state.isUnFriend){
              this.props.toastMessage.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
                closeButton: true,
              });
              this.setState({phone:'', isUnFriend:false,message:'', disabledBtn:'', textBtn:this.props.lng.FRIEND_BUTTON_MAKE_FRIEND});
            }
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.toastMessage.success(this.props.lng.FAIL_OTP, `Thông báo.`, {
                closeButton: true,
              });
            }else{
              if(this.state.isUnFriend){
                this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                  closeButton: true,
                });
                this.setState({isUnFriend:false});
              }
            }
          }
          break;
        case actionType.BLOCK_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataFriend;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(this.state.isBlock){
              this.props.toastMessage.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
                closeButton: true,
              });
              this.setState({phone:'', message:'', isBlock:false});
            }
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.toastMessage.success(this.props.lng.FAIL_OTP, `Thông báo.`, {
                closeButton: true,
              });
            }else{
              if(this.state.isBlock){
                this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                  closeButton: true,
                });
                this.setState({isBlock:false});
              }
            }
          }
          break;
        case actionType.UNBLOCK_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataFriend;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(this.state.isUnFriend){
              this.props.toastMessage.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
                closeButton: true,
              });
              this.setState({phone:'', message:'', isUnFriend:false});
            }
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.toastMessage.success(this.props.lng.FAIL_OTP, `Thông báo.`, {
                closeButton: true,
              });
            }else{
              this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
        case actionType.ACCEPT_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataFriend;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.props.toastMessage.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
            this.props.actions.findFriend(this.state.phone);
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.toastMessage.success(this.props.lng.FAIL_OTP, `Thông báo.`, {
                closeButton: true,
              });
            }else{
              this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
        case actionType.TRACKING_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataShops;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            utils.setTemporaryData('infoFriend', result.data);
            browserHistory.push('/detail/'+result.data.user.id);
          }else{
            this.onTrackingFriend(this.state.idFriend);
          }
          break;
      }
    }
  }
  onTrackingFriend(id){
    let user = Aes.aesDecrypt(localStorage.getItem('user'));
    if(user.id == id){
      browserHistory.push('/thong-tin-ca-nhan');
    }else{
      this.setState({idFriend: id});
      this.props.actions.trackingFriend({userIdFriend:id, shopinfo: 1});
    }
  }
  onAcceptFriend(id){
    this.setState({isAccept:true});
    this.props.actions.acceptFriend(id);
  }
  onAddFriend(id){
    this.setState({isAddFriend:true});
    this.props.actions.addFriend(id);
  }

  onUnFriend(id){
    this.setState({isUnFriend:true});
    this.props.actions.unFriend({ref:id});
  }

  onUnBlock(id){
    this.setState({isUnFriend:true});
    this.props.actions.unBlock({id:id});
  }

  onBlockFriend(id){
    this.setState({isBlock:true});
    this.props.actions.blockFriend({ref: id});
  }

  render(){
    return(
      <div className="list-friend">
        <Helmet
          title="Tìm kiếm bạn bè"
        />
        <div className="list-friend-header">
          <form action="">
            <div className="input-group cus-input">
              <input className="form-control input-lg"
                     type="text"
                     placeholder={this.props.lng.FRIEND_REQUEST_PHONE_HINT}
                     value={this.state.phone}
                     name="phone"
                     onChange={this.updateState}/>
            </div>
            <div className="form-right">
              <button className="continue-forgot" onClick={!this.state.isSubmit?this.submitFind:null}
                      disabled={this.state.isSubmit||this.state.phone.length==0}>{this.state.isSubmit?this.props.lng.SEARCH_BUTTON_SEARCHING:this.props.lng.FRIEND_REQUEST_BUTTON_SEARCH}</button>
            </div>
          </form>
        </div>
        {this.state.error.phone?<HelpBlock>{this.props.lng.NOT_NULL}</HelpBlock>:''}
        {this.state.error.phone2?<HelpBlock>{this.props.lng.REGISTER_VALIDATE_PHONE}</HelpBlock>:''}
        <div className="desc-text" style={{width:'100%'}}>
          <p className="primary-color">{this.props.lng.FRIEND_RESULT_FOR}{this.state.phone}</p>
        </div>
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
        <FindFriendListRow
          messages={this.state.message}
          addFriend={this.onAddFriend.bind(this)}
          acceptFriend={this.onAcceptFriend.bind(this)}
          textBtn={this.state.textBtn}
          disabledBtn={this.state.disabledBtn}
          unFriend={this.onUnFriend.bind(this)}
          blockFriend={this.onBlockFriend.bind(this)}
          onUnBlock={this.onUnBlock.bind(this)}
          removeRequest={this.onUnFriend.bind(this)}
          lng={this.props.lng}
          onTrackingFriend = {this.onTrackingFriend.bind(this)}
        />
      </div>
    );
  }
}

FindFriendPage.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.userReducer,
    data:PropTypes.array
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(FindFriendPage);
