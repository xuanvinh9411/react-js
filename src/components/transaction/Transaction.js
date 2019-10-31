/*
 * Created by TrungPhat on 28/03/2017
 */
import React,{PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as transactionAction from '../../actions/transactionAction';
import * as actionType from '../../actions/actionTypes';
import TransactionList from './TransactionList';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Pagination} from 'react-bootstrap';
import LoadingTable from '../controls/LoadingTable';
import {ToastContainer, ToastMessage} from "react-toastr";
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Aes=require('../../services/httpRequest');
let Constants=require('../../services/Constants');
let _=require('../../utils/Utils');
const urlOnPage = require('../../url/urlOnPage');
let httpRequest = require('../../services/httpRequest');
const urlRequestApi = require('../../url/urlRequestApi');

class Transaction extends React.Component {
  constructor(props, context){
    super(props, context);
    this.state={
      trs:[],
      error:[],
      isReady:false,
      state:'',
      isDell:false,
      total:0,
      pageNumber:1,
      activePage: 1,
      totalMoney : 0
    }
    this.handleSelect=this.handleSelect.bind(this);
    this.getMoneyToUser=this.getMoneyToUser.bind(this);
  }

  componentWillMount(){
    if(!_.checkSession()){
      browserHistory.push("/login");
    }
    else {
      this.checkQuery();
      this.getMoneyToUser();
    }
  }

  getMoneyToUser () {
    let totalMoney = 0;
    const that = this;
    let data = {
      platform: Constants.platform,
      session: localStorage.getItem(Constants.SESSION_NAME_REQUEST),
    };

    httpRequest.post(urlRequestApi.user.userGetMoney, data, function cb(err, res) {
      if (!err && res && res.data && res.data.balance) {
        that.setState({totalMoney : res.data.balance});
      }
    });
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
    this.setState({isReady:true})
    this.props.actions.getTrs({page:page});
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result={};
      switch (type){
        case actionType.LOAD_TRS_SUCCESS:
          result=nextProps.dataMessage.dataTrs;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.setState({trs:result.data.transactions,
              isReady:false, total:result.data.total,
              pageNumber: Math.ceil(result.data.total /result.data.totalItemPaging)});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.checkQuery();
            }
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
  handleSelect(eventKey) {
    let query=this.props.location.query;
    if(eventKey==1)
      delete query.page;
    else
      query.page=eventKey;
    browserHistory.push({pathname:this.props.location.pathname,query:query});
  }
  render(){
    return(
      <div>
        <Helmet
          title="Lịch sử giao dịch"
        />
        { this.state.isReady == true ?
          <LoadingTable height="660px"/> :
          <div className="accept-friend p_ads-wrap">
            <h4 style={{marginLeft:'0px'}}>
              <span >{this.props.lng.TRANSACTION_TITLE} </span>
              <span style={{float: 'right', fontWeight: '400'}}><Link to={urlOnPage.ads.adsVideoSysList}> Xem quảng cáo</Link></span>
              <span style={{float: 'right', marginRight: '30px', fontWeight: '400'}}><Link to={urlOnPage.coin.coinBuyCoin}> Nạp Acoin </Link></span>
              <span style={{float: 'right', marginRight: '30px', fontWeight: '400'}}><Link to={urlOnPage.friends.friendList}> Chuyển Acoin </Link></span>
            </h4>
            <div className="p_ads_list_content">
              <p style={{fontSize: '16px'}}>
                <a href="javascript:void(0)"> Tổng số dư hiện tại: {this.state.totalMoney} </a>
                <img width="18px" style={{marginTop: "-4px" }} src={Constants.linkServerImage + "/dong_tien_giao_dich.png"} />
              </p>
              <TransactionList
                lng={this.props.lng}
                messages={this.state.trs}
              />
            </div>
            <div className="text-center">
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
        }
      </div>
    );
  }
}

Transaction.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.transactionReducer,
    data:PropTypes.array
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(transactionAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
