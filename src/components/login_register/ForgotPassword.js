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
class ForgotPassword extends React.Component{
  initalUser(){
    return {
      id:-1,
      phone: '',
      password:'',
      fullname: '',
      address: '',
      sex:'',
      birthday:'',
      jobs:'',
      nameJob:'',
      email:'',
      avatar:''
    };
  }
  constructor(props, context){
    super(props, context);
    this.state={
      user:this.initalUser,
      error:{},
      isSubmit:false,
      isSubmitLogin:false,
      userLogin:{phoneLogin :'', passwordLogin :''},
      emailFG:'',
      isNumber: false
    }
    this.onChangState=this.onChangState.bind(this);
    this.submitForgot=this.submitForgot.bind(this);
    this.changStateLogin=this.changStateLogin.bind(this);
    this.submitLogin=this.submitLogin.bind(this);
  }

  componentWillReceiveProps(nextProps){
    let type = nextProps.dataMessage.type;
    let result='';
    switch (type){
      case actionType.FORGOT_PASSWORD_SUCCESS:
        result=nextProps.dataMessage.dataUser;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          utils.setTemporaryData('emailForgotPassword', this.state.emailFG);
          if(utils.isEmpty(result.data) && !this.state.isNumber){
            if(confirm(lng.RESET_PASSWORD_CHECK_EMAIL)){
              browserHistory.push('/recover-password');
            }
          }else{
            if(!utils.isEmpty(result.data)){
              if(result.data.message){
                if(confirm(lng.LOGIN_FORGET_PASSWORD_SMS(result.data.message.syntax, result.data.message.gateway))){
                  browserHistory.push('/recover-password');
                }
              }
            }else{
              if(confirm(lng.RESET_PASSWORD_CHECK_EMAIL)){
                browserHistory.push('/recover-password');
              }
            }
          }
          this.setState({isSubmit:false});
        }else{
          if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
            this.submitForgot();
          }else{
            if(result.code == Constants.RESPONSE_CODE_ERROR){
              this.refs.container.error(lng.RESET_NOT_FOUND_EMAIL, `Thông báo.`, {
                closeButton: true,
              });
              this.setState({isSubmit:false});
            }
          }
        }

    }
  }


  /*LOGIN*/
  changStateLogin(e){
    let field=e.target.name;
    let valueField=e.target.value;
    let userLogin=this.state.userLogin;
    let error=this.state.error;
    if(field=='phoneLogin'){
      if(valueField.length==0){
        error[field]=true;
        error[field]=false;
      }else{
        if(valueField.length<=11){
          error[field]=false;
          if(utils.validatePhoneNumber(valueField)!=true){//Số điện thoại nhập vào có các ký tự không phải là số
            error[field]=true;
          }else if(utils.checkPhone(valueField)!=true){
            error[field]=true;
          }else{
            error[field]=false;
          }
        }else{
          error[field]=true;
        }
      }
    }else if(field=='passwordLogin'){
      error[field]=(valueField.length<6||valueField=='');
    }
    userLogin[field]=valueField;
    this.setState({userLogin:userLogin,error:error});
  }
  validatorFormLogin() {
    let error=this.state.error;
    let dataForm=this.state.userLogin;
    let check=true;
    if(dataForm.phoneLogin.length==0){
      error['phoneLogin']=true;
      check=false;
    }else{
      if(dataForm.phoneLogin.length>11){
        error['phoneLogin']=true;
        check=false;
      }else{
        if(utils.validatePhoneNumber(dataForm.phoneLogin)!=true){
          error['phoneLogin']=true;
          check=false;
        }else if(utils.checkPhone(dataForm.phoneLogin)==false){
          error['phoneLogin']=true;
          check=false;
        }
      }
    }
    if(dataForm.passwordLogin.length<6){
      error['passwordLogin']=true;
      check=false;
    }
    this.setState({error:error});
    return check;
  }
  submitLogin(e){
    e.preventDefault();
    if(this.validatorFormLogin()){
      this.setState({isSubmitLogin:true});
      this.props.actions.login(this.state.userLogin);
    }
  }
  /*FORGOT PASSWORD*/
  onChangState(e){
    let field=e.target.name;
    let valueField=e.target.value;
    let emailFG=this.state.emailFG;
    let error=this.state.error;
    if(field=='emailFG'){
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
    emailFG=valueField;
    this.setState({emailFG:emailFG,error:error});
  }
  validatorForm() {
    let error=this.state.error;
    let dataForm=this.state;
    let check=true;

    if(dataForm.emailFG.length==0){
      error['emailFG']=true;
      check=false;
    }else{
      if(utils.validatePhoneNumber(dataForm.emailFG)!=true){
        if(utils.isEmail(dataForm.emailFG)==true){
          if(utils.checkChartEmail(dataForm.emailFG)==true){
            error['emailFG2']=false;
            this.setState({isNumber: false})
          }else{
            error['emailFG2']=true;
            check=false;
          }
        }else{
          error['emailFG2']=true;
          check=false;
        }
      }else if(utils.checkPhone(dataForm.emailFG)==false){
        error['emailFG2']=true;
        check=false;
      }else{
        this.setState({isNumber: true})
      }

    }
    this.setState({error:error});
    return check;
  }
  submitForgot(e){
    if(this.validatorForm()){
      this.setState({isSubmit:true});
      this.props.actions.forgotPassword(this.state.emailFG);
    }
  }

  onBack(){
    browserHistory.push("/");
  }
  search() {
    this.submitForgot();
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
              {/*<div className="navbar-custom-menu">
                <div className="panel-login">
                  <form action="">
                    <FormGroup validationState={this.state.error.phoneLogin?'error':null}>
                      <ControlLabel>{lng.LOGIN_PHONE_HINT}</ControlLabel>
                      <FormControl
                        type="text"
                        className="form-control"
                        name="phoneLogin"
                        value={this.state.userLogin.phoneLogin}
                        onChange={this.changStateLogin}
                      />
                    </FormGroup>
                    <FormGroup validationState={this.state.error.passwordLogin?'error':null}>
                      <ControlLabel>{lng.LOGIN_PASSWORD_HINT}</ControlLabel>
                      <FormControl
                        type="password"
                        className="form-control"
                        name="passwordLogin"
                        value={this.state.userLogin.password}
                        onChange={this.changStateLogin}
                      />
                    </FormGroup>
                    <button className="btn-login primary-color" onClick={!this.state.isSubmitLogin?this.submitLogin:null}
                            disabled={this.state.isSubmitLogin}>{this.state.isSubmitLogin?lng.LOGIN_BEGING_LOGGED_IN:lng.LOGIN_LOGIN_BUTTON}</button>

                  </form>
                </div>
                <div className="forgot-password">
                  <Link className="text-left forgot" to="">{lng.LOGIN_FORGET_PASSWORD}</Link>
                </div>
              </div>*/}
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
          <div className="main-forgot-password">
            <div className="forgot-title">
              <h4>{lng.LOGIN_FORGET_PASSWORD}</h4>
            </div>
            <div className="forgot-content">
              <p className="text-center">{lng.LOGIN_FORGET_PASSWORD_MESSAGE}</p>
              <FormGroup validationState={this.state.error.emailFG?'error':null}>
                <FormControl
                  type="email"
                  className="form-control"
                  name="emailFG"
                  onKeyPress={event => {
                    if (event.key === "Enter") {
                      this.search();
                    }
                  }}
                  value={this.state.emailFG}
                  onChange={this.onChangState}
                />
              </FormGroup>
              <HelpBlock>{this.state.error.emailFG?lng.NOT_NULL:''}</HelpBlock>
              <HelpBlock>{this.state.error.emailFG2?lng.LOGIN_FORGET_PASSWORD_MESSAGE_WARNING:''}</HelpBlock>
            </div>
            <div className="forgot-bottom">
              <button className="continue-forgot" onClick={!this.state.isSubmit?this.submitForgot:null}
                    disabled={this.state.isSubmit}>{this.state.isSubmit?lng.RESET_PASSWORD_SENDING:lng.RESET_PASSWORD_NEXT}</button>
              <button onClick={this.onBack} className="cancel">{lng.RESET_PASSWORD_CANCEL}</button>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

ForgotPassword.propTypes={
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
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
