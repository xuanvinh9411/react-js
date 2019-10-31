/*
 * Created by TrungPhat on 11/04/2017
 */
import React,{PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as messageAction from '../../actions/messageAction';
import * as actionType from '../../actions/actionTypes';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Pagination} from 'react-bootstrap';
import {connect} from 'react-redux';
import SendMessagesList from '../messages/SendMessagesList';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import {ToastContainer, ToastMessage} from "react-toastr";
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let utils=require('../../utils/Utils')

class SendMessagesPage extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state={
      userTo:-1,
      userFrom:Aes.aesDecrypt(localStorage.getItem('user')),
      message:'',
      messagesThreadId:[],
      error:{},
      unMount:'',
      increments:0,
      id:1
    }
    this.onSendMessage=this.onSendMessage.bind(this);
    this.updateState=this.updateState.bind(this);
    this.onLoadMessageByThread=this.onLoadMessageByThread.bind(this);
  }

  componentWillMount(){
    this.props.actions.trackingFriend({userIdFriend:this.props.params.id});
    this.props.actions.listByUserTo({idUserTo: this.props.params.id});
    var data=setInterval(this.onLoadMessageByThread, 5000);
    this.setState({unMount:data});
  }

  componentWillUnmount(){
    clearInterval(this.state.unMount);
  }

  onLoadMessageByThread(){
    this.props.actions.listByUserTo({idUserTo: this.props.params.id,increments:this.state.increments});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result={};
      switch (type){
        case actionType.TRACKING_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataShops;
          if(result.code!=Constants.RESPONSE_CODE_SUCCESS){
            browserHistory.push('/');
          }
          break;
      }
    }
    if(nextProps.dataListUser.dataUser){
      let type=nextProps.dataListUser.type;
      let result='';
      switch (type){
        case actionType.GET_LIST_BY_USERTO_SUCCESS:
          result=nextProps.dataListUser.dataUser;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let element = document.getElementById("msg-scroll");
            if(element!=null){
              element.scrollTop=element.scrollHeight+10;
            }
            let increments, data;
            if(result.data){
              if(result.data.messages[0]){
                let number=result.data.messages.length-1;
                if(result.data.messages[number]){
                  if(result.data.messages[number].increments){
                    increments=result.data.messages[number].increments;
                  }
                }
              }
            }
            data=result.data.messages;
            this.setState({messagesThreadId:data, increments:increments});
          }
          break;
        case actionType.SEND_MESSAGE_SUCCESS:
          result=nextProps.dataListUser.dataUser;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            /*let messagesThreadId=this.state.messagesThreadId;
             let data={id:this.state.id,message:this.state.message,userFrom:this.state.userFrom, createAt:moment().format('DD/MM/YYYY'),
             increments:this.state.increments};
             messagesThreadId=messagesThreadId.push(data);
             let id=this.state.id;
             id+=1*/
            if(this.state.isSubmit==true){
              this.onLoadMessageByThread();
              this.setState({message:'', isSubmit:false/*, messagesThreadId:messagesThreadId, id:id*/});
            }
          }
          break;
      }
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
    e.preventDefault();
    if(this.validatorForm()){
      this.setState({isSubmit:true});
      this.props.actions.sendMessage({message:this.state.message, idTo:this.props.params.id, title:''});
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
          </div>
          <div className="box-body">
            <div className="direct-chat-messages msg-scroll" id="msg-scroll">
              <SendMessagesList
                messages={this.state.messagesThreadId}
              />
            </div>
          </div>
          <div className="box-footer">
            <div className="input-group">
              <input
                type="text"
                name="message"
                placeholder="Nhập văn bản..."
                className="form-control"
                onChange={this.updateState}
                value={this.state.message}
              />
              <span className="input-group-btn">
                <button type="button"
                        className="btn btn-warning btn-flat"
                        onClick={this.onSendMessage}
                        style={{fontSize:'14px', fontWeight:'600'}}
                >Gửi</button>
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
