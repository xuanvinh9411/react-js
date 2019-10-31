/*
 * Created by TrungPhat on 14/02/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as newsFeedAction from '../../actions/newsFeedAction';
import * as actionTypes from '../../actions/actionTypes';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LoadingTable from '../controls/LoadingTable';
import HomeList from './HomeList';
import {ToastContainer, ToastMessage} from "react-toastr";
// import {AroundMap} from '../controls/AroundMap';
import DirectionsAroundGoogleMap from '../controls/DirectionsAroundGoogleMaps';
import {Modal} from 'react-bootstrap';
import moment from 'moment';
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let Constants=require('../../services/Constants');
let Session=require('../../utils/Utils');
let Aes=require('../../services/httpRequest');
let polyline=require('polyline'),
  geojson = require('geojson'),
  util = require('util'),
  urlOnPage = require('../../url/urlOnPage');

class HomePage extends React.Component{
  initialCommentsSub(){
    return{
      cmt :'',
      idPost: '',
      idCmt: '',
      listComment: [],
      isLoading: false,
      page:0,
      num:1,
      totalItemPaging:0,
      loadChild:false
    }
  }
  initialComments(){
    return{
      cmt:'',
      idPost:'',
      listComment:[],
      page:0,
      num:1,
      totalItemPaging:0,
      isLoading:false,
      display:'none',
      sub: this.initialCommentsSub()
    }
  }
  initialListLike(){
    return{
      messages:[],
      isShowModal: false,
      pageNumber: 0,
      page: 0,
      isPostCliked: '',
      total: 0,
      isClick: false
    }
  }
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
      isSubmit: false,
      isNoResult:false,
      isLoadMores:false,
      statusMap:false,
      origin: new google.maps.LatLng(10.8230989, 106.6296638),
      destination: new google.maps.LatLng(10.8230989, 106.6296638),
      directions: null,
      idFriend:'',
      shareLocation: false,
      idPost:'',
      comment: this.initialComments(),
      loadMoresComments:false,
      isLikePost: false,
      listLike: this.initialListLike(),
      isLoadListPost: false
    };
    this.onLoadMores=this.onLoadMores.bind(this);
    this.onDefinePosition = this.onDefinePosition.bind(this);
    this.onLoadListLiker = this.onLoadListLiker.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentWillMount(){
    Session.setTemporaryData('blockOnClickLike', false);
    //if(!Session.checkSession()){
     //browserHistory.push("/login")
   // }else{
      navigator.geolocation.getCurrentPosition(function(location) {
        this.setState({
          shareLocation:true,
          origin: new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
        })
      }.bind(this));
      this.loadData(0);
   // }

  }
  componentWillUnmount(){
    Session.removeTemporaryData('blockOnClickLike');
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  loadData(page){
  	this.setState({isLoadListPost: true});
    this.props.actions.listNewsFeed({page:page});
  }
  listPostByFriend(data){
    this.props.actions.friendFeed({userIdFriend:data.userIdFriend, page:data.page});
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result='';
      switch (type){
        case actionTypes.LOAD_NEWSFEED_SUCCESS:
          result=nextProps.dataMessage.dataList;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(result.data.posts.length>0){
              if(this.state.isLoadListPost){
              	let data=this.state.messages;
	              	if(this.state.isClick==true){
	                	data=data.concat(result.data.posts);
	                	this.setState({isClick:false});
	              	}else{
	                	data=result.data.posts;
	              	}
	              	this.setState({
		                messages:data,
		                total:result.data.posts.length,
		                totalItemPaging:result.data.totalItemPaging,
		                page:result.data.page,
		                isNoResult:true,
		                isLoad:false,
		                isLoadMores:false,
		                isLoadListPost: false
	              	});
              }
            }else{
              this.setState({
                isLoad:false,
                isSubmit:false,
                isNoResult:false
              });
            }
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              setTimeout(this.loadData(0), 5000);
            }else{
              this.setState({isLoad:false});
            }
          }
          break;
        case actionTypes.TRACKING_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataShops;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(result.data.user){
              Session.setTemporaryData('infoFriend', result.data);
              browserHistory.push(urlOnPage.user.userViewProfileFriend+result.data.user.id);
            }
          }else{
            this.onTrackingFriend(this.state.idFriend);
          }
          break;
        case actionTypes.LIKE_POST_SUCCESS:
          result=nextProps.dataMessage.dataPosts;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(Session.getTemporaryData('blockOnClickLike')){
              let messages=this.state.messages;
              for(let i in messages){
                if(messages[i].id == this.state.idPost){
                  messages[i].totalLike+=1;
                  messages[i].isLike = 1;
                }
              }
              this.setState({messages:messages, isClick:false, comments:[], isLiked:true});
              Session.setTemporaryData('blockOnClickLike', false);
            }
          }else{
            if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
              Session.setTemporaryData('blockOnClickLike', false);
              this.onLikePost({id:this.state.idPost, isLike: 0});
            }else{
              Session.setTemporaryData('blockOnClickLike', false);
              this.onLikePost({id:this.state.idPost, isLike: 1});
            }
          }
          break;
        case actionTypes.UNLIKE_SUCCESS:
          result=nextProps.dataMessage.dataPost;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(this.state.isClick){
              let messages = this.state.messages;
              for( let i in messages){
                if(messages[i].id == this.state.idPost){
                  messages[i].isLike = 0;
                  if(messages[i].totalLike - 1 >= 0){
                    messages[i].totalLike -= 1;
                  }else{
                    messages[i].totalLike = 0;
                  }
                }
              }
              this.setState({messages:messages, isClick:false});
              Session.setTemporaryData('blockOnClickLike', false)
            }
          }else{
            if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
              Session.setTemporaryData('blockOnClickLike', false)
              this.onLikePost({id:this.state.idPost, isLike: 1});
            }
          }
          break;
        case actionTypes.LOAD_COMMENTS_SUCCESS:
          result=nextProps.dataMessage.dataPost;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(this.state.isClick){
              let comment=this.state.comment;
              if(!result.params.parent){
                /* COMMENTS PARENT */
                /*Bị cache*/
                let messages = this.state.messages;
                for(let i in messages){
                  if(messages[i].id == comment.idPost){
                    let data = messages[i].comments;
                    if(this.state.loadMoresComments == true){
                      for(let j in result.data.socials){
                        data.push(result.data.socials[j]);
                      }
                      this.setState({loadMoresComments:false});
                    }else{
                      data=result.data.socials;
                    }
                    messages[i].comments = data;
                  }
                }
                comment.page=result.data.page;
                comment.totalItemPaging=result.data.totalItemPaging;
                comment.isLoading=false;
                this.setState({comment:comment, messages:messages});
              }else{
                /* REPLY */
                let comment = this.state.comment;
                let data = comment.sub.listComment;
                if(this.state.loadMoresComments == true){
                  for(let j in result.data.socials){
                    data.push(result.data.socials[j]);
                  }
                  this.setState({loadMoresComments:false});
                }else{
                  data=result.data.socials;
                }
                comment.sub.listComment = Session.reverseArray(data);/* Đảo chiều mảng */
                comment.sub.page=result.data.page;
                comment.sub.totalItemPaging=result.data.totalItemPaging;
                comment.sub.isLoading=false;
                this.setState({comment:comment});
              }
              this.setState({isClick: false});
            }
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              if(!result.params.parent){
                this.loadComments(this.state.comment.idPost, 0)
              }else{
                this.loadListReply(this.state.comment.sub.idPost, this.state.comment.sub.idCmt, 0);
              }
            }else{
              this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
        case actionTypes.COMMENTS_SUCCESS:
          result=nextProps.dataMessage.dataPost;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(this.state.isClick){
              let comment = this.state.comment;
              let messages = this.state.messages;
              /* Comment */
              if(!result.parent){
                if(comment.cmt.length > 0 && comment.isLoading == true){
                  let msg = {
                    idUser: Aes.aesDecrypt(localStorage.getItem('user')),
                    idPost:comment.idPost
                  }
                  msg = Object.assign(msg, result.data);
                  //Thêm vào mảng bình luận
                  for(let i in messages){
                    //Kiểm tra, thêm bình luận vào đúng post
                    if(messages[i].id == this.state.comment.idPost){
                      messages[i].totalComment += 1;
                      /*Kiểm tra đã có bình luận hay chưa*/
                      if(messages[i].comments){
                        messages[i].comments.unshift(msg);
                      }else{
                        messages[i].comments= [msg];
                      }
                    }
                  }
                  comment.num ++;
                  comment.cmt = '';
                  comment.isLoading= false;
                }
                this.setState({messages: messages, comment:comment})
              }else{
                /*REPLY*/
                let comment = this.state.comment;
                let msg = {
                  idUser: Aes.aesDecrypt(localStorage.getItem('user')),
                  idPost:comment.sub.idPost
                }
                msg = Object.assign(msg, result.data);
                if(comment.sub.idCmt == result.parent){
                  comment.sub.listComment.push(msg);
                }
                comment.sub.num ++;
                comment.sub.cmt = '';
                comment.sub.isLoading= false;
                this.setState({comment:comment});
              }
              this.setState({isClick:false});
            }
          }else{
            if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
              if(!result.parent){
                this.onSubmitComment(this.state.comment.idPost);
              }else{
                this.onSubmitReplyForComment();
              }
            }else{
              this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
        case actionTypes.LOAD_LIST_LIKER_SUCCESS:
          result=nextProps.dataMessage.dataPost;
          if(result.code == Constants.RESPONSE_CODE_SUCCESS){
            let listLike = this.state.listLike;
            if(listLike.isClick){
              let data = this.state.listLike.messages;
              if(result.params.page != this.state.listLike.page){
                data = listLike.messages.concat(result.data.socials);
              }else{
                data = result.data.socials;
              }
              listLike.messages = data;
              //listLike.page += 1;
              listLike.total = result.data.total;
              listLike.pageNumber = Math.ceil(result.data.total / result.data.totalItemPaging);
              listLike.isShowModal = true;
            }
            listLike.isClick = false;
            this.setState({listLike:listLike});
          }else{
            if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
              this.onLoadListLiker(this.state.listLike.isPostCliked, this.state.listLike.page);
            }
          }
      }
    }
    if(nextProps.location.key!=this.props.location.key){
      window.scrollTo(0,0)
      this.loadData(0);
    }
  }
  /*POST*/
  onLoadMores(){
    this.setState({isClick:true,isLoadMores: true,});
    let page=this.state.page;
    page=page+1;
    this.setState({page:page});
    if(this.state.userIdFriend){
      let data={};
      data.userIdFriend=this.state.userIdFriend;
      data.page=page;
      this.listPostByFriend(data);
    }else{
      this.loadData(page);
    }
  }
  onDefinePosition(location){
    let origin= this.state.origin;
    let destination=new google.maps.LatLng(location[1], location[0]);
    if(this.state.shareLocation==false){
      origin=new google.maps.LatLng(location[1], location[0]);
    }
    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route({
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result,
        });
      }else {
        this.setState({origin:new google.maps.LatLng(location[0], location[1])});
      }
    });
    this.setState({statusMap: true});
  }
  handleMapClick(){

  }
  onClickMarker(){

  }
  /*COMMENTS*/
  onTrackingFriend(id){
    let user = Aes.aesDecrypt(localStorage.getItem('user'));
    if(user.id == id){
      browserHistory.push(urlOnPage.user.userMyProfile);
    }else{
      this.setState({idFriend: id});
      this.props.actions.trackingFriend({userIdFriend:id, shopinfo: 1});
    }
  }
  onLikePost(data){
    if(!Session.getTemporaryData('blockOnClickLike')){
      this.setState({idPost:data.id, isClick:true,isLikePost:true});
      Session.setTemporaryData('blockOnClickLike', true);
      if(data.isLike == 0){
        this.props.actions.socialAddLike({idPost:data.id, kind:Constants.KIND_LIKE});
      }else{
        this.props.actions.socialUnLike({idPost:data.id, kind:Constants.KIND_LIKE});
      }
    }
  }
  loadComments(id, page){
    let comment = this.state.comment;
    comment.page = page;
    comment.idPost = id;
    comment.isLoading = true;
    this.setState({comment:comment, isClick: true});
    this.props.actions.socialList({idPost:id, page: page, kind:Constants.KIND_COMMENT});
  }
  loadMoresComment(id, page){
    let comment = this.state.comment;
    comment.page = page;
    comment.idPost = id;
    comment.isLoading = true;
    this.setState({comment:comment,loadMoresComments:true, isClick: true});
    this.props.actions.socialList({idPost:id, page: page, kind:Constants.KIND_COMMENT});
  }
  updateState(id, value){
    let comment= this.state.comment;
    comment.cmt=value;
    comment.idPost = id;
    let error = this.state.error;
    if(value.length > 0){
      error['cmt'] = false;
    }
    this.setState({comment:comment, error:error});
  }
  validatorForm() {
    let error=this.state.error;
    let dataForm=this.state.comment;
    let check=true;
    if(dataForm.cmt.length==0){
      error['cmt']=true;
      check=false;
    }
    this.setState({error:error});
    return check;
  }
  onSubmitComment(id){
    if(this.validatorForm()){
      let comment = this.state.comment;
      comment.isLoading = true;
      comment.idPost = id;
      this.setState({comment:comment, isClick: true});
      this.props.actions.socialAdd({idPost:id, kind:Constants.KIND_COMMENT, message:this.state.comment.cmt});
    }
  }
  /* REPLY */
  validatorFormReply() {
    let error=this.state.error;
    let dataForm=this.state.comment;
    let check=true;
    if(dataForm.sub.cmt.length==0){
      error['subCmt']=true;
      check=false;
    }
    this.setState({error:error});
    return check;
  }
  onShowFormReply(idCmt, idPost){
    let comment = this.state.comment;
    comment.sub.idCmt = idCmt;
    comment.sub.listComment.length = 0;
    this.setState({comment:comment, isClick: true});
    this.props.actions.socialList({idPost:idPost, parent: idCmt ,page: 0, kind:Constants.KIND_COMMENT});
  }
  updateStateSubComment(idPost, idCmt, value){
    let comment = this.state.comment;
    comment.sub.idPost = idPost;
    comment.sub.idCmt = idCmt;
    comment.sub.cmt = value;
    let error = this.state.error;
    if(value.length > 0){
      error['subCmt'] = false;
    }
    this.setState({comment:comment, error:error});
  }
  onSubmitReplyForComment(e){
    if(this.validatorFormReply()){
      let sub = this.state.comment.sub;
      this.setState({isClick: true});
      this.props.actions.socialAdd({idPost: sub.idPost, kind:2, message:sub.cmt, parent: sub.idCmt});
    }
  }
  loadListReply(idPost, idCmt, page){
    let comment = this.state.comment;
    comment.sub.page = page;
    comment.sub.idPost = idPost;
    comment.sub.idCmt = idCmt;
    comment.sub.isLoading = true;
    this.setState({comment:comment, loadMoresComments: page > 0, isClick: true});
    this.props.actions.socialList({idPost:idPost, parent: idCmt ,page: page, kind:Constants.KIND_COMMENT});
  }
  onLoadListLiker(id, page){
    let listLike = this.state.listLike;
    listLike.isPostCliked = id;
    listLike.isClick = true;
    if(page == 0){
      listLike.messages.length = 0;
    }
    this.setState({listLike:listLike});
    this.props.actions.listLiker({idPost:id, page: page, kind:Constants.KIND_LIKE});
  }
  render(){
    let cpnLoadMores='';
    if(this.state.total%10==0&&this.state.total!=0&&this.state.isNoResult==true) {
      cpnLoadMores =
        <div className="load-more-rel">
          <button type="button"
                  style={{border:0}}
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
    let lgClose = () => this.setState({ statusMap: false });
    return(
      <div id="news-feed">
        <Helmet
          title="Newsfeed"
        />
        {///this.state.isLoad?<LoadingTable/>:
          <div style={{
            minHeight: '1px',
            width: '100%',
            overflow: 'hidden'
          }}>
            {
              this.state.messages.length > 0 ?
                <HomeList
                  onLikePost = {this.onLikePost.bind(this)}
                  isLiked = {this.state.isLiked}
                  lng={this.props.lng}
                  messages={this.state.messages}
                  comment={this.state.comment}
                  updateState={this.updateState.bind(this)}
                  isLoading={this.state.comment.isLoading}
                  loadListReply = {this.loadListReply.bind(this)}
                  error = {this.state.error}
                  onSubmitReplyForComment = {this.onSubmitReplyForComment.bind(this)}
                  updateStateSubComment = {this.updateStateSubComment.bind(this)}
                  onShowFormReply = {this.onShowFormReply.bind(this)}
                  onSubmitComment={this.onSubmitComment.bind(this)}
                  loadComments={this.loadComments.bind(this)}
                  loadMoresComment={this.loadMoresComment.bind(this)}
                  onTrackingFriend = {this.onTrackingFriend.bind(this)}
                  onDefinePosition = {this.onDefinePosition.bind(this)}
                  onLoadListLiker = {this.onLoadListLiker.bind(this)}
                  idPost = {this.state.comment.idPost}
                />
              :
                <div className="no-result-data" style={{marginTop:'-10px'}}>
                  <p className="primary-color">{this.props.lng.MY_ACCOUNT_NOT_POST}</p>
                </div>
            }
          </div>}
        {cpnLoadMores}
        <Modal show={this.state.statusMap} onHide={lgClose} bsSize="large" aria-labelledby="contained-modal-title-lg">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">{this.props.lng.GOOLE_MAPS}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <center>
              <div style={{height: `500px`,width:'900px'}}>
                {
                  <DirectionsAroundGoogleMap
                    containerElement={
                      <div style={{ height: `100%` }} />
                    }
                    mapElement={
                      <div style={{ height: `100%` }} />
                    }
                    center={this.state.origin}
                    directions={this.state.directions}
                  />
                }
              </div>
            </center>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.listLike.isShowModal} onHide={() => {
          let listLike =  this.state.listLike;
          listLike.isShowModal = false;
          this.setState({listLike: listLike});
        }} bsSize="large" aria-labelledby="contained-modal-title-lg" className="modal-like">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">{this.props.lng.LIST_LIKE_TITLE}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <center>
              <div style={{minHeight: `200px`,width:'100%', padding: '10px'}}>
                {
                  this.state.listLike.messages.map((item, index) =>
                    <div className="list-friend-suggest btn-add" key={index}>
                      {
                        item.idUser.avatar?
                          <div onClick={() => this.onTrackingFriend(item.idUser.id)}
                             className="friend-avatar-img css-bg-df"
                             style={{
                               width:'55px',
                               cursor: 'pointer',
                               height:'55px',
                               overflow:'hidden',
                               float:'left',
                               borderRadius:'50%',
                               background:"url("+Constants.linkApi+'/images/'+item.idUser.avatar+")",
                               backgroundRepeat:'no-repeat',
                               backgroundSize:'cover',
                               backgroundPosition:'50% 50%'}}>
                          </div>
                        :
                          <div onClick={() => props.onTrackingFriend(item.idUser.id)}
                             className="friend-avatar-img css-bg-df"
                             style={{
                               width:'55px',
                               cursor: 'pointer',
                               height:'55px',
                               overflow:'hidden',
                               float:'left',
                               borderRadius:'50%',
                               background:"url("+Constants.linkServerImage+'no_user.png)',
                               backgroundRepeat:'no-repeat',
                               backgroundSize:'cover',
                               backgroundPosition:'50% 50%'}}>
                          </div>
                      }
                      <div className="suggest-address">
                        <p className = "text-left" style={{margin:'0px'}}><Link onClick={() => this.onTrackingFriend(item.idUser.id)}>{item.idUser.fullname}</Link></p>
                        <p className = "text-left">{item.createdAt}</p>
                      </div>
                    </div>
                  )
                }
                {
                  this.state.listLike.messages.length < this.state.listLike.total? this.state.listLike.pageNumber > 1 ?
                    <div className="load-more"
                         onClick={() => {
                           /*let listLike = this.state.listLike;
                           listLike.page += 1;
                           this.setState({listLike:listLike});*/
                           this.onLoadListLiker(this.state.listLike.isPostCliked, this.state.listLike.page + 1)
                       }}>
                      Xem thêm
                    </div>:null: null
                }
              </div>
            </center>
          </Modal.Body>
        </Modal>
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
      </div>
    );
  }
}
HomePage.propTypes={
  actions:PropTypes.object.isRequired
};
function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.newFeedReducer,
    dataComment: state.commentReducer
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(newsFeedAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
