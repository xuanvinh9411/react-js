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

class CoinPage extends React.Component{
  initialStatePagination(){
    return{
      pageNumber:1,
      activePage: 1,
      total: 0
    }
  }
  initialStateConstructor_Status(){
    return{
      isReady: false,
      onLoadData: false,
      onShowModalBankList: false,
      infoAcoin:{},
      isSubmit:false
    }
  }
  initialStateNLCheckout(){
    return{
      method:'SetExpressCheckout',
      payment_method:'ATM_ONLINE',
      bank_code:''
    }
  }
  constructor(props, context){
    super(props, context);
    this.state = {
      pagination: this.initialStatePagination(),
      initialize: this.initialStateConstructor_Status(),
      products: [],
      checkout: this.initialStateNLCheckout()
    }
    this.handleSelect=this.handleSelect.bind(this);
    this.updateState = this.updateState.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  componentWillMount(){
    if(!_.checkSession()){
      browserHistory.push(urlOnPage.loginRegister.lrLogin);
    }else{
      this.checkQuery();
    }
    if(_.getTemporaryData('errorPaymentNL')){
      this.props.toastMessage.error(this.props.lng.BUY_COIN_ERROR, 'Thông báo');
      _.removeTemporaryData('errorPaymentNL');
    }
  }
  checkQuery(){
    if(_.isEmpty(this.props.location.query)){
      this.loadListAcionSys(0);
    }else{
      let queryPage=this.props.location.query.page?this.props.location.query.page:1;
      let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
      let pagination = this.state.pagination;
      pagination.activePage = parseInt(newActivePage);
      this.setState({pagination: pagination});
      this.loadListAcionSys(newActivePage-1);
    }
  }
  loadListAcionSys(page){
    let initialize = this.state.initialize;
    initialize.onLoadData = true;
    this.setState({initialize: initialize});
    this.props.actions.listAcoinSys({page: page});
  }
  componentWillReceiveProps(nextProps){
    let type=nextProps.dataMessage.type;
    let result=nextProps.dataMessage.data;
    switch (type){
      case actionTypes.LOAD_LIST_ACOIN_SUCCESS:
        /* Chặn trả lại dữ liệu nhiều lần khi gọi thôn báo + tin nhắn */
        if(this.state.initialize.onLoadData){
          let initialize = this.state.initialize;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            let pagination = this.state.pagination;
            pagination.pageNumber = Math.ceil(result.data.total /result.data.totalItemPaging);
            pagination.total = result.data.total;
            this.setState({
              products: result.data.products,
              pagination: pagination,
              initialize: initialize});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.checkQuery();
            }else{
              let initialize = this.state.initialize;
              this.setState({initialize:initialize});
            }
          }
          this.setState({initialize: initialize});
        }
        break;
      case actionTypes.SEND_DATA_TO_NL_SUCCESS:{
        if(result.code==Constants.RESPONSE_CODE_SUCCESS){
          let initialize = this.state.initialize;
          initialize.isSubmit = false;
          this.setState({initialize:initialize});
          _.setTemporaryData(Constants.SESSION_NAME_CHECKOUT_NL_TOKEN, result.data.token);
          window.open(result.data.checkout_url,'_parent');
        }else if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
          this.props.actions.sendDataToNL({
            idProduct: this.state.initialize.infoAcoin.id,
            method: this.state.checkout.payment_method,
            bankCode: this.state.checkout.bank_code
          });
        }else{
          this.props.toastMessage.error(this.props.lng.BUY_COIN_ERROR, `Thông báo.`, {
            closeButton: true,
          });
        }
      }
    }
    if(nextProps.location.key!=this.props.location.key){
      window.scrollTo(0,0);
      let queryPage=nextProps.location.query.page?nextProps.location.query.page:1;
      let newActivePage=_.isInt(queryPage)?queryPage:this.state.activePage;
      let pagination = this.state.pagination;
      pagination.activePage = parseInt(newActivePage);
      this.setState({pagination: pagination});
      this.loadListAcionSys(newActivePage-1);
    }
  }
  handleSelect(eventKey) {
    let query = this.props.location.query;
    if(eventKey==1)
      delete query.page;
    else
      query.page=eventKey;
    browserHistory.push({pathname:this.props.location.pathname,query:query});
  }
  updateState(e) {
    e.preventDefault();
    let field=e.target.name;
    let valueField=e.target.value;
    let checkout=this.state.checkout;
    if(field=='option_payment'){
      if(valueField == 'VISA' || valueField == 'NL'){
        checkout.bank_code=valueField;
        checkout.payment_method=valueField;
      }else{
        if(valueField == 'MASTER'){
          checkout.bank_code=valueField;
          checkout.payment_method='VISA';
        }else{
          checkout.payment_method=valueField;
          checkout.bank_code = '';
        }
      }
    }
    if(field=='bankcode'){
      checkout.bank_code=valueField;
    }
    this.setState({checkout:checkout});
  }
  onClickNext(){
    if(this.state.checkout.payment_method!=''){
      if(this.state.checkout.bank_code!=''){
        if(confirm(this.props.lng.BUY_COIN_CONFIRM(_.format_price(this.state.initialize.infoAcoin.aCoin), _.format_price(this.state.initialize.infoAcoin.money)))){
          let initialize = this.state.initialize;
          initialize.isSubmit = true;
          this.setState({initialize:initialize});
          _.setTemporaryData(Constants.SESSION_NUMBER_ACOIN_BUY, this.state.initialize.infoAcoin.aCoin);
          this.props.actions.sendDataToNL({
            idProduct: initialize.infoAcoin.id,
            method: this.state.checkout.payment_method,
            bankCode: this.state.checkout.bank_code
          });
        }
      }else{
        this.props.toastMessage.error(this.props.lng.BUY_COIN_WARNING_BANKCODE, `Thông báo.`, {
          closeButton: true,
        });
      }
    }else{
      this.props.toastMessage.error(this.props.lng.BUY_COIN_WARNING_PAYMENT_METHOD, `Thông báo.`, {
        closeButton: true,
      });
    }
  }
  render(){
    return(
      <div className="loaded-coin">
        <Helmet
          title="Nạp Acoin"
        />
        <div>
          {
            this.state.products.map((item, idx) =>
              <div className="item-list-row-coin" key={idx}>
                <div className="left-width30 w12 pull-left">
                  <img src={Constants.linkApi + '/images/' + item.images[0]}/>
                </div>
                <div className="right-width70 pull-left w88">
                  <h3>
                    <a className="primary-color pull-left">{item.name}</a>
                  </h3>
                  <div className="price-item-coin pull-right">
                    <span className="primary-color">{item.aCoin > 0 ? _.format_price(item.aCoin) : 0}</span>
                    <img src={Constants.linkServerImage + 'common/icon-coin.png'}/>
                  </div>
                  <p className="split-string">
                    {item.description}
                  </p>
                  <div className="price-buy-acoin">
                    <span>{this.props.lng.BUY_COIN_PRICE(item.money > 0 ? _.format_price(item.money) : 0)}</span>
                  </div>
                  <button type="button"
                          onClick={() => {
                            let initialize = this.state.initialize;
                            initialize.onShowModalBankList = true;
                            initialize.infoAcoin = item;
                            this.setState({initialize: initialize})
                          }}
                          className="btn-action-primary btn-buy primary-color">{this.props.lng.BUY_COIN_BUTTON}</button>
                </div>
              </div>
            )
          }
          <div className="center-btn">
            {this.state.pagination.pageNumber>1?
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                bsSize="normal"
                maxButtons={Constants.MAX_BUTTON_PAGGING}
                items={this.state.pagination.pageNumber}
                activePage={this.state.pagination.activePage}
                onSelect={this.handleSelect}/>
              :
              null}
          </div>
          <Modal show={this.state.initialize.onShowModalBankList}
                 onHide={() => {
                   let initialize = this.state.initialize;
                   initialize.onShowModalBankList = false;
                   this.setState({initialize: initialize, checkout: this.initialStateNLCheckout()})
                 }}
                 bsSize="large" aria-labelledby="contained-modal-title-lg" dialogClassName="modal-checkout-nl">
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-lg">{this.props.lng.BUY_COIN_MODAL_TITLE}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="bank-list-nl">
                <div className="nl-checkout-content clearfix">
                  <ul className="list-content" style={{
                    position: 'relative',
                    padding:0
                  }}>
                    <li className={this.state.checkout.payment_method == 'NL' ?'active bg-active-nl':''} style={{float: 'left'}}>
                      <label>
                        <div className="nl-atm">
                          <p>{this.props.lng.BUY_COIN_VI_NGAN_LUONG}</p>
                          <img src={Constants.linkServerImage+'/ic_logo_nganluong.png'}/>
                          <input type="radio" value="NL" name="option_payment" onChange={this.updateState}/>
                        </div>
                      </label>
                    </li>
                    <li className={this.state.checkout.payment_method=='ATM_ONLINE'?'active bg-active-nl':''} style={{float: 'left'}}>
                      <label>
                        <div className="nl-atm">
                          <p>{this.props.lng.BUY_COIN_ATM_NOI_DIA}</p>
                          <img src={Constants.linkServerImage+'/ic_atm_noidia.png'} />
                          <input type="radio" value="ATM_ONLINE" name="option_payment" onChange={this.updateState}/>
                        </div>
                      </label>
                    </li>
                    <li className={
                      this.state.checkout.payment_method == 'VISA' && this.state.checkout.bank_code=='VISA'?'active bg-active-nl':''} style={{float: 'left'}}>
                      <label>
                        <div className="nl-atm">
                          <p>{this.props.lng.BUY_COIN_VISA}</p>
                          <img src={Constants.linkServerImage+'/ic_atm_visa.png'} />
                          <input type="radio" value="VISA" name="option_payment" onChange={this.updateState}/>
                        </div>
                      </label>
                    </li>
                    <li className={this.state.checkout.payment_method == 'VISA' && this.state.checkout.bank_code=='MASTER'?'active bg-active-nl':''} style={{float: 'left'}}>
                      <label>
                        <div className="nl-atm">
                          <p>{this.props.lng.BUY_COIN_MASTERCARD}</p>
                          <img src={Constants.linkServerImage+'/ic_atm_mastercard.png'} />
                          <input type="radio" value="MASTER" name="option_payment" onChange={this.updateState}/>
                        </div>
                      </label>
                    </li>
                  </ul>
                  <div className="boxContent" style={{display: this.state.checkout.payment_method=='ATM_ONLINE'?'block':'none'}}>
                    <p><i>
                      {this.props.lng.BUY_COIN_BANK_NOTE}</i></p>
                    <ul className="cardList clearfix">
                      <li className={this.state.checkout.bank_code == 'BIDV' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="BIDV" title="Ngân hàng TMCP Đầu tư &amp; Phát triển Việt Nam"/>
                          <input type="radio" value="BIDV"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'VCB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="VCB" title="Ngân hàng TMCP Ngoại Thương Việt Nam"/>
                          <input type="radio" value="VCB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'DAB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="DAB" title="Ngân hàng Đông Á"/>
                          <input type="radio" value="DAB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'TCB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="TCB" title="Ngân hàng Kỹ Thương"/>
                          <input type="radio" value="TCB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'MB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="MB" title="Ngân hàng Quân Đội"/>
                          <input type="radio" value="MB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'VIB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="VIB" title="Ngân hàng Quốc tế"/>
                          <input type="radio" value="VIB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'ICB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="ICB" title="Ngân hàng Công Thương Việt Nam"/>
                          <input type="radio" value="ICB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'EXB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="EXB" title="Ngân hàng Xuất Nhập Khẩu"/>
                          <input type="radio" value="EXB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'ACB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="ACB" title="Ngân hàng Á Châu"/>
                          <input type="radio" value="ACB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'HDB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="HDB" title="Ngân hàng Phát triển Nhà TPHCM"/>
                          <input type="radio" value="HDB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'MSB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="MSB" title="Ngân hàng Hàng Hải"/>
                          <input type="radio" value="MSB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'NVB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="NVB" title="Ngân hàng Nam Việt"/>
                          <input type="radio" value="NVB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'VAB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="VAB" title="Ngân hàng Việt Á"/>
                          <input type="radio" value="VAB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'VPB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="VPB" title="Ngân Hàng Việt Nam Thịnh Vượng"/>
                          <input type="radio" value="VPB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'SCB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="SCB" title="Ngân hàng Sài Gòn Thương tín"/>
                          <input type="radio" value="SCB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'PGB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="PGB" title="Ngân hàng Xăng dầu Petrolimex"/>
                          <input type="radio" value="PGB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'GPB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="GPB" title="Ngân hàng TMCP Dầu khí Toàn Cầu"/>
                          <input type="radio" value="GPB"  name="bankcode" onChange={this.updateState} />
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'AGB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="AGB" title="Ngân hàng Nông nghiệp &amp; Phát triển nông thôn"/>
                          <input type="radio" value="AGB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'SGB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="SGB" title="Ngân hàng Sài Gòn Công Thương"/>
                          <input type="radio" value="SGB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'BAB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="BAB" title="Ngân hàng Bắc Á"/>
                          <input type="radio" value="BAB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'TPB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="TPB" title="Tền phong bank"/>
                          <input type="radio" value="TPB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'NAB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="NAB" title="Ngân hàng Nam Á"/>
                          <input type="radio" value="NAB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'SHB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="SHB" title="Ngân hàng TMCP Sài Gòn - Hà Nội (SHB)"/>
                          <input type="radio" value="SHB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                      <li className={this.state.checkout.bank_code == 'OJB' ? 'bank-online-methods active' : 'bank-online-methods'}>
                        <label>
                          <i className="OJB" title="Ngân hàng TMCP Đại Dương (OceanBank)"/>
                          <input type="radio" value="OJB"  name="bankcode" onChange={this.updateState}/>
                        </label></li>
                    </ul>
                  </div>
                </div>
                <div className="button-checkout-nl clearfix">
                  <button
                    name="nlpayment"
                    onClick={()=>this.onClickNext()}>{this.props.lng.BUY_COIN_BUTTON_PAYMENT}
                      <span style={{marginLeft: '5px'}} className={ !this.state.initialize.isSubmit? 'fa fa-credit-card' : 'fa fa-spinner fa-pulse fa-fw'}/>
                    </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}

CoinPage.propTypes={
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
export default connect(mapStateToProps, mapDispatchToProps)(CoinPage);
