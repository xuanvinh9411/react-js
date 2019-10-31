/*
 * Created by TrungPhat on 20/05/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as notificationAction from '../../actions/notificationAction';
import * as actionTypes from '../../actions/actionTypes';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LoadingTable from '../controls/LoadingTable';
import NotificationList from './NotificationList';
import {ToastContainer, ToastMessage} from "react-toastr";
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let Constants=require('../../services/Constants');
let Session=require('../../utils/Utils');
let Aes=require('../../services/httpRequest');

class Notifications extends React.Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      error: {},
      messages:[],
      total:0,
      activePage:1,
      page:0,
      totalItemPaging:0,
      isLoad: true,
      isClick:false,
      isLoadMores:false
    };
    this.onLoadMores=this.onLoadMores.bind(this);
  }

  componentWillMount(){
    if(!Session.checkSession()){
      browserHistory.push("/login");
    }else{
      this.loadData(0);
    }
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  loadData(page){
    this.setState({isClick: true});
    this.props.actions.getNotification(page);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result=nextProps.dataMessage.data;
      switch (type){
        case actionTypes.LOAD_NOTIFICATION_SUCCESS:
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            //if(this.state.isClick){
              if(result.data.notifications.length>0){
                let data=this.state.messages;
                if(this.state.isLoadMores==true){
                  data=data.concat(result.data.notifications);
                }else{
                  data=result.data.notifications;
                }
                this.setState({
                  messages:data,
                  total:result.data.notifications.length,
                  totalItemPaging:result.data.totalItemPaging,
                  page:result.data.page,
                  isNoResult:true,
                  isLoad:false,
                  isLoadMores:false
                });
              }else{
                this.setState({
                  isLoad:false,
                  isSubmit:false,
                  isNoResult:false
                });
              }
              this.setState({isClick: false});
            //}
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.loadData(0);
            }else{
              this.setState({isLoad:false});
            }
          }
          break;
      }
    }
  }

  onLoadMores(){
    this.setState({isClick:true,isLoadMores: true});
    let page=this.state.page;
    let num=page+1;
    this.setState({page:num});
    this.loadData(page+1);
  }

  render(){
    let cmpNull='';
    if(this.state.messages.length==0){
      cmpNull=
        <div className="no-result-data">
          <p className="primary-color">{this.props.lng.NOTIFICATION_NULL}</p>
        </div>
    }
    let cpnLoadMores='';
    if(this.state.total%10==0&&this.state.total!=0&&this.state.isNoResult==true) {
      cpnLoadMores =
        <div className="load-more-rel">
          <button type="button"
                  className="btn btn-warning btn-flat btn-search"
                  onClick={!this.state.isLoadMores ? this.onLoadMores : null}
                  disabled={this.state.isLoadMores}>
            {this.state.isLoadMores ?
              <span>{this.props.lng.LOADING} <img src={Constants.linkServerImage + '/loading_7.gif'}/></span> : this.props.lng.LOAD_MORES}
          </button>
        </div>
    }else{
      cpnLoadMores=<div style={{marginTop:'30px'}}></div>;
    }
    return(
      <div className="UIStandardFrame_Content" id="list-notification">
        <Helmet
          title="Thông báo"
        />
        <div className="uiHeader uiHeaderBottomBorder mbm uiHeaderPage">
          <div className="clearfix uiHeaderTop">
            <div>
              <h2 className="uiHeaderTitle" aria-hidden="true">
                {this.props.lng.NOTIFICATION_TITLE_WEB}
              </h2>
            </div>
          </div>
        </div>
        {cmpNull}
        <div>
          <div id="u_0_0">
            <div className="_44_u">
              <div data-testid="see_all_list">
                <NotificationList
                  lng={this.props.lng}
                  messages={this.state.messages}
                  query = {this.props.location.query}
                />
              </div>
            </div>
          </div>
        </div>
        {cpnLoadMores}
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
      </div>
    );
  }
}
Notifications.propTypes={
  actions:PropTypes.object.isRequired
};
function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.notificationReducer
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(notificationAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
