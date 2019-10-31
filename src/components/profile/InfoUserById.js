/*
 * Created by TrungPhat on 1/10/2017
 */
import React, {PropTypes} from "react";
import * as friendProfileAction from '../../actions/friendProfileAction';
import * as actionTypes from '../../actions/actionTypes';
import {Link, browserHistory} from 'react-router';
import PersonalInformation from './PersonalInformation';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PostListPage from '../post/PostListPage';
import {Pagination} from 'react-bootstrap';
import {ToastContainer, ToastMessage} from "react-toastr";
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let Constants=require('../../services/Constants');
let Session=require('../../utils/Utils');
let _=require('../../utils/Utils');
let Aes=require('../../services/httpRequest');
let urlOnPage=require('../../url/urlOnPage');
let functionCommon = require('../common/FunctionCommon');
class InfoUserById extends React.Component{
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
      shop:{
        msg: [],
        pageNumber:0,
        total:0,
        page:0,
        clickLoadMore:false
      },
      loadShop:false,
      arrArrShop:[],
      friend:{},
      addFriend:{
        isAddFriend: false,
        idUserAdd:'',
        textBtn:this.props.lng.FRIEND_BUTTON_MAKE_FRIEND,
        disabledBtn:'',
        hiddenButton: false
      }
    }
    this.handleSelect=this.handleSelect.bind(this);
    this.onLoadMoreShop = this.onLoadMoreShop.bind(this);
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  componentWillUnmount(){
    _.removeTemporaryData('listShopOfUser');
  }
  componentWillMount(){
    _.setTemporaryData('listShopOfUser', []);
    if(!Session.checkSession()){
      browserHistory.push("/login");
    }else{
      this.loadListShop(0);
      let user = {};
      if(this.props.params.id && Session.getTemporaryData('infoFriend')){
        user = Session.getTemporaryData('infoFriend').user;
      }
      this.props.actions.findFriend(user.phone);
      this.setState({user:user, isReady:true});
      this.checkQuery();
    }
  }
  loadListShop(page){
    this.setState({loadShop:true});
    this.props.actions.loadListShop({
      page:page,
      userId: this.props.params.id
    })
  }
  loadData(page){
    this.setState({isReadyPost:true});
    this.props.actions.friendFeed({userIdFriend:this.props.params.id, page:page});
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
    switch (type) {
      case actionTypes.LOAD_SHOP_ON_PROFILE_SUCCESS:
        result = nextProps.dataMessage.dataUser;
        if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
          if(this.state.loadShop == true){
            let shop = this.state.shop;
            let data = _.getTemporaryData('listShopOfUser');
            if(shop.clickLoadMore == true){
              data = data.concat(result.data.shops);
            }else{
              data = result.data.shops;
            }
            shop.total = result.data.total;
            shop.pageNumber = Math.ceil(result.data.total / result.data.totalItemPaging);
            _.setTemporaryData('listShopOfUser', data);
            this.setState({shop: shop, loadShop:false});
          }
        }else{
          if (result.code == Constants.RESPONSE_CODE_OTP_INVALID) {
            this.loadListShop(0);
          }
        }
        break;
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
      case actionTypes.GET_FRIEND_SUCCESS:
        result = nextProps.dataMessage.dataUser;
        if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
          if (result.data.posts.length > 0) {
            this.setState({
              messages: result.data.posts,
              isReadyPost: false,
              pageNumber: Math.ceil(result.data.total / result.data.totalItemPaging),
              total: result.data.posts.length
            });
          } else {
            this.setState({messages: result.data.posts});
          }
        }else{
          if(result.code == Constants.RESPONSE_CODE_OTP_INVALID) {
            this.checkQuery();
          }
        }
        break;
      case actionTypes.FIND_FRIEND_SUCCESS:
        result=nextProps.dataMessage.dataUser;
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          if(result.data.friendStatus){
            if(result.data.friendStatus.from == 1 && result.data.friendStatus.status == 0){
              let addFriend = this.state.addFriend;
              addFriend.textBtn = this.props.lng.FRIEND_ADDING_WAIT_FOR_COFNIRMATION;
              addFriend.disabledBtn = 'disabled';
            }
          }
          this.setState({friend: result.data, isSubmit: false});
        }else{
          if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
            this.props.actions.findFriend(this.state.user.phone);
          }else{
            this.setState({friend: this.props.lng.FRIEND_NO_RESULT, isSubmit: false});
          }
        }
        break;
      case actionTypes.ADD_FRIEND_SUCCESS:
        result=nextProps.dataMessage.dataUser;
        if(result.code==204){
          if(this.state.addFriend.isAddFriend){
            this.props.toastMessage.error(this.props.lng.FRIEND_ADDING_WAIT_FOR_COFNIRMATION, `Thông báo.`, {
              closeButton: true,
            });
            let addFriend = this.state.addFriendl
            addFriend.isAddFriend = false;
            this.setState({addFriend:addFriend});
          }
        }else{
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let addFriend = this.state.addFriend;
            if(this.state.addFriend.isAddFriend){
              this.props.toastMessage.success(this.props.lng.FRIEND_ADD_SUCCESS, `Thông báo.`, {
                closeButton: true,
              });
              addFriend.isAddFriend = false;
            }
            addFriend.textBtn = '';
            addFriend.disabledBtn = 'disabled';
            this.setState({addFriend:addFriend});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.actions.addFriend(this.state.addFriend.idUserAdd);
            }
          }
        }
        break;
      case actionTypes.ACCEPT_FRIEND_SUCCESS:
        result=nextProps.dataMessage.dataFriend;
        if(result.code == Constants.RESPONSE_CODE_SUCCESS){
          if(this.state.addFriend.isAddFriend){
            this.props.toastMessage.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
            let addFriend = this.state.addFriend;
            addFriend.isAddFriend = false;
            this.setState({addFriend:addFriend});
          }
          let friend = this.state.friend;
          friend.hiddenButton = true;
          this.setState({friend:friend});
        }else{
          if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
            this.onAcceptFriend(this.state.friend.idUserAdd);
          }else{
            if(this.state.addFriend.isAddFriend) {
              this.props.toastMessage.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
              let addFriend = this.state.addFriend;
              addFriend.isAddFriend = false;
              this.setState({addFriend:addFriend});
            }
          }
        }
        break;
    }
    if(nextProps.location.key!=this.props.location.key){
      //console.log('Khác key');
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
    event.preventDefault();
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
  returnLengthArrArr(){
    let arr = _.getTemporaryData('listShopOfUser') ? _.getTemporaryData('listShopOfUser') : [];
    return arr.length;
  }
  onLoadMoreShop(){
    var totalItems = $('.item').length;
    var currentIndex = $('div.active').index() + 1;
    if(currentIndex == (totalItems - 1)){
      if(this.state.shop.pageNumber > 1 && this.returnLengthArrArr() < this.state.shop.total){
        let shop = this.state.shop;
        shop.clickLoadMore = true;
        let page = shop.page;
        shop.page = page + 1;
        this.setState({shop:shop});
        this.loadListShop(page + 1);
      }
    }
  }
  onAddFriend(id){
    let addFriend = this.state.addFriend;
    addFriend.isAddFriend = true;
    addFriend.idUserAdd = id;
    this.setState({addFriend:addFriend});
    this.props.actions.addFriend(id);
  }
  onAcceptFriend(id){
    let addFriend = this.state.addFriend;
    addFriend.isAddFriend = true;
    addFriend.idUserAdd = id;
    this.setState({addFriend:addFriend});
    this.props.actions.acceptFriend(id);
  }
  onTrackingFriend(id){
    let user = Aes.aesDecrypt(localStorage.getItem('user'));
    if(user.id == id){
      browserHistory.push(urlOnPage.user.userMyProfile);
    }else{
      let addFriend = this.state.addFriend;
      addFriend.isAddFriend = true;
      addFriend.idUserAdd = id;
      this.setState({addFriend: addFriend});
      this.props.actions.trackingFriend({userIdFriend:id, shopinfo: 1});
    }
  }
  render(){
    let data = _.chuckArray(_.getTemporaryData('listShopOfUser') ? _.getTemporaryData('listShopOfUser') : []);
    let cmpMore = '';
    return(
      <div id="a-profile">
        <Helmet
          title="Thông tin cá nhân"
        />
        <PersonalInformation
          lng={this.props.lng}
          user={this.state.user}
          update={false}
          textBtn={this.state.addFriend.textBtn}
          disabledBtn={this.state.addFriend.disabledBtn}
          onAddFriend = {this.onAddFriend.bind(this)}
          onAcceptFriend = {this.onAcceptFriend.bind(this)}
          friend = {this.state.friend.friendStatus? this.state.friend.friendStatus : null}
          hiddenButton = {this.state.friend.hiddenButton}
          total={this.state.total}
        />
        <div className="list-shop-of-user">
          <h3 className="primary-color" style={{paddingLeft: '0px', fontSize: '20px', fontWeight: 500}}>{
            this.props.lng.MY_ACCOUNT_SHOP_LIST + ' ('+this.state.shop.total+')'
          }</h3>
          <div className="wrap-list-shop">
            <div id="carousel-id" className="carousel slide" data-ride="carousel" data-interval="false">
              <div className="carousel-inner">
                {
                  data.map((parent, index) =>
                    <div className={index == 0 ? 'item active' : 'item'} key={index}>
                      {
                        parent.map((child, idx)=>
                          <div className="shop-item" key={idx}>
                            <div
                              className="bg-shop"
                              onClick={()=>browserHistory.push('/xem-cua-hang/'+ functionCommon.createSlug(child.name) + '-' + child.id + '.html')}
                              style={{
                                background:'url('+Constants.linkApi+'/images/'+child.avatar[0]+')',
                                backgroundPosition: 'center center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                width:'100%',
                                height:'100%'
                              }}
                            />
                            <div className="name-shop" onClick={()=>browserHistory.push('/xem-cua-hang/' + functionCommon.createSlug(child.name) + '-' + child.id + '.html')}>
                              {_.sliceStringByLength(child.name, 25)}
                            </div>
                          </div>
                        )
                      }
                      {cmpMore}
                    </div>
                  )
                }
              </div>
              <div style={{display: this.state.shop.total <= 4 ? 'none' : 'block'}}>
                <a className="left carousel-control" href="#carousel-id" data-slide="prev">
                  <span className="glyphicon glyphicon-chevron-left"/>
                </a>
                <a className="right carousel-control" href="#carousel-id" data-slide="next" onClick={()=>this.onLoadMoreShop()}>
                  <span className="glyphicon glyphicon-chevron-right"/>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="list-status-title">
          <h3 className="primary-color" style={{paddingLeft: '0px', fontSize:' 20px', fontWeight: '500'}}>{this.props.lng.MY_ACCOUNT_TOTAL_POST} ({this.state.total>0?this.state.total:0})</h3>
        </div>
        {this.state.total==0?<div className="list-status-user">
          <p style={{fontSize:'16px', textAlign:'center',marginTop:'22px'}}>{this.props.lng.MY_ACCOUNT_NOT_POST}</p>
        </div>:null}
        <PostListPage
          pathname={window.location.pathname}
          messages={this.state.messages}
          lng={this.props.lng}
          onTrackingFriend = {this.onTrackingFriend.bind(this)}
          action={false}
          url={window.location.pathname.indexOf('thong-tin-ca-nhan')>=0?true:false}
          onHideShowPhone={this.onHideShowPhone.bind(this)}
          onDeletePost={this.onDeletePost.bind(this)}
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

InfoUserById.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.friendProfileReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(friendProfileAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(InfoUserById);
