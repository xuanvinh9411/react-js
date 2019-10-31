/*
 * Created by TrungPhat on 23/03/2017
 */
import React,{PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as adsAction from '../../actions/adsAction';
import * as actionType from '../../actions/actionTypes';
import AdsByPostLists from './AdsByPostLists';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LoadingTable from '../controls/LoadingTable';
import {ToastContainer, ToastMessage} from "react-toastr";
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Aes=require('../../services/httpRequest');
let Constants=require('../../services/Constants');
let utils=require('../../utils/Utils');
class ListAdsByPost extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state={
      ads:[],
      error:[],
      isReady:false,
      state:'',
      isDell:false,
      blockRenderingData: false
    }
    this.loadData=this.loadData.bind(this);
  }

  componentWillMount(){
    this.props.actions.getPostById({idPost:this.props.params.id});
    this.loadData();
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  loadData(){
    this.setState({isReady:true})
    this.props.actions.listAdsByPost({idPost: this.props.params.id});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result={};
      switch (type){
        case actionType.GET_POST_SUCCESS:
          result=nextProps.dataMessage.dataPost;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let userCurrent=Aes.aesDecrypt(localStorage.getItem('user'));
            if(userCurrent.id!=result.data.post.userId.id){
              browserHistory.push('./404');
            }
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.actions.getPostById({idPost:this.props.params.id});
            }
          }
          break;
        case actionType.LOAD_ADS_SUCCESS:
          result=nextProps.dataMessage.dataAds;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.setState({ads:result.data.ads, isReady:false});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.loadData();
            }
          }
          break;
        case actionType.CHANGE_STATE_ADS_SUCCESS:
          result=nextProps.dataMessage.dataAds;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(this.state.blockRenderingData){
              if(this.state.isDel==true){
                this.props.toastMessage.success(this.props.lng.POST_ADS_DELETE_SUCCESS, `Thông báo.`, {
                  closeButton: true,
                });
                this.setState({isDel:false});
              }else{
                if(this.state.state==0){
                  this.props.toastMessage.success(this.props.lng.POST_ADS_ACTIVE_SUCCESS, `Thông báo.`, {
                    closeButton: true,
                  });
                }else{
                  this.props.toastMessage.success(this.props.lng.POST_ADS_PAUSE_SUCCESS, `Thông báo.`, {
                    closeButton: true,
                  });
                }
              }
              this.loadData();
              this.setState({blockRenderingData: false});
            }
          }else{
            if(this.state.blockRenderingData){
              if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
                this.props.toastMessage.warning(this.props.lng.FAIL_OTP, `Thông báo.`, {
                  closeButton: true,
                });
              }else{
                if(result.code==1006){
                  this.props.toastMessage.error(this.props.lng.POST_ADS_DELETE_ERROR, `Thông báo.`, {
                    closeButton: true,
                  });
                  this.setState({isDel:false});
                }else{
                  if(this.state.isDel==true){
                    this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                      closeButton: true,
                    });
                    this.setState({isDel:false});
                  }else{
                    if(this.state.state==0)
                      this.props.toastMessage.error(this.props.lng.POST_ADS_ACTIVE_ERROR, `Thông báo.`, {
                        closeButton: true,
                      });
                    else
                      this.props.toastMessage.error(this.props.lng.POST_ADS_PAUSE_ERROR, `Thông báo.`, {
                        closeButton: true,
                      });
                  }
                }
              }
              this.setState({blockRenderingData: false});
            }
          }
          break;
      }
    }
  }

  changStateAds(data){
    if(data.state == Constants.STATE_ADS_PAUSE || data.state == Constants.STATE_ADS_PENDING){
      if(confirm(this.props.lng.POST_ADS_ACTIVE_CONFIRM)){
        this.setState({state:data.state, blockRenderingData: true});
        this.props.actions.changStateAds({id:data.id,state:1});
      }
    }else{
      if(data.state == Constants.STATE_ADS_PLAY){
        if(confirm(this.props.lng.POST_ADS_PAUSE_CONFIRM)){
          this.setState({state:data.state, blockRenderingData: true});
          this.props.actions.changStateAds({id:data.id,state:0});
        }
      }
    }
  }

  delAds(data){
    if(confirm(this.props.lng.POST_ADS_MSG_DELETE_ADS)){
      this.setState({isDel:true, blockRenderingData: true});
      this.props.actions.changStateAds({id:data.id,status:-2});
    }
  }

  render(){
    return(
      <div>
        <Helmet
          title="Quảng cáo"
        />
        {this.state.isReady==true?<LoadingTable/>:
          <div className="accept-friend p_ads-wrap">
            <h4 style={{marginLeft:'0px', marginBottom:'20px'}}>{this.props.lng.POST_ADS_LIST_TITLE}</h4>
            <Link to={'/advertisement/'+this.props.params.id+'/create'} className="p-btn-create-ads">{this.props.lng.POST_ADS_LIST_BUTTON_ADD}</Link>
            <div className="p_ads_list_content">
              <AdsByPostLists
                lng={this.props.lng}
                messages={this.state.ads}
                changStateAds={this.changStateAds.bind(this)}
                delAds={this.delAds.bind(this)}
              />
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

ListAdsByPost.propTypes={
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
export default connect(mapStateToProps, mapDispatchToProps)(ListAdsByPost);
