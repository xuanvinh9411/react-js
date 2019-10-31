/*
 * Created by TrungPhat on 1/24/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio} from 'react-bootstrap';
let Constants=require('../../services/Constants');
let Aes=require('../../services/httpRequest');
let urlOnPage = require('../../url/urlOnPage');
let functionCommon = require('../common/FunctionCommon');


const StoreListRowPage =(props)=>{
  let message=props.message;
  let userCurrent=Aes.aesDecrypt(localStorage.getItem('user'));
  let cpnButtons='';
  if(userCurrent.id==message.userId.id){
    cpnButtons=<div className="info-action">
      <Link to={urlOnPage.shop.shopView + functionCommon.createSlug(message.name) + '-' + message.id + '.html'} className="btn-action-primary">{props.lng.SHOP_BUTTON_VIEW}</Link>
      &nbsp; &nbsp;&nbsp; &nbsp;
      <Link to={urlOnPage.shop.shopEdit+message.id} className="btn-action-primary">{props.lng.SHOP_BUTTON_EDIT}</Link>
      &nbsp; &nbsp;&nbsp; &nbsp;
      <button
        type="button"
        className="button-red"
        onClick={()=>props.onDeleteShop(message.id)}
      >{props.lng.SHOP_BUTTON_DELETE}</button>
    </div>
  };
  let linkImg=message.coverImage?Constants.linkApi+"/images/"+message.coverImage:Constants.linkServerImage+"/common/store1.png";
  return(
    <div className="box-store" style={{padding:'5px'}}>
      <div className="store-cover-img" style={{
        background:"url("+linkImg+")",
        backgroundRepeat:'no-repeat',
        backgroundSize:'cover', backgroundPosition:'50% 50%'}}
           onClick={() => browserHistory.push(urlOnPage.shop.shopView+ functionCommon.createSlug(message.name) + '-' + message.id + '.html')}
      >
        {/*<img className="box-store-img"
             src={message.coverImage?Constants.linkApi+"/images/"+message.coverImage:Constants.linkServerImage+"/common/store1.png"}
        />*/}
      </div>
      <div className="info">
        <div className="info-content">
          <div className="div-table dt-list-shop" style={{paddingLeft:'15px', paddingRight:'15px'}}>
            <div className="div-row">
              <div className="div-cell" style={{marginTop: 6+'px', marginBottom:2+'px', marginRight:2+'px', marginLeft:2+'px'}}>{props.lng.SHOP_NAME}</div>
              <div className="div-cell-2 strong-title"><Link to={urlOnPage.shop.shopView + functionCommon.createSlug(message.name) + '-' + message.id + '.html'} id="name-shop-i">{message.name}</Link></div>
            </div>
            <div className="div-row">
              <div className="div-cell">{props.lng.SHOP_ADDRESS}</div>
              <div className="div-cell-2">{message.address}</div>
            </div>
            <div-row>
              <div className="div-cell">{props.lng.SHOP_COUNT_POST}</div>
              <div className="div-cell-2">{message.totalPost}</div>
            </div-row>
          </div>
        </div>
        {cpnButtons}
      </div>
    </div>
  );
}

StoreListRowPage.propTypes = {
  message: PropTypes.object.isRequired
};

export default StoreListRowPage;
