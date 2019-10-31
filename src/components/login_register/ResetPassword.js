/*
 * Created by TrungPhat on 1/16/2017
 */
import React, {PropTypes} from 'react';
import * as userAction from '../../actions/userAction';
import * as actionType from '../../actions/actionTypes';
import {LoadingTable} from '../controls/LoadingTable';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Combobox from '../controls/Combobox';
import {Link,browserHistory} from 'react-router';
import {ToastContainer, ToastMessage} from "react-toastr";
import Footer from '../common/Footer';
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let utils=require('../../utils/Utils')
let lng=utils.changLanguage();
class ResetPassword extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state={
      error:{},
      isSubmit:false,
      resetPassword:{email:'', password:'', temporaryPassword:'', rePassword:''}
    }
    this.onChangState=this.onChangState.bind(this);
    this.submitReset=this.submitReset.bind(this);
  }
  componentWillMount(){
    if(!utils.getTemporaryData('emailForgotPassword')){
      browserHistory.push('/');
    }else{
      let email = utils.getTemporaryData('emailForgotPassword');
      let resetPassword = this.state.resetPassword;
      resetPassword.email = email;
      this.setState({resetPassword:resetPassword});
    }
  }
  /*FORGOT PASSWORD*/
  onChangState(e){
    let field=e.target.name;
    let valueField=e.target.value;
    let resetPassword=this.state.resetPassword;
    let error=this.state.error;
    if(field=='email'){
      if(valueField.length==0){
        error[field]=true;
        error[field+'2']=false;
      }else{
        error[field]=false;
        if(utils.validatePhoneNumber(valueField)!=true){
          if(utils.isEmail(valueField)==true){
            if(utils.checkChartEmail(valueField)==true){
              error[field+'2']=false;
            }else{
              error[field+'2']=true;
            }
          }else{
            error[field+'2']=true;
          }
        }else {
          if(utils.checkPhone(valueField)==false){
            error[field+'2']=true;
          }else{
            error[field+'2']=false;
          }
        }
      }
    }
    if(field=='password')
      error[field]=(valueField.length>0&&valueField.length<6);
    if(field=='rePassword')
      error[field]=((valueField.length>0&&valueField.length<6)||(valueField!=resetPassword.password));
    if(field=='temporaryPassword')
      error[field]=(valueField.length==0);
    resetPassword[field]=valueField;
    this.setState({resetPassword:resetPassword,error:error});
  }

  validatorForm() {
    let error=this.state.error;
    let dataForm=this.state.resetPassword;
    let check=true;

    if(dataForm.email.length==0){
      error['email']=true;
      check=false;
    }else{
      if(utils.validatePhoneNumber(dataForm.email)!=true){
        if(utils.isEmail(dataForm.email)==true){
          if(utils.checkChartEmail(dataForm.email)==true){
            error['email2']=false;
          }else{
            error['email2']=true;
            check=false;
          }
        }else{
          error['email2']=true;
          check=false;
        }
      }else if(utils.checkPhone(dataForm.email)==false){
        error['email2']=true;
        check=false;
      }else{
        this.setState({isNumber: true})
      }

    }
    if(dataForm.password.length==0){
      error['password']=true;
      check=false;
    }
    if(dataForm.rePassword.length==0){
      error['rePassword']=true;
      check=false;
    }
    if(dataForm.rePassword!=dataForm.password){
      error['rePassword']=true;
      check=false;
    }
    if(dataForm.temporaryPassword.length==0){
      error['temporaryPassword']=true;
      check=false;
    }
    this.setState({error:error});
    return check;
  }

  submitReset(e){
    //e.preventDefault();
    if(this.validatorForm()){
      this.setState({isSubmit:true});
      this.props.actions.changPassword(this.state.resetPassword);
    }
  }

  onBack(){
    browserHistory.push("/");
  }

  componentWillReceiveProps(nextProps){
    let type = nextProps.dataMessage.type;
    let result='';
    switch (type){
      case actionType.CHANGE_PASSWORD_SUCCESS:
        result=nextProps.dataMessage.dataUser;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          browserHistory.push('/login');
          this.setState({isSubmit:false});
        }else{
          if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
            this.props.actions.changPassword(this.state.resetPassword);
          }else{
            this.refs.container.error(lng.RESET_PASSWORD_RESET_PASSWORD_FAILURE, `Thông báo.`, {
              closeButton: true,
            });
            this.setState({isSubmit:false});
          }
        }

    }
  }
  search() {
    this.submitReset();
  }
  render(){
    let style={};
    if(utils.isMobile.any()!=null){
      style={minHeight:utils.getHeight()};
    }else{
      style={minHeight:window.innerHeight+'px'}
    }
    $(function() {
      var timer;
      $(window).resize(function() {
        clearTimeout(timer)
        timer = setTimeout(function() {
          $('.main-body').css("min-height", ($(window).height()) + "px" );
        }, 40);
      }).resize();
    });
    return(
      <div className="wrapper login-register" style={style}>
        <header className="main-header">
          <nav className="navbar navbar-static-top">
            <div className="container-head">
              <div className="navbar-header-logo">
                <Link to="/" className="navbar-logo"><img src="static/img/logo.png"/></Link>
              </div>
            </div>
          </nav>
        </header>
        <hr className="hr-index"/>
        {this.state.isLoading=="true"?<LoadingTable/>:""}
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
        <div className="main-body">
          <div className="main-reset-password main-forgot-password">
            <div className="forgot-title">
              <h4>{lng.RESET_PASSWORD_TITLE_IN_WEB}</h4>
            </div>
            <div className="forgot-content">
              <form onKeyPress={event => {
                if (event.key === "Enter") {
                  this.search();
                }
              }}>
                {/*<FormGroup validationState={this.state.error.email?'error':null}>
                  <FormControl
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder={lng.LOGIN_FORGET_PASSWORD_MESSAGE}
                    value={this.state.resetPassword.email}
                    onChange={this.onChangState}
                  />
                </FormGroup>*/}
                <HelpBlock>{this.state.error.email?lng.NOT_NULL:''}</HelpBlock>
                <HelpBlock>{this.state.error.email2?lng.RESET_PASSWORD_TYPE_EMAIL:''}</HelpBlock>
                <FormGroup validationState={this.state.error.password?'error':null}>
                  <FormControl
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder={lng.RESET_PASSWORD_NEW_PASSWORD}
                    value={this.state.resetPassword.password}
                    onChange={this.onChangState}
                  />
                </FormGroup>
                <HelpBlock>{this.state.error.password?lng.RESET_PASSWORD_NEW_PASSWORD_ERROR:''}</HelpBlock>
                <FormGroup validationState={this.state.error.rePassword?'error':null}>
                  <FormControl
                    type="password"
                    className="form-control"
                    name="rePassword"
                    placeholder={lng.RESET_PASSWORD_RETYPE_NEW_PASSWORD}
                    value={this.state.resetPassword.rePassword}
                    onChange={this.onChangState}
                  />
                </FormGroup>
                <HelpBlock>{this.state.error.rePassword?lng.RESET_PASSWORD_PASSWORD_NOT_MATCH:''}</HelpBlock>
                <FormGroup validationState={this.state.error.temporaryPassword?'error':null}>
                  <FormControl
                    type="text"
                    className="form-control"
                    name="temporaryPassword"
                    placeholder={lng.RESET_PASSWORD_SECURE_CODE}
                    value={this.state.resetPassword.temporaryPassword}
                    onChange={this.onChangState}
                  />
                </FormGroup>
                <HelpBlock>{this.state.error.temporaryPassword?lng.RESET_PASSWORD_SECURE_CODE_ERROR:''}</HelpBlock>
              </form>
            </div>
            <div className="forgot-bottom">
              <Link to="/login-identify" className="text-left">{lng.RESET_PASSWORD_HAVE_OTP}</Link>
              <div className="btn-action-forgot">
                <button className="continue-forgot" onClick={!this.state.isSubmit?this.submitReset:null}
                        disabled={this.state.isSubmit}>{this.state.isSubmit?lng.RESET_PASSWORD_SENDING:lng.RESET_PASSWORD_RESET_BUTTON}</button>
                <button onClick={this.onBack} className="cancel">{lng.RESET_PASSWORD_CANCEL}</button>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

ResetPassword.propTypes={
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
export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
