/*
 * Created by TrungPhat on 30/03/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as postAction from '../../actions/postAction';
import * as actionTypes from '../../actions/actionTypes';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio, Modal} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AroundMap} from '../controls/AroundMap';
import {ToastContainer, ToastMessage} from "react-toastr";
import Autocomplete from '../controls/Autocomplete';
import AvatarCropper from "../controls/lib";
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let Constants=require('../../services/Constants');
let Session=require('../../utils/Utils');
let Aes=require('../../services/httpRequest');
class CreateUpdatePost extends React.Component{
  initialPost() {
    return {
      id: -1,
      name: '',
      price:'',
      location: [],
      newLocation:[],
      phone: Aes.aesDecrypt(localStorage.getItem('user')).phone,
      address: '',//Aes.aesDecrypt(localStorage.getItem('user')).address ? Aes.aesDecrypt(localStorage.getItem('user')).address : '',
      images: [],
      image_deletes: [],
      show: 3,
      showPhone:'',
      description: "",
      tags: '',
      parentId:'-1',
      listImages:[],
      kind:'1',
      categoryParent:'',
      categorySub:'',
    };
  }
  getInitialImg(){
    return{
      cropperOpen: false,
      img: null
    }
  }
  constructor(props, context){
    super(props, context);
    this.state = {
      post: this.initialPost(),
      error: {},
      dataCateParent:[],
      dataCateSub:[],
      isLoad:true,
      isChecked:false,
      isShopChecked:false,
      isNewsChecked:false,
      statusLoaded:0,
      isUpload: false,
      isSubmit: false,
      statusMap:false,
      markers: [
        {
          position: {
            lat: 0.0,
            lng: 0.0,
          },
          key: Date.now(),
        }
      ],
      lgShow: false,
      isOk:false,
      click:0,
      listAddress:[],
      textAddress:'',
      isSelect:false,
      locationShop:[],
      avatar:this.getInitialImg(),
      avatarTmp:[],
      getLocation: false,
      blockRenderingData: false
    };
    this.updateState=this.updateState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMapClick=this.handleMapClick.bind(this);
    this.submitHandler=this.submitHandler.bind(this);
    this.onShowGoogleMap=this.onShowGoogleMap.bind(this);
    this.deleteImage=this.deleteImage.bind(this);
    this.handleCropAvatar=this.handleCropAvatar.bind(this);
    this.onChangeLocation=this.onChangeLocation.bind(this);
    this.handleRequestHide=this.handleRequestHide.bind(this);
  }
  componentWillMount(){
    if(!Session.checkSession()){
      browserHistory.push("/login");
    }else{
      /*if(this.state.post.address){
        if(this.state.post.address.length > 0){
          this.props.actions.getAddressFirst(this.state.post.address);
        }
      }*/
      this.props.actions.loadCategory({parentId:this.state.post.parentId})
      if(this.props.params.id){
        this.setState({blockRenderingData: true});
        this.props.actions.getPostById({idPost:this.props.params.id});
      }
    }
  }
  componentDidMount(){
    window.scrollTo(0,0)
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result='';
      switch (type){
        case actionTypes.GET_CATEGORY_SUCCESS:
          result=nextProps.dataMessage.dataPost;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(result.data[0].parentId==-1){
              this.setState({dataCateParent:result.data});
            }else{
              this.setState({dataCateSub:result.data});
            }
          }else{
            if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.actions.loadCategory({parentId:this.state.post.parentId});
            }
          }
          break;
        case actionTypes.GET_GOOGLE_SUCCESS:
          result=nextProps.dataMessage.dataPost;
          if(result.status=='OK'){
            this.setState({listAddress:result.results});
          }
          break;
        case actionTypes.GET_GOOGLE_FIRST_SUCCESS:
          result=nextProps.dataMessage.dataPost;
          if(result.status=='OK'){
            let post=this.state.post;
            if(result.results[0]){
              post.location=[result.results[0].geometry.location.lat, result.results[0].geometry.location.lng];
            }
            let markers = this.state.markers;
            let lgShow = this.state.lgShow;
            if(this.state.getLocation){
              markers[0].position.lat = result.results[0].geometry.location.lat;
              markers[0].position.lng = result.results[0].geometry.location.lng;
              lgShow = true;
            }
            this.setState({post:post, markers:markers, getLocation: false, lgShow:lgShow});
          }
          break;
        case actionTypes.CREATE_POST_SUCCESS:
          result=nextProps.dataMessage.dataPost;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let post=this.state.post;
            post.name=''; post.kind=1;post.price='';post.newLocation=[];post.images=[]; post.image_deletes=[]; post.show='';
            post.showPhone='';post.shortDescription='';post.description='';post.tags='';post.categoryParent='';
            post.categorySub='';post.parentId=-1;post.listImages=[];
            this.setState({isSubmit:false,post:post,isChecked:false, isNewsChecked:false, isShopChecked:false});
            this.props.toastMessage.success(this.props.lng.POST_CREATE_MESSAGh_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
            browserHistory.push('/');
          }else {
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.actions.createPost(this.state.post);
            }else{
              this.setState({isSubmit:false});
              this.refs.container.error(this.props.lng.POST_CREATE_MESSAGE_CREATE_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
        case actionTypes.GET_POST_SUCCESS:
          result=nextProps.dataMessage.dataPost;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(result.data.post.userId.id != Session.aesDecrypt(localStorage.getItem('user')).id){
              browserHistory.push('');
            }
            if(this.state.blockRenderingData){
              let post=this.initialPost();
              post=Object.assign(post, result.data.post);
              let data=post.images;
              let array=[];
              for(let key in data){
                array.push({name:data[key], status:this.state.statusLoaded});
              }
              post.images=array;
              post.categoryParent=result.data.post.primaryCategory.id;
              this.props.actions.loadCategory({parentId:post.categoryParent});
              post.categorySub=result.data.post.secondCategory.id;
              if(post.show==3){
                this.setState({isNewsChecked:true, isShopChecked:true});
              }else{
                if(post.show==2){
                  this.setState({isNewsChecked:true});
                }else{
                  this.setState({isShopChecked:true});
                }
              }
              if(post.showPhone==0){
                this.setState({isChecked:true})
              }else{
                this.setState({isChecked:false})
              }
              if(post.price==-1){
                post.kind=-1;
                post.price='';
              }else{
                if(post.price==-2){
                  post.kind=-2;
                  post.price='';
                }
              }
              post.location=[result.data.post.location[1], result.data.post.location[0]];
              this.setState({post:post, textAddress:result.data.post.address, blockRenderingData: false});
            }
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.setState({blockRenderingData: true});
              this.props.actions.getPostById({idPost:this.props.params.id});
            }else{
              if(result.code==704){
                this.refs.container.error(this.props.lng.POST_CREATE_SHOP_NOT_EXIST, `Thông báo.`, {
                  closeButton: true,
                });
                browserHistory.push('/xem-cua-hang' + 'cua-hang-' + this.state.post.idShop + '.html');
              }
            }
          }
          break;
        case actionTypes.UPDATE_POST_SUCCESS:
          result=nextProps.dataMessage.dataPost;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.setState({isSubmit:false});
            this.props.toastMessage.success(this.props.lng.POST_CREATE_MESSAGE_UPDATE_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
            browserHistory.push('/');
          }else {
            if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.actions.updatePost(this.state.post);
            }else{
              this.setState({isSubmit:false});
              this.refs.container.error(this.props.lng.POST_CREATE_MESSAGE_UPDATE_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
        case actionTypes.UPLOAD_BASE64_2_SUCCESS:
          result = nextProps.dataMessage.dataBase64;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS) {
            let error=this.state.error;
            error['images']=false;
            let post=this.state.post;
            if(this.state.isUpload){
              post.images.push({name:result.data[0],status:1});
            }
            this.setState({
              post:post,
              error:error,
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
      }
    }
  }
  updateState(event){
    const field=event.target.name;
    let valueField=event.target.value;
    let error=this.state.error;
    let post=this.state.post;
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
          if(Session.validatePhoneNumber(valueField)!=true){
            error[field+'2']=true;
          }else{
            error[field]=false;
            if(Session.checkPhone(valueField)!=true){
              error[field+'2']=true;
            }else{
              error[field+'2']=false;
            }
          }
        }
      }
    }
    if(field=='price'){
      if(valueField==0||valueField.length<=0){
        error[field]=true;
      }else{
        error[field]=false;
      }/*else{
        if(Session.validatePhoneNumber(valueField)!=true){
          error[field]=true;
        }else{
          error[field]=false;
        }
      }*/
    }
    if(field=='categoryParent'){
      if(valueField!=''){
        this.props.actions.loadCategory({parentId:valueField});
      }
      error[field]=valueField.length==0;
    }
    if(field=='categorySub'){
      error[field]=valueField==''||valueField.length==0;
    }
    if(field=='location'){
      error[field]=valueField.length==0;
    }
    if(field=='description'){
      error[field]=valueField.length==0;
    }
    /*if(field=='tags'){
      error[field]=valueField.length==0;
    }*/
    if(field == 'address'){
      post.location=[0,0];
      if(valueField.length>0){
        error.address=false;
      }else{
        error.address=true;
      }
    }
    post[field]=valueField;
    if(post.tags.length > 50){
      post.tags = post.tags.slice(0, 50);
    }
    return this.setState({post:post,error:error});
  }

  handleChange() {
    this.setState({
      isChecked: !this.state.isChecked
    })
  }
  validatorForm() {
    let error=this.state.error;
    let dataForm=this.state.post
    let check=true;
    let post=this.state.post;

    if(post.show==""){
      error['show']=true;
      check=false;
    }

    if(this.state.post.images.length==0){
      error['images']=true;
      check=false;
    }

    if(dataForm.name.length==0){
      error['name']=true;
      check=false;
    }

    if(dataForm.kind==""){
      error['kind']=true;
      check=false;
    }else{
      if(dataForm.kind==1){
        if(dataForm.price.length<=0){
          error['price']=true;
          check=false;
        }else{
          if(Session.validatePhoneNumber(parseInt(Session.findAndSliceString(dataForm.price, ',')))!=true){
            error['price']=true;
            check=false;
          }
        }
      }
    }

    if(dataForm.phone.length==0){
      error['phone']=true;
      check=false;
    }else{
      if(dataForm.phone.length>11){
        error['phone2']=true;
        check=false;
      }else{
        if(Session.validatePhoneNumber(dataForm.phone)!=true){
          error['phone2']=true;
          check=false;
        }else if(Session.checkPhone(dataForm.phone)==false){
          error['phone2']=true;
          check=false;
        }
      }
    }

    if(dataForm.address.length==0){
      error['address']=true;
      check=false;
    }
    if(dataForm.location[0]==0||dataForm.location[1]==0){
      error['location']=true;
      check=false;
    }

    if(dataForm.description.length==0){
      error['description']=true;
      check=false;
    }

    if(dataForm.categoryParent==''){
      error['categoryParent']=true;
      check=false;
    }

    /*if(dataForm.tags.length==0){
      error['tags']=true;
      check=false;
    }*/

    if(dataForm.categorySub==''){
      error['categorySub']=true;
      check=false;
    }
    if(dataForm.kind==-1){
      dataForm.price=-1;
    }else{
      if(dataForm.kind==-2){
        dataForm.price=-2;
      }
    }
    this.setState({error:error, post:dataForm});
    return check;
  }
  onClickMarker(){}
  submitHandler(e) {
    e.preventDefault();
    let showPhone='';
    if(this.state.isChecked==true){
      showPhone=0;
    }else{
      showPhone=1;
    }
    let post=this.state.post;
    let img=[];
    for(let key in post.images){
      img.push(post.images[key].name);
    }
    post.listImages=img;
    post.showPhone=showPhone.toString();
    this.setState({post:post});
    if(this.validatorForm()){
      if(post.kind == 1){
        post.price = parseInt(Session.findAndSliceString(post.price, ','));
      }
      this.setState({isSubmit:true, isLoad:false});
      if(this.state.post.id==-1){
        this.props.actions.createPost(post);
      }else{
        this.props.actions.updatePost(post);
      }
    }else{
      this.setState({isSubmit:false});
    }
  }
  onImageDrop(files) {
    if(this.state.post.images){
      if(this.state.post.images.length>0){
        let post=this.state.post;
        post.image_delete=[post.images];
        this.setState({post:post});
      }
    }
    let avatar=this.state.avatar;
    avatar.img=files[0].preview;
    this.setState({
      avatar:avatar,
      cropperOpen: true
    });
  }
  handleCropAvatar(dataURI){
    this.setState({isUpload:true});
    let avatar = this.state.avatar;
    avatar.cropperOpen=false;
    avatar.img=null;
    let data=dataURI.slice(22);
    this.props.actions.uploadBase642(data);
    let post=this.state.post;
    let avatarTmp=this.state.avatarTmp;
    avatarTmp.push(dataURI);
    this.setState({
      avatar:avatar,
      avatarTmp:avatarTmp,
      post:post
    });
  }
  deleteImage(event){
    event.preventDefault();
    let post=this.state.post;
    let error=this.state.error;
    let key=-1;
    for(let i=0; i<post.images.length;i++){
      if(event.target.name==post.images[i].name){
        key = i;
      }
    }
    post.images.splice(key,1);
    if(post.image_deletes)
      post.image_deletes.push(event.target.name);
    else
      post.image_deletes=[event.target.name];
    if(post.images.length==0){
      error['images']=true;
    }
    this.setState({post:post});
  }
  handleRequestHide(){
    this.setState({
      cropperOpen: false
    })
  }
  onShowGoogleMap(event){
    event.preventDefault();
    let error2=this.state.error;
    error2.address=false;
    error2.location = false;
    if(this.state.post.address.length>0){
      if(this.state.post.location!=[]&&this.state.isSelect==true){/*Truong hop chon autocomplete*/
        if(this.state.post.newLocation.length>0 && this.state.click>0 && this.state.isOk==true){/*Truong hop co thay thoi vi tri*/
          this.setState({
            lgShow:true,isOk:false,
            markers: [
              {
                position: {
                  lat: this.state.post.newLocation[1],
                  lng: this.state.post.newLocation[0]
                },
                key: Date.now(),
              }
            ]});
          this.setState({lgShow:true, error:error2});
        }else{/*Truong hop chua thay doi vi tri*/
          this.setState({lgShow:true,
            markers: [
              {
                position: {
                  lat: this.state.post.location[0],
                  lng: this.state.post.location[1]
                },
                key: Date.now(),
              }
            ]});
          this.setState({lgShow:true, error:error2});
        }
      }else{/*Truong hop nhap tay*/
        this.setState({getLocation: true});
      //Nếu chưa có vị trí
        if(this.state.post.location[0]==0&&this.state.post.location[1]==0){
          this.props.actions.getAddressFirst(this.state.post.address);
        }else{
          this.setState({lgShow:true, error:error2});
          if(this.state.post.newLocation.length>0 &&this.state.click>0 && this.state.isOk==true){/*Da thay doi vi tri*/
            this.setState({
              lgShow:true,
              isOk:false,
              markers: [
                {
                  position: {
                    lat: this.state.post.newLocation[1],
                    lng: this.state.post.newLocation[0]
                  },
                  key: Date.now(),
                }
              ]});
          }else{/*Chua thay doi*/
            let location=[this.state.post.location[0], this.state.post.location[1]];
            this.setState({
              lgShow:true,
              markers: [
                {
                  position: {
                    lat: location[0]==0?this.state.locationShop[1]:location[0],
                    lng: location[1]==0?this.state.locationShop[0]:location[1],
                  },
                  key: Date.now(),
                }
              ]});
          }
        }
      }
    }else{
      this.refs.container.error(this.props.lng.POST_CREATE_VALIDATE_ADDRESS, `Thông báo.`, {
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
    let post=this.state.post;
    post.newLocation=[nextMarkers[0].position.lng(),nextMarkers[0].position.lat()];
    this.setState({
      markers: nextMarkers,
      post:post
    });
  }
  onChangeLocation(){
    this.setState({isOk:true});
    let post=this.state.post;
    if(post.newLocation.length>0){
      post.location=[post.newLocation[1], post.newLocation[0]];
      let error=this.state.error;
      error.location=false;
      let click=this.state.click;
      this.setState({post:post,
        lgShow:false,
        disSubmit:false,
        /*isOk:false,*/
        error:error,
        click:click+1,
        markers: [
          {
            position: {
              lat: post.newLocation[0],
              lng: post.newLocation[1]
            },
            key: Date.now(),
          }
        ]});
    }else{
      this.setState({lgShow:false});
    }
  }
  onAutoComAddress(event){
    let keyword=event.target.value;
    let post=this.state.post;
    let error=this.state.error;
    post.location=[0,0];
    if(keyword.length>0){
      error.address=false;
      //keyword=keyword.replace(/\s/g, '');
      this.props.actions.getAddress(keyword.replace(/\s/g, ''));
    }else{
      error.address=true;
    }
    post.address=keyword
    this.setState({post:post, isSelect:false});
  }
  render(){
    let lgClose = () => this.setState({ lgShow: false });
    let cmpImageAvatar=[];
    let arrImg=this.state.post.images;
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
          let imgFolder=(arrImg[i].status==0)?'/images/':'/tmp/';
          cmpImageAvatar[i]=(
            <div className="box-img">
              <div className="box-img-action array-img">
                <img src={Constants.linkApi+imgFolder+arrImg[i].name}/>
                <Link href="#" onClick={this.deleteImage} className="pull-right">
                  <img className="icon-remove" name={arrImg[i].name} src={Constants.linkServerImage+"/common/remove.png"}/>
                </Link>
              </div>
            </div>
          );
        }
      }
      else{
        cmpImageAvatar=[]
      }
    }
    cmpImg=(<FormGroup validationState={this.state.error.images ? 'error' : null}>
      <div className="FileUpload images">
        {cmpImageAvatar[0]}{cmpImageAvatar[1]}{cmpImageAvatar[2]}{cmpImageAvatar[3]}{cmpImageAvatar[4]}{cmpUpFileAvatar}
      </div>
      <HelpBlock>{this.state.error.images ? this.props.lng.POST_CREATE_VALIDATE_IMAGE : ''}</HelpBlock>
    </FormGroup>);
    let cpnBtn='';
    if(this.state.post.id==-1){
      cpnBtn=<button className="button-create-store" onClick={!this.state.isSubmit?this.submitHandler:null}
                     disabled={this.state.isSubmit}>{this.state.isSubmit?this.props.lng.POST_CREATE_BUTTON_SAVING:this.props.lng.POST_CREATE_BUTTON_SAVE}</button>
    }else{
      cpnBtn=<button className="button-create-store" onClick={!this.state.isSubmit?this.submitHandler:null}
                     disabled={this.state.isSubmit||this.state.isUpload}>{this.state.isSubmit?this.props.lng.POST_CREATE_BUTTON_SAVING:this.props.lng.POST_CREATE_BUTTON_SAVE}</button>
    }
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
    if(this.state.post.categoryParent!=''){
      cpnSelect=<FormGroup>
        <FormControl componentClass="select"
                     className="input-radius"
                     id="select-district"
                     name="categorySub"
                     onChange={this.updateState}
                     value={this.state.post.categorySub}>
          <option value="0">[--{this.props.lng.POST_CREATE_CHOOSE_CATEGORY}--]</option>
          {this.state.dataCateSub.map(item =>
            <option key={item.id} value={item.id}>{item.name}</option>)
          }
        </FormControl>
        <HelpBlock>{this.state.error.categorySub?this.props.lng.POST_CREATE_VALIDATE_CATEGORY02:''}</HelpBlock>
      </FormGroup>
    }
    return(
      <div className="panel-create-store" id="create-post">
        <Helmet
          title="Bài viết"
        />
        <div className="info">
          <div className="info-content">
            <div className="box-body">
              <div className="form-group clearfix" style={{marginTop:'10px'}}>
                {this.state.avatar.img!=null? <AvatarCropper
                  onRequestHide={this.handleRequestHide}
                  cropperOpen={this.state.cropperOpen}
                  onCrop={this.handleCropAvatar}
                  image={this.state.avatar.img}
                  width={640}
                  height={480}
                />:""}
                <label className="col-sm-3">{this.props.lng.POST_CREATE_NAME_HINT}</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control input-radius"
                    name="name"
                    value={this.state.post.name}
                    onChange={this.updateState}
                  />
                  <HelpBlock>{this.state.error.name?this.props.lng.POST_CREATE_VALIDATE_NAME:''}</HelpBlock>
                </div>
              </div>
              <div className="form-group clearfix" style={{marginBottom:'5px'}}>
                <label className="col-sm-3">{this.props.lng.POST_CREATE_PRICE_HINT}</label>
                <div className="col-sm-9">
                  <FormGroup style={{marginBottom:'5px'}}>
                    <FormControl componentClass="select"
                                 className="input-radius"
                                 id="select-district"
                                 name="kind"
                                 onChange={this.updateState}
                                 value={this.state.post.kind}>
                      <option value="-1">{this.props.lng.POST_TYPE_CALL}</option>
                      <option value="1">{this.props.lng.POST_TYPE_PRICE}</option>
                      {/*<option value="-2">{this.props.lng.POST_TYPE_NEWS_FEED_NOTIFY}</option>*/}
                    </FormControl>
                    <HelpBlock>{this.state.error.kind?this.props.lng.NOT_NULL:''}</HelpBlock>
                  </FormGroup>
                </div>
              </div>
              {this.state.post.kind==1?<div className="form-group clearfix">
                <label className="col-sm-3"/>
                <div className="col-sm-9 ">
                  <input
                    type="text"
                    className="form-control input-radius"
                    name="price"
                    placeholder={this.props.lng.POST_CREATE_PRICE_PLACEHOLDER}
                    min={0}
                    value={accounting.formatNumber(this.state.post.price)}
                    onChange={this.updateState}/>
                  <HelpBlock>{this.state.error.price?this.props.lng.POST_CREATE_VALIDATE_PRICE:''}</HelpBlock>
                </div>
              </div>:''}
              <div className="form-group clearfix">
                <label className="col-sm-3 ">{this.props.lng.POST_CREATE_PHONE_HINT}</label>
                <div className="col-sm-9">
                  <div className="col-sm-9" style={{paddingLeft:'0px'}}>
                    <input
                      type="text"
                      className="form-control input-radius"
                      name="phone"
                      value={this.state.post.phone}
                      onChange={this.updateState}
                    />
                    {this.state.error.phone?<HelpBlock>{this.props.lng.POST_CREATE_VALIDATE_PHONE}</HelpBlock>:''}
                    {this.state.error.phone2?<HelpBlock>{this.props.lng.REGISTER_VALIDATE_PHONE}</HelpBlock>:''}
                  </div>
                  <div className="col-sm-3">
                    <div className="checkbox checkbox-primary">
                      <input
                        id="checkbox1"
                        className="styled"
                        type="checkbox"
                        name="showPhone"
                        checked={this.state.isChecked}
                        onChange={ this.handleChange }
                      />
                      <label htmlFor="checkbox1"  style={{lineHeight:'17px'}}>{this.props.lng.POST_CREATE_POST_HIDE_PHONE}</label>
                    </div>
                  </div>
                </div>
              </div>
              <FormGroup className={'clearfix'}>
                <ControlLabel className="col-sm-3">{this.props.lng.POST_CREATE_ADDRESS_HINT}</ControlLabel>
                <div className="col-sm-9 has-feedback">
                  {/*<Autocomplete
                    inputProps={{name: "address", id: "states-autocomplete",className:"form-control"}}
                    ref="autocomplete"
                    value={this.state.post.address}
                    items={this.state.listAddress}
                    getItemValue={(item) => item.formatted_address}
                    onSelect={(value, item) => {
                      let post=this.state.post;
                      let error=this.state.error;
                      error.address=false;
                      post.address=item.formatted_address;
                      post.location=[item.geometry.location.lat, item.geometry.location.lng];
                      this.setState({post:post,error:error,textAddress:item.formatted_address, isSelect:true});
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
                    value={this.state.post.address}
                    onChange={this.updateState}
                  />
                  <div style={{float:'left', marginBottom:'5px', marginTop:'0px'}}>
                    <Link href="#" name='maps' onClick={this.onShowGoogleMap} className="show-maps-location">
                      <img className="icon-location"
                           src={Constants.linkServerImage+"/common/location_point.png"}
                      />
                    </Link>
                  </div>
                  <span style={{color: '#999', fontStyle:'italic', display:'block', clear:'both'}}
                  >{this.props.lng.SHOP_CREATE_ADDRESS_EXAMPLE} 150/30 đường Trục, phường 13, Bình Thạnh, Hồ Chí Minh, Việt Nam</span>
                  {this.state.error.address?<HelpBlock>{this.props.lng.POST_CREATE_VALIDATE_ADDRESS}</HelpBlock>:null}
                  {this.state.error.location?<HelpBlock style={{color:'#dd4b39', fontSize:'15px'}}>{this.props.lng.POST_MSG_EMPTY_LOCATION_MAPS}</HelpBlock>:null}
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
                {/*<Modal.Footer>
                 <Button onClick={lgClose}>Close</Button>
                 </Modal.Footer>*/}
              </Modal>
              <div className="form-group clearfix">
                <label className="col-sm-3 mar-top-5">{this.props.lng.POST_CREATE_CATEGORY01}</label>
                <div className="col-sm-9">
                  <FormGroup>
                    <FormControl componentClass="select"
                                 className="input-radius"
                                 id="select-district"
                                 name="categoryParent"
                                 onChange={this.updateState}
                                 value={this.state.post.categoryParent}>
                      <option value="">[--{this.props.lng.POST_CREATE_CHOOSE_CATEGORY}--]</option>
                      {this.state.dataCateParent.map(item =>
                        <option key={item.id} value={item.id}>{item.name}</option>)
                      }
                    </FormControl>
                    <HelpBlock>{this.state.error.categoryParent?this.props.lng.POST_CREATE_VALIDATE_CATEGORY01:''}</HelpBlock>
                  </FormGroup>
                  {cpnSelect}
                </div>
              </div>
            </div>
            <div className="form-group clearfix">
              <label className="col-sm-3 mar-top-5">{this.props.lng.POST_CREATE_HAG_TAG_HINT}</label>
              <div className="col-sm-9 mar-bot-5">
                <input
                  type="text"
                  className="form-control input-radius"
                  placeholder={this.props.lng.POST_CREATE_TAG_PLACEHOLDER}
                  name="tags"
                  value={this.state.post.tags}
                  onChange={this.updateState}/>
                <HelpBlock>{this.state.error.tags?'Không được để trống':''}</HelpBlock>
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="form-group col-sm-12 clearfix" style={{paddingLeft:'0px', paddingRight:'0px'}}>
              <label className="col-sm-2 mar-top-5">{this.props.lng.POST_CREATE_DESC_TITLE}</label>
              <div className="col-sm-12 mar-top-5">
                <textarea className="form-control input-radius"
                          rows="5"
                          name="description"
                          value={this.state.post.description}
                          onChange={this.updateState}
                />
                <HelpBlock>{this.state.error.description?this.props.lng.POST_CREATE_VALIDATE_DESC:''}</HelpBlock>
              </div>
            </div>
            <div className="col-sm-12" style={{paddingLeft:'30px !important', paddingRight:'30px !important'}}>
              {cmpImg}
            </div>
          </div>
          <div className="info-action">
            {cpnBtn}
          </div>
        </div>
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
      </div>
    );
  }
}

CreateUpdatePost.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.postReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(postAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateUpdatePost);
