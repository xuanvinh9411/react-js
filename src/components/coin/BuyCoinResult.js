/*
* Created by TrungPhat on 1/17/2017
*/
import React, {PropTypes} from "react";
import * as acoinAction from '../../actions/acoinAction';
import * as actionTypes from '../../actions/actionTypes';
import {Link, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LoadingTable from '../controls/LoadingTable';
import {Pagination, Modal} from 'react-bootstrap';
import {Helmet} from "react-helmet";
let Constants=require('../../services/Constants');
let _=require('../../utils/Utils');
let urlOnPage=require('../../url/urlOnPage');

class BuyCoinResult extends React.Component{
  initialStateConstructor_Status(){
    return{
      isSubmit:true,
      isUpdate: false
    }
  }
  constructor(props, context){
    super(props, context);
    this.state = {
      initialize: this.initialStateConstructor_Status()
    }
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  componentWillUnmount(){
    _.removeTemporaryData(Constants.SESSION_NAME_CHECKOUT_NL_TOKEN);
    _.removeTemporaryData(Constants.SESSION_NUMBER_ACOIN_BUY)
  }
  componentWillMount(){
    if(!_.checkSession() || !_.getTemporaryData(Constants.SESSION_NAME_CHECKOUT_NL_TOKEN)){
      browserHistory.push(urlOnPage.loginRegister.lrLogin);
    }
    let query = this.props.location.query;
    if((query.error_code == '00' || parseInt(query.error_code) == 0) && query.token == _.getTemporaryData(Constants.SESSION_NAME_CHECKOUT_NL_TOKEN)){
      this.props.actions.updatePaymentNL({
        token: _.getTemporaryData(Constants.SESSION_NAME_CHECKOUT_NL_TOKEN)
      })
    }else{
      _.setTemporaryData('errorPaymentNL', true);
      browserHistory.push(urlOnPage.coin.coinBuyCoin);
    }
  }
  componentWillReceiveProps(nextProps){
    let type=nextProps.dataMessage.type;
    let result=nextProps.dataMessage.data;
    switch (type){
      case actionTypes.UPDATE_NL_SUCCESS:
        if(result.code == Constants.RESPONSE_CODE_SUCCESS){
          this.props.toastMessage.success(
            this.props.lng.BUY_COIN_SUCCESS(
              _.format_price(_.getTemporaryData(Constants.SESSION_NUMBER_ACOIN_BUY)
              )
            ), 'Thông báo'
          )
          browserHistory.push(urlOnPage.coin.coinBuyCoin);
        }else{
          if(result.code == Constants.RESPONSE_CODE_OTP_INVALID){
            this.props.actions.updatePaymentNL({
              token: _.getTemporaryData(Constants.SESSION_NAME_CHECKOUT_NL_TOKEN)
            })
          }else{
            _.setTemporaryData('errorPaymentNL', true);
            browserHistory.push(urlOnPage.coin.coinBuyCoin);
          }
        }
    }
  }
  render(){
    return(
      <div className="loaded-coin">
        <Helmet
          title="Acoin"
        />
        <div className="buy-coin-update">
          <LoadingTable/>
        </div>
      </div>
    );
  }
}

BuyCoinResult.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.acoinReducer,
    data:PropTypes.array
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(acoinAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(BuyCoinResult);
