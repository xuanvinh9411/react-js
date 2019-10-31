/*
 * Created by TrungPhat on 29/03/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as transactionAction from '../../actions/transactionAction';
import * as actionTypes from '../../actions/actionTypes';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio, Modal} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ToastContainer, ToastMessage} from "react-toastr";
import LoadingTable from '../controls/LoadingTable';
import {Helmet} from "react-helmet";

const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let _=require('../../utils/Utils');
class ACoinTransfer extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state={
      error: {},
      money:0,
      user:Aes.aesDecrypt(localStorage.getItem('user')),
      friend:{},
      transfer:{balance:0, note:'', idUserReceived:this.props.params.id},
      isSubmit:false,
      isReady:false,
      ref:'',
      otp:'',
      isSuccess:false
    };
    this.submitHandler=this.submitHandler.bind(this);
    this.updateState=this.updateState.bind(this);
  }

  componentWillMount(){
    if(this.props.route.path=='/acoin-transfer/:id/confirm'||this.props.route.path=='/acoin-transfer/:id/success'){
      browserHistory.push('/acoin-transfer/'+this.props.params.id);
    }
    this.setState({isReady:true});
    this.props.actions.getMoney();
    this.props.actions.getUserById(this.props.params.id);
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  componentWillReceiveProps(nextProps){
    let type=nextProps.dataMessage.type;
    let result='';
    switch (type){
      case actionTypes.GET_MONEY_SUCCESS:
        result=nextProps.dataMessage.data;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          this.setState({money: result.data.balance, isReady:false});
        }else{
          if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
            this.props.actions.getMoney();
          }
        }
        break;
      case actionTypes.GET_USER_SUCCESS:
        result=nextProps.dataMessage.dataUser;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          this.setState({friend:result.data.user, isReady:false});
        }else{
          if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
            this.props.actions.getUserById(this.props.params.id);
          }
        }
        break;
      case actionTypes.TRANSFER_REQUEST_SUCCESS:
        result=nextProps.dataMessage.data;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          if(this.state.isSubmit==true){
            this.setState({isReady:false, ref:result.data.ref, isSubmit:false});
            browserHistory.push('/acoin-transfer/'+this.props.params.id+'/confirm')
          }
        }else{
          if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
            this.refs.container.warning(this.props.lng.FAIL_OTP, `Thông báo.`, {
              closeButton: true,
            });
            this.setState({isReady:false, isSubmit:false});
          }else{
            this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
              closeButton: true,
            });
            this.setState({isReady:false, isSubmit:false});
          }
        }
        break;
      case actionTypes.TRANSFER_MONEY_SUCCESS:
        result=nextProps.dataMessage.data;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          if(this.state.isSubmit==true){
            this.setState({isSuccess:true, isSubmit:false, isReady:false})
            browserHistory.push('/acoin-transfer/'+this.props.params.id+'/success')
          }
        }else{
          if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
            this.refs.container.warning(this.props.lng.FAIL_OTP, `Thông báo.`, {
              closeButton: true,
            });
            this.setState({isReady:false, isSubmit:false});
          }else{
            if(this.state.isSubmit){
              if(result.code==118){//Qua thoi gian
                this.refs.container.error(this.props.lng.MOVE_COIN_WARNING_OTP, `Thông báo.`, {
                  closeButton: true,
                });
                this.setState({isReady:false,isSubmit:false})
              }else{
                if(result.code == 117){
                  this.props.toastMessage.error(this.props.lng.MOVE_COIN_WARNING_OTP, `Thông báo.`, {
                    closeButton: true,
                  });
                  browserHistory.push('/danh-sach-ban-be');
                }else{
                  this.refs.container.error(this.props.lng.MOVE_COIN_WARNING_OTP, `Thông báo.`, {
                    closeButton: true,
                  });
                  this.setState({isReady:false,isSubmit:false})
                }
              }
              this.setState({isSubmit:false});
            }
          }
        }
    }
  }

  updateState(event){
    let transfer=this.state.transfer;
    let otp=this.state.otp;
    const field=event.target.name;
    let valueField=event.target.value;
    let error=this.state.error;
    if(this.state.ref!=''){
      if(field=='otp'){
        error[field]=valueField==0;
      }
      otp=valueField.toString();
      return this.setState({otp:otp,error:error});
    }else{
      if(field=='balance'){
        if(_.validatePhoneNumber(valueField)==true){
          error['isNumber']=false;
          if(_.isInt(valueField)){
            if(valueField<0){
              error['isNumber']=true;
            }else if(valueField==0){
              error['isNumber']=false;
              error[field]=true;
            }else if(valueField>this.state.money){
              error[field]=false;
              error[field+'2']=true;
            }else{
              error[field+'2']=false;
              error[field]=false;
            }
          }
        }else{
          error['isNumber']=true;
          error[field]=false;
        }
        transfer[field]=valueField;
      }
      /*if(field=='balance'){
        error['balance2']=valueField>this.state.money;
      }*/
      if(field=='note'){
        error[field]=valueField.length==0;
        transfer[field]=valueField;
      }
      return this.setState({transfer:transfer,error:error});
    }
  }
  validatorForm() {
    let error=this.state.error;
    let dataForm=this.state.transfer;
    let check=true;
    if(this.state.ref!=''){
      if(this.state.otp.length==0){
        error['otp']=true;
        check=false;
      }
    }else{
      /*if(dataForm.balance==0){
        error['balance']=true;
        check=false;
      }
      if(dataForm.balance>this.state.money){
        error['balance2']=true;
        check=false;
      }*/
      let valueField=dataForm.balance;
      let field='balance';
      if(_.validatePhoneNumber(valueField)==true){
        error['isNumber']=false;
        if(_.isInt(valueField)){
          if(valueField<0){
            error['isNumber']=true;
            check=false;
          }else if(valueField==0){
            error['isNumber']=false;
            error[field]=true;
            check=false;
          }else if(valueField>0){
            error[field]=false;
            if(valueField>this.state.money){
              error[field+'2']=true;
              check=false;
            }
          }else{
            error[field+'2']=false;
            //error[field]=false;
          }
        }
      }else{
        error['isNumber']=true;
        error[field]=false;
        check=false;
      }
      if(dataForm.note.length==0){
        error['note']=true;
        check=false;
      }
    }
    this.setState({error:error});
    return check;
  }
  submitHandler(e) {
    e.preventDefault();
    if(this.validatorForm()==true){
      this.setState({isSubmit:true, isReady:true});
      if(this.state.ref==''){
        this.props.actions.tranferRequest(this.state.transfer);
      }else{
        let data={otp:this.state.otp, ref:this.state.ref};
        this.props.actions.tranferMoney(data);
      }
    }else{
      this.setState({isSubmit:false});
    }
  }
  render(){
    let cpnUL="";
    if(this.state.ref==''){
      cpnUL=<ul className="tab">
        <li className="tab-item active"><Link>1. {this.props.lng.MOVE_COIN_TITLE_1}</Link></li>
        <li className="tab-item"><Link>2. {this.props.lng.MOVE_COIN_TITLE_2}</Link></li>
        <li className="tab-item"><Link>3. {this.props.lng.MOVE_COIN_TITLE_3}</Link></li>
      </ul>
    }else{
      if(this.state.isSuccess){
        cpnUL=<ul className="tab">
          <li className="tab-item"><Link>1. {this.props.lng.MOVE_COIN_TITLE_1}</Link></li>
          <li className="tab-item"><Link>2. {this.props.lng.MOVE_COIN_TITLE_2}</Link></li>
          <li className="tab-item active"><Link>3. {this.props.lng.MOVE_COIN_TITLE_3}</Link></li>
        </ul>
      }else{
        cpnUL=<ul className="tab">
          <li className="tab-item"><Link>1. {this.props.lng.MOVE_COIN_TITLE_1}</Link></li>
          <li className="tab-item active"><Link>2. {this.props.lng.MOVE_COIN_TITLE_2}</Link></li>
          <li className="tab-item"><Link>3. {this.props.lng.MOVE_COIN_TITLE_3}</Link></li>
        </ul>
      }
    }
    let balance=this.state.transfer.balance;
    return(
      <div id="acoin-transfer">
        <Helmet
          title="Acoin"
        />
        <header className="portlet-topper">
          <h1 className="portlet-title">
            <span className="portlet-title-text not-editable">{this.props.lng.MOVE_COIN_TITLE}</span>
          </h1>
        </header>
        <div className="tab-wrapper">
          {cpnUL}
          {this.state.isReady?<LoadingTable/>:
            <div className="tab-content">
              <form className="form-horizontal">
                <div className="t-box-body">
                  <div className="wrap-info clearfix">
                    <div className="width50 pull-left t-info-from">
                      <h4 className="t-content-header">{this.props.lng.MOVE_COIN_USER_FROM_INFO_TITLE}</h4>
                      <div className="t-content">
                        <p><strong>{this.props.lng.MOVE_COIN_USER_FROM_NAME}:</strong> {this.state.user.fullname}</p>
                        <p><strong>{this.props.lng.MOVE_COIN_USER_FORM_PHONE}:</strong> {this.state.user.phone}</p>
                        {this.state.isSuccess!=true?<p><strong>{this.props.lng.MOVE_COIN_USER_FROM_MONEY}:</strong> {_.format_price(this.state.money)}</p>:null}
                      </div>
                    </div>
                    <div className="width50 pull-left t-info-to">
                      <h4 className="t-content-header">{this.props.lng.MOVE_COIN_USER_TO_INFO_TITLE}</h4>
                      <div className="t-content">
                        <p><strong>{this.props.lng.MOVE_COIN_USER_TO_NAME}:</strong> {this.state.friend.fullname}</p>
                        <p><strong>{this.props.lng.MOVE_COIN_USER_TO_PHONE}:</strong> {this.state.friend.phone}</p>
                        {this.state.ref!=''?<p><strong>{this.props.lng.MOVE_COIN_USER_FROM_MONEY}:</strong> +{_.format_price(balance)}</p>:null}
                      </div>
                    </div>
                  </div>
                  {this.state.isSuccess==true?
                    <div className="wrap-acoin t-success">
                      <div className="t-success-info"><p className="fa fa-check-circle fa-2x"/><span>{this.props.lng.MOVE_COIN_MOVE_COIN_SUCCESS}</span></div>
                    </div>
                  :null}
                  {this.props.route.path=='/acoin-transfer/:id'?
                  <div className="wrap-acoin">
                    <FormGroup>
                      <div className="col-sm-9">
                        <span>{this.props.lng.MOVE_COIN_AMOUNT_HINT}:</span>
                        <input className="form-control"
                               type="text"
                               name="balance"
                               value={this.state.transfer.balance}
                               onChange={this.updateState}
                        />
                        {this.state.error.balance?<HelpBlock style={{fontWeight: '400',fontStyle: 'italic',color: 'red'}}>{this.props.lng.MOVE_COIN_WARNING_MONEY}</HelpBlock>:null}
                        {this.state.error.balance2?<HelpBlock style={{fontWeight: '400',fontStyle: 'italic',color: 'red'}}>{this.props.lng.MOVE_COIN_MONEY}</HelpBlock>:null}
                        {this.state.error.isNumber?<HelpBlock style={{fontWeight: '400',fontStyle: 'italic',color: 'red'}}>{this.props.lng.MOVE_COIN_MONEY_ISNUMBER}</HelpBlock>:null}

                      </div>
                    </FormGroup>
                    <FormGroup>
                      <div className="col-sm-9">
                        <span>{this.props.lng.MOVE_COIN_MESSAGE_HINT}:</span>
                        <textarea
                          className="form-control"
                          rows="5"
                          name="note"
                          value={this.state.transfer.note}
                          onChange={this.updateState}
                        />
                        {this.state.error.note?<HelpBlock style={{fontWeight: '400',fontStyle: 'italic',color: 'red'}}>{this.props.lng.MOVE_COIN_WARNING_MESSAGE}</HelpBlock>:null}
                      </div>
                    </FormGroup>
                  </div>:this.props.route.path=='/acoin-transfer/:id/success'?null:
                  <div className="wrap-acoin confirm-transfer">
                    <FormGroup>
                      <div className="col-sm-9">
                        <span>Mã xác thực:</span>
                        <input className="form-control"
                               type="text"
                               name="otp"
                               value={this.state.otp}
                               onChange={this.updateState}
                        />
                        {this.state.error.otp?<HelpBlock style={{fontWeight: '400',fontStyle: 'italic',color: 'red'}}>{this.props.lng.MOVE_COIN_OTP_NOTIFICATION}</HelpBlock>:null}
                      </div>
                    </FormGroup>
                    <p style={{fontStyle: 'italic'}}>{this.props.lng.MOVE_COIN_OTP_NOTIFICATION_WEB}
                      <br/>{this.props.lng.MOVE_COIN_OTP_NOTIFICATION_WEB2}</p>
                  </div>}
                  {this.state.isSuccess==false?<div className="t-list-btn">
                    <button className="t-btn-submit" onClick={!this.state.isSubmit?this.submitHandler:null}
                            disabled={this.state.isSubmit}>{this.state.isSubmit?this.props.lng.MOVE_COIN_MOVING:this.props.lng.MOVE_COIN_BUTTON_NEXT}</button>
                  </div>:null}
                </div>
              </form>
            </div>}
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

ACoinTransfer.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.transactionReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(transactionAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ACoinTransfer);
