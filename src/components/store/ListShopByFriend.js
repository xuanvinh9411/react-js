/*
 * Created by TrungPhat on 18/02/2017
 */
import React, {PropTypes} from "react";
import {Link, browserHistory} from 'react-router';
import * as shopAction from '../../actions/shopAction';
import * as actionType from '../../actions/actionTypes';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Pagination} from 'react-bootstrap';
import StoreListPage from './StoreListPage';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ToastContainer, ToastMessage} from "react-toastr";
import LoadingTable from '../controls/LoadingTable';

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Session=require('../../utils/Utils');
let Constants=require('../../services/Constants');

class ListShopByFriend extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state={
      products:[],
      error: {},
      total:'',
      userId:'',
      pageCurrent:'',
      totalItemPaging:'',
      isUpload:false,
      isSubmit:false,
      isReady:false
    };
    this.handleSelect=this.handleSelect.bind(this);
  }

  componentWillMount(){
    if(!Session.checkSession()){
      browserHistory.push("/login");
    }
    else{
      let url=window.location.pathname;
      let userId=url.slice(10);
      this.props.actions.trackingFriend({userIdFriend:userId});
      let data={page:0, userId:userId};
      this.loadData(data);
      this.setState({userId:userId});
    }
  }

  loadData(params){
    this.props.actions.loadListShop({page:params.page, userId: params.userId});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result='';
      switch (type){
        case actionType.TRACKING_FRIEND_SUCCESS:
          result=nextProps.dataMessage.dataShops;
          if(result.code!=Constants.RESPONSE_CODE_SUCCESS){
            browserHistory.push('/danh-sach-ban-be');
          }
          break;
        case actionType.LOAD_SHOP_SUCCESS:
          result=nextProps.dataMessage.dataShops;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.setState({products:result.data.shops, total:result.data.total, totalItemPaging:result.data.totalItemPaging, isReady:true})
          }
          break;
      }
    }
  }


  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    })
    let data={page:eventKey-1, userId:this.state.userId};
    this.loadData(data);
  }

  onDeleteShop(){}

  render(){
    let cmpPagging='';
    let pageNum= Math.ceil(this.state.total / this.state.totalItemPaging)
    if(pageNum>1){
      cmpPagging = (
        <Pagination
          bsSize="small"
          items={pageNum}
          activePage={this.state.activePage}
          onSelect={this.handleSelect}/>
      );
    };
    let cmpNull='';
    if(this.state.products.length==0){
      cmpNull=<div className="no-result-data">
        <p className="primary-color">Người dùng chưa có địa điểm !</p>
      </div>
    }
    return(
      <div id="all-shop">
        {cmpNull}
        {this.state.isReady==false?<LoadingTable/>:
          <StoreListPage
            messages={this.state.products}
            onDeleteShop={this.onDeleteShop.bind(this)}
          />}
        {cmpPagging}
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
      </div>
    );
  }
}

ListShopByFriend.propTypes={
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
export default connect(mapStateToProps, mapDispatchToProps)(ListShopByFriend);
