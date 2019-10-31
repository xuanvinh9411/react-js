/*
 * Created by TrungPhat on 1/11/2017
 */
import React, {PropTypes} from 'react';
import * as userAction from '../../actions/userAction';
import * as actionType from '../../actions/actionTypes';
import {LoadingTable} from '../controls/LoadingTable';
import {Button, ControlLabel, FormControl, Glyphicon, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Combobox from '../controls/Combobox';
import {Link, browserHistory} from 'react-router';
import moment from 'moment';
import '../../../node_modules/react-datetime/css/react-datetime.css';
import {ToastContainer, ToastMessage} from "react-toastr";
import CryptoJS from 'crypto-js';
import Footer from '../common/Footer';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Constants = require('../../services/Constants');
let Aes = require('../../services/httpRequest');
let Session = require('../../utils/Utils')
let Datetime = require('react-datetime');
let lng = Session.changLanguage();
class RegisterPage extends React.Component {
  initalUser() {
    return {
      id: -1,
      phone: '',
      password: '',
      rePassword: '',
      fullname: '',
      // address: '',
      // sex: '',
      // birthday: '',
      // jobs: '',
      // nameJob: '',
      email: '',
      // avatar: '',
      // identifyNumber: '',
      // identifyDate: '',
      // identifyProvince: '',
      // identifyProvinceName: ''
    };
  }

  constructor(props, context) {
    super(props, context);
    let queryRequire = props.location.query.require ? true : false;
    this.state = {
      user: this.initalUser(),
      error: {},
      isSubmit: false,
      isSubmitLogin: false,
      userLogin: {phoneLogin: '', passwordLogin: '', location: [0.0, 0.0]},
      data: [],
      isReady: false,
      isCheck: false,
      identifyProvince: [],
      queryRequire: queryRequire,
      isCheckOtp: 2,


      // isSubmitFacebook: false,
      // isSubmitFacebookLogin: false,
    }
    this.submitHandler = this.submitHandler.bind(this);
    this.updateState = this.updateState.bind(this);
    this.onChangeBirthday = this.onChangeBirthday.bind(this);
    this.onChangeCMMDDate = this.onChangeCMMDDate.bind(this);
    /*Login*/
    this.changStateLogin = this.changStateLogin.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    
    this.responseFacebook = this.responseFacebook.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
  }

  componentWillMount() {
    this.props.actions.getJobs();
    this.props.actions.getNation();
    /*navigator.geolocation.getCurrentPosition(function(location) {
     this.setState({
     userLogin:{phoneLogin :'', passwordLogin :'',location:[location.coords.latitude,location.coords.longitude]}
     });
     }.bind(this));*/
    let options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(this.success, this.error, options);
  }

  success(pos) {
    let userLogin = this.state.userLogin;
    userLogin.location = [pos.coords.latitude, pos.coords.longitude];
    this.setState({userLogin: userLogin});
  };

  error(err) {

  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataMessage) {
      /*Register*/
      if (nextProps.dataMessage.userRegister) {
        let result = nextProps.dataMessage.userRegister;
        if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
          if (result.data.message) {
            if (this.state.isSubmit) {
              if (confirm(lng.REGISTER_SEND_SMS_MESSAGE(result.data.message.syntax, result.data.message.gateway))) {
                localStorage.setItem('sessionAround', result.data.session);
                let user = Object.assign(this.state.user, result.data.user);
                user.password = CryptoJS.MD5(this.state.user.password).toString(),
                  Session.setTemporaryData('infoRegister', user);
                localStorage.setItem('user', Aes.aesEncrypt(user));
                Session.setTemporaryData('onlyPhone', true);
                browserHistory.push('/register-active');
              }
            }
          } else {
            localStorage.setItem('sessionAround', result.data.session);
            let user = Object.assign(this.state.user, result.data.user);
            user.password = CryptoJS.MD5(this.state.user.password).toString(),
              Session.setTemporaryData('infoRegister', user);
            localStorage.setItem('user', Aes.aesEncrypt(user));
            browserHistory.push('/register-active');
          }
          this.setState({isSubmit: false});
        } else {
          if (result.code == Constants.RESPONSE_CODE_OTP_INVALID) {
            this.props.actions.registerUser(this.state.user);
          } else {
            this.setState({isSubmit: false});
            this.refs.container.error(lng.REGISTER_MESSAGE_PHONE_EXIST, `Thông báo.`, {
              closeButton: true,
            });
          }
        }
      }
      /*Login*/
      if (nextProps.dataMessage && nextProps.dataMessage.length > 0) {
        let result = nextProps.dataMessage[0].userLogin;
        if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
          localStorage.setItem('sessionAround', result.data.session);
          let password2 = CryptoJS.MD5(this.state.userLogin.passwordLogin).toString();
          let user = this.initalUser();
          user.password = password2;
          let userSS = Object.assign(user, result.data.user);
          localStorage.setItem('user', Aes.aesEncrypt(userSS));
          Session.setTemporaryData('locationUser', this.state.userLogin.location);
          browserHistory.push('/');
        } else {
          if (result.code == Constants.RESPONSE_CODE_OTP_INVALID) {
            this.setState({isSubmitLogin: false});
          } else {
            this.refs.container.error(lng.LOGIN_LOGIN_ERROR, `Thông báo.`, {
              closeButton: true,
            });
            this.setState({isSubmitLogin: false});
          }
        }
      }
      let type = nextProps.dataMessage.type;
      let result = '';
      switch (type) {
        case actionType.GET_JOBS_SUCCESS:
          result = nextProps.dataMessage.userData;
          if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
            localStorage.setItem('job', Aes.aesEncrypt(Object.assign(this.state.data, result.data)));
            this.setState({data: Object.assign(this.state.data, result.data), isReady: true});
          }
          break;
        case actionType.GET_NATION_SUCCESS:
          result = nextProps.dataMessage.nationData;
          if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
            if (result.data.length > 0) {
              if (result.data[0].kind == 2) {
                this.setState({identifyProvince: result.data});
              }
            } else {
              if (result.code == Constants.RESPONSE_CODE_OTP_INVALID) {
                this.props.actions.getNation();
              } else {
                this.setState({identifyProvince: []});
                this.refs.container.warning(this.props.lng.PROFILE_WARNING_NATION, `Thông báo.`, {
                  closeButton: true,
                });
              }
            }
          }
          break;
      }
    }
  }

  /*Register*/
  validatorForm() {
    let error = this.state.error;
    let dataForm = this.state.user;
    let check = true;

    if (dataForm.fullname.length == 0) {
      error['fullname'] = true;
      check = false;
    } else {
      if (dataForm.fullname.length < 6 && dataForm.fullname.length > 100) {
        error['fullname2'] = true;
        check = false;
      }
    }

    if (dataForm.phone.length == 0) {
      error['phone'] = true;
      check = false;
    } else {
      if (dataForm.phone.length > 11) {
        error['phone2'] = true;
        check = false;
      } else {
        if (Session.validatePhoneNumber(dataForm.phone) != true) {
          error['phone2'] = true;
          check = false;
        } else if (Session.checkPhone(dataForm.phone) == false) {
          error['phone2'] = true;
          check = false;
        }
      }
    }

    // if (dataForm.birthday.length == 0) {
    //   error['birthday'] = true;
    //   check = false;
    // }
    //
    // if (dataForm.sex.length == 0) {
    //   error['sex'] = true;
    //   check = false;
    // }
    //
    // if (dataForm.jobs.length == 0) {
    //   error['jobs'] = true;
    //   check = false;
    // }

    if (dataForm.email.length == 0) {
      error['email2'] = true;
      check = false;
    } else {
      if (Session.isEmail(dataForm.email) == true) {
        if (Session.checkChartEmail(dataForm.email) == true) {
          error['email2'] = false;
        } else {
          error['email2'] = true;
          check = false;
        }
      } else {
        error['email2'] = true;
        check = false;
      }
    }

    if (dataForm.password.length > 0 && dataForm.password.length < 6 || dataForm.password.length == 0) {
      error['password'] = true;
      check = false;
    }
    if (dataForm.rePassword.length > 0 && dataForm.rePassword.length < 6) {
      error['rePassword'] = true;
      check = false;
    }
    if (dataForm.rePassword == 0) {
      error['rePassword2'] = true;
      check = false;
    }
    if (dataForm.rePassword != dataForm.password) {
      error['rePassword2'] = true;
      check = false;
    }
    this.setState({error: error});
    return check;
  }

  submitHandler(e) {
    e.preventDefault();
    if (this.validatorForm()) {
      if (this.state.isCheck) {
        this.setState({isSubmit: true});
        let user = this.state.user;
        let isCheckOtp = this.state.isCheckOtp;
        user.typeOtp = isCheckOtp;
        // let identifyProvince = this.state.identifyProvince;
        // for(let i in identifyProvince){
        //   if(identifyProvince[i].id == user.identifyProvince){
        //     user.identifyProvinceName = identifyProvince[i].name;
        //   }
        // }

        this.props.actions.registerUser(user);
      } else {
        let error = this.state.error;
        error.isCheck = true;
        this.setState({error: error});
      }
    }
  }

  updateState(event) {
    const field = event.target.name;
    let valueField = event.target.value;
    let error = this.state.error;
    let user = this.state.user;
    if (field == 'fullname') {
      if (valueField.length == 0) {
        error[field] = valueField.length == 0;
        error['fullname2'] = false;
      } else {
        error[field] = false;
        error['fullname2'] = valueField.length < 6 || valueField.length > 100;
      }
    }
    if (field == 'phone') {
      if (valueField.length == 0) {
        error[field] = true;
        error[field + '2'] = false;
      } else {
        error.REGISTER_WARNING_PHONE_OR_EMAIL = false;
        if (valueField.length > 11) {
          error[field + '2'] = true;
        } else {
          if (Session.validatePhoneNumber(valueField) != true) {
            error[field + '2'] = true;
          } else {
            error[field] = false;
            if (Session.checkPhone(valueField) != true) {
              error[field + '2'] = true;
            } else {
              error[field + '2'] = false;
            }
          }
        }
      }
    } else if (field == 'password') {
      if (valueField.length < 6 || valueField == '') {
        error[field] = true;
      } else {
        error[field] = false;
      }
    }
    if (field == 'rePassword') {
      error['rePassword2'] = ((valueField.length < 6 && valueField.length > 0) || (valueField != user.password));
    }
    if (field == 'birthday') {
      error[field] = valueField.length == 0;
    }
    if (field == 'email') {
      if (valueField.length == 0) {
        error[field] = true;
        error[field + '2'] = false;
      } else {
        error.REGISTER_WARNING_PHONE_OR_EMAIL = false;
        error[field] = false;
        if (Session.isEmail(valueField) == true) {
          if (Session.checkChartEmail(valueField) == true) {
            error[field + '2'] = false;
          } else {
            error[field + '2'] = true;
          }
        } else {
          error[field + '2'] = true;
        }
      }
    }
    if (field == 'sex') {
      error[field] = valueField.length == 0;
    }
    if (field == 'jobs') {
      if (valueField == '') {
        error[field] = true;
      } else {
        error[field] = false;
      }
    }
    user[field] = valueField;
    return this.setState({user: user, error: error});
  }

  onChangeBirthday(value) {
    let user = this.state.user;
    let error = this.state.error;
    if (moment(value, 'DD/MM/YYYY', true).isValid()) {
      let date = moment(value).format('DD/MM/YYYY');
      let data = [date, moment().format('DD/MM/YYYY')];
      if (Session.compareTwoDate(data) == false) {
        error.dateError = true;
      } else {
        error.dateError = false;
      }
      user.birthday = date;
      error.birthday = false;
      if (user.birthday != '') {
        /*if(user.birthday>=data[1]){
         error.dateError=true;
         }else{

         }*/
        if (!(moment().diff(moment(user.birthday, 'DD/MM/YYYY'), 'years') >= 12 && moment().diff(moment(user.birthday, 'DD/MM/YYYY'), 'years') <= 100)) {
          error.dateError = true;
        } else {
          error.dateError = false;
        }
      }
    } else {
      error.dateError = true;
    }
    this.setState({
      user: user, error: error
    });
  }

  onChangeCMMDDate(value) {
    let user = this.state.user;
    let error = this.state.error;
    if (moment(value, 'DD/MM/YYYY', true).isValid()) {
      let date = moment(value).format('DD/MM/YYYY');
      let data = [date, moment().format('DD/MM/YYYY')];
      if (Session.compareTwoDate(data) == false) {
        error.cmnd_date = true;
      } else {
        error.cmnd_date = false;
      }
      user.cmnd_date = date;
      error.birthday = false;
    } else {
      error.cmnd_date = true;
    }
    this.setState({
      user: user, error: error
    });
  }

  /*Login*/
  changStateLogin(e) {
    let field = e.target.name;
    let valueField = e.target.value;
    let userLogin = this.state.userLogin;
    let error = this.state.error;
    if (field == 'phoneLogin') {
      if (valueField.length == 0) {
        error[field] = true;
        error[field] = false;
      } else {
        if (Session.checkChartPhoneNumber(valueField) != true) {
          error[field] = true;
        } else {
          error[field] = false;
        }
      }
    } else if (field == 'passwordLogin') {
      error[field] = (valueField.length < 6 || valueField == '');
    }
    userLogin[field] = valueField;
    this.setState({userLogin: userLogin, error: error});
  }

  validatorFormLogin() {
    let error = this.state.error;
    let dataForm = this.state.userLogin;
    let check = true;
    if (dataForm.phoneLogin.length == 0) {
      error['phoneLogin'] = true;
      check = false;
    } else {
      if (Session.checkChartPhoneNumber(dataForm.phoneLogin) == false) {
        error['phoneLogin'] = true;
        check = false;
      }
    }
    if (dataForm.passwordLogin.length < 6) {
      error['passwordLogin'] = true;
      check = false;
    }
    this.setState({error: error});
    return check;
  }

  submitLogin(e) {
    e.preventDefault();
    if (this.validatorFormLogin()) {
      this.setState({isSubmitLogin: true});
      this.props.actions.login(this.state.userLogin);
    }
  }

  responseFacebook(response) {
    if (response && response.accessToken){
      this.props.actions.loginFacebook(response);
    }
  }

  responseGoogle(response) {
    if (response && response.tokenId){
      this.props.actions.loginGoogle(response);
    }
  }

  componentDidMount() {
    setTimeout(() => this.onShowConfirm(), 1000);
  }


  onShowConfirm() {
    if (Session.isMobile.iOS()) {
      if (confirm(lng.CONFIRM_APP_IOS)) {
        window.location = Constants.linkAppIOS;
      }
    } else {
      if (Session.isMobile.Android()) {
        if (confirm(lng.CONFIRM_APP_ANDROID)) {
          window.location = Constants.linkAppAndroind;
        }
      }
    }
  }

  onChangeClickOtp () {
    let isCheckOtp = this.state.isCheckOtp;
    isCheckOtp = isCheckOtp == 1 ? 2 : 1;
    this.setState({isCheckOtp: isCheckOtp})
  }


  render() {
    let style = {}, padding = '';
    if (Session.isMobile.any() != null) {
      style = {minHeight: Session.getHeight()};
    } else {
      style = {minHeight: window.innerHeight + 'px'}
    }
    if (Session.isMobile.iOS() == null) {
      padding = '5px';
    }
    $(function () {
      var timer;
      $(window).resize(function () {
        clearTimeout(timer)
        timer = setTimeout(function () {
          $('.main-body').css("min-height", ($(window).height() ) + "px");
          $('.main-body-register').css("margin", "0 auto");
          $('.main-body .panel-register').css("margin-top", ( ($(window).height() - 475  ) / 2 - 5 ) + "px");

        }, 40);
      }).resize();
    });


    return (
      <div className="wrapper login-register" style={style}>
        <header className="main-header main-header-register">
          <nav className="navbar navbar-register-login navbar-static-top">
            <div className="container-head">
              <div className="navbar-header-logo">
                <Link to="/" className="navbar-logo"><img src="static/img/logo.png"/></Link>
              </div>
              <div className="navbar-custom-menu">
                <form action="">
                  <div className="panel-login">
                    <FormGroup validationState={this.state.error.phoneLogin ? 'error' : null}>
                      {/*<ControlLabel>{lng.LOGIN_PHONE_HINT}</ControlLabel>*/}
                      <FormControl
                        type="text"
                        className="form-control"
                        name="phoneLogin"
                        value={this.state.userLogin.phoneLogin}
                        onChange={this.changStateLogin}
                        placeholder="Số điện thoại"
                      />
                    </FormGroup>
                    <FormGroup validationState={this.state.error.passwordLogin ? 'error' : null}>
                      {/*<ControlLabel>{lng.LOGIN_PASSWORD_HINT}</ControlLabel>*/}
                      <FormControl
                        type="password"
                        className="form-control"
                        name="passwordLogin"
                        value={this.state.userLogin.password}
                        onChange={this.changStateLogin}
                        placeholder="Mật khẩu"
                      />
                    </FormGroup>
                    <button className="btn-login primary-color"
                            onClick={!this.state.isSubmitLogin ? this.submitLogin : null}
                            disabled={this.state.isSubmitLogin}>{this.state.isSubmitLogin ? lng.LOGIN_BEGING_LOGGED_IN : lng.LOGIN_LOGIN_BUTTON}</button>

                    <FacebookLogin
                      appId={Constants.FACEBOOK_APP_ID}
                      // autoLoad={true}
                      fields="name,email,picture"
                      // onClick={!this.state.isSubmitLogin ? this.submitLogin : null}
                      scope="public_profile,user_friends,user_actions.books"
                      // cssClass="my-facebook-button-class"
                      cssClass="btn-facebook-login"
                      icon="fa-facebook"
                      textButton=" Facebook"
                      // redirectUri="/"
                      callback={this.responseFacebook} />

                    <GoogleLogin
                      clientId={Constants.GOOGLE_APP_ID}
                      // buttonText=" Login"
                      // autoLoad={true}
                      className="btn-google-login"
                      onSuccess={this.responseGoogle}
                      onFailure={this.responseGoogle}>
                        <i className="fa fa-google" aria-hidden="true"></i>
                        <span> Google</span>
                    </GoogleLogin>

                            
                  </div>
                </form>
                <div className="forgot-password">
                  <Link className="text-left forgot" to="/login-identify">{lng.LOGIN_FORGET_PASSWORD}</Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
        {this.state.isLoading == "true" ? <LoadingTable/> : ""}
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
        <div className="main-body main-body-register">
          <div className="panel-register">
            {this.state.queryRequire ?
              <h6 className="title-register-1" style={{color: 'orange'}}>Bạn cần đăng nhập để sử dụng những tính năng khác của Around</h6>
              : ''
            }
            <h3 className="title-register-1">{lng.REGISTER_TITLE_H3}</h3>
            <form className="form-register">
              <input className="form-control input-lg"
                     type="text"
                     placeholder={lng.REGISTER_HINT_FULLNAME}
                     value={this.state.user.fullname ? this.state.user.fullname : ''}
                     name="fullname"
                     onChange={this.updateState}/>
              {this.state.error.fullname ? <HelpBlock>{lng.NOT_NULL}</HelpBlock> : ''}
              {this.state.error.fullname2 ? <HelpBlock>{lng.REGISTER_WARNING_FULLNAME}</HelpBlock> : ''}

              <input className="form-control input-lg"
                     type="text"
                     placeholder={lng.REGISTER_HINT_PHONE}
                     value={this.state.user.phone ? this.state.user.phone : ''}
                     name="phone"
                     onChange={this.updateState}/>
              {this.state.error.phone ? <HelpBlock>{lng.NOT_NULL}</HelpBlock> : ''}
              {this.state.error.phone2 ? <HelpBlock>{lng.REGISTER_VALIDATE_PHONE}</HelpBlock> : ''}
              {this.state.error.REGISTER_WARNING_PHONE_OR_EMAIL ?
                <HelpBlock>{lng.REGISTER_WARNING_PHONE_OR_EMAIL}</HelpBlock> : ''}
              <input className="form-control input-lg"
                     type="email"
                     placeholder={lng.REGISTER_HINT_EMAIL}
                     value={this.state.user.email ? this.state.user.email : ''}
                     name="email"
                     required
                     onChange={this.updateState}/>
              {this.state.error.email ? <HelpBlock>{lng.NOT_NULL}</HelpBlock> : ''}
              {this.state.error.email2 ? <HelpBlock>{lng.RESET_PASSWORD_TYPE_EMAIL}</HelpBlock> : ''}
              {this.state.error.REGISTER_WARNING_PHONE_OR_EMAIL ?
                <HelpBlock>{lng.REGISTER_WARNING_PHONE_OR_EMAIL}</HelpBlock> : ''}

              <input className="form-control input-lg"
                     type="password"
                     placeholder={lng.REGISTER_HINT_PASSWORD}
                     value={this.state.user.password ? this.state.user.password : ''}
                     name="password"
                     onChange={this.updateState}/>
              {this.state.error.password ? <HelpBlock>{lng.RESET_PASSWORD_NEW_PASSWORD_ERROR}</HelpBlock> : ''}
              <input className="form-control input-lg"
                     type="password"
                     placeholder={lng.REGISTER_HINT_RETYPE_PASSWORD}
                     value={this.state.user.rePassword ? this.state.user.rePassword : ''}
                     name="rePassword"
                     onChange={this.updateState}/>
              {this.state.error.rePassword2 ? <HelpBlock>{lng.REGISTER_WARNING_PASSWORD_NOT_MATCH}</HelpBlock> : ''}
              {this.state.error.rePassword ? <HelpBlock>{lng.NOT_NULL}</HelpBlock> : ''}
              <div className="checkbox cb-dk">
                <div className="squaredFour">
                  <input type="checkbox" className="pull-left"
                         onChange={() => {
                           let isCheck = this.state.isCheck;
                           if (!this.state.isSubmit) {
                             isCheck = !this.state.isCheck;
                           }
                           this.setState({isCheck: isCheck})
                         }}
                         value={this.state.isCheck} id="squaredFour" name="check"/>
                  <label htmlFor="squaredFour" className="pull-left"/>
                  <span>Tôi đồng ý với <a href={Constants.linkDieuKhoan} target="_blank"
                                          style={{color: '#72afd2', textDecoration: 'underline'}}>điều khoản</a> Around</span>
                </div>
                {this.state.error.isCheck ? <HelpBlock style={{
                  clear: 'both',
                  color: 'red'
                }}>{lng.REGISTER_WARNING_CHECK_PLOLICY}</HelpBlock> : ''}
              </div>

              <div className="checkbox cb-dk">
                <div className="squaredFour" onClick={this.onChangeClickOtp.bind(this)}>
                  <input type="checkbox" className="pull-left"

                         checked={this.state.isCheckOtp == 1 ? true: false} name="checkOtp"/>
                  <label  className="pull-left"/>
                  <span>Nhận mã OTP qua Email</span>
                </div>

              </div>

              <div className="checkbox cb-dk">
                <div className="squaredFour" onClick={this.onChangeClickOtp.bind(this)}>
                  <input type="checkbox" className="pull-left"

                         checked={this.state.isCheckOtp == 2 ? true: false}  name="checkOtp"/>
                  <label className="pull-left"/>
                  <span> Nhận mã OTP qua điện thoại </span>
                </div>

              </div>

              <button className="btn-register" onClick={!this.state.isSubmit ? this.submitHandler : null}
                      disabled={this.state.isSubmit || this.state.error.birthday || this.state.error.dateError}>{this.state.isSubmit ? lng.RESET_PASSWORD_SENDING : lng.REGISTER_BUTTON_REGISTER}</button>
            </form>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

RegisterPage.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.userReducer,
    data: PropTypes.array
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
