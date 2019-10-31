/*
 * Created by TrungPhat on 22/03/2017
 */
import React,{PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as adsAction from '../../actions/adsAction';
import * as actionType from '../../actions/actionTypes';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Pagination} from 'react-bootstrap';
import TimePicker from 'rc-time-picker';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import LoadingTable from '../controls/LoadingTable';
import {ToastContainer, ToastMessage} from "react-toastr";
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Ase=require('../../services/httpRequest');
let Constants=require('../../services/Constants');
let utils=require('../../utils/Utils');
let DatePicker = require("react-bootstrap-date-picker");
const showSecond = false;
let moment=require('moment');
class CreateUpdateAdsPost extends React.Component{
  initialAds(){
    return{
      idPost:'',
      id:-1,
      km:10,
      name:'',
      oldMin: -1,
      oldMax: -1,
      gender: 1,
      job:-1,
      dateStart:'',
      dateTmp:'',
      location:[],
      budget:0,
      total:0,
      idShop:'',
      time:{timeTmp:moment()},
    };
  }
  constructor(props, context){
    super(props, context);
    this.state={
      ads:this.initialAds(),
      error:[],
      isSubmit:false,
      isReady:false,
      data:[],
      isAcoin:true,
      settings:[],
      isUpdate: false,
      isChangeDateTime: false
    }
    this.handleValueChange=this.handleValueChange.bind(this);
    this.onChangeBirthday=this.onChangeBirthday.bind(this);
    this.submitHandler=this.submitHandler.bind(this);
    this.updateState=this.updateState.bind(this);
  }

  componentWillMount(){
    let ads=this.state.ads;
    ads.idPost=this.props.params.id;
    this.setState({ads:ads});
    this.props.actions.getPriceAds();
    this.props.actions.getJobs();
    if(this.props.route.path=="/advertisement/:id/create"){
      this.props.actions.getPostById({idPost:this.props.params.id});
    }
    if(this.props.route.path=="/advertisement/:id/update"){
      this.props.actions.getAdsById({idAds:this.props.params.id});
    }
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result={};
      switch (type){
        case actionType.GET_JOBS_SUCCESS:
          result=nextProps.dataMessage.userData;
          if(result.code ==Constants.RESPONSE_CODE_SUCCESS){
            this.setState({data:Object.assign(this.state.data,result.data)});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.actions.getJobs();
            }else{
              this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
        case actionType.GET_POST_SUCCESS:
          result=nextProps.dataMessage.dataPost;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let ads=this.state.ads;
            ads.location=result.data.post.location;
            ads.idShop=result.data.post.idShop;
            this.setState({ads:ads, isReady:true});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.actions.getPostById({idPost:this.props.params.id});
            }else{
              this.setState({isReady:true});
            }
          }
          break;
        case actionType.ADS_QUERY_SUCCESS:
          result=nextProps.dataMessage.dataAds;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let ads=this.state.ads;
            ads.total=result.data.total;
            let settings=this.state.settings;
            let acoin=0;
            if(settings.length>0){
              for (let i=0; i<settings.length;i++){
                acoin+=parseInt(settings[i].stringValue)*ads.total;
              }
            }
            ads.budget=acoin;
            this.setState({ads:ads, isAcoin:false});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.actions.adsQuery(this.state.ads);
            }else{
              this.setState({isReady:false});
            }
          }
          break;
        case actionType.GET_PRICE_ADS_SUCCESS:
          result=nextProps.dataMessage.dataAds;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.setState({settings:result.data.settings});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.actions.getPriceAds();
            }
          }
          break;
        case actionType.ADD_ADS_SUCCESS:
          result=nextProps.dataMessage.dataAds;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let user=Ase.aesDecrypt(localStorage.getItem('user'));
            user.balance=user.balance-this.state.ads.budget;
            localStorage.setItem('user',Ase.aesEncrypt(user));
            this.setState({ads:this.initialAds(), isSubmit:false});
            this.refs.container.success(this.props.lng.POST_ADS_MSG_CREATE_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.refs.container.warning(this.props.lng.FAIL_OTP, `Thông báo.`, {
                closeButton: true,
              });
              this.setState({isSubmit:false});
            }else{
              if(result.code==115){
                this.refs.container.error(this.props.lng.POST_ADS_MSG_OUT_MONEY, `Thông báo.`, {
                  closeButton: true,
                });
                this.setState({isSubmit:false});
              }
            }
          }
          break;
        case actionType.GET_ADS_SUCCESS:
          result=nextProps.dataMessage.dataAds;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let ads=Object.assign(this.state.ads,result.data.ad);
            let dataTime=result.data.ad.dateStart;
            let date=dataTime.slice(0, 10);
            let time=dataTime.slice(10);
            ads.time.timeTmp=moment(time,'HH:mm a');
            ads.dateTmp=date;
            ads.oldMin=result.data.ad.ageMin;
            ads.oldMax=result.data.ad.ageMax;
            ads.km=result.data.ad.radius;
            this.props.actions.adsQuery(ads);
            this.setState({ads:ads, isReady:true, isUpdate: true});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.actions.getAdsById({idAds:this.props.params.id});
            }else{
              this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
        case actionType.UPDATE_ADS_SUCCESS:
          result=nextProps.dataMessage.dataAds;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.setState({isSubmit:false});
            this.refs.container.success(this.props.lng.POST_ADS_MSG_UPDATE_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
          }else {
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.setState({isSubmit:false});
              this.refs.container.warning(this.props.lng.FAIL_OTP, `Thông báo.`, {
                closeButton: true,
              });
            }else{
              this.setState({isSubmit:false});
              this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
      }
    }
  }
  handleChange = (value) => {
    let ads=this.state.ads;
    if(!ads.state || ads.state == Constants.STATE_ADS_PAUSE){
      let error=this.state.error;
      if(value==0){
        error['km']=true;
      }else{
        error['km']=false;
      }
      ads.km=value;
      if(ads.km !== 0 && ads.oldMax !== '' && ads.oldMin !== '' && ads.gender !== ''){
        this.props.actions.adsQuery(ads);
      }
    }
    this.setState({
      ads: ads
    })
  }
  onChangeBirthday(value, formattedValue) {
    let ads=this.state.ads;
    let tmp=moment().format('DD/MM/YYYY');
    let error=this.state.error;
    if(ads.state == Constants.STATE_ADS_PAUSE || !ads.state){
      if(formattedValue==null||formattedValue==''||formattedValue<tmp){
        error['dateTmp']=true;
      }else{
        error['dateTmp']=false;
        error['dateStart']=false;
      }
      ads.dateTmp=formattedValue;
      if(this.state.isUpdate){
        this.setState({isChangeDateTime: true});
      }
    }
    this.setState({
      ads: ads
    });
  }
  handleValueChange(value){
    if(this.state.ads.state == Constants.STATE_ADS_PAUSE || !this.state.ads.state){
      let time=this.state.ads.time;
      let error=this.state.error;
      let tmp=moment ().format("HH:mm");
      if(value==null||value.format("HH:mm")<tmp){
        error['timeTmp']=true;
      }else{
        error['timeTmp']=false;
      }
      time.timeTmp=value;
      this.setState({timeTmp:time});
    }
  }
  updateState(event){
    const field=event.target.name;
    let valueField=event.target.value;
    let error=this.state.error;
    let ads=this.state.ads;
    console.log("ads ads ads 111", ads);
    if(!ads.state || ads.state == Constants.STATE_ADS_PAUSE){
      if(field=='oldMin'){
        error[field]=valueField=='';
      }
      if(field=='name'){
        error[field]=valueField=='';
      }
      if(field=='oldMax'){
        error[field]=valueField=='';
      }
      ads[field]=valueField;
      if(field=='oldMin'){
        if(ads.oldMax==''){
          error['oldMin']=true;
        }else{
          error['oldMin']=false;
          if(parseInt(ads.oldMin)>parseInt(ads.oldMax)){
            error['oldMin2']=true;
          }else{
            error['oldMin2']=false;
          }
        }
      }
      if(field=='oldMax'){
        if(ads.oldMin==''){
          error['oldMin']=true;
        }else{
          error['oldMin']=false;
          if(parseInt(ads.oldMax)<parseInt(ads.oldMin)){
            error['oldMin2']=true;
          }else{
            error['oldMin2']=false;
          }
        }
      }
      if(ads.km!=0&&ads.oldMax!=''&&ads.oldMin&&ads.gender!=''){
        console.log("ads ads ads", ads);
        this.props.actions.adsQuery(ads);
      }
    }
    return this.setState({ads:ads,error:error});
  }
  validatorForm() {
    let error=this.state.error;
    let dataForm=this.state.ads;
    let tmp=moment ().format("HH:mm");
    let tmp2=moment().format('DD/MM/YYYY');
    dataForm.dateStart=dataForm.dateTmp+' '+dataForm.time.timeTmp.format("HH:mm");
    let check=true;

    if(dataForm.oldMin==''){
      error['oldMin']=true;
      check=false;
    }
    if(dataForm.oldMax==''){
      error['oldMax']=true;
      check=false;
    }
    if(dataForm.name==''){
      error['name']=true;
      check=false;
    }
    console.log("dataForm.job dataForm.job", dataForm.job);
    if(dataForm.job ==''){
      error['job']=true;
      check=false;
    }
    if(dataForm.dateTmp==''){
      error['dateTmp']=true;
      check=false;
    }
    if(dataForm.dateStart==''){
      error['dateStart']=true;
      check=false;
    }
    if(this.state.isChangeDateTime){
      if(dataForm.dateTmp<tmp2){
        check=false;
      }
      if(dataForm.dateTmp==tmp2){
        if(dataForm.time.timeTmp.format("HH:mm")<tmp){
          error['timeTmp']=true;
          check=false
        }else{
          error['timeTmp']=false;
        }
      }else{
        error['timeTmp']=false;
      }
    }
    if(dataForm.total==0){
      error['total']=true;
      check=false;
    }
    this.setState({error:error, ads:dataForm});
    return check;
  }

  submitHandler(e) {
    e.preventDefault();
    if(this.validatorForm()==true){
      this.setState({isSubmit:true});
      if(this.props.route.path=="/advertisement/:id/update"){
        if(this.state.ads.state == 0){
          this.props.actions.updateAds(this.state.ads);
        }
      }else{
        this.props.actions.addAds(this.state.ads);
      }
    }else{
      this.setState({isSubmit:false})
    }
  }
  render(){
    const formatkg = value => value + ' Km';
    let cpnOld=[];
    for (let i=1;i<=100;i++){
      cpnOld.push(<option value={i} key={i}>{i}</option>);
    }
    return(
      <div>
        <Helmet
          title="Quảng cáo"
        />
        {this.state.isReady==false?<LoadingTable/>:
        <div className="accept-friend">
          <h4>{this.props.lng.POST_ADS_CREATE_OBJECTIVE_TITLE}</h4>
          <div className="p_ads_content">
            <div className="p_row_ads">
              <div className="p_cell_30 pull-left">
                <li className="nomal">{this.props.lng.POST_ADS_CREATE_NAME_HINT}</li>
              </div>
              <div className="p_cell-70 pull-left">
                <input type="text"
                       name="name"
                       style={{width:'100%', height:'35px', padding:'0px 10px'}}
                       className="input-radius-2"
                       value={this.state.ads.name}
                       onChange={this.updateState}/>
                {this.state.error.name?<HelpBlock>{this.props.lng.POST_ADS_CREATE_WARNING_NAME}</HelpBlock>:null}
              </div>
            </div>
            <div className="p_row_ads-2">
              <div className="p_cell_30 pull-left">
                  <li className="km">{this.props.lng.POST_ADS_RADIUS}</li>
              </div>
              <div className="p_cell-70 pull-left">
                <Slider
                  min={0}
                  max={20}
                  value={this.state.ads.km}
                  onChange={this.handleChange}
                  format={formatkg}
                  labels={{0:'0Km',10:'10Km' ,20:'20Km'}}
                />
                {this.state.error.km?<HelpBlock style={{marginTop:"30px"}}>{this.props.lng.POST_ADS_WARNING_RADIUS}</HelpBlock>:null}
              </div>
            </div>
            <div className="p_row_ads">
              <div className="p_cell_30 pull-left">
                <li className="nomal">{this.props.lng.POST_ADS_CREATE_AGE}</li>
              </div>
              <div className="p_cell-70 pull-left">
                <div className="p_cell-40 pull-left">
                  <select className="form-control input-radius-2"
                          onChange={this.updateState}
                          value={this.state.ads.oldMin}
                          name="oldMin">
                    <option value="-1"> Tất cả</option>
                    {cpnOld}
                  </select>
                </div>
                <div className="p_cell-20 pull-left text-center"> - </div>
                <div className="p_cell-40 pull-left">
                  <select className="form-control input-radius-2"
                          onChange={this.updateState}
                          value={this.state.ads.oldMax}
                          name="oldMax">
                    <option value="-1"> Tất cả</option>
                    {cpnOld}
                  </select>
                </div>
                {this.state.error.oldMin?<HelpBlock>{this.props.lng.POST_ADS_CREATE_WARNING_AGE}</HelpBlock>:null}
                {this.state.error.oldMin2?<HelpBlock>{this.props.lng.POST_ADS_CREATE_WARNING_AGE}</HelpBlock>:null}
              </div>
            </div>
            <div className="p_row_ads">
              <div className="p_cell_30 pull-left">
                <li className="nomal">{this.props.lng.POST_ADS_CREATE_GENDER}</li>
              </div>
              <div className="p_cell-70 pull-left">
                <select className="form-control input-radius-2"
                        onChange={this.updateState}
                        value={this.state.ads.gender}
                        name="gender">
                  <option value="1">{this.props.lng.SEX_MALE}</option>
                  <option value="2">{this.props.lng.SEX_FEMALE}</option>
                  <option value="0">{this.props.lng.SEX_ALL}</option>
                </select>
                {this.state.error.gender?<HelpBlock>{this.props.lng.POST_ADS_CREATE_WARNING_GENDER}</HelpBlock>:null}
              </div>
            </div>
            <div className="p_row_ads">
              <div className="p_cell_30 pull-left">
                <li className="nomal">{this.props.lng.POST_ADS_CREATE_JOB}</li>
              </div>
              <div className="p_cell-70 pull-left">
                <select className="form-control input-radius-2"
                        onChange={this.updateState}
                        value={this.state.ads.job}
                        name="job">
                  <option key="-1" value="-1"> Tất cả</option>
                  {this.state.data.map(item=>
                    <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                {this.state.error.job?<HelpBlock>{this.props.lng.POST_ADS_CREATE_GET_JOB}</HelpBlock>:null}
              </div>
            </div>
            <div className="p_row_ads-2">
              <div className="p_cell_30 pull-left">
                <li className="nomal">{this.props.lng.POST_ADS_CREATE_DATE}</li>
              </div>
              <div className="p_cell-70 pull-left">
                <div className="pull-left" style={{width:'70%',marginBottom:'5px'}}>
                  <DatePicker dateFormat="DD/MM/YYYY"
                              value={utils.format_date(this.state.ads.dateTmp)}
                              onChange={this.onChangeBirthday}
                  />
                </div>
                <div className="pull-left" style={{width:'30%',marginBottom:'5px'}}>
                  <TimePicker
                    style={{ width: 100+'%' }}
                    showSecond={showSecond}
                    className="xxx"
                    onChange={this.handleValueChange}
                    name="timeTmp"
                    value={this.state.ads.time.timeTmp}
                  />
                </div>
                {this.state.error.dateTmp?<HelpBlock>{this.props.lng.POST_ADS_VALIDATE_DATE_START}</HelpBlock>:null}
                {this.state.error.timeTmp?<HelpBlock>{this.props.lng.POST_ADS_VALIDATE_TIME_START}</HelpBlock>:null}
                {this.state.error.dateStart?<HelpBlock>{this.props.lng.POST_ADS_VALIDATE_TIME_START_2}</HelpBlock>:null}
              </div>
            </div>
            <div className="p_row_ads">
              <div className="p_cell_30 pull-left">

              </div>
              <div className="p_cell-70 pull-right">
                <p style={{fontSize:'16px', color:'#14b577'}}>{this.props.lng.POST_ADS_CREATE_ESTIMATE_USER}{this.state.ads.total}</p>
                {this.state.error.total?<HelpBlock>{this.props.lng.POST_ADS_CREATE_WARNING_CAN_NOT_RUNNING_ADS}</HelpBlock>:null}
              </div>
            </div>
            <div className="p_row_ads">
              <div className="p-total-money pull-left">
                <div className="">
                  <p className="pull-left color-primary">{this.props.lng.POST_ADS_CREATE_ESTIMATE_ACOIN(this.state.ads.budget.toLocaleString())}</p>
                </div>
              </div>
              {
                this.state.ads.state == 0 || !this.state.ads.state?
                  <div className="pull-right">
                    <button className="p-button-create-ads" onClick={!this.state.isSubmit?this.submitHandler:null}
                            disabled={this.state.isSubmit||this.state.isAcoin}>{this.state.isSubmit?this.props.lng.POST_CREATE_BUTTON_SAVING:this.props.lng.POST_CREATE_BUTTON_SAVE}</button>
                  </div>
                :
                  ''
              }
            </div>
          </div>
          <ToastContainer
            toastMessageFactory={ToastMessageFactory}
            ref="container"
            className="toast-top-right"
          />
        </div>}
      </div>
    );
  }
}

CreateUpdateAdsPost.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.adsReducer,
    data:PropTypes.array
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(adsAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateUpdateAdsPost);
