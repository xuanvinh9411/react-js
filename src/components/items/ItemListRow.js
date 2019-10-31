/*
 * Created by TrungPhat on 01/03/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
let Constants=require('../../services/Constants');
let _=require('../../utils/Utils');
const ItemListRow =(props)=>{
  let message=props.message;
  let cpnButton='';
  let cpnNumber=message.counts;
  if(props.parent != -1){
    if(message.isBuy){
      cpnButton=<button type="button"
                        className="btn-action-primary btn-buy primary-color"
                        disabled>{props.lng.PT_BUTTON_BOUGHT}</button>;
    }else{
      cpnButton=<button type="button"
                        className="btn-action-primary btn-buy primary-color"
                        onClick={()=>props.onBuyItem(message)}>{props.lng.PT_BUTTON_BUY}</button>
    }
  }
  return(
    <div className="item-list-row">
      <div className="left-width30 pull-left" style={{width:'12%'}}>
        <img src={Constants.linkApi + '/images/' + message.images[0]} style={{width:'80px'}}/>
      </div>
      <div className="right-width70 pull-left" style={{width:'88%'}}>
        <h3><Link onClick={() => props.onPushLink(message.id)} className="primary-color pull-left">{message.name}</Link></h3>
        {
          props.parent != -1 ?
            <div className="price-item pull-right">
              <span className="primary-color name-span-item">{message.money}</span>
              <img src={Constants.linkServerImage + '/common/icon-coin.png'}/>
            </div>:''
        }
        <p>{_.sliceStringByLength(message.description, 190)}</p>
        {
          props.parent != -1 ?
            <div className="download">
              <img src={Constants.linkServerImage + '/common/icon-dl.png'} alt="" className="pull-left"/>
              <span className="pull-left primary-color">{cpnNumber}</span>
            </div>:''
        }
        {cpnButton}
      </div>
    </div>
  );
}

ItemListRow.propTypes = {
  message: PropTypes.object.isRequired
};

export default ItemListRow;
