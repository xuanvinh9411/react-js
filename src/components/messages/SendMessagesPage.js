/*
 * Created by TrungPhat on 1/20/2017
 */
import React,{PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as messageAction from '../../actions/messageAction';
import * as actionType from '../../actions/actionTypes';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Pagination} from 'react-bootstrap';
import {connect} from 'react-redux';
import SendMessagesList from '../messages/SendMessagesList';
import {bindActionCreators} from 'redux';
import {Helmet} from "react-helmet";
import {ToastContainer, ToastMessage} from "react-toastr";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let utils=require('../../utils/Utils')

class SendMessagesPage extends React.Component{
  initialUserTo(){
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
  inititalStateReBoot(){
    return {
      isGetUser: false,
      isLoadListByUserTo: false,
      isSendMessage: false
    }
  }
  constructor(props, context){
    super(props, context);
    this.state={
      userTo:this.initialUserTo(),
      userFrom:Aes.aesDecrypt(localStorage.getItem('user')),
      message:'',
      msg:[],
      error:{},
      status:'',
      messagesThreadId:[],
      unMount:'',
      increments:0,
      userIdFriend:'',
      idFriend:'',
      reboot: this.inititalStateReBoot()
    }
    this.onSendMessage=this.onSendMessage.bind(this);
    this.updateState=this.updateState.bind(this);
    this.handleSelect=this.handleSelect.bind(this);
    this.onLoadMessageByThread=this.onLoadMessageByThread.bind(this);
    this.getInfoUserById = this.getInfoUserById.bind(this);
    this.loadDataMessageWillMount = this.loadDataMessageWillMount.bind(this)
  }

  componentWillMount(){
    this.getInfoUserById(this.props.params.id);
    this.props.actions.trackingFriend({userIdFriend:this.props.params.id});
    this.loadDataMessageWillMount(this.props.params.id);
    var data=setInterval(this.onLoadMessageByThread, Constants.TIME_RELOAD);
    this.setState({unMount:data});
  }
  getInfoUserById(id){
    let reboot = this.state.reboot;
    reboot.isGetUser = true;
    this.setState({reboot: reboot});
    this.props.actions.getUserById({id:id});
  }
  loadDataMessageWillMount(id){
    let reboot = this.state.reboot;
    reboot.isLoadListByUserTo = true;
    this.setState({reboot: reboot});
    this.props.actions.listByUserTo({idUserTo: id});
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  componentWillUnmount(){
    clearInterval(this.state.unMount);
  }

  onLoadMessageByThread(){
    if(this.state.userTo){
      if(this.state.userTo.id&&this.state.increments){
        let reboot = this.state.reboot;
        reboot.isLoadListByUserTo = true;
        this.setState({reboot: reboot});
        this.props.actions.listByUserTo({idUserTo: this.props.params.id,increments:this.state.increments});
      }
    }
  }

  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    })
    this.loadData(eventKey-1);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result={};
      switch (type){
        case actionType.GET_USER_SUCCESS:
          if(this.state.reboot.isGetUser){
            result=nextProps.dataMessage.dataUser;
            if(result.code==Constants.RESPONSE_CODE_SUCCESS){
              let user=Object.assign(this.state.userTo, result.data.user);
              this.setState({userTo:user});
            }else{
              this.getInfoUserById(this.props.params.id)
            }
            let reboot = this.state.reboot;
            reboot.isGetUser = false;
            this.setState({reboot:reboot});
          }
          break;
        case actionType.TRACKING_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataShops;
          if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
            this.props.actions.trackingFriend({userIdFriend:this.props.params.id});
          }else{
            if(result.code!=Constants.RESPONSE_CODE_SUCCESS){
              browserHistory.push('/');
            }
          }
          break;
      }
    }
    if(nextProps.dataListUser.dataUser){
      let type=nextProps.dataListUser.type;
      let result='';
      switch (type){
        case actionType.GET_LIST_BY_USERTO_SUCCESS:
          if(this.state.reboot.isLoadListByUserTo){
            result=nextProps.dataListUser.dataUser;
            if(result.code==Constants.RESPONSE_CODE_SUCCESS){
              let increments = this.state.increments, listMessageResult = [];
              if(result.data.messages[0]){
                let number=result.data.messages.length-1;
                if(result.data.messages[number].increments){
                  increments=result.data.messages[number].increments;
                }
              }
              listMessageResult=result.data.messages;
              let messagesThreadId = this.state.messagesThreadId;
              /* Load lần đầu */
              if(result.params.increments == 0){
                messagesThreadId = listMessageResult;
              }else{
                /* Lặp mảng tin nhắn mới, nếu tìm không có trong mảng dữ liệu thì thêm vô, ngược lại bỏ qua */
                for(let i in listMessageResult){
                  let checkElementInArray = messagesThreadId.filter((messagesThreadId) =>{
                    return messagesThreadId.id === listMessageResult[i].id;
                  });
                  if(checkElementInArray.length == 0){
                    messagesThreadId.push(listMessageResult[i]);
                  }
                }
              }
              this.setState({messagesThreadId:messagesThreadId, increments:increments});
            }
            let reboot = this.state.reboot;
            reboot.isLoadListByUserTo = false;
            this.setState({reboot: reboot});
          }
          break;
        case actionType.SEND_MESSAGE_SUCCESS:
          if(this.state.reboot.isSendMessage){
            result=nextProps.dataListUser.dataUser;
            if(result.code==Constants.RESPONSE_CODE_SUCCESS){
              /*this.setState({message:'', isSubmit:false});
              this.props.actions.listByUserTo({idUserTo: this.props.params.id});*/
              let messagesThreadId = this.state.messagesThreadId;
              let rs = result.data.message;
              rs.userFrom = this.state.userFrom;
              messagesThreadId.push(rs);
              this.setState({message:'', isSubmit:false, messagesThreadId:messagesThreadId});
            }
            let reboot = this.state.reboot;
            reboot.isSendMessage = false;
            this.setState({reboot: reboot});
          }
          break;
      }
    }
  }
  componentDidUpdate() {
    let element = document.getElementById("msg-scroll");
    if(element!=null){
      element.scrollTop=element.scrollHeight+10;
    }
  }
  updateState(event){
    const field=event.target.name;
    let valueField=event.target.value;
    let error=this.state.error;
    if(field=='message'){
      error[field]=valueField.length==0;
    }
    let message=this.state.message;
    message=valueField;
    return this.setState({message:message,error:error});
  }
  validatorForm() {
    let error=this.state.error;
    let dataForm=this.state.message;
    let check=true;

    if(dataForm.length==0){
      error['phone']=true;
      check=false;
    }
    this.setState({error:error});
    return check;
  }
  onSendMessage(e){
    //e.preventDefault();
    if(this.validatorForm()){
      let reboot = this.state.reboot;
      reboot.isSendMessage = true;
      this.setState({isSubmit:true, reboot:reboot});
      this.props.actions.sendMessage({message:this.state.message, idTo:this.props.params.id, title:this.state.userTo.fullname?this.state.userTo.fullname:''});
    }
  }
  search() {
    this.onSendMessage();
  }
  onTrackingFriend(id){
    let user = Aes.aesDecrypt(localStorage.getItem('user'));
    if(user.id == id){
      browserHistory.push(urlOnPage.user.userMyProfile);
    }else{
      this.setState({idFriend: id});
      this.props.actions.trackingFriend({userIdFriend:id, shopinfo: 1});
    }
  }
  render(){
    return(
      <div id="send-message">
        <Helmet
          title="Tin nhắn"
        />
        <div className="box box-warning direct-chat direct-chat-warning list-inbox inbox">
          <div className="box-header with-border">
            {/*<h3 className="box-title">{this.state.userTo.fullname}</h3>*/}
          </div>
          <div className="box-body">
            <div className="direct-chat-messages msg-scroll" id="msg-scroll">
              <SendMessagesList
                messages={this.state.messagesThreadId}
                onTrackingFriend = {this.onTrackingFriend.bind(this)}
              />
            </div>
          </div>
          <div className="box-footer">
            <div className="input-group">
              <input
                type="text"
                name="message"
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    this.search();
                  }
                }}
                placeholder={this.props.lng.MESSAGE_INPUT_PLACEHOLDER}
                className="form-control"
                onChange={this.updateState}
                value={this.state.message}
              />
              <span className="input-group-btn">
                <button type="button"
                        className="btn btn-warning btn-flat"
                        disabled={this.state.isSubmit}
                        onClick={!this.state.isSubmit?this.onSendMessage:null}>
                    {this.state.isSubmit?<span className="fa fa-spinner fa-pulse fa-fw"/>:this.props.lng.POST_VIEW_COMMENT_SEND}</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
SendMessagesPage.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.messageReducer,
    dataListUser: state.listMessageUserByIdReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(messageAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SendMessagesPage);
