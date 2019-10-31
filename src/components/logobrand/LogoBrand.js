/*
 * Created by TrungPhat on 24/05/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as logoBrandAction from '../../actions/logoBrandAction';
import * as actionTypes from '../../actions/actionTypes';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio, Modal} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AroundMap} from '../controls/AroundMap';
import {ToastContainer, ToastMessage} from "react-toastr";
import Dropzone from 'react-dropzone';
import LoadingTable from '../controls/LoadingTable';
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let Constants=require('../../services/Constants');
let Session=require('../../utils/Utils');
let Aes=require('../../services/httpRequest');
let moment=require('moment');
class LogoBrand extends React.Component{
  getInitialImg(){
    return{
      cropperOpen: false,
      img: null
    }
  }
  getInitialData(){
    return{
      logo:{name:'', status:0},
      image_deletes:[]
    }
  }
  constructor(props, context){
    super(props, context);
    this.state = {
      isSubmit:false,
      isReady:false,
      isUpload:false,
      data:this.getInitialData(),
      image:'',
      markers: [
        {
          position: {
            lat: 10.8230989,
            lng: 106.6296638
          },
          key: Date.now(),
        }
      ],
      isImages:true
    };
    this.onImageDrop=this.onImageDrop.bind(this);
    this.onLoad=this.onLoad.bind(this);
    this.onUpdateLogo=this.onUpdateLogo.bind(this);
  }

  componentWillMount(){
    if(!Session.checkSession()){
      browserHistory.push("/login");
    }else{
      navigator.geolocation.getCurrentPosition(function(location) {
        if(location.coords.latitude!=0&&location.coords.longitude!=0){
          this.setState({isGetLocation:true,currentLocation:true, markers: [
            {
              position: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
              },
              key: Date.now(),
            }
          ]});
        }
      }.bind(this));
      this.setState({isReady:true});
      this.props.actions.getLogo();
    }
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result="";
      switch (type){
        case actionTypes.GET_LOGO_SUCCESS:{
          result=nextProps.dataMessage.data;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let data=Object.assign(this.state.data,result.data);
            data.logo={
              name:result.data.logo?result.data.logo:'',
              status:1
            }
            this.setState({data:data, isReady:false});
          }else{
            this.props.actions.getLogo();
          }
          break;
        }
        case actionTypes.UPIMAGE_SUCCESS:
          result=nextProps.dataMessage.data;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS) {
            let data=this.state.data;
            data.logo.name=result.data[0];
            data.logo.status=0;
            this.setState({
              data:data,
              isUpload:false,
              isImages:false
            });
          }else{
            if(result.code==Constants.RESPONSE_CODE_USER_NOT_FOUND){
              this.refs.container.error(this.props.lng.LOGO_BRAND_MESSAGE_NOT_ENOUGH_MONEY, `Thông báo.`, {
                closeButton: true,
              });
              this.setState({
                isUpload:false
              });
            }else{
              if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
                this.props.actions.updateLogo(this.state.data);
              }else{
                this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                  closeButton: true,
                });
                this.setState({
                  isUpload:false
                });
              }
            }
          }
          break;
        case actionTypes.UPDATE_LOGO_SUCCESS:{
          result=nextProps.dataMessage.data;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.refs.container.success(this.props.lng.LOGO_BRAND_MESSAGE_UPDATE_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
            this.setState({isSubmit:false,isImages:true});
            this.props.actions.getLogo();
          }else{
            this.setState({isSubmit:false});
            this.refs.container.error(this.props.lng.LOGO_BRAND_MESSAGE_UPDATE_FASLE, `Thông báo.`, {
              closeButton: true,
            });
          }
          break;
        }
      }
    }
  }
  onClickMarker(){

  }
  handleMapClick(){

  }

  onUpdateLogo(e){
    e.preventDefault();
    if(this.state.data.logo){
      //if(this.state.data.balance>this.state.data.priceLogo){
        this.setState({isSubmit:true});
        this.props.actions.updateLogo(this.state.data);
      /*}else{
        this.refs.container.error('Số dư tài khoản không đủ', `Thông báo.`, {
          closeButton: true,
        });
      }*/
    }
  }

  onImageDrop(files) {
    if(this.state.data.logo){
      let data=this.state.data;
      data.image_deletes=data.logo.name;
      this.setState({data:data});
    }
    if(files.length>0){
      this.setState({image:files[0]});
    }
  }
  onLoad(e){
    let width=e.target.naturalWidth;
    let height=e.target.naturalHeight;
    if(width==40&&height==40){
      this.setState({isUpload:true});
      this.props.actions.uploadImage(this.state.image);
    }else{
      this.refs.container.error(this.props.lng.LOGO_BRAND_MESSAGE_WRONG_SIZE, `Thông báo.`, {
        closeButton: true,
      });
    }
  }
  render(){
    let cmpImage=[];
    let nameImg=this.state.data.logo;
    let cmpUpFile='';
    if(this.state.isUpload){
      cmpUpFile=(
        <div className="box-loading">
          <img src={Constants.linkServerImage+"loading_7.gif"} style={{width:'50px', paddingTop:'14px'}} />
        </div>
      );
    }else{
      if(this.state.data.logo.name!=''){
        let imgFolder=nameImg.status==1?'/images/':'/tmp/';
        cmpUpFile=( <Dropzone
          onDrop={this.onImageDrop.bind(this)}
          multiple={false}
          accept="image/*"
          className='box-img-ava'>
          <img src={Constants.linkApi+imgFolder+nameImg.name}
               style={{width:'40px'}}
          />
        </Dropzone>);
      }else{
        cmpUpFile=( <Dropzone
          onDrop={this.onImageDrop.bind(this)}
          multiple={false}
          accept="image/*"
          className="file-up">
          <img src={Constants.linkServerImage+"/common/camera.png"} style={{width:'40px'}} />
        </Dropzone>);
      }
    }
    return(
      <div id="display-search" style={{minHeight:'660px '}}>
        <Helmet
          title="Logo thương hiệu"
        />
        <img src={this.state.image.preview} style={{display:'none'}} onLoad={this.onLoad}/>
        {
          this.state.isReady?
            <LoadingTable/>
          :
            <div>
              <div id="logo-brand">
                <div className="form-left">
                  <div className="box-store-logo">
                    <div className="logo-brand-left pull-left" style={{width:'17%'}}>
                      <FormGroup style={{height:100+"%"}} encType="multipart/form-data">
                        <div className="FileUpload" style={{height:100+"%"}}>
                          {cmpImage}{cmpUpFile}
                        </div>
                      </FormGroup>
                    </div>
                    <div className="logo-brand-right pull-left" style={{width:'40%'}}>
                      {/*<p>{this.props.lng.LOGO_BRAND_BALANCE}<span>{Session.format_price(this.state.data.balance) + ' ' + this.props.lng.MOVE_COIN_USER_FROM_MONEY}</span></p>*/}
                      <p>{this.props.lng.LOGO_BRAND_MONEY} <span>{Session.format_price(this.state.data.priceLogo) + ' ' + this.props.lng.MOVE_COIN_USER_FROM_MONEY}</span></p>
                      <p>{this.props.lng.LOGO_BRAND_STATE_DATE_EXPIRED}<span>{this.state.data.expired?this.state.data.expired:'-'}</span></p>
                    </div>
                    <div className="logo-brand-right pull-left" style={{width:'40%'}}>
                      <p>{this.props.lng.LOGO_BRAND_STATUS}<span>{
                          this.state.data.logoState==0?
                            this.props.lng.LOGO_BRAND_STATE_PENDING
                          :
                            this.state.data.logoState==1?
                              this.state.data.logoStatus<=0?
                                this.props.lng.LOGO_BRAND_STATE_EXPIRED
                              :
                                this.props.lng.LOGO_BRAND_STATE_ACTIVE
                            :
                              this.props.lng.LOGO_BRAND_STATE_DEFAULT
                      }</span></p>
                    </div>
                  </div>
                </div>
                <div className="abc">
                  <button type="button"
                          className="btn btn-flat btn-warning btn-search pull-right"
                          style={{marginTop:'30px'}}
                          onClick={!this.state.isSubmit?this.onUpdateLogo:null}
                          disabled={this.state.isSubmit||this.state.data.logo.name==""||this.state.isImages}>{this.state.isSubmit?this.props.lng.POST_CREATE_BUTTON_SAVING:this.props.lng.PROFILE_BUTTON_UPDATE}</button>
                </div>
              </div>
              <div className="maps-google" style={{height:'470px', position: 'relative'}}>
                <AroundMap
                  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDtPEnxZi9s2ngovnLyFs89_RPAWVzEFfE&amp;v=3.exp&amp;signed_in=true"
                  loadingElement={
                    <div style={{ height: `100%` }}>
                    </div>
                  }
                  containerElement={
                    <div style={{ height: `100%` }} />
                  }
                  mapElement={
                    <div style={{ height: `100%` }} />
                  }
                  currentLocation = {true}
                  onMapClick={this.handleMapClick}
                  onClickMarker={this.onClickMarker.bind(this)}
                  markers={this.state.markers}
                  icon={this.state.data.logo}
                />
              </div>
            </div>
        }
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
      </div>
    );
  }
}

LogoBrand.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.logoBrandReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(logoBrandAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(LogoBrand);
