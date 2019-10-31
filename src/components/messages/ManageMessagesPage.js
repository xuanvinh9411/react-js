/*
 * Created by TrungPhat on 1/17/2017
 */
import React,{PropTypes} from 'react';
import * as messageAction from '../../actions/messageAction';
import * as actionType from '../../actions/actionTypes';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {bindActionCreators} from 'redux';
import MessagesUsersList from './MessagesUsersList';
import MessagesList from './MessagesList';
import * as ReactDOM from 'react-dom';
import ReactInterval from 'react-interval';
import LoadingTable from '../controls/LoadingTable';
import {Helmet} from "react-helmet";
let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let utils=require('../../utils/Utils');
let urlOnPage=require('../../url/urlOnPage');

class ManageMessagesPage extends React.Component{
  initialStateStatus(){
    return {
      isLoadListMessage: false, /* Gọi danh sách tin nhắn của tất cả những người gửi tới*/
      isLoadDetailMessage: false, /* Gọi nội dung chat giữa 2 người */
      isSendMessage: false
    }
  }
  constructor(props, context){
    super(props, context);
    this.state={
      userTo:'',
      messages:[],//List message
      threadId:'',//Store threadId
      errorSend:'',
      title:'',//Title of chat box when user click
      messagesThreadId:[],//Message by threadId
      messageSend:'',//Tin nhan gui di
      userFrom:Aes.aesDecrypt(localStorage.getItem('user')),//User current (online)
      totalMess:0,
      totalItemPaging:0,
      pageNext:'',
      countItemPaging:'',
      isLoading: false,
      increments:0,
      unMount:'',
      listMessage:'',
      isClick:false,
      showU: true,
      tmp:false,
      deleteMessage:{
        threadId:'',
        isDel: false
      },
      status: this.initialStateStatus(),
      messageSendResult:[],
      pageNumber: 0
    }
    this.onSendMessage=this.onSendMessage.bind(this);
    this.updateState=this.updateState.bind(this);
    this.onLoadData=this.onLoadData.bind(this);
    this.handleSelect=this.handleSelect.bind(this);
    this.onLoadMessageByThread=this.onLoadMessageByThread.bind(this);
    this.onDeleteMessage=this.onDeleteMessage.bind(this);
  }
  /* ------------------------ /
  /* Hàm chạy đầu tiên - Gọi hàm lấy danh sách tin nhắn  */
  /* ----------------------- */
  componentWillMount(){
    this.onLoadData(0);
  }

  componentDidMount(){
    window.scrollTo(0,0);
  }
  /* Xóa autoload khi thoát khỏi */
  componentWillUnmount(){
    clearInterval(this.state.listMessage);
    this.state.messagesThreadId.length = 0;
  }

  /* ------------------------ /
  /* Lấy danh sách tin nhắn  */
  /* ----------------------- */
  onLoadData(page){
    /* Thêm trạng thái chống reboot dữ liệu */
    let status = this.state.status;
    status.isLoadListMessage = true;
    this.setState({status: status});
    this.props.actions.loadMessage({page:page});
  }

  /* ------------------------ /
  /* Lấy nội dung tin nhắn giữa 2 user  */
  /* ----------------------- */
  onLoadMessageByThread(){
    /* Thêm trạng thái chống reboot dữ liệu */
    let status = this.state.status;
    status.isLoadDetailMessage = true;
    this.setState({status: status});
    if(this.state.threadId!=''&&this.state.increments){
      this.props.actions.listByThread({threadId:this.state.threadId, increments:this.state.increments});
    }
  }


  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage!=null){
      let type=nextProps.dataMessage.type;
      let result='';
      switch (type){
        case actionType.LOAD_INBOX_SUCCESS:
          if(this.state.status.isLoadListMessage){
            result=nextProps.dataMessage.dataUser;
            if(result.code==Constants.RESPONSE_CODE_SUCCESS){
              this.setState({
                messages:result.data.messages,
                totalMess:result.data.total,
                totalItemPaging:result.data.totalItemPaging,
                pageNext:result.data.page + 1,
                isLoading:false,
                pageNumber: Math.ceil(result.data.total /result.data.totalItemPaging)
              });
            }else{
              if(result.code==Constants.RESPONSE_CODE_SUCCESS){
                setTimeout(this.onLoadData(0), Constants.TIME_RELOAD);
              }else{
                this.setState({isLoading:false});
              }
            }
            let status = this.state.status;
            status.isLoadListMessage = false;
            this.setState({status: status});
          }
          break;
        case actionType.DELETE_MESSAGE_SUCCESS:
          result=nextProps.dataMessage.dataUser;
          if(result.code == Constants.RESPONSE_CODE_SUCCESS){
            if(this.state.deleteMessage.isDel){
              let threadId = this.state.deleteMessage.threadId;
              let messages = this.state.messages;
              for(let i in messages){
                if(messages[i]){
                  if(messages[i].threadId == threadId){
                    messages.splice(i, 1);
                  }
                }
              }
              let deleteMessage = this.state.deleteMessage;
              deleteMessage.isDel = false;
              this.setState({messages:messages, totalMess:parseInt(this.state.totalMess - 1)});
              this.props.toastMessage.success(this.props.lng.TEXT_SUCCESS, 'Thành công');
            }
          }else if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
            this.props.actions.deleteMessage({threadId:this.state.deleteMessage.threadId});
          }else{
            this.props.toastMessage.success(this.props.lng.MESSAGE_MSG_DELETE_INBOX_FAILED, 'Thành công');
          }
          break;
        case actionType.TRACKING_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataShops;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(result.data.user){
              utils.setTemporaryData('infoFriend', result.data);
              browserHistory.push(urlOnPage.user.userViewProfileFriend+result.data.user.id);
            }
          }else{
            this.onTrackingFriend(this.state.idFriend);
          }
          break;
      }
    }
    if(nextProps.dataList.dataUser){
      let type=nextProps.dataList.type;
      let result='';
      switch (type){
        case actionType.GET_LIST_THREAD_SUCCESS:
          if(this.state.status.isLoadDetailMessage){
            result=nextProps.dataList.dataUser;
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
              this.setState({messagesThreadId:messagesThreadId, increments:increments,isClick:false});
            }else{
              if (result.code==Constants.RESPONSE_CODE_OTP_INVALID){
                setTimeout(this.onLoadMessageByThread, Constants.TIME_RELOAD);
              }
            }
            let status = this.state.status;
            status.isLoadDetailMessage = false;
            this.setState({status: status});
          }
          break;
        case actionType.SEND_MESSAGE_SUCCESS:
          result=nextProps.dataMessage.dataUser;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS) {
            if(this.state.status.isSendMessage){
              if(this.state.isSubmit==true){
                let messagesThreadId = this.state.messagesThreadId;
                let rs = result.data.message;
                rs.userFrom = this.state.userFrom;
                messagesThreadId.push(rs);
                /* Lưu lại để xóa khi gọi lại*/
                let messageSendResult = this.state.messageSendResult;
                messageSendResult.push(rs);
                this.setState({messageSend:'', isSubmit:false, messagesThreadId:messagesThreadId, messageSendResult: messageSendResult});
              }
              let status = this.state.status;
              status.isSendMessage = false;
              this.setState({status: status});
            }
          }else{
            this.setState({isSubmit:false});
          }
          break;
      }
    }
  }
  /* Khi kích vào một tin nhắn, gọi danh sách những đoạn chat lên */
  /* Nếu là tin nhắn chưa đọc thì giảm số lượng ở header */
  onClickMessages(params){
    clearInterval(this.state.listMessage);
    let data=this.state.messages;
    for(let key in data){
      if(data[key].threadId==params.threadId){
        data[key].state=1;
      }
    }
    if(this.state.threadId != params.threadId){
      /* Thêm trạng thái chống reboot dữ liệu */
      let status = this.state.status;
      status.isLoadDetailMessage = true;
      this.setState({status: status});
      this.setState({isClick:true,showU: false});
      if(params.state == 0){
        this.props.onChangeTotalMessageNew(true);
      }
      this.setState({threadId:params.threadId, messages:data, userTo:params.idTo, title:params.title});
      /* Gọi danh sách đoạn chat */
      this.props.actions.listByThread({threadId:params.threadId, increments:0});
      var listMessage=setInterval(this.onLoadMessageByThread, Constants.TIME_RELOAD);
      this.setState({listMessage:listMessage});
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
    let error=this.state.errorSend;
    if(field=='messageSend'){
      error=valueField.length==0;
    }
    let messageSend=this.state.messageSend;
    messageSend=valueField;
    return this.setState({messageSend:messageSend, error:error});
  }
  validatorForm() {
    let error=this.state.error;
    let dataForm=this.state.messageSend;
    let check=true;

    if(dataForm.length==0){
      error=true;
      check=false;
    }
    this.setState({error:error});
    return check;
  }
  onSendMessage(e){
    //e.preventDefault();
    if(this.validatorForm()){
      let data=this.state.messages;
      for(let key in data){
        if(data[key].threadId==this.state.threadId){
          data[key].message=this.state.messageSend;
        }
      }
      let status = this.state.status;
      status.isSendMessage = true;
      this.setState({isSubmit:true, messages:data, status:status});
      this.props.actions.sendMessage({
        message:this.state.messageSend,
        idTo:this.state.userTo,
        title:this.state.title,
        threadId:this.state.threadId
      });
    }
  }
  handleSelect() {
    this.onLoadData(this.state.pageNext);
  }
  search() {
    this.onSendMessage();
  }
  onDeleteMessage(threadId){
    if(threadId && confirm(this.props.lng.MESSAGE_MSG_DELETE_INBOX)){
      let deleteMessage = this.state.deleteMessage;
      deleteMessage.threadId = threadId;
      deleteMessage.isDel = true;
      let messagesThreadId = this.state.messagesThreadId;
      messagesThreadId.length = 0;
      let title = this.state.title;
      title = '';
      this.setState({title: title, threadId:'', deleteMessage:deleteMessage, messagesThreadId:messagesThreadId});
      this.props.actions.deleteMessage({threadId:threadId});
    }
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
    let cmpLoadMore='';
    if((this.state.messages.length < this.state.totalMess) && this.state.pageNumber > 1){
      cmpLoadMore=<button className="btn-loadmores" onClick={!this.state.isLoading?this.handleSelect:null}
                          disabled={this.state.isLoading}>{this.state.isLoading=='true'?this.props.lng.LOADING+'..':this.props.lng.LOAD_MORES}</button>
    }

    return(
      <div>
        <Helmet
          title="Quản lý tin nhắn"
        />
        <div className="list-user-chat">
          <MessagesUsersList
            messages={this.state.messages}
            onClickMessages={this.onClickMessages.bind(this)}
            disable={this.state.isClick}
            onDeleteMessage={this.onDeleteMessage.bind(this)}
          />
          {cmpLoadMore}
        </div>
        <div className="box box-warning direct-chat direct-chat-warning list-inbox inbox">
          <div>
            <div className="box-header with-border">
              <h3 className="box-title">{this.state.title}</h3>
            </div>
            {this.state.isClick==true?<LoadingTable />:<div className="box-body">
              <div className="direct-chat-messages msg-scroll" id="msg-scroll">
                <MessagesList
                  messages={this.state.messagesThreadId}
                  onTrackingFriend = {this.onTrackingFriend.bind(this)}
                />
              </div>
            </div>}
            <div className="box-footer">
              <div className="input-group">
                <input
                  type="text"
                  name="messageSend"
                  disabled={this.state.showU}
                  onKeyPress={event => {
                    if (event.key === "Enter") {
                      this.search();
                    }
                  }}
                  placeholder={this.props.lng.MESSAGE_INPUT_PLACEHOLDER}
                  className="form-control"
                  onChange={this.updateState}
                  value={this.state.messageSend}
                />
                <span className="input-group-btn">
                  <button type="button"
                          className="btn btn-warning btn-flat"
                          disabled={this.state.isSubmit || this.state.showU}
                          onClick={!this.state.isSubmit?this.onSendMessage:null}>
                    {this.state.isSubmit?<span className="fa fa-spinner fa-pulse fa-fw"/>:this.props.lng.POST_VIEW_COMMENT_SEND}</button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ManageMessagesPage.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.messageReducer,
    dataList: state.listMessageByThreadIdReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(messageAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ManageMessagesPage);
