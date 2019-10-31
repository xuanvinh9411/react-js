/*
 * Created by TrungPhat on 30/03/2017
 */
import React,{PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as adsAction from '../../actions/adsAction';
import * as actionType from '../../actions/actionTypes';
import AdsVideoList from './AdsVideoList';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LoadingTable from '../controls/LoadingTable';
import {HelpBlock,Pagination} from 'react-bootstrap';
import {ToastContainer, ToastMessage} from "react-toastr";
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Aes=require('../../services/httpRequest');
let Constants=require('../../services/Constants');
let _=require('../../utils/Utils');
class AdsVideoPage extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state={
      ads:[],
      error:[],
      isReady:false,
      total:0,
      pageNumber:1,
      activePage: 1,
      isView : 0,
    }
    this.handleSelect = this.handleSelect.bind(this);
    this.checkQuery = this.checkQuery.bind(this);
  }

  componentWillMount(){
    if(!_.checkSession()){
      browserHistory.push("/login");
    }else{
      this.checkQuery();
    }
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  checkQuery(){
    let isView = this.state.isView;
    if(_.isEmpty(this.props.location.query)){
      this.loadData(0, isView);
    }else{
      let queryPage=this.props.location.query.page?this.props.location.query.page:1;
      let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
      this.setState({activePage:parseInt(newActivePage)});
      this.loadData(newActivePage-1, isView);
    }
  }
  loadData(page, isView) {
    console.log("isView isView", isView);
    this.setState({isReady:true})
    this.props.actions.listVideoAds({page:page, isView});
  }

  onChangeStateIsView (isView) {
    this.setState({isView: isView},function() {this.loadData(0, isView) })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result={};
      switch (type){
        case actionType.LOAD_ADS_VIDEO_SUCCESS:
          result=nextProps.dataMessage.dataAds;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.setState({
              ads:result.data.ads,
              isReady:false,
              total:result.data.total,
              pageNumber: Math.ceil(result.data.total /result.data.totalItemPaging),});
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
      <div className="list-adwords">
        <Helmet
          title="Quảng cáo video"
        />
        <h4 style={{
          marginLeft:'0px',
          marginBottom: '15px',
          fontSize: '17px'
        }}>
          <span> <a href="javascript: void(0)"> Xem quảng cáo nhận Acoin  </a></span>
          <span style={{float: 'right', fontWeight: '400'}}><a onClick={this.onChangeStateIsView.bind(this, 1)}> Đã xem </a></span>
          <span style={{float: 'right', marginRight: '30px', fontWeight: '400'}}><a onClick={this.onChangeStateIsView.bind(this, -1)}> Chưa xem</a></span>
          <span style={{float: 'right', fontWeight: '400', marginRight: '30px'}}><a onClick={this.onChangeStateIsView.bind(this, 0)}> Tất cả</a></span>

        </h4>

        {this.state.isReady?<LoadingTable/>:
          <AdsVideoList
            lng={this.props.lng}
            messages={this.state.ads}
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
      </div>
    );
  }
}

AdsVideoPage.propTypes={
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
export default connect(mapStateToProps, mapDispatchToProps)(AdsVideoPage);
