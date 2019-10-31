/*
 * Created by TrungPhat on 27/02/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as itemsAction from '../../actions/itemsAction';
import * as actionTypes from '../../actions/actionTypes';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ItemsList from './ItemsList';
import LoadingTable from '../controls/LoadingTable';
import {ToastContainer, ToastMessage} from "react-toastr";
import {HelpBlock,Pagination} from 'react-bootstrap';
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let Constants=require('../../services/Constants');
let Session=require('../../utils/Utils');
let Aes=require('../../services/httpRequest');
let _=require('../../utils/Utils')
class ItemsPage extends React.Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      shop:{},
      error: {},
      messages:[],
      total:0,
      isLoad: false,
      isBuy:false,
      isShop:'',
      priceItem:0,
      number:0,
      isChangeState:false,
      data:{},
      pageNumber:1,
      activePage: 1,
      parent:'-1'
    };
    this.handleSelect=this.handleSelect.bind(this);
  }

  componentWillMount(){
    if(!_.checkSession()){
      browserHistory.push("/login");
    }else{
      this.setState({isShop:this.props.params.id});
      this.checkQuery();
    }
  }
  componentDidMount(){
    window.scrollTo(0, 0);
  }
  checkQuery(){
    let parent = -1;
    if(this.props.route.path == '/:id/items/child'){
      parent = _.getTemporaryData('idItemParent') ? _.getTemporaryData('idItemParent') : -1;
    }
    this.setState({parent:parent});
    if(_.isEmpty(this.props.location.query)){
      this.loadData(0, parent);
    }else{
      let queryPage=this.props.location.query.page?this.props.location.query.page:1;
      let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
      this.setState({activePage:parseInt(newActivePage), parent: parseInt(parent)});
      this.loadData(newActivePage-1, parent);
    }
  }
  loadData(page, parent){
    this.setState({isLoad: true});
    this.props.actions.listItem({page:page, parent: parent});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result='';
      switch (type){
        case actionTypes.LOAD_ITEM_SUCCESS:
          result=nextProps.dataMessage.dataList;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(result.parent != -1){
              let data=result.data.products;
              /*let shop=Aes.aesDecrypt(localStorage.getItem('iS'));
              if(shop.decorate){
                if(shop.decorate.length>0&&data.length>0){
                  for(let i=0;i<shop.decorate.length;i++){
                    for(let j=0; j<data.length; j++){
                      if(shop.decorate[i].id==data[j].id){
                        data[j]=(Object.assign({isBuy:true},data[j]));
                      }
                    }
                  }
                }
              }*/
            }
            this.setState({
              messages:result.data.products,
              total:result.data.total,
              pageNumber: Math.ceil(result.data.total /result.data.totalItemPaging),
              isLoad:false
            });
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.checkQuery();
            }else{
              this.setState({isLoad:false});
            }
          }
          break;
        case actionTypes.BUY_ITEM_SUCCESS:
          result=nextProps.dataMessage.dataList;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            if(this.state.isBuy){
              this.setState({isBuy:false});
              let user=Aes.aesDecrypt(localStorage.getItem('user'));
              user.balance=user.balance-this.state.priceItem;
              //let shop=Aes.aesDecrypt(localStorage.getItem('iS'));
              //let decorate=shop.decorate;
              let data=this.state.data;
              data.counts+=1;
             // decorate.push(data);
              //shop.decorate=decorate;
              //localStorage.setItem('iS',Aes.aesEncrypt(shop));
              localStorage.setItem('user',Aes.aesEncrypt(user));
              //let page=location.search.split('page=')[1];
              //this.loadData(page-1, this.state.parent);
              this.refs.container.success(this.props.lng.PT_MSG_BUY_SUCCESS, `Thông báo.`, {
                closeButton: true,
              });
            }
          }else{
            if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
              this.onBuyItem(this.state.data);
            }else{
              this.setState({isBuy:false});
              this.refs.container.error(this.props.lng.PT_MSG_BUY_FAILED, `Thông báo.`, {
                closeButton: true,
              });
            }
          }
          break;
      }
    }
    if(nextProps.location.key!=this.props.location.key){
      window.scrollTo(0, 0);
      let queryPage=nextProps.location.query.page?nextProps.location.query.page:1;
      let parent = -1;
      if(window.location.pathname.indexOf('/items/child') >= 0){
        parent = _.getTemporaryData('idItemParent') ? _.getTemporaryData('idItemParent'):-1;
      }
      let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
      this.setState({activePage:parseInt(newActivePage), parent:parent});
      this.loadData(newActivePage-1, parent);
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
  onBuyItem(data){
    if(confirm(this.props.lng.PT_MSG_BUY_CONFIRM)){
      this.setState({isBuy:true, priceItem:data.aCoin, data:data});
      this.props.actions.buyItem({id:data.id, idShop:this.state.isShop});
    }
  }
  onPushLink(id){
    let params = this.props.params;
    params.pr = id;
    _.setTemporaryData('idItemParent', id);
    browserHistory.push('/'+params.id+'/items/child');
  }

  render(){
    return(
      <div id="list-item-store">
        <Helmet
          title="Vật phẩm phong thủy"
        />
        {this.state.isLoad == true || this.state.isBuy==true ? <LoadingTable/> :
          <ItemsList
           messages={this.state.messages}
           onBuyItem={this.onBuyItem.bind(this)}
           isBuy={this.state.isBuy}
           lng={this.props.lng}
           parent = {this.state.parent}
           onPushLink = {this.onPushLink.bind(this)}
           />
        }
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

ItemsPage.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.itemReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(itemsAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ItemsPage);
