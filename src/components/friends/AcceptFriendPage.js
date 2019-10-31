/*
* Created by TrungPhat on 1/18/2017
*/
import React,{PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as userAction from '../../actions/userAction';
import * as actionType from '../../actions/actionTypes';
import {Pagination} from 'react-bootstrap';
import AcceptFriendsListPage from './AcceptFriendsListPage';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LoadingTable from '../controls/LoadingTable';
import {Helmet} from "react-helmet";
import {ToastContainer, ToastMessage} from "react-toastr";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let _=require('../../utils/Utils')

class AcceptFriendPage extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state={
      message:[],
      totalItem: 0,
      pageNumber:1,
      activePage: 1,
      isChangeState:false,
      totalItemPaging:0,
      isReady:false,
      isUnF:false,
      idUser:''
    }
    this.handleSelect=this.handleSelect.bind(this);
  }

  componentWillMount(){
    if(!_.checkSession()){
      browserHistory.push("/login");
    }else{
      this.checkQuery();
    }
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  checkQuery(){
    if(_.isEmpty(this.props.location.query)){
      this.loadData(0);
    }else{
      let queryPage=this.props.location.query.page?this.props.location.query.page:1;
      let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
      this.setState({activePage:parseInt(newActivePage)});
      this.loadData(newActivePage-1);
    }
  }
  loadData(page){
    this.setState({isReady:true});
    this.props.actions.loadRequest({page:page});
  }

  onAcceptFriend(id){
    this.setState({isAccept:true, idUser: id});
    this.props.actions.acceptFriend(id);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result={};
      switch (type){
        case actionType.LOAD_REQUEST_SUCCESS:
          result=nextProps.dataMessage.dataUser;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.setState({
              totalItem: result.data.total,
              pageNumber: Math.ceil(result.data.total /result.data.totalItemPaging),
              message:result.data.friends, isReady:false});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.checkQuery();
            }else{
              this.setState({isReady:true});
            }
          }
          break;
        case actionType.ACCEPT_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataFriend;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let queryPage=this.props.location.query.page?this.props.location.query.page:1;
            let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
            this.setState({activePage:parseInt(newActivePage)});
            if (this.state.isAccept) {
              if (this.state.message.length == 1) {
                let query=this.props.location.query;
                if((parseInt(newActivePage)-1)==1)
                  delete query.page;
                else
                  query.page=newActivePage-1;
                browserHistory.push({pathname:this.props.location.pathname,query:query});
              }else{
                if(this.state.message.length>1){
                  this.loadData(newActivePage-1);
                }
              }
              this.setState({isAccept: false});
            }
            this.props.toastMessage.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
          }else{
            if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
              this.onAcceptFriend(this.state.idUser);
            }else{
              this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
        break;
        case actionType.UNFRIEND_SUCCESS:
          result=nextProps.dataMessage.dataFriend;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let queryPage=this.props.location.query.page?this.props.location.query.page:1;
            let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
            this.setState({activePage:parseInt(newActivePage)});
            if (this.state.isUnF) {
              if (this.state.message.length == 1) {
                let query=this.props.location.query;
                if((parseInt(newActivePage)-1)==1)
                  delete query.page;
                else
                  query.page=newActivePage-1;
                browserHistory.push({pathname:this.props.location.pathname,query:query});
              }else{
                if(this.state.message.length>1){
                  this.loadData(newActivePage-1);
                }
              }
              this.setState({isUnF: false});
            }
            this.props.toastMessage.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
          }else{
            if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
              this.onRemoveRequest(this.state.idUser);
            }else{
              this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
        case actionType.TRACKING_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataShops;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            _.setTemporaryData('infoFriend', result.data);
            browserHistory.push('/detail/'+result.data.user.id);
          }else{
            this.onTrackingFriend(this.state.idFriend);
          }
          break;
      }
    }
    if(nextProps.location.key!=this.props.location.key){
      let queryPage=nextProps.location.query.page?nextProps.location.query.page:1;
      let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
      this.setState({activePage:parseInt(newActivePage)});
      this.loadData(newActivePage-1);
    }
  }
  onTrackingFriend(id){
    let user = Aes.aesDecrypt(localStorage.getItem('user'));
    if(user.id == id){
      browserHistory.push('/thong-tin-ca-nhan');
    }else{
      this.setState({idFriend: id});
      this.props.actions.trackingFriend({userIdFriend:id, shopinfo: 1});
    }
  }
  onRemoveRequest(id){
    this.setState({isUnF:true, idUser:id});
    this.props.actions.unFriend({ref:id});
  }
  handleSelect(eventKey) {
    let query=this.props.location.query;
    if(eventKey==1)
      delete query.page;
    else
      query.page=eventKey;
    browserHistory.push({pathname:this.props.location.pathname,query:query});
  }
  render(){
    let cpmNoRequest='';
    if(this.state.totalItem==0){
      cpmNoRequest=<div className="notfound-error">
        <h4 className="text-center" style={{borderBottom:'none'}}>{this.props.lng.FRIEND_LIST_REQUEST_NULL}</h4>
        <img src="static/img/404-not-found.png"/>
      </div>;
    }
    return(
      <div>
        <Helmet
          title="Đồng ý kết bạn"
        />
        {this.state.isReady==true?<LoadingTable height="660px"/>:
          <div className="accept-friend" style={{paddingRight:'10px', paddingLeft:'10px'}}>
            <h4 style={{marginLeft:'0', marginRight:'0px'}}>{this.props.lng.FRIEND_LIST_REQUEST_TITLE}</h4>
            <AcceptFriendsListPage
              message={this.state.message}
              lng={this.props.lng}
              onTrackingFriend={this.onTrackingFriend .bind(this)}
              acceptFriend={this.onAcceptFriend.bind(this)}
              removeRequest={this.onRemoveRequest.bind(this)}
            />
            {cpmNoRequest}
            <ToastContainer
              toastMessageFactory={ToastMessageFactory}
              ref="container"
              className="toast-top-right"
            />
            <div className="center-btn">
              {this.state.pageNumber>1?
                <Pagination
                  prev
                  next
                  first
                  last
                  ellipsis
                  boundaryLinks
                  bsSize="normal"
                  maxButtons={Constants.MAX_BUTTON_PAGGING}
                  items={this.state.pageNumber}
                  activePage={this.state.activePage}
                  onSelect={this.handleSelect}/>
                :
                null}
            </div>
          </div>
        }
      </div>
    );
  }
}

AcceptFriendPage.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.userReducer,
    data:PropTypes.array
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(userAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AcceptFriendPage);
