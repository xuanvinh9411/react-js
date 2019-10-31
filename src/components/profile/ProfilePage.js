/*
 * Created by TrungPhat on 1/10/2017
 */
import React, {PropTypes} from "react";
import * as userAction from '../../actions/userAction';
import * as actionTypes from '../../actions/actionTypes';
import {Link, browserHistory} from 'react-router';
import PersonalInformation from './PersonalInformation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PostListPage from '../post/PostListPage';
import LoadingTable from '../controls/LoadingTable';
//import Pagination from '../controls/Pagination';
import {Helmet} from "react-helmet";
import {Pagination} from 'react-bootstrap';
import {ToastContainer, ToastMessage} from "react-toastr";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let Constants=require('../../services/Constants');
let Session=require('../../utils/Utils');
let _=require('../../utils/Utils');
let Aes=require('../../services/httpRequest');
let urlOnPage=require('../../url/urlOnPage');

class ProfilePage extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state={
      user: {},
      post:{},
      isReady:false,
      isReadyPost:false,
      messages:[],
      total:0,
      totalItemPaging:0,
      onHidePhone:false,
      pageNumber:1,
      activePage: 1,
      money:0,
      settings:{
        focusOnSelect: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 500
      },
      addFriend:{
        isAddFriend: false,
        idUserAdd:'',
        textBtn:this.props.lng.FRIEND_BUTTON_MAKE_FRIEND,
        disabledBtn:'',
        hiddenButton: false
      }
    }
    this.handleSelect=this.handleSelect.bind(this);
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  checkUserLogin(){
    let idFriend =  this.props.params ? this.props.params.id ? this.props.params.id: '' : '';
    let user=Aes.aesDecrypt(localStorage.getItem('user'));
    if(user){
      if(!idFriend || idFriend == '' || idFriend == null){
        if(window.location.pathname == '/thong-tin-ca-nhan'){
          return user;
        }else{
          browserHistory.push('/');
        }
      }else{
        if(idFriend == user.id){
          return user;
        }else{
          return false;
        }
      }
    }
  }
  componentWillMount(){
    if(!Session.checkSession()){
      browserHistory.push("/login");
    }else{
      let user = this.checkUserLogin();
      if(user != false){
        this.setState({user:user, isReady:true});
        this.props.actions.getUserById(user.id);
        this.props.actions.getMoney();
      }else{
        if(this.props.params.id && Session.getTemporaryData('infoFriend')){
          user = Session.getTemporaryData('infoFriend').user;
        }
        this.setState({user:user, isReady:true});
      }
      this.checkQuery();
    }
  }
  loadData(page){
    this.setState({isReadyPost:true});
    if(this.checkUserLogin() != false) {
      this.props.actions.listPostByShop({page: page});
    }else{
      this.props.actions.friendFeed({userIdFriend:this.props.params.id, page:page});
    }
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
  componentWillReceiveProps(nextProps){
    let type=nextProps.dataMessage.type;
    let result='';
    switch (type){
      case actionTypes.TRACKING_FRIEND_SUCCESS:
        result=nextProps.dataMessage.dataShops;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          Session.setTemporaryData('infoFriend', result.data);
          //browserHistory.push(urlOnPage.user.userViewProfileFriend+result.data.user.id);
          window.location.href = urlOnPage.user.userViewProfileFriend+result.data.user.id;
        }else{
          this.onTrackingFriend(this.state.idFriend);
        }
        break;
      case actionTypes.GET_USER_SUCCESS:
        result=nextProps.dataMessage.dataUser;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          let user=Aes.aesDecrypt(localStorage.getItem('user'));
          user=Object.assign(user,result.data.user);
          localStorage.setItem('user',Aes.aesEncrypt(user));
          this.setState({user:result.data.user, isReady:false});
        }else{
          if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
            this.props.actions.getUserById(this.state.user.id);
          }
        }
        break;
      case actionTypes.GET_FRIEND_SUCCESS:
        result=nextProps.dataMessage.dataUser;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          if(result.data.posts.length>0){
            this.setState({
              messages:result.data.posts,
              isReadyPost:false,
              pageNumber: Math.ceil(result.data.total /result.data.totalItemPaging),
              total:result.data.total
            });
          }else{
            this.setState({messages:result.data.posts});
          }
        }else{
          if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
            this.checkQuery();
          }
        }
        break;
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
      case actionTypes.LOAD_POST_SUCCESS:
        result=nextProps.dataMessage.dataPost;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          if(result.data.posts.length>0){
            this.setState({
              messages:result.data.posts,
              isReadyPost:false,
              pageNumber: Math.ceil(result.data.total /result.data.totalItemPaging),
              total:result.data.total
            });
          }else{
            this.setState({messages:result.data.posts});
          }
        }else{
          if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
            this.checkQuery();
          }
        }
        break;
      case actionTypes.UPDATE_POST_SUCCESS:
        result=nextProps.dataMessage.dataPost;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          let page=1;
          if(location.search!=''){
            page=location.search.split('page=')[1];
          }
          this.loadData(parseInt(page)-1);
          if(this.state.onHidePhone==false){
            this.refs.container.success(this.props.lng.PROFILE_UPDATE_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
          }else{
            this.setState({onHidePhone:false});
          }
        }else{
          this.refs.container.error(this.props.lng.PROFILE_UPDATE_FAILURE, `Thông báo.`, {
            closeButton: true,
          });
        }
        break;
      case actionTypes.DELETE_POST_SUCCESS:
        result=nextProps.dataMessage.dataPost;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          let queryPage=this.props.location.query.page?this.props.location.query.page:1;
          let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
          this.setState({activePage:parseInt(newActivePage)});
          if(this.state.isChangeState){
            if(this.state.messages.length==1){
              let query=this.props.location.query;
              if((parseInt(newActivePage)-1)==1)
                delete query.page;
              else
                if((newActivePage-1) == 0){
                  delete query.page;
                }else{
                  query.page=newActivePage-1;
                }

              browserHistory.push({pathname:this.props.location.pathname,query:query});
            }else{
              if(this.state.messages.length>1){
                this.loadData(newActivePage-1);
              }
            }
            this.setState({isChangeState:false, total: this.state.total - 1});
          }
          this.refs.container.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
            closeButton: true,
          });
        }else{
          if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
            this.refs.container.error(this.props.lng.FAIL_OTP, `Thông báo.`, {
              closeButton: true,
            });
          }else{
            this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
              closeButton: true,
            });
          }
        }
        break;
    }
    if(nextProps.location.key!=this.props.location.key){
      let queryPage=nextProps.location.query.page?nextProps.location.query.page:1;
      let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
      this.setState({activePage:parseInt(newActivePage)});
      this.loadData(newActivePage-1);
    }
  }
  onHideShowPhone(data){
    this.setState({onHidePhone:true});
    if(data.showPhone==1){
      data.showPhone=0;
    }else{
      data.showPhone=1;
    }
    this.props.actions.updatePostHiddenPhone(data);
  }
  onDeletePost(data){
    this.setState({isChangeState:true});
    data.status=-2;
    if(confirm(this.props.lng.MY_ACCOUNT_CONFIRM_DELETE)){
      this.props.actions.deletePost(data);
    }
  }
  handleSelect(eventKey) {
    let query=this.props.location.query;
    if(eventKey==1)
      delete query.page;
    else
      query.page=eventKey;
    browserHistory.push({pathname:this.props.location.pathname,query:query});
  }
  onTrackingFriend(id){
    let user = Aes.aesDecrypt(localStorage.getItem('user'));
    if(user.id != id){
      let addFriend = this.state.addFriend;
      addFriend.isAddFriend = true;
      addFriend.idUserAdd = id;
      this.setState({addFriend: addFriend});
      this.props.actions.trackingFriend({userIdFriend:id, shopinfo: 1});
    }
  }
  render(){
    return(
      <div id="a-profile">
        <Helmet
          title="Thông tin cá nhân"
        />
        <PersonalInformation
          lng={this.props.lng}
          user={this.state.user}
          update={true}
          total={this.state.total}
        />
        {
          this.checkUserLogin()!=false ?
            <div className="primary-account">
              <h4>{this.props.lng.MY_ACCOUNT_ACOIN} <span className="primary-color">{this.state.money>0?Session.format_price(this.state.money):this.state.money}</span></h4>
              <img src={Constants.linkServerImage+"/common/icon-coin.png"} alt="Coin"/>
              <p className="primary-color">
                <Link to="/nap-coin" className="primary-color">{this.props.lng.MY_ACCOUNT_BUTTON_BUY_ACOIN}</Link>
              </p>
            </div>:''
        }
        {
          this.checkUserLogin()==false ?
            <SimpleSlider
              lng = {this.props.lng}
            />:''
        }
        {
          this.checkUserLogin()!=false?
            <div className="list-status-title">
              <h3 className="primary-color" style={{paddingLeft: '0px', fontSize:' 20px', fontWeight: '500'}}>{this.props.lng.MY_ACCOUNT_TOTAL_POST} ({this.state.total<10&&this.state.total>0?'0'+this.state.total:this.state.total})</h3>
                <div className="create-store mar-bot-5">
                  <Link className="primary-color" to={"/user/post"}><img src={Constants.linkServerImage+"/common/create-store.png"}/>{this.props.lng.MY_ACCOUNT_BUTTON_ADD_POST}
                  </Link>{/*to={"/user/post"}*/}
                </div>

            </div>:''
        }
        {this.state.total==0?<div className="list-status-user">
          <p style={{fontSize:'16px', textAlign:'center',marginTop:'22px'}}>{this.props.lng.MY_ACCOUNT_NOT_POST}</p>
        </div>:null}
        <PostListPage
          pathname={window.location.pathname}
          messages={this.state.messages}
          lng={this.props.lng}
          onTrackingFriend = {this.onTrackingFriend.bind(this)}
          action={this.checkUserLogin()==false?false:null}
          url={window.location.pathname.indexOf('thong-tin-ca-nhan')>=0?true:false}
          onHideShowPhone={this.onHideShowPhone.bind(this)}
          onDeletePost={this.onDeletePost.bind(this)}
          trv = {true}
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
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
      </div>
    );
  }
}

ProfilePage.propTypes={
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
