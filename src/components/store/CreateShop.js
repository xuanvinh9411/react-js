/*
* Created by TrungPhat on 1/10/2017
*/
import React, {PropTypes} from 'react';
import AvatarCropper from "../controls/lib";
import {Link, browserHistory} from 'react-router';
import * as shopAction from '../../actions/shopAction';
import * as actionTypes from '../../actions/actionTypes';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio, Modal} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import {connect} from 'react-redux';
import TimePicker from 'rc-time-picker';
import {bindActionCreators} from 'redux';
import {AroundMap} from '../controls/AroundMap';
import {ToastContainer, ToastMessage} from "react-toastr";
import Autocomplete from '../controls/Autocomplete';
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
const showSecond = false;
let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let _=require('../../utils/Utils');
class CreateShop extends React.Component{
  initialShop(){
    return{
      id:-1,
      name:'',
      location:[],
      newLocation:[],
      phone:Aes.aesDecrypt(localStorage.getItem('user')).phone,
      address:'',//Aes.aesDecrypt(localStorage.getItem('user')).address,
      avatar:[],
      image_delete:[],
      coverImage:[],
      status:'',
      linkwebsite:'',
      email:Aes.aesDecrypt(localStorage.getItem('user')).email,
      description:"",
      openCloseTime:{t2_t6:{open:null, close:null}, t7:{open:null, close:null}, cn:{open:null, close:null}},
      time:{},
      categoryParent:'',
      categorySub:'',
      parentId:'-1',
      identifyNumber: '',
      tags:''
    };
  }
  getInitialImg(){
    return{
      cropperOpen: false,
      img: null
    }
  }
  getInitialImg2(){
    return{
      cropperOpen2: false,
      img: null
    }
  }
  constructor(props, context){
    super(props, context);
    this.state={
      shop: this.initialShop(),
      error: {},
      dataCbx:[],
      isUpload:false,
      isUpload2:false,
      isSubmit:false,
      image:this.getInitialImg(),
      markers: [
        {
          position: {
            lat: 10.8230989,
            lng: 106.6296638,
          },
          key: Date.now(),
        }
      ],
      style:{},
      lgShow: false,
      showResults:false,
      isLoad:true,
      statusMap: false,
      isOk:false,
      image2:'',
      click:0,
      textShow:'',
      disSubmit:false,
      listAddress:[],
      textAddress:'', isSelect:false,
      avatar:this.getInitialImg2(),
      avatarTmp:[],
      dataCateParent:[],
      dataCateSub:[],
    };
    this.deleteImage=this.deleteImage.bind(this);
    this.submitHandler=this.submitHandler.bind(this);
    this.updateState=this.updateState.bind(this);
    this.updateStateAddress=this.updateStateAddress.bind(this);
    this.handleValueChangeT6O=this.handleValueChangeT6O.bind(this);
    this.handleValueChangeT6C=this.handleValueChangeT6C.bind(this);
    this.handleValueChangeT7O=this.handleValueChangeT7O.bind(this);
    this.handleValueChangeT7C=this.handleValueChangeT7C.bind(this);
    this.handleValueChangeCNO=this.handleValueChangeCNO.bind(this);
    this.handleValueChangeCNC=this.handleValueChangeCNC.bind(this);
    this.onShowGoogleMap=this.onShowGoogleMap.bind(this);
    this.handleMapClick=this.handleMapClick.bind(this);
    this._onLoad=this._onLoad.bind(this);
    this.onChangeLocation=this.onChangeLocation.bind(this);
    this.handleCrop=this.handleCrop.bind(this);
    this.handleCropAvatar=this.handleCropAvatar.bind(this);
    this.handleRequestHide=this.handleRequestHide.bind(this);
    this.handleRequestHide2=this.handleRequestHide2.bind(this);
  }

  componentWillMount(){
    this.props.actions.loadCategory({parentId:this.state.shop.parentId});
    //this.props.actions.getAddressFirst(this.state.shop.address);
    if(this.props.params.id){
      this.props.actions.getShopById(this.props.params.id);
    }
  }

  componentWillReceiveProps(nextProps){
    let type=nextProps.dataMessage.type;
    let result='';
    switch (type){
      case actionTypes.GET_CATEGORY_SUCCESS:
        result=nextProps.dataMessage.dataShops;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          if(result.data[0].parentId==-1){
            this.setState({dataCateParent:result.data});
          }else{
            this.setState({dataCateSub:result.data});
          }
        }else{
          if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
            this.props.actions.loadCategory({parentId:this.state.shop.parentId});
          }else{
            this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
              closeButton: true,
            });
          }
        }
        break;
      case actionTypes.UPIMAGE_SUCCESS:
        result = nextProps.dataMessage.dataUpload;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS) {
          let shop=this.state.shop;
          shop.coverImage=result.data[0];
          this.setState({
            shop:shop,
            isUpload:false
          });
        }else{
          this.setState({
            isUpload:false
          });
          this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
            closeButton: true,
          });
        }
        break;
      case actionTypes.UPLOAD_MUTI_IMAGE_SUCCESS:
        result = nextProps.dataMessage.dataUpload;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS) {
          let shop=this.state.shop;
          let error=this.state.error;
          shop.avatar.push(result.data[0]);
          error.avatar='';
          this.setState({
            shop:shop,
            error:error,
            isUpload2:false
          });
        }else{
          this.setState({
            isUpload:false
          });
          this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
            closeButton: true,
          });
        }
        break;
      case actionTypes.GET_GOOGLE_FIRST_SUCCESS:
        result=nextProps.dataMessage.dataPost;
        /*if(result.status=='OK'){
          let shop=this.state.shop;
          if(result.results[0]){
            shop.location=[result.results[0].geometry.location.lat, result.results[0].geometry.location.lng];
          }
          this.setState({shop:shop});
        }*/
        if(this.state.statusMap){
          if(result.status=='OK'){
            let shop=this.state.shop;
            if(result.results[0]){
              shop.location=[result.results[0].geometry.location.lat, result.results[0].geometry.location.lng];
            }
            let markers = this.state.markers;
            let lgShow = this.state.lgShow;
            markers[0].position.lat = result.results[0].geometry.location.lat;
            markers[0].position.lng = result.results[0].geometry.location.lng;
            lgShow = true;
            this.setState({shop:shop, markers:markers, lgShow:lgShow, statusMap:false});
          }
        }
        break;
      case actionTypes.CREATE_SHOP_SUCCESS:
        result=nextProps.dataMessage.dataShops;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          let shop = this.state.shop;
          shop.name=''; shop.newLocation=[]; shop.avatar=[]; shop.coverImage=[];
          shop.status=''; shop.linkwebsite=''; shop.email=''; shop.description='';
          shop.openCloseTime={t2_t6:{open:null, close:null}, t7:{open:null, close:null}, cn:{open:null, close:null}};
          shop.time={}
          this.setState({isSubmit:false, shop:shop});
          this.props.toastMessage.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
            closeButton: true,
          });
          browserHistory.goBack();
        }else {
          if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
            this.props.actions.createShop(this.state.shop);
          }else{
            this.setState({isSubmit:false});
            this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
              closeButton: true,
            });
          }
        }
        break;
      case actionTypes.UPDATE_SHOP_SUCCESS:
        result=nextProps.dataMessage.dataShops;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          this.setState({isSubmit:false});
          this.props.toastMessage.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
            closeButton: true,
          });
        }else {
          this.setState({isSubmit:false});
          this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
            closeButton: true,
          });
        }
        break;
      case actionTypes.GET_SHOP_SUCCESS:
        result=nextProps.dataMessage.dataShops;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          let shop=Object.assign(this.state.shop, result.shop);
          this.setState({shop:shop});
        }
        break;
      case actionTypes.GET_GOOGLE_SUCCESS:
        result=nextProps.dataMessage.dataShops;
        if(result.status=='OK'){
          this.setState({listAddress:result.results});
        }
        break;
      case actionTypes.UPLOAD_BASE64_SUCCESS:
        result=nextProps.dataMessage.dataBase64;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS) {
          let shop=this.state.shop;
          if(this.state.isUpload){
            shop.coverImage=result.data[0];
          }
          this.setState({
            shop:shop,
            isUpload:false
          });
        }else{
          this.setState({
            isUpload:false
          });
          this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
            closeButton: true,
          });
        }
        break;
      case actionTypes.UPLOAD_BASE64_2_SUCCESS:{
        result=nextProps.dataMessage.dataBase64;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS) {
          let shop=this.state.shop;
          if(this.state.isUpload2){
            shop.avatar.push(result.data[0]);
          }
          let error=this.state.error;
          error.avatar=false;
          this.setState({
            shop:shop,
            isUpload2:false,
            error:error
          });
        }else{
          this.setState({
            isUpload2:false
          });
          this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
            closeButton: true,
          });
        }
        break;
      }
    }
  }

  updateStateAddress(event){
    const field=event.target.name;
    let valueField=event.target.value;
    let error=this.state.error;
    if(field=='address'){
      error[field]=valueField.length==0;
    }
    let shop=this.state.shop;
    shop[field]=valueField;
    if(this.state.shop.address){
      shop.newLocation=[];
      this.setState({isLoad:false, statusMap:false, shop:shop, isOk: false});
      this.props.actions.getAddress(this.state.shop.address.replace(/\s/g, ''));
    }
    return this.setState({shop:shop,error:error});
  }
  updateState(event){
    let shop=this.state.shop;
    const field=event.target.name;
    let valueField=event.target.value;
    let error=this.state.error;
    if(field=='categoryParent'){
      if(valueField!=''){
        this.props.actions.loadCategory({parentId:valueField});
      }
      error[field]=valueField.length==0;
    }
    if(field=='categorySub'){
      error[field]=valueField==''||valueField.length==0;
    }
    if(field=='name'){
      error[field]=valueField.length==0;
    }
    if(field=='phone'){
      if(valueField.length==0){
        error[field]=true;
        error[field+'2']=false;
      }else{
        if(valueField.length>11){
          error[field+'2']=true;
        }else{
          error[field]=false;
          if(_.validatePhoneNumber(valueField)!=true){
            error[field+'2']=true;
          }else{
            error[field]=false;
            if(_.checkPhone(valueField)!=true){
              error[field+'2']=true;
            }else{
              error[field+'2']=false;
            }
          }
        }
      }
    }
    if(field=='email'){
      if(valueField.length>0){
        if(_.isEmail(valueField)==true){
          if(_.checkChartEmail(valueField)==true){
            error[field+'2']=false;
          }else{
            error[field+'2']=true;
          }
        }else{
          error[field+'2']=true;
        }
      }else{
        error[field+'2']=false;
      }
    }
    if(field=='description'){
      error[field]=valueField.length==0;
    }
    if(field=='address'){
      error[field]=valueField.length==0;
      shop.location = [0,0];
    }
    shop[field]=valueField;
    if(shop.tags.length > 50){
      shop.tags = shop.tags.slice(0, 50);
    }
    return this.setState({shop:shop,error:error});
  }
  validatorForm() {
    let error=this.state.error;
    let dataForm=this.state.shop;
    let check=true;
    let shop=this.state.shop;

    if(this.state.shop.avatar.length==0){
      error['avatar']=true;
      check=false;
    }

    if((shop.time.t2_t6.open!="")&&(shop.time.t2_t6.close!="")&&(shop.time.t2_t6.close<=shop.time.t2_t6.open)){
      error['time3']=true;
      check=false;
    }

    if((shop.time.t7.open!="")&&(shop.time.t7.close!="")&&(shop.time.t7.close<=shop.time.t7.open)){
      error['time3']=true;
      check=false;
    }

    if((shop.time.cn.open!="")&&(shop.time.cn.close!="")&&(shop.time.cn.close<=shop.time.cn.open)){
      error['time3']=true;
      check=false;
    }

    if(dataForm.name.length==0){
      error['name']=true;
      check=false;
    }
    if(dataForm.location[0]==0||dataForm.location[1]==0){
      error['location']=true;
      check=false;
    }

    if(dataForm.phone.length==0){
      error['phone']=true;
      check=false;
    }else{
      if(dataForm.phone.length>11){
        error['phone2']=true;
        check=false;
      }else{
        if(_.validatePhoneNumber(dataForm.phone)!=true){
          error['phone2']=true;
          check=false;
        }else if(_.checkPhone(dataForm.phone)==false){
          error['phone2']=true;
          check=false;
        }
      }
    }

    if(dataForm.address.length==0){
      error['address']=true;
      check=false;
    }
    if(dataForm.description.length==0){
      error['description']=true;
      check=false;
    }

    if(dataForm.email.length>0){
      if(_.isEmail(dataForm.email)==true){
        if(_.checkChartEmail(dataForm.email)==true){
          error['email2']=false;
        }else{
          error['email2']=true;
          check=false;
        }
      }else{
        error['email2']=true;
        check=false;
      }
    }
    if(dataForm.categoryParent==''){
      error['categoryParent']=true;
      check=false;
    }
    if(dataForm.categorySub==''){
      error['categorySub']=true;
      check=false;
    }
    this.setState({error:error});
    return check;
  }
  submitHandler(e) {
    e.preventDefault();
    let dateFormat={}, t2t6o, t2t6c, t7o, t7c, cno, cnc;
    let shop=this.state.shop;
    if(shop.openCloseTime.t2_t6.open==null) {
      t2t6o='';
    }else{
      t2t6o=shop.openCloseTime.t2_t6.open.format('HH:mm');
    }
    if(shop.openCloseTime.t2_t6.close==null){
      t2t6c='';
    }else{
      t2t6c=shop.openCloseTime.t2_t6.close.format('HH:mm');
    }
    if(shop.openCloseTime.t7.open==null) {
      t7o = '';
    }else{
      t7o=shop.openCloseTime.t7.open.format('HH:mm');
    }
    if(shop.openCloseTime.t7.close==null){
      t7c='';
    }else{
      t7c=shop.openCloseTime.t7.close.format('HH:mm');
    }
    if(shop.openCloseTime.cn.open==null){
      cno='';
    }else{
      cno=shop.openCloseTime.cn.open.format('HH:mm');
    }
    if(shop.openCloseTime.cn.close==null){
      cnc='';
    }else{
      cnc=shop.openCloseTime.cn.close.format('HH:mm');
    }
    dateFormat={t2_t6:{open:t2t6o, close:t2t6c}, t7:{open:t7o, close:t7c}, cn:{open:cno, close:cnc}};
    shop.time=dateFormat;
    this.setState({shop:shop});
    if(this.validatorForm()==true){
      this.setState({isSubmit:true});
      this.props.actions.createShop(this.state.shop);
    }else{
      this.setState({isSubmit:false});
    }
  }
  /* LIST FUNCTION EVENT ONCHANGE FOR TIME-PICKER */
  handleValueChangeT6O(value){
    let time=this.state.shop.openCloseTime.t2_t6;
    time.open=value;
    this.setState({open:time});
  }
  handleValueChangeT6C(value){
    let time=this.state.shop.openCloseTime.t2_t6;
    time.close=value;
    this.setState({close:time});
  }
  handleValueChangeT7O(value){
    let time=this.state.shop.openCloseTime.t7;
    time.open=value;
    this.setState({open:time});
  }
  handleValueChangeT7C(value){
    let time=this.state.shop.openCloseTime.t7;
    time.close=value;
    this.setState({close:time});
  }
  handleValueChangeCNO(value){
    let time=this.state.shop.openCloseTime.cn;
    time.open=value;
    this.setState({open:time});
  }
  handleValueChangeCNC(value){
    let time=this.state.shop.openCloseTime.cn;
    time.close=value;
    this.setState({close:time});
  }
  /* GOOGLE MAPS */
  onShowGoogleMap(event){
    event.preventDefault();
    let error2=this.state.error;
    error2.address=false;
    error2.location = false;
    this.setState({ error:error2});
    if(this.state.shop.address.length>0){
      if(this.state.shop.location!=[]&&this.state.isSelect==true){/*Truong hop chon autocomplete*/
        if(this.state.shop.newLocation.length>0 && this.state.click>0 && this.state.isOk==true){/*Truong hop co thay thoi vi tri*/
          this.setState({
            lgShow:true,isOk:false,
            markers: [
              {
                position: {
                  lat: this.state.shop.newLocation[1],
                  lng: this.state.shop.newLocation[0]
                },
                key: Date.now(),
              }
            ]});
        }else{/*Truong hop chua thay doi vi tri*/
          this.setState({lgShow:true,
            markers: [
              {
                position: {
                  lat: this.state.shop.location[0],
                  lng: this.state.shop.location[1]
                },
                key: Date.now(),
              }
            ]});
        }
      }else{/*Truong hop nhap tay*/
        if(this.state.shop.newLocation.length>0 &&this.state.click>0 && this.state.isOk==true){/*Da thay doi vi tri*/
          this.setState({
            lgShow:true,
            isOk:false,
            markers: [
              {
                position: {
                  lat: this.state.shop.newLocation[1],
                  lng: this.state.shop.newLocation[0]
                },
                key: Date.now(),
              }
            ]});
        }else{/*Chua thay doi*/
          if(this.state.shop.location[0]==0&&this.state.shop.location[1]==0){
            this.setState({statusMap: true});
            this.props.actions.getAddressFirst(this.state.shop.address);
          }else{
            let location=[this.state.shop.location[0], this.state.shop.location[1]];
            this.setState({
              lgShow:true,
              markers: [
                {
                  position: {
                    lat: location[0]==0?10.8230989:location[0],
                    lng: location[1]==0?106.6296638:location[1],
                  },
                  key: Date.now(),
                }
              ]});
          }
        }
      }
    }else{
      this.refs.container.error(this.props.lng.SHOP_CREATE_VALIDATE_ADDRESS, `Thông báo.`, {
        closeButton: true,
      });
    }
  }
  handleMapClick(event) {
    const nextMarkers = [
      {
        position: event.latLng,
        key: Date.now(),
      },
    ];
    let shop=this.state.shop;
    shop.newLocation=[nextMarkers[0].position.lng(),nextMarkers[0].position.lat()];
    this.setState({
      markers: nextMarkers,
      shop:shop
    });
  }
  _onLoad(e) {
    if(e.target.offsetHeight<300){
      this.setState({
        textShow:this.props.lng.SHOP_CREATE_VALIDATE_IMAGES_WIDTH_HEIGHT,
        srcImg:''
      })
    }
  }
  onClickMarker(){

  }
  onChangeLocation(){
    this.setState({isOk:true});
    let shop=this.state.shop;
    if(shop.newLocation.length>0){
      shop.location=[shop.newLocation[1], shop.newLocation[0]];
      let error=this.state.error;
      error.location=false;
      let click=this.state.click;
      this.setState({shop:shop,
        lgShow:false,
        disSubmit:false,
        /*isOk:false,*/
        error:error,
        click:click+1,
        markers: [
          {
            position: {
              lat: shop.newLocation[0],
              lng: shop.newLocation[1]
            },
            key: Date.now(),
          }
        ]});
    }else{
      this.setState({lgShow:false});
    }
  }
  //IMAGES
  handleRequestHide(){
    this.setState({
      cropperOpen: false
    })
  }
  handleRequestHide2(){
    this.setState({
      cropperOpen2: false
    })
  }
  handleCrop(dataURI){
    this.setState({isUpload:true});
    let image = this.state.image;
    image.cropperOpen=false;
    image.img=null;
    let data=dataURI.slice(22);
    this.props.actions.uploadBase64(data);
    let shop=this.state.shop;
    shop.coverImage=dataURI;
    this.setState({
      image:image,
      image2:dataURI,
      shop:shop
    });
  }
  handleCropAvatar(dataURI){
    this.setState({isUpload2:true});
    let avatar = this.state.avatar;
    avatar.cropperOpen2=false;
    avatar.img=null;
    let data=dataURI.slice(22);
    this.props.actions.uploadBase642(data);
    let shop=this.state.shop;
    //shop.avatar.push(dataURI);
    let avatarTmp=this.state.avatarTmp;
    avatarTmp.push(dataURI);
    this.setState({
      avatar:avatar,
      avatarTmp:avatarTmp,
      shop:shop
    });
  }
  /*Cover Image*/
  onImageDropCoverImage(files) {
    let image=this.state.image;
    image.img=files[0].preview;
    this.setState({
      image:image,
      cropperOpen: true
    });
  }
  /*Avatar Images*/
  onImageDrop(files) {
    if(this.state.shop.avatar){
      if(this.state.shop.avatar.length>0){
        let shop=this.state.shop;
        shop.image_delete=[shop.avatar];
        this.setState({shop:shop});
      }
    }
    let avatar=this.state.avatar;
    avatar.img=files[0].preview;
    this.setState({
      avatar:avatar,
      cropperOpen2: true
    });
  }
  deleteImage(event){
    event.preventDefault();
    let shop=this.state.shop;
    let error=this.state.error;
    let key=-1;
    for(let i=0; i<shop.avatar.length;i++){
      if(event.target.name==shop.avatar[i]){
        key = i;
      }
    }
    shop.avatar.splice(key,1);
    this.setState({shop:shop});
  }
  onAutoComAddress(event){
    let keyword=event.target.value;
    let shop=this.state.shop;
    let error=this.state.error;
    shop.location=[0,0];
    if(keyword.length>0){
      error.address=false;
      this.props.actions.getAddress(keyword.replace(/\s/g, ''));
    }else{
      error.address=true;
    }
    shop.address=keyword
    this.setState({shop:shop, isSelect:false});
  }
  render(){
    let lgClose = () => this.setState({ lgShow: false });
    let btnAction='';
    if(this.state.shop.id.length>0){
      btnAction=<button className="button-create-store" onClick={!this.state.isSubmit?this.submitHandler:null}
                        disabled={this.state.isSubmit||this.state.disSubmit}>{this.state.isSubmit?this.props.lng.SHOP_CREATE_BUTTON_SAVING:this.props.lng.SHOP_CREATE_BUTTON_SAVE}</button>
    }else{
      btnAction=<button className="button-create-store" onClick={!this.state.isSubmit?this.submitHandler:null}
                        disabled={this.state.isSubmit||this.state.isUpload||this.state.isUpload2}>{this.state.isSubmit?this.props.lng.SHOP_CREATE_BUTTON_SAVING:this.props.lng.SHOP_CREATE_BUTTON_SAVE}</button>
    }
    /*UP COVER IMAGE*/
    let cmpImage=[];
    let nameImg=this.state.shop.coverImage;
    let cmpUpFile='';
    if(this.state.isUpload){
      cmpUpFile=(
        <div className="box-loading coverImage">
          <img src={Constants.linkServerImage+"/loading_7.gif"} style={{marginTop:50+'px', width:50+'px'}}/>
        </div>
      );
    }else{
      if(this.state.shop.coverImage.length>0){
        cmpUpFile=( <Dropzone
          onDrop={this.onImageDropCoverImage.bind(this)}
          multiple={false}
          accept="image/*"
          className='box-img-ava coverImage' data-toggle="tooltip" data-placement="top">
          {this.state.image2? <img src={this.state.image2} alt="" className="img-upload" style={{width:'100%'}}/>:null}
        </Dropzone>);
      }else{
        cmpUpFile=/*Dua anh di crop*/
          <Dropzone
            onDrop={this.onImageDropCoverImage.bind(this)}
            multiple={false}
            accept="image/*"
            className="file-up coverImage-Primary" style={{height:100+"%"}}>
            <img src={Constants.linkServerImage+"/common/camera.png"} style={{    width: '30px',
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block'}}
            />
          </Dropzone>
      }
    }
    /*UP AVATAR*/
    let cmpImageAvatar=[];
    let arrImg=this.state.shop.avatar;
    let cmpUpFileAvatar='';
    let cmpImg='';
    if(this.state.isUpload){
      cmpUpFileAvatar=(
        <div className="box-loading">
          <img src={Constants.linkServerImage+"/loading_7.gif"} style={{width:50+'px', margin: 15+'px'}}/>
        </div>
      );
    }else{
      if(arrImg.length==5){
        cmpUpFileAvatar='';
      }else{
        cmpUpFileAvatar=( <Dropzone
          onDrop={this.onImageDrop.bind(this)}
          multiple={false}
          accept="image/*"
          className="file-up list-img-avatar"
        >
          <img src={Constants.linkServerImage+"/common/new_image.png"}/>
        </Dropzone>);
      }
    }
    if(arrImg){
      if(arrImg.length>0){
        for (let i=0;i<arrImg.length;i++){
          let imgFolder='/tmp/';
          cmpImageAvatar[i]=(
            <div className="box-img">
              <div className="box-img-action array-img">
                {this.state.shop.avatar? <img src={Constants.linkApi+imgFolder+this.state.shop.avatar[i]} alt="" className="img-upload" style={{width:'100%'}}/>:null}
                <Link href="#"  onClick={this.deleteImage} className="pull-right" data-toggle="tooltip" data-placement="right" title={this.props.lng.SHOP_CREATE_DELETE_IMAGE}>
                  <img className="icon-remove" name={arrImg[i]} src={Constants.linkServerImage+"/common/remove.png"}/>
                </Link>
              </div>
            </div>
          );
        }
      }else{
        cmpImageAvatar=[]
      }
    }
    //LIST IMAGES AVATAR
    cmpImg=(<FormGroup>
      <div className="FileUpload images">
        {cmpImageAvatar[0]}{cmpImageAvatar[1]}{cmpImageAvatar[2]}{cmpImageAvatar[3]}{cmpImageAvatar[4]}{cmpUpFileAvatar}
      </div>
      </FormGroup>);
    //CSS FOR AUTOCOMPLETE
    let styles = {
      item: {
        padding: '5px 6px',
        cursor: 'default',
        borderBottom: '1px solid #d1d1d1'
      },

      highlightedItem: {
        color: 'white',
        background: 'hsl(200, 50%, 50%)',
        padding: '5px 6px',
        cursor: 'default',
      },

      menu: {
        border: 'solid 1px #ccc'
      }
    };
    let cpnSelect='';
    if(this.state.shop.categoryParent!=''){
      cpnSelect=
        <FormGroup>
          <ControlLabel className="col-sm-3">{this.props.lng.SHOP_CREATE_CATETORY_02}<span style={{color:'red'}}>(*)</span></ControlLabel>
          <div className="col-sm-9 has-feedback">
          <FormControl componentClass="select"
                       className="input-radius"
                       id="select-district"
                       name="categorySub"
                       onChange={this.updateState}
                       value={this.state.shop.categorySub}>
            <option value="0">{this.props.lng.POST_CREATE_CATEGORY02}</option>
            {this.state.dataCateSub.map(item =>
              <option key={item.id} value={item.id}>{item.name}</option>)
            }
          </FormControl>
          <HelpBlock style={{color:'#dd4b39'}}>{this.state.error.categorySub?this.props.lng.SHOP_CREATE_VALIDATE_CATETORY_02:''}</HelpBlock>
          </div></FormGroup>
    }
    return(
      <div className="panel-create-store" style={{position:'relative'}}>
        <Helmet
          title="Tạo Shop"
        />
        <div className="box-store-img" style={{height:305+"px"}}>
          {this.state.avatar.img!=null? <AvatarCropper
            onRequestHide={this.handleRequestHide2}
            cropperOpen={this.state.cropperOpen2}
            onCrop={this.handleCropAvatar}
            image={this.state.avatar.img}
            width={640}
            height={480}
          />:""}
          <FormGroup style={{height:100+"%"}} encType="multipart/form-data">
            <div className="FileUpload" style={{height:100+"%"}}>
              {cmpImage}{cmpUpFile}
            </div>
          </FormGroup>
          {this.state.image.img!=null? <AvatarCropper
            onRequestHide={this.handleRequestHide}
            cropperOpen={this.state.cropperOpen}
            onCrop={this.handleCrop}
            image={this.state.image.img}
            width={700}
            height={305}
          />:""}
        </div>
        <div className="info">
          <div className="info-content">
            <form className="form-horizontal">
              <div className="box-body">
                <FormGroup>
                  <ControlLabel className="col-sm-3">{this.props.lng.SHOP_CREATE_NAME_HINT}<span style={{color:'#dd4b39'}}>(*)</span></ControlLabel>
                  <div className="col-sm-9 has-feedback">
                    <FormControl
                      type="text"
                      value={this.state.shop.name}
                      name="name"
                      className="form-control input-radius"
                      onChange={this.updateState}/>
                    {this.state.error.name?<HelpBlock style={{color:'#dd4b39'}}>{this.props.lng.SHOP_CREATE_VALIDATE_NAME}</HelpBlock>:null}
                  </div>
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="col-sm-3">{this.props.lng.SHOP_CREATE_ADDRESS_HINT}<span style={{color:'#dd4b39'}}>(*)</span></ControlLabel>
                  <div className="col-sm-9 has-feedback">
                    {/*<Autocomplete
                      inputProps={{name: "address", id: "states-autocomplete",className:"form-control"}}
                      ref="autocomplete"
                      value={this.state.shop.address}
                      items={this.state.listAddress}
                      getItemValue={(item) => item.formatted_address}
                      onSelect={(value, item) => {
                        let shop=this.state.shop;
                        let error=this.state.error;
                        error.address=false;
                        shop.address=item.formatted_address;
                        shop.location=[item.geometry.location.lat, item.geometry.location.lng];
                        this.setState({shop:shop,error:error,textAddress:item.formatted_address, isSelect:true});
                      }}
                      onChange={this.onAutoComAddress.bind(this)}
                      renderItem={(item, isHighlighted) => (
                        <div  style={isHighlighted ? styles.highlightedItem : styles.item}>{item.formatted_address}</div>
                      )}
                    />*/}
                    <input
                      type="text"
                      className="form-control input-radius"
                      name="address"
                      value={this.state.shop.address}
                      onChange={this.updateState}
                    />
                    <div style={{float:'left', marginBottom:'5px'}}>
                      <Link href="#" name='maps' onClick={this.onShowGoogleMap} className="show-maps-location">
                        <img className="icon-location"
                             src={Constants.linkServerImage+"/common/location_point.png"}
                        />
                      </Link>
                    </div>
                    <span style={{color: '#999', fontStyle:'italic', display:'block'}}
                    >{this.props.lng.SHOP_CREATE_ADDRESS_EXAMPLE} 150/30 đường Trục, phường 13, Bình Thạnh, Hồ Chí Minh</span>
                    {this.state.error.address?<HelpBlock style={{color:'#dd4b39', fontSize:'15px'}}>{this.props.lng.SHOP_CREATE_VALIDATE_ADDRESS}</HelpBlock>:null}
                    {this.state.error.location?<HelpBlock style={{color:'#dd4b39', fontSize:'15px'}}>{this.props.lng.SHOP_NOT_GET_CURRENT_LOCATION}</HelpBlock>:null}
                  </div>
                </FormGroup>
                <Modal show={this.state.lgShow} onHide={lgClose} bsSize="large" aria-labelledby="contained-modal-title-lg">
                  <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">{this.props.lng.GOOLE_MAPS}
                      <a onClick={this.onChangeLocation}
                         href="javascript:void(0)"
                          className="fa fa-check btn-acc-location"
                          style={{float:'right', marginTop:'3px', color:'#333', marginRight:'5px', border:'none', background:'#fff'}}>
                      </a>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <center>
                      <div style={{height: `500px`,width:'900px'}}>
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
                          onMapClick={this.handleMapClick}
                          onClickMarker={this.onClickMarker.bind(this)}
                          markers={this.state.markers}
                          currentLocation = {true}
                        />
                      </div>
                    </center>
                  </Modal.Body>
                </Modal>
                <FormGroup validationState={this.state.error.phone?'error':null}>
                  <ControlLabel className="col-sm-3">{this.props.lng.SHOP_CREATE_PHONE_HINT}<span style={{color:'#dd4b39'}}>(*)</span></ControlLabel>
                  <div className="col-sm-9 has-feedback">
                    <FormControl
                      type="text"
                      value={this.state.shop.phone}
                      name="phone"
                      className="form-control input-radius"
                      onChange={this.updateState}/>
                    {this.state.error.phone?<HelpBlock>{this.props.lng.SHOP_CREATE_VALIDATE_PHONE}</HelpBlock>:null}
                    {this.state.error.phone2?<HelpBlock style={{color:'#dd4b39'}}>{this.props.lng.REGISTER_VALIDATE_PHONE}</HelpBlock>:''}
                  </div>
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="col-sm-3">{this.props.lng.SHOP_CREATE_WEBSITE_HINT}</ControlLabel>
                  <div className="col-sm-9 has-feedback">
                    <FormControl
                      type="text"
                      value={this.state.shop.linkwebsite}
                      name="linkwebsite"
                      className="form-control input-radius"
                      onChange={this.updateState}/>
                  </div>
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="col-sm-3">{this.props.lng.SHOP_CREATE_EMAIL_HINT}</ControlLabel>
                  <div className="col-sm-9 has-feedback">
                    <FormControl
                      type="email"
                      value={this.state.shop.email}
                      name="email"
                      className="form-control input-radius"
                      onChange={this.updateState}/>
                    {this.state.error.email2?<HelpBlock style={{color:'#dd4b39'}}>{this.props.lng.RESET_PASSWORD_TYPE_EMAIL}</HelpBlock>:''}
                  </div>
                </FormGroup>
                <FormGroup>
                  <ControlLabel className="col-sm-3">{this.props.lng.SHOP_CREATE_CATETORY_01}<span style={{color:'#dd4b39'}}>(*)</span></ControlLabel>
                  <div className="col-sm-9 has-feedback">
                    <FormControl componentClass="select"
                                 className="input-radius"
                                 id="select-district"
                                 name="categoryParent"
                                 onChange={this.updateState}
                                 value={this.state.shop.categoryParent}>
                      <option value="">[--{this.props.lng.POST_CREATE_CHOOSE_CATEGORY}--]</option>
                      {this.state.dataCateParent.map(item =>
                        <option key={item.id} value={item.id}>{item.name}</option>)
                      }
                    </FormControl>
                    {this.state.error.categoryParent?<HelpBlock style={{color:'#dd4b39'}}>{this.props.lng.SHOP_CREATE_VALIDATE_CATETORY_01}</HelpBlock>:''}
                  </div>
                </FormGroup>
                {cpnSelect}
                <div className="form-group">
                  <label className="col-sm-3">{this.props.lng.SHOP_TIME_WORK}</label>
                </div>
                <div className="form-group time-open">
                  <div className="col-sm-12">
                    <div className="div-table pull-right-time">
                      <div className="div-row">
                        <div className="div-cell width100" style={{marginTop: 9+'px', marginBottom:2+'px', marginRight:2+'px', marginLeft:2+'px'}}>{this.props.lng.SHOP_CREATE_TIME_T2_TITLE}</div>
                        <div className="div-cell">
                          <TimePicker
                            style={{ width: 100+'%' }}
                            showSecond={showSecond}
                            className="xxx input-radius"
                            onChange={this.handleValueChangeT6O}
                            transitionName="t2_t6_open"
                            value={this.state.shop.openCloseTime.t2_t6.open}
                          />
                        </div>
                        <div className="div-cell">
                          <TimePicker
                            style={{ width: 100+'%' }}
                            showSecond={showSecond}
                            className="xxx input-radius"
                            onChange={this.handleValueChangeT6C}
                            name="t2_t6_close"
                            value={this.state.shop.openCloseTime.t2_t6.close}
                          />
                        </div>
                      </div>
                      <div className="err-time">
                        {this.state.error.time?<HelpBlock>{this.props.lng.SHOP_CREATE_VALIDATE_TIME_WORK}</HelpBlock>:null}
                      </div>
                      <div className="div-row">
                        <div className="div-cell width100" style={{marginTop: 9+'px', marginBottom:2+'px', marginRight:2+'px', marginLeft:2+'px'}}>{this.props.lng.SHOP_CREATE_TIME_T7_TITLE}</div>
                        <div className="div-cell">
                          <TimePicker
                            style={{ width: 100+'%' }}
                            showSecond={showSecond}
                            className="xxx input-radius"
                            onChange={this.handleValueChangeT7O}
                            name="t7_open"
                            value={this.state.shop.openCloseTime.t7.open}
                          />
                        </div>
                        <div className="div-cell">
                          <TimePicker
                            style={{ width: 100+'%' }}
                            showSecond={showSecond}
                            className="xxx input-radius"
                            onChange={this.handleValueChangeT7C}
                            name="t7_close"
                            value={this.state.shop.openCloseTime.t7.close}
                          />
                        </div>
                      </div>
                      <div className="err-time">
                        {this.state.error.time2?<HelpBlock>{this.props.lng.SHOP_CREATE_VALIDATE_TIME_WORK}</HelpBlock>:null}
                      </div>
                      <div className="div-row">
                        <div className="div-cell width100"  style={{marginTop: 9+'px', marginBottom:2+'px', marginRight:2+'px', marginLeft:2+'px'}}>{this.props.lng.SHOP_CREATE_TIME_CN_TITLE}</div>
                        <div className="div-cell">
                          <TimePicker
                            style={{ width: 100+'%' }}
                            showSecond={showSecond}
                            className="xxx input-radius"
                            onChange={this.handleValueChangeCNO}
                            name="cn_open"
                            value={this.state.shop.openCloseTime.cn.open}
                          />
                        </div>
                        <div className="div-cell">
                          <TimePicker
                            style={{ width: 100+'%' }}
                            showSecond={showSecond}
                            className="xxx input-radius"
                            onChange={this.handleValueChangeCNC}
                            name="cn_close"
                            value={this.state.shop.openCloseTime.cn.close}
                          />
                        </div>
                      </div>
                      <div className="err-time">
                        {this.state.error.time3?<HelpBlock>{this.props.lng.SHOP_CREATE_VALIDATE_TIME_WORK}</HelpBlock>:null}
                      </div>
                    </div>
                  </div>
                </div>
                <FormGroup validationState={this.state.error.identifyNumber?'error':null}>
                  <ControlLabel className="col-sm-3">{this.props.lng.SHOP_LICENSE}</ControlLabel>
                  <div className="col-sm-9 has-feedback">
                    <FormControl
                      type="text"
                      value={this.state.shop.identifyNumber}
                      name="identifyNumber"
                      className="form-control input-radius"
                      onChange={this.updateState}/>
                  </div>
                </FormGroup>
                <div className="form-group clearfix">
                  <label className="col-sm-3 mar-top-5">{this.props.lng.SHOP_CREATE_HAG_TAG_HINT}</label>
                  <div className="col-sm-9 mar-bot-5">
                    <input
                      type="text"
                      className="form-control input-radius"
                      placeholder={this.props.lng.POST_CREATE_TAG_PLACEHOLDER}
                      name="tags"
                      value={this.state.shop.tags}
                      onChange={this.updateState}/>
                    <HelpBlock>{this.state.error.tags?this.props.lng.POST_CREATE_VALIDATE_HASHTAG:''}</HelpBlock>
                  </div>
                </div>
              </div>
              <ToastContainer
                toastMessageFactory={ToastMessageFactory}
                ref="container"
                className="toast-top-right"
              />

              <div className="form-group cr-shop-detail">
                <label className="col-sm-3">{this.props.lng.SHOP_CREATE_DESCRIPTION}<span style={{color:'red'}}>(*)</span></label>
                <div className="col-sm-12">
                  <textarea
                    className="form-control input-radius"
                    rows="5"
                    name="description"
                    value={this.state.shop.description}
                    onChange={this.updateState}
                  >
                  </textarea>
                  <HelpBlock>{this.state.error.description?this.props.lng.SHOP_CREATE_VALIDATE_DESCRIPTION:''}</HelpBlock>
                </div>
                <div className="col-sm-12">
                  <label className="clearfix title-list-img">{this.props.lng.SHOP_PHOTOS}<span style={{color:'red'}}>(*)</span></label>
                {cmpImg}
                  {this.state.error.avatar?<HelpBlock>{this.props.lng.SHOP_CREATE_VALIDATE_AVATAR}</HelpBlock>:null}
                </div>
              </div>
            </form>
          </div>
          <div className="info-action">
            {btnAction}
          </div>
        </div>
      </div>
    );
  }
}

CreateShop.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.shopReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(shopAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateShop);
