/*
 * Created by TrungPhat on 21/07/2017
 */
import React, {PropTypes} from 'react';
import * as userAction from '../../actions/userAction';
import * as actionType from '../../actions/actionTypes';
import {LoadingTable} from '../controls/LoadingTable';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link,browserHistory} from 'react-router';
import {ToastContainer, ToastMessage} from "react-toastr";
import Footer from '../common/Footer';
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let utils=require('../../utils/Utils')
let lng=utils.changLanguage();
class RegisterActive extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state={
      error:{},
      isSubmit:false,
      idUser: '',
      otp: ''
    }
    this.onChangState=this.onChangState.bind(this);
    this.submitReset=this.submitReset.bind(this);
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  componentWillUnmount(){
    utils.removeTemporaryData('onlyPhone');
  }
  /*FORGOT PASSWORD*/
  onChangState(e){
    let field=e.target.name;
    let valueField=e.target.value;
    let error=this.state.error;
    if(field=='temporaryPassword')
      error[field]=(valueField.length==0);
    this.setState({otp:valueField});
  }

  validatorForm() {
    let error = this.state.error;
    let dataForm = this.state.otp;
    let check = true;
    if (dataForm.length == 0) {
      error['otp'] = true;
      check = false;
    }
    this.setState({error: error});
    return check;
  }

  submitReset(e){
    if(this.validatorForm()){
      let infoRegister = utils.getTemporaryData('infoRegister');
      this.setState({isSubmit:true, idUser: infoRegister.id});
      this.props.actions.activeRegister({idUser: infoRegister.id, otp: this.state.otp});
    }
  }

  onBack(){
    browserHistory.push("/");
  }

  componentWillReceiveProps(nextProps){
    let type = nextProps.dataMessage.type;
    let result='';
    switch (type){
      case actionType.ACTIVE_REGISTER_SUCCESS:
        result=nextProps.dataMessage.dataUser;
        if(result.code == Constants.RESPONSE_CODE_SUCCESS){
          localStorage.setItem('sessionAround',result.data.session);
          let user=Object.assign(utils.getTemporaryData('infoRegister'),result.data.user);
          localStorage.setItem('user',Aes.aesEncrypt(user));
          browserHistory.push('/');
        }else{
          if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
            this.props.actions.activeRegister({idUser: this.state.idUser, otp: this.state.otp});
          }else{
            this.setState({isSubmit:false});
            this.refs.container.error(lng.REGISTER_ACTIVE_OPT_ACTIVE_FALSE, `Thông báo.`, {
              closeButton: true,
            });
          }
        }
        break;
    }
  }
  search() {
    this.submitReset();
  }
  render(){
    //window.scrollTo(0,0);
    $(function() {
      var timer;
      $(window).resize(function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
          $('.main-body').css("min-height", ($(window).height()) + "px" );
        }, 40);
      }).resize();
    });
    return(
      <div className="wrapper login-register">
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
              <h4>{lng.REGISTER_ACTIVE_TITLT}</h4>
            </div>
            <div className="forgot-content">
              <FormGroup validationState={this.state.error.temporaryPassword?'error':null}>
                <FormControl
                  type="text"
                  className="form-control"
                  name="otp"
                  onKeyPress={event => {
                    if (event.key === "Enter") {
                      this.search();
                    }
                  }}
                  placeholder={lng.REGISTER_ACTIVE_OPT_HINT}
                  value={this.state.otp}
                  onChange={this.onChangState}
                />
              </FormGroup>
              <HelpBlock>{this.state.error.otp?lng.REGISTER_ACTIVE_OPT_WARNING:''}</HelpBlock>
              {/*<p><i>{lng.REGISTER_ACTIVE_OPT_DESCRIPTION_EMAIL}</i></p>*/}
            </div>
            <div className="forgot-bottom">
              <p><i>{utils.getTemporaryData('onlyPhone') ? lng.REGISTER_ACTIVE_OPT_DESCRIPTION_PHONE : lng.REGISTER_ACTIVE_OPT_DESCRIPTION_EMAIL}</i></p>
              {/*<Link className="text-left">{lng.REGISTER_ACTIVE_OPT_DESCRIPTION_EMAIL}</Link>*/}
              <div className="btn-action-forgot">
                <button className="continue-forgot" onClick={!this.state.isSubmit?this.submitReset:null}
                        disabled={this.state.isSubmit}>{this.state.isSubmit?lng.RESET_PASSWORD_SENDING:lng.RESET_PASSWORD_NEXT}</button>
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

RegisterActive.propTypes={
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
export default connect(mapStateToProps, mapDispatchToProps)(RegisterActive);
