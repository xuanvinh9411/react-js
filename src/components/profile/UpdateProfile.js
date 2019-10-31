/*
 * Created by TrungPhat on 1/12/2017
 */
import React, {PropTypes} from "react";
import {Link, browserHistory} from 'react-router';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Modal, Glyphicon} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as userAction from '../../actions/userAction';
import * as actionType from '../../actions/actionTypes';
import Combobox from '../controls/Combobox';
import {ToastContainer, ToastMessage} from "react-toastr";
import Dropzone from 'react-dropzone';
import CryptoJS from 'crypto-js';
import AvatarCropper from "../controls/lib";
import {Helmet} from "react-helmet";
let Constants = require('../../services/Constants');
let Session = require('../../utils/Utils');
let Datetime = require('react-datetime');
let Aes = require('../../services/httpRequest');
import '../../../node_modules/react-datetime/css/react-datetime.css';
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
import moment from 'moment';
import LoadingTable from '../controls/LoadingTable';
class UpdateProfile extends React.Component {
  initalUser() {
    return {
      id: -1,
      phone: '',
      password: '',
      passwordSubmit: '',
      fullname: '',
      new_password: '',
      re_password: '',
      address: '',
      sex: '',
      birthday: '',
      jobs: '',
      email: '',
      idProvince: '',
      idDistrict: '',
      province: {},
      district: {},
      avatar: '',
      image_deletes: "",
      identifyNumber: "",
      identifyDate: "",
      identifyProvince :''
    };
  }

  getInitialImg() {
    return {
      cropperOpen: false,
      img: null
    }
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      user: this.initalUser(),
      data: [],
      error: {},
      dataProvince: [],
      dataDistrict: [],
      isSubmit: false,
      isUpload: false,
      isUploaded: true,
      disabledDate: true,
      avatar: this.getInitialImg(),

    }
    this.submitHandler = this.submitHandler.bind(this);
    this.updateState = this.updateState.bind(this);
    this.updateStateNation = this.updateStateNation.bind(this);
    this.onChangeBirthday = this.onChangeBirthday.bind(this);
    this.updateStateJobs = this.updateStateJobs.bind(this);
    this.handleCropAvatar = this.handleCropAvatar.bind(this);
    this.handleRequestHide = this.handleRequestHide.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillMount() {
    if (!Session.checkSession()) {
      browserHistory.push("/login");
    }
    this.props.actions.getNation();
    this.props.actions.getJobs();
    let user = Object.assign(this.initalUser(), Aes.aesDecrypt(localStorage.getItem('user')));
    if (user.province.id) {
      this.props.actions.getNation(user.province.id);
    }
    let avatar = this.state.avatar;
    if (user.avatar.length > 0) {
      avatar.img = Constants.linkApi + '/images/' + user.avatar;
    }
    this.setState({user: user, avatar: avatar});
  }

  componentWillReceiveProps(nextProps) {
    let type = nextProps.dataMessage.type;
    let result = {};
    let users;
    switch (type) {
      case actionType.UPDATE_PROFILE_SUCCESS:
        result = nextProps.dataMessage.userData;
        if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
          if (this.state.isSubmit) {
            let data = Object.assign({}, Aes.aesDecrypt(localStorage.getItem('user')));
            users = Object.assign(data, this.state.user)
            if (users.new_password.length > 0 && users.re_password.length > 0) {
              users.password = CryptoJS.MD5(users.new_password).toString();
            }
            localStorage.setItem('user', Aes.aesEncrypt(users));
            this.props.toastMessage.success(this.props.lng.PROFILE_UPDATE_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
            this.setState({isSubmit: false});
            browserHistory.goBack();
          }
        } else {
          if (result.code == Constants.RESPONSE_CODE_OTP_INVALID) {
            this.props.actions.updateProfile(this.state.user);
          } else {
            if (this.state.isSubmit) {
              this.refs.container.error(this.props.lng.PROFILE_UPDATE_FAILURE, `Thông báo.`, {
                closeButton: true,
              });
              this.setState({isSubmit: false});
            }
          }
        }
        break;
      case actionType.GET_NATION_SUCCESS:
        result = nextProps.dataMessage.nationData;
        if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
          let user = this.state.user;
          user.idProvince = this.state.user.province.id;
          user.idDistrict = this.state.user.district.id;
          this.setState({user: user});
          if (result.data.length > 0) {
            if (result.data[0].kind == 2) {
              this.setState({dataProvince: result.data});
            } else {
              this.setState({dataDistrict: result.data});
            }
          } else {
            this.setState({dataDistrict: [], idDistrict: ''});
            /*this.refs.container.warning(this.props.lng.PROFILE_WARNING_NATION, `Thông báo.`, {
             closeButton: true,
             });*/
          }
        }
        break;
      case actionType.UPIMAGE_SUCCESS:
        result = nextProps.dataMessage.dataUpload;
        if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
          let user = this.state.user;
          user.avatar = result.data[0];
          this.setState({
            user: user,
            isUpload: false,
            isUploaded: false
          });
        }
        else {
          this.setState({
            isUpload: false
          });
          this.refs.container.success(this.props.lng.PROFILE_ERROR_UPLOAD_IMAGES, `Thông báo.`, {
            closeButton: true,
          });
        }
        break;
      case actionType.GET_JOBS_SUCCESS:
        result = nextProps.dataMessage.userData;
        if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
          this.setState({data: Object.assign(this.state.data, result.data)});
        }
        break;
      case actionType.UPLOAD_BASE64_SUCCESS:
        result = nextProps.dataMessage.dataBase64;
        if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
          let user = this.state.user;
          if (this.state.isUpload) {
            user.avatar = result.data[0];
          }
          this.setState({
            user: user,
            isUpload: false
          });
        } else {
          this.setState({
            isUpload: false
          });
          this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
            closeButton: true,
          });
        }
        break;
    }
  }

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
    if (dataForm.birthday.length == 0) {
      error['birthday'] = true;
      check = false;
    }
    if (dataForm.sex.length == 0) {
      error['sex'] = true;
      check = false;
    }
    if (dataForm.jobs.length == 0) {
      error['jobs'] = true;
      check = false;
    }
    /* Nếu input mật khẩu mới được nhập thì mới check*/
    if (dataForm.new_password != '') {
      if (dataForm.passwordSubmit.length > 0) {
        if (dataForm.new_password.length < 6) {
          error['matKhauMoiKoHopLe'] = true;
          check = false;
        } else {
          error['matKhauMoiKoHopLe'] = false;
          if (CryptoJS.MD5(dataForm.new_password).toString() == dataForm.password) {
            error['new_password'] = true;
            check = false;
          }
        }
        if (dataForm.re_password.length < 6) {
          error['matKhauKoHopLe'] = true;
          check = false;
        } else {
          error['matKhauKoHopLe'] = false;
          if (dataForm.re_password != dataForm.new_password) {
            error['matKhauKoKhop'] = true;
            check = false;
          } else {
            if (CryptoJS.MD5(dataForm.re_password).toString() == dataForm.password) {
              error['trungMatKhauSubmit'] = true;
              check = false;
            } else {
              error['trungMatKhauSubmit'] = false;
            }
          }
        }
      } else {
        error.matKhauHTKoDung = true;
        check = false;
      }
    }
    if (dataForm.email.length == 0 && dataForm.phone.length == 0) {
      error.REGISTER_WARNING_PHONE_OR_EMAIL = true;
      check = false;
    } else {
      if (dataForm.phone.length > 11) {
        error['phone2'] = true;
        check = false;
      } else {
        if (dataForm.phone.length > 0) {
          if (Session.validatePhoneNumber(dataForm.phone) != true) {
            error['phone2'] = true;
            check = false;
          } else if (Session.checkPhone(dataForm.phone) == false) {
            error['phone2'] = true;
            check = false;
          }
        }
      }
      if (dataForm.email.length > 0) {
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
    }
    console.log("error error ", error);
    this.setState({error: error});
    return check
  }

  submitHandler(e) {
    e.preventDefault();
    if (this.validatorForm() == true) {
      if (!this.state.error.matKhauHTKoDung) {
        this.setState({isSubmit: true});
        let user = this.state.user;
        if (user.passwordSubmit.length > 0) {
          user.password = CryptoJS.MD5(user.passwordSubmit).toString();
        }
        this.props.actions.updateProfile(user);
      }
    } else {
      this.setState({isSubmit: false})
    }
  }

  updateState(event) {
    const field = event.target.name;
    let valueField = event.target.value;
    let error = this.state.error;
    let newPassword, rePassword;
    let user = this.state.user;
    if (field == 'fullname') {
      if (valueField.length == 0) {
        error[field] = (valueField.length == 0);
        error['fullname2'] = false;
      } else {
        error[field] = false
        error['fullname2'] = valueField.length < 6 || valueField.length > 100;
      }
    }
    if (field == 'new_password') {
      error[field] = ((valueField.length < 6 && valueField.length > 0) || (valueField == user.passwordSubmit));
      newPassword = valueField;
      if (valueField.length < 6) {
        error['matKhauMoiKoHopLe'] = true;
        error[field] = false;
        user.re_password = '';
        user.new_password = '';
        if (valueField.length == 0) {
          error['matKhauMoiKoHopLe'] = false;
          error['matKhauKoHopLe'] = false;
          error['matKhauKoKhop'] = false;
        }
      } else {
        error['matKhauMoiKoHopLe'] = false;
        if (CryptoJS.MD5(valueField).toString() == user.password) {
          error[field] = true;
        } else {
          error[field] = false;
        }
      }
    }
    if (field == 'passwordSubmit') {
      error.matKhauHTKoDung = false;
      //error.matKhauHTKoDung = false;
      //error.passwordSubmit = valueField.length < 6;
      if (CryptoJS.MD5(valueField).toString() != user.password) {
        error.matKhauHTKoDung = true;
      } else {
        error.matKhauHTKoDung = false;
      }

    }
    if (field == 're_password') {
      if (valueField.length < 6) {
        error['matKhauKoHopLe'] = true;
        error['matKhauKoKhop'] = false;
      } else {
        error['matKhauKoHopLe'] = false;
        error['trungMatKhauSubmit'] = false;
        if (valueField != user.new_password && valueField.length != user.new_password.length) {
          error['matKhauKoKhop'] = true;
        } else {
          error['matKhauKoKhop'] = false;
          if (CryptoJS.MD5(valueField).toString() == user.password) {
            error['trungMatKhauSubmit'] = true;
          } else {
            error['trungMatKhauSubmit'] = false;
          }
        }
      }
    }

    if (field == 'birthday') {
      error[field] = valueField.length == 0;
    }

    if (field == 'sex') {
      error[field] = valueField.length == 0;
    }

    user[field] = valueField;
    return this.setState({user: user, error: error});
  }

  updateStateJobs(event) {
    const field = event.target.name;
    let valueField = event.target.value;
    let error = this.state.error;
    let user = this.state.user;
    if (field == 'jobs') {
      error[field] = valueField.length == 0;
    }
    for (var key in this.state.data) {
      if (valueField == this.state.data[key].id) {
        user.jobs = this.state.data[key];
        this.setState({user: user});
      }
    }
  }

  updateStateNation(event) {
    const field = event.target.name;
    let valueField = event.target.value;
    let user = this.state.user;
    let data = [];
    if (field == 'idProvince') {
      data = this.state.dataProvince;
      for (var key in data) {
        if (data[key].id == valueField) {
          user.idProvince = valueField;
          user.province = data[key];
          this.props.actions.getNation(valueField);
          this.setState({user: user});
        }
      }
    } else {
      data = this.state.dataDistrict;
      for (var key in data) {
        if (data[key].id == valueField) {
          user.idDistrict = valueField;
          user.district = data[key];
          this.setState({user: user});
        }
      }
    }
  }


  updateStateNationNoiCap(event) {
    const field = event.target.name;
    let valueField = event.target.value;
    let user = this.state.user;
    let data = [];
    if (field == 'identifyProvince') {
      data = this.state.dataProvince;
      for (var key in data) {
        if (data[key].id == valueField) {
          user.identifyProvince = valueField;
          this.props.actions.getNation(valueField);
          this.setState({user: user});
        }
      }
    } else {
      data = this.state.dataDistrict;
      for (var key in data) {
        if (data[key].id == valueField) {
          user.idDistrict = valueField;
          user.district = data[key];
          this.setState({user: user});
        }
      }
    }
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
      error.birthday = true;
    }
    /*console.lgo()
     let dateCurrent=moment().format('DD/MM/YYYY');
     if(dateCurrent<=user.birthday){
     error.dateError=true;
     }*/
    this.setState({
      user: user, error: error
    });
  }


  onChangeNgayCapCmnd(value) {
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
      user.identifyDate = date;
      error.identifyDate = false;
      if (user.identifyDate != '') {
        error.dateError = false;
      }
    } else {
      error.identifyDate = true;
    }
    /*console.lgo()
     let dateCurrent=moment().format('DD/MM/YYYY');
     if(dateCurrent<=user.birthday){
     error.dateError=true;
     }*/
    this.setState({
      user: user, error: error
    });
  }



  /*onImageDrop(files) {
   if(this.state.user.avatar){
   let user=this.state.user;
   user.image_deletes=user.avatar;
   this.setState({user:user});
   }
   if(files.length>0){
   this.setState({
   isUpload:true
   });
   this.props.actions.uploadImage(files[0]);
   }
   }*/
  onImageDrop(files) {
    if (this.state.user.avatar) {
      if (this.state.user.avatar.length > 0) {
        let user = this.state.user;
        user.image_deletes = [user.avatar];
        this.setState({user: user});
      }
    }
    let avatar = this.state.avatar;
    avatar.img = files[0].preview;
    avatar.cropperOpen = true;
    this.setState({
      avatar: avatar
    });
  }

  handleCropAvatar(dataURI) {
    this.setState({isUpload: true});
    let avatar = this.state.avatar;
    avatar.cropperOpen = false;
    avatar.img = null;
    let data = dataURI.slice(22);
    this.props.actions.uploadBase64(data);
    let post = this.state.user;
    avatar.img = dataURI;
    this.setState({
      avatar: avatar,
      user: post
    });
  }

  handleRequestHide() {
    let avatar = this.state.avatar;
    avatar.cropperOpen = false;
    this.setState({
      avatar: avatar
    })
  }

  render() {
    let dataProvince = this.state.dataProvince;
    let dataDistrict = this.state.dataDistrict;
    let cmpImage = [];
    let nameImg = this.state.user.avatar;
    let cmpUpFile = '';
    if (this.state.isUpload) {
      cmpUpFile = (
        <div className="box-loading coverImage">
          <img src={Constants.linkServerImage + "/loading_7.gif"} style={{marginTop: 50 + 'px', width: 50 + 'px'}}/>
        </div>
      );
    } else {
      if (this.state.user.avatar != '') {
        cmpUpFile = ( <Dropzone
          onDrop={this.onImageDrop.bind(this)}
          multiple={false}
          accept="image/*"
          className='box-img-ava coverImage' data-toggle="tooltip" data-placement="top">
          {this.state.avatar.img ?
            <img src={this.state.avatar.img} alt="" className="img-upload" style={{width: '100%'}}/> : null}
        </Dropzone>);
      } else {
        cmpUpFile = /*Dua anh di crop*/
          <Dropzone
            onDrop={this.onImageDrop.bind(this)}
            multiple={false}
            accept="image/*"
            className="file-up coverImage-Primary" style={{height: 100 + "%"}}>
            <img src={Constants.linkServerImage + "/common/camera.png"} style={{
              width: '30px',
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block'
            }}
            />
          </Dropzone>
      }
    }

    return (
      <div className="update-profile">
        <Helmet
          title="Cập nhật thông tin"
        />
        <h4 className="primary-color"
            style={{paddingBottom: '5px', borderBottom: '3px solid #14b577'}}>{this.props.lng.PROFILE_UPDATE_TITLE}</h4>
        <form className="form-horizontal">
          <div className="box-body" style={{paddingLeft: '35px', paddingBottom: '35px'}}>
            <FormGroup>
              <label className="col-sm-3 control-label pull-left">{this.props.lng.PROFILE_HINT_FULLNAME}</label>
              <div className="col-sm-9 has-feedback">
                <input className="form-control"
                       type="text"
                       value={this.state.user.fullname ? this.state.user.fullname : ''}
                       name="fullname"
                       onChange={this.updateState}/>
                {this.state.error.fullname ? <HelpBlock>{this.props.lng.NOT_NULL}</HelpBlock> : null}
                {this.state.error.fullname2 ? <HelpBlock>{this.props.lng.REGISTER_WARNING_FULLNAME}</HelpBlock> : ''}
              </div>
            </FormGroup>
            <FormGroup>
              <label className="col-sm-3 control-label pull-left">{this.props.lng.PROFILE_AVATAR}</label>
              <div className="FileUpload col-sm-9 has-feedback">
                {this.state.avatar.img != null ? <AvatarCropper
                  onRequestHide={this.handleRequestHide}
                  cropperOpen={this.state.avatar.cropperOpen}
                  onCrop={this.handleCropAvatar}
                  image={this.state.avatar.img}
                  width={320}
                  height={320}
                /> : ""}
                {cmpImage}{cmpUpFile}
              </div>
            </FormGroup>
            <FormGroup>
              <label className="col-sm-3 control-label pull-left">{this.props.lng.PROFILE_HINT_SEX}</label>
              <div className="col-sm-9 has-feedback">
                <select className="form-control"
                        onChange={this.updateState}
                        value={this.state.user.sex}
                        name="sex">
                  <option value="" disabled>{this.props.lng.PROFILE_HINT_SEX}</option>
                  <option value="1">{this.props.lng.SEX_MALE}</option>
                  <option value="2">{this.props.lng.SEX_FEMALE}</option>
                  <option value="-1">{this.props.lng.SEX_OTHER}</option>
                </select>
                {this.state.error.sex ? <HelpBlock>{this.props.lng.NOT_NULL}</HelpBlock> : ''}
              </div>
            </FormGroup>
            <div id="birthday">
              <FormGroup>
                <label className="col-sm-3 control-label pull-left">{this.props.lng.PROFILE_HINT_BIRTHDAY}</label>
                <div className="col-sm-9 has-feedback rdt2">
                  <Datetime
                    value={this.state.user.birthday}
                    dateFormat="DD/MM/YYYY"
                    timeFormat={false}
                    onChange={this.onChangeBirthday.bind(this)}/>
                  <FormControl.Feedback>
                    <Glyphicon glyph="calendar"/>
                  </FormControl.Feedback>
                  {this.state.error.dateError ?
                    <p style={{color: 'red'}}>{this.props.lng.REGISTER_VALIDATE_BIRTHDAY}</p> : ''}
                  {this.state.error.birthday ?
                    <p style={{color: 'red'}}>{this.props.lng.REGISTER_VALIDATE_BIRTHDAY}</p> : ''}
                </div>
              </FormGroup>
            </div>
            <FormGroup>
              <label className="col-sm-3 control-label pull-left">{this.props.lng.PROFILE_PHONE}</label>
              <div className="col-sm-9 has-feedback">
                <input className="form-control"
                       type="text"
                       value={this.state.user.phone}
                       name="phone"
                       disabled="disabled"
                       style={{background: '#fff '}}
                />
              </div>
            </FormGroup>
            <HelpBlock/>
            <FormGroup>
              <label className="col-sm-3 control-label pull-left">{this.props.lng.RESET_PASSWORD_EMAIL}</label>
              <div className="col-sm-9 has-feedback">
                <input className="form-control"
                       type="text"
                       value={this.state.user.email}
                       name="email"
                       disabled="disabled"
                       style={{background: '#fff '}}
                />
              </div>
            </FormGroup>
            <HelpBlock/>
            <FormGroup>
              <label className="col-sm-3 control-label pull-left">{this.props.lng.PROFILE_HINT_ADDRESS}</label>
              <div className="col-sm-9 has-feedback">
                <input className="form-control"
                       type="text"
                       placeholder={this.props.lng.PROFILE_HINT_ADDRESS}
                       value={this.state.user.address ? this.state.user.address : ''}
                       name="address"
                       onChange={this.updateState}/>
              </div>
              <HelpBlock/>
            </FormGroup>
            <FormGroup>
              <label className="col-sm-3 control-label pull-left">{this.props.lng.REGISTER_HINT_JOB}</label>
              <div className="col-sm-9 has-feedback">
                <FormControl componentClass="select"
                             id="select-idProvince"
                             name="jobs"
                             onChange={this.updateStateJobs}
                             value={this.state.user.jobs.id}>
                  <option value="">{this.props.lng.CHOOSE_OPTION}</option>
                  {this.state.data.map(item =>
                    <option key={item.id} value={item.id}>{item.name}</option>)
                  }
                </FormControl>
                {this.state.error.jobs ? <HelpBlock>{this.props.lng.POST_ADS_CREATE_WARNING_JOB}</HelpBlock> : ''}
              </div>
            </FormGroup>
            <FormGroup>
              <label className="col-sm-3 control-label pull-left">{this.props.lng.PROFILE_HINT_PROVINCE}</label>
              <div className="col-sm-9 has-feedback">
                <FormControl componentClass="select"
                             id="select-idProvince"
                             name="idProvince"
                             onChange={this.updateStateNation}
                             value={this.state.user.province.id}>
                  <option value="">{this.props.lng.OPTION_DEFAULT}</option>
                  {dataProvince.map(item =>
                    <option key={item.id} value={item.id}>{item.name}</option>)
                  }
                </FormControl>
              </div>
            </FormGroup>
            {
              this.state.user.province.id != "" ?
                <FormGroup>
                  <label className="col-sm-3 control-label pull-left">{this.props.lng.PROFILE_HINT_DISTRICT}</label>
                  <div className="col-sm-9 has-feedback">
                    <FormControl componentClass="select"
                                 id="select-district"
                                 name="district"
                                 onChange={this.updateStateNation}
                                 value={this.state.user.district.id}>
                      <option value="">{this.props.lng.OPTION_DEFAULT}</option>
                      {dataDistrict.map(item =>
                        <option key={item.id} value={item.id}>{item.name}</option>)
                      }
                    </FormControl>
                    {this.state.error.job ? <HelpBlock>{this.props.lng.NOT_NULL}</HelpBlock> : ''}
                  </div>
                </FormGroup> : null
            }



            <FormGroup>
              <label className="col-sm-3 control-label pull-left">{this.props.lng.REGISTER_HINT_CMND}</label>
              <div className="col-sm-9 has-feedback">
                <input className="form-control"
                       type="text"
                       placeholder={this.props.lng.REGISTER_HINT_CMND}
                       value={this.state.user.identifyNumber ? this.state.user.identifyNumber : ''}
                       name="identifyNumber"
                       onChange={this.updateState}/>
              </div>
              <HelpBlock/>
            </FormGroup>

            <FormGroup>
              <label className="col-sm-3 control-label pull-left">Ngày cấp</label>
              <div className="col-sm-9 has-feedback">
                <Datetime
                  value={this.state.user.identifyDate}
                  dateFormat="DD/MM/YYYY"
                  timeFormat={false}
                  onChange={this.onChangeNgayCapCmnd.bind(this)}/>
              </div>
              <HelpBlock/>
            </FormGroup>


            <FormGroup>
              <label className="col-sm-3 control-label pull-left">{this.props.lng.REGISTER_HINT_CMND_PLACE}</label>
              <div className="col-sm-9 has-feedback">
                <FormControl componentClass="select"
                             id="select-identifyProvince"
                             name="identifyProvince"
                             onChange={this.updateStateNationNoiCap.bind(this)}
                             value={this.state.user.identifyProvince}>
                  <option value="">Chọn nơi cấp</option>
                  {dataProvince.map(item =>
                    <option key={item.id} value={item.id}>{item.name}</option>)
                  }
                </FormControl>
              </div>
              <HelpBlock/>
            </FormGroup>

            <FormGroup>
              <label className="col-sm-3 control-label pull-left">{this.props.lng.PROFILE_HINT_PASSWORD}</label>
              <div className="col-sm-9 has-feedback">
                <input className="form-control"
                       type="password"
                       value={this.state.user.passwordSubmit ? this.state.user.passwordSubmit : ''}
                       name="passwordSubmit"
                       onChange={this.updateState}/>
                {this.state.error.passwordSubmit ? <HelpBlock>{this.props.lng.PROFILE_UPDATE_PASSWORD}</HelpBlock> : ''}
                {this.state.error.matKhauHTKoDung ?
                  <HelpBlock>{this.props.lng.PROFILE_WARNING_PASSWORD}</HelpBlock> : ''}
              </div>
            </FormGroup>
            <FormGroup>
              <label className="col-sm-3 control-label pull-left">{this.props.lng.PROFILE_HINT_NEW_PASSWORD}</label>
              <div className="col-sm-9 has-feedback">
                <input className="form-control"
                       type="password"
                       value={this.state.user.new_password ? this.state.user.new_password : ''}
                       name="new_password"
                       onChange={this.updateState}/>
                {this.state.error.new_password ?
                  <HelpBlock style={{color: 'red', textAlign: 'left', paddingLeft: '6px', fontStyle: 'italic'}}>
                    {this.props.lng.PROFILE_UPDATE_NEW_PASSWORD}</HelpBlock> : ''}
                {this.state.error.matKhauMoiKoHopLe ?
                  <HelpBlock style={{color: 'red', textAlign: 'left', paddingLeft: '6px', fontStyle: 'italic'}}>
                    {this.props.lng.PROFILE_UPDATE_PASSWORD}</HelpBlock> : ''}
              </div>
            </FormGroup>
            <FormGroup>
              <label
                className="col-sm-3 control-label pull-left">{this.props.lng.PROFILE_HINT_RETYPE_NEW_PASSWORD}</label>
              <div className="col-sm-9 has-feedback">
                <input className="form-control"
                       type="password"
                       value={this.state.user.re_password ? this.state.user.re_password : ''}
                       name="re_password"
                       disabled={this.state.user.new_password.length == 0}
                       onChange={this.updateState}/>
                {this.state.error.matKhauKoHopLe ?
                  <HelpBlock style={{color: 'red', textAlign: 'left', paddingLeft: '6px', fontStyle: 'italic'}}>
                    {this.props.lng.PROFILE_HINT_RETYPE_NEW_PASSWORD}</HelpBlock> : ''}
                {this.state.error.matKhauKoKhop ?
                  <HelpBlock style={{color: 'red', textAlign: 'left', paddingLeft: '6px', fontStyle: 'italic'}}>
                    {this.props.lng.PROFILE_WARNING_PASSWORD_NOT_MATCH}</HelpBlock> : ''}
                {this.state.error.trungMatKhauSubmit ?
                  <HelpBlock style={{color: 'red', textAlign: 'left', paddingLeft: '6px', fontStyle: 'italic'}}>
                    {this.props.lng.PROFILE_UPDATE_NEW_PASSWORD}</HelpBlock> : ''}
              </div>
            </FormGroup>
            <br/>
            <br/>
            <div id="pagination">
              <button className="btn-register" onClick={!this.state.isSubmit ? this.submitHandler : null}
                      disabled={this.state.isSubmit || this.state.error.birthday || this.state.error.dateError}>{this.state.isSubmit ? this.props.lng.POST_CREATE_BUTTON_SAVING : this.props.lng.PROFILE_BUTTON_UPDATE}</button>
            </div>
          </div>
        </form>
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
      </div>
    );
  }
}
UpdateProfile.propTypes = {
  actions: PropTypes.object.isRequired,
  data: PropTypes.array
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.userReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
