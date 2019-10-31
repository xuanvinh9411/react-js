/*
* Created by TrungPhat on 1/17/2017
*/
import React,{PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as userAction from '../../actions/userAction';
import * as actionType from '../../actions/actionTypes';
import {Button,Pagination} from 'react-bootstrap';
import FriendsListPage from './FriendsListPage';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ToastContainer, ToastMessage} from "react-toastr";
import {Helmet} from "react-helmet";
import LoadingTable from '../controls/LoadingTable';
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let _=require('../../utils/Utils');

class FriendsPage extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state={
      message:[],
      data:[],
      user:{},
      total:0,
      totalRQ:0,
      phone:'',
      error: {},
      isSubmit: false,
      data_search:[],
      isReady:false,
      isBlock:false,
      isUnF:false,
      pageNumber:1,
      activePage: 1,
      keyword:'',
      friendsSearch:[],
      style:'',
      idUser: '',
      idFriend:'',
      isClickAction: false,
      isSearchFriend: false
    }
    this.updateState=this.updateState.bind(this);
    this.handleSelect=this.handleSelect.bind(this);
  }

  componentWillMount(){
    if(!_.checkSession()){
      browserHistory.push("/login");
    }else{
      this.props.actions.loadRequest(0);
      let user=Aes.aesDecrypt(localStorage.getItem('user'));
      this.setState({user:user});
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
    this.props.actions.loadFriend({page:page});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result={};
      switch (type){
        case actionType.TRACKING_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataShops;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            _.setTemporaryData('infoFriend', result.data);
            browserHistory.push('/detail/'+result.data.user.id);
          }else{
            this.onTrackingFriend(this.state.idFriend);
          }
          break;
        case actionType.LOAD_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataUser;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.setState({message:result.data.friends,
              total:result.data.total,
              pageNumber: Math.ceil(result.data.total /result.data.totalItemPaging),
              isReady:false});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.checkQuery();
            }else{
              this.setState({isReady:true});
            }
          }
          break;
        case actionType.SEARCH_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataUser;
          if(result.code == Constants.RESPONSE_CODE_SUCCESS){
            this.setState({friendsSearch: result.data.friendsSearch});
          }else{
            this.props.actions.search_friend(this.state.keyword);
          }
          break;
        case actionType.LOAD_REQUEST_SUCCESS:
          result=nextProps.dataMessage.dataUser;
          this.setState({totalRQ: result.data.total, data: result.data.friends});
          break;
        case actionType.BLOCK_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataFriend;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(!result.action){
              let queryPage=this.props.location.query.page?this.props.location.query.page:1;
              let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
              this.setState({activePage:parseInt(newActivePage)});
              if(this.state.message) {
                if (this.state.isBlock) {
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
                  this.setState({isBlock: false});
                }
              }
            }else{
              let friendsSearch = this.state.friendsSearch;
              for(let i in friendsSearch){
                if(friendsSearch[i].friendStatus){
                  if(friendsSearch[i].friendStatus.ref == this.state.idUser){
                    friendsSearch.splice(parseInt(i), 1);
                  }
                }
              }
              let message = this.state.message;
              for(let i in message){
                if(message[i].id == this.state.idUser){
                  message.splice(parseInt(i), 1);
                }
              }
              this.setState({isBlock: false, friendsSearch:friendsSearch, message:message, total: this.state.total - 1});
              _.removeTemporaryData('action');
            }
            if(this.state.isClickAction){
              this.props.toastMessage.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
                closeButton: true,
              });
              this.setState({isClickAction: false});
            }
          }else{
            if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
              this.onBlockFriend(this.state.idUser);
            }else{
              if(this.state.isClickAction){
                this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                  closeButton: true,
                });
                this.setState({isClickAction: false});
              }
              _.removeTemporaryData('action');
            }
          }
          break;
        case actionType.UNFRIEND_SUCCESS:
          result=nextProps.dataMessage.dataFriend;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(!result.action){
              let queryPage=this.props.location.query.page?this.props.location.query.page:1;
              let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
              this.setState({activePage:parseInt(newActivePage)});
              if(this.state.message) {
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
              }
            }else{
              let friendsSearch = this.state.friendsSearch;
              for(let i in friendsSearch){
                if(friendsSearch[i].friendStatus){
                  if(friendsSearch[i].friendStatus.ref == this.state.idUser){
                    friendsSearch.splice(parseInt(i), 1);
                  }
                }
              }
              let message = this.state.message;
              for(let i in message){
                if(message[i].id == this.state.idUser){
                  message.splice(parseInt(i), 1);
                }
              }
              this.setState({isUnF: false, friendsSearch:friendsSearch, message:message, total: this.state.total - 1});
              _.removeTemporaryData('action');
            }
            if(this.state.isClickAction){
              this.props.toastMessage.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
                closeButton: true,
              });
              this.setState({isClickAction: false});
            }
          }else{
            if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
              this.onUnFriend(this.state.idUser);
            }else{
              if(this.state.isClickAction){
                this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                  closeButton: true,
                });
                this.setState({isClickAction: false});
              }
              _.removeTemporaryData('action');
            }
          }
          break;
      }
    }
    if(nextProps.location.key!=this.props.location.key){
      window.scrollTo(0,0);
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
  onUnFriend(id){
    if(confirm(this.props.lng.FRIEND_UNFRIEND_CONFIRM)){
      this.setState({isUnF:true, idUser: id, isClickAction: true})
      this.props.actions.unFriend({ref:id, action : _.getTemporaryData('action') ? _.getTemporaryData('action') : null});
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
  onBlockFriend(id){
    this.setState({isBlock:true, idUser:id, isClickAction:true})
    this.props.actions.blockFriend({ref: id, action : _.getTemporaryData('action') ? _.getTemporaryData('action') : null});
  }
  componentDidUpdate(prevProps, prevState) {
    //window.scrollTo(0,0);
  }
  updateState(e){
    let field=e.target.name;
    let valueField=e.target.value;
    let keyword=this.state.keyword;
    let error=this.state.error;
    let style = this.state.style;
    keyword=valueField;
    this.setState({keyword:keyword,error:error, style:style});
    if(keyword.length > 0){
      this.setState({isSearchFriend: true});
      this.props.actions.search_friend(keyword);
    }else{
      this.setState({isSearchFriend: false});
    }
  }
  render(){
    return(
      <div>
        <Helmet
          title="Danh sách bạn bè"
        />
        {this.state.isReady==true?<LoadingTable height="660px"/>:
          <div className="list-friend cpm-list-friend accept-friend">
            <div className="list-friend-header">
              <div className="input-group cus-input">
                <input className="form-control input-lg"
                        type="text"
                       value={this.state.keyword}
                       style={{
                         background:Constants.linkServerImage+ 'common/icon-search.png',
                         backgroundSize:'6%',
                         height:'35px',
                         paddingLeft:'30px',
                         border: this.state.style}}
                       name="keyword"
                       onChange={this.updateState}/>
              </div>
              <div className="form-right pull-right" style={{marginLeft:'0'}}>
                <p className="text-center">
                  <Link to="/friends-requests" style={{height:'32px'}}>{this.props.lng.FRIEND_BUTTON_REQUEST}{this.state.totalRQ>0?<span className="_51lp _5ugg _5ugh _3-99" id="u_jsonp_3_1">{this.state.totalRQ}</span>:''}
                  </Link>
                </p>
              </div>
              {/*<div className="form-right">
                <p className="text-center"><Link to="/blocking">{this.props.lng.FRIEND_BUTTON_LIST_BLOCK}</Link></p>
              </div>*/}
            </div>
            <div>
              <div className="desc-text" style={{width:'100%'}}>
                <p className="primary-color">{this.state.keyword.length > 0 ? this.props.lng.FRIEND_RESULT_FOR : this.props.lng.FRIEND_TITLE} {this.state.keyword.length > 0 ? this.state.keyword : '('+this.state.total+')'}</p>
              </div>
              <FriendsListPage
                rsSearch={this.state.keyword.length}
                messages={this.state.message}
                lng={this.props.lng}
                onTrackingFriend = {this.onTrackingFriend.bind(this)}
                unFriend={this.onUnFriend.bind(this)}
                blockFriend={this.onBlockFriend.bind(this)}
                user={this.state.user}
              />
              {
                this.state.friendsSearch.length > 0 ?
                  this.state.friendsSearch.map((i, idx) =>
                    <div className="list-friend-suggest btn-add" key={idx} style={{display: this.state.keyword.length > 0 ? 'block' : 'none'}}>
                      {
                        i.avatar ?
                          <div className="friend-avatar-img css-bg-df"
                               onClick={()=>this.onTrackingFriend(i.id)}
                               style={{
                                 width:'55px',
                                 height:'55px',
                                 overflow:'hidden',
                                 float:'left',
                                 cursor: 'pointer',
                                 borderRadius:'50%',
                                 background:"url("+Constants.linkApi+'/images/'+ i.avatar + ")",
                                 backgroundRepeat:'no-repeat',
                                 backgroundSize:'cover',
                                 backgroundPosition:'50% 50%'}}>
                          </div>
                        :
                          <div className="friend-avatar-img css-bg-df"
                               onClick={()=>this.onTrackingFriend(i.id)}
                               style={{
                                 width:'55px',
                                 height:'55px',
                                 overflow:'hidden',
                                 cursor: 'pointer',
                                 float:'left',
                                 borderRadius:'50%',
                                 background:"url("+Constants.linkServerImage+'no_user.png'+")",
                                 backgroundRepeat:'no-repeat',
                                 backgroundSize:'cover',
                                 backgroundPosition:'50% 50%'}}>
                          </div>
                      }
                      <div className="suggest-address">
                        <p style={{margin:'0px'}}><Link onClick={()=>this.onTrackingFriend(i.id)}>{i.fullname}</Link></p>
                        <span>{i.phone}</span>
                      </div>
                      <div className="list-btn-action btn-messages">
                        <div className="btn-unfriend mg1" id="message">
                          <Link to={"/messages/"+i.id}>{this.props.lng.FRIEND_MENU_MESSAGE}</Link>
                        </div>
                        <div className="f-action-more">
                          <img src={Constants.linkServerImage+"icon-more-2.png"}/>
                          <div className="f-action text-center">
                            <li>
                              <a
                                onClick={()=>browserHistory.push('acoin-transfer/'+i.id)}
                              >{this.props.lng.FRIEND_MENU_MOVE_COIN}</a></li>
                            <li><a onClick={() => {
                              _.setTemporaryData('action', 'search');
                              this.onBlockFriend(i.friendStatus.ref);
                            }}>{this.props.lng.FRIEND_MENU_BLOCK}</a></li>
                            <li><a onClick={()=>{
                              _.setTemporaryData('action', 'search');
                              this.onUnFriend(i.friendStatus.ref);
                            }}>{this.props.lng.FRIEND_MENU_CANCEL_FRIEND}</a></li>
                          </div>
                        </div>
                      </div>
                    </div>
                  ):''
              }
              <div className="center-btn" style={{display: this.state.isSearchFriend ? 'none' : 'block'}}>
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
            <ToastContainer
              toastMessageFactory={ToastMessageFactory}
              ref="container"
              className="toast-top-right"
            />
          </div>
        }
      </div>
    );
  }
}

FriendsPage.propTypes={
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
export default connect(mapStateToProps, mapDispatchToProps)(FriendsPage);

