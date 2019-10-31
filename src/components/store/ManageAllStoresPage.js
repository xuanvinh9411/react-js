/*
 * Created by TrungPhat on 1/10/2017
 */
import React, {PropTypes} from "react";
import {Link, browserHistory} from 'react-router';
import * as shopAction from '../../actions/shopAction';
import * as actionType from '../../actions/actionTypes';
import {Pagination} from 'react-bootstrap';
import StoreListPage from './StoreListPage';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ToastContainer, ToastMessage} from "react-toastr";
import LoadingTable from '../controls/LoadingTable';
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Session=require('../../utils/Utils');
let Constants=require('../../services/Constants');
let _=require('../../utils/Utils');
class ManageAllStoresPage extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state={
      products:[],
      error: {},
      total:'',
      style:{},
      isUpload:false,
      isSubmit:false,
      isReady:false,
      firstLoad:false,
      isChangeState:false,
      pageNumber:1,
      activePage: 1,
      idShop: ''
    };
    this.handleSelect=this.handleSelect.bind(this);
  }

  componentWillMount(){
    if(!Session.checkSession()){
      browserHistory.push("/login");
    }else{
      this.checkQuery();
    }
  }
  componentDidMount(){
    window.scrollTo(0,0)
  }
  loadData(page){
    this.setState({firstLoad:true});
    this.props.actions.loadListShop({page:page});
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
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result='';
      switch (type){
        case actionType.LOAD_SHOP_SUCCESS:
          result=nextProps.dataMessage.dataShops;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.setState({products:result.data.shops,
              total:result.data.total,
              pageNumber: Math.ceil(result.data.total /result.data.totalItemPaging),
              isReady:true});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.checkQuery();
            }else{
              this.setState({isReady:true});
            }
          }
          break;
        case actionType.DELETE_SHOP_SUCCESS:
          result=nextProps.dataMessage.dataShops;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let queryPage=this.props.location.query.page?this.props.location.query.page:1;
            let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
            this.setState({activePage:parseInt(newActivePage)});
            if(this.state.products) {
              if (this.state.isChangeState) {
                if(this.state.products.length==1){
                  let query=this.props.location.query;
                  if((parseInt(newActivePage)-1)==1)
                    delete query.page;
                  else
                    query.page=newActivePage-1;
                  browserHistory.push({pathname:this.props.location.pathname,query:query});
                }else{
                  if(this.state.products.length>1){
                    this.loadData(newActivePage-1);
                  }
                }
                this.setState({isChangeState: false});
              }
            }
            this.refs.container.success(this.props.lng.TEXT_SUCCESS, `Thông báo.`, {
              closeButton: true,
            });
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.props.actions.deleteShop(this.state.idShop);
            }else{
              this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
      }
    }
    if(nextProps.location.key!=this.props.location.key){
      window.scrollTo(0,0)
      let queryPage=nextProps.location.query.page?nextProps.location.query.page:1;
      let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
      this.setState({activePage:parseInt(newActivePage)});
      this.loadData(newActivePage-1);
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
  onDeleteShop(id){
    if(confirm(this.props.lng.CONFIRM_DELETE)){
      this.setState({isChangeState:true, idShop: id});
      this.props.actions.deleteShop(id);
    }
  }
  render(){
    let cmpNull='';
    if(this.state.products.length==0){
      cmpNull=<div className="no-result-data">
        <p className="primary-color">{this.props.lng.SHOP_NO_SHOPS}</p>
      </div>
    }
    return(
      <div id="all-shop" style={{minHeight: '660px'}}>
        <Helmet
          title="Quản lý cửa hàng"
        />
        <div className="create-store">
          <Link className="primary-color" to="/tao-cua-hang">
            <img src={Constants.linkServerImage+"/common/create-store.png"} />{this.props.lng.SHOP_BUTTON_CREATE_SHOP}</Link>
        </div>
        {cmpNull}
        {this.state.isReady==false?<LoadingTable/>:
          <StoreListPage
            messages={this.state.products}
            lng={this.props.lng}
            onDeleteShop={this.onDeleteShop.bind(this)}
          />}
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

ManageAllStoresPage.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.shopReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(shopAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ManageAllStoresPage);
