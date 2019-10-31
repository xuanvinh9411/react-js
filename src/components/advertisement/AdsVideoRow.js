/*
 * Created by TrungPhat on 30/03/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
const Constants=require('../../services/Constants');
const _=require('../../utils/Utils');
const AdsVideoRow = (props) =>{
  let message=props.message;
  return(
    <div className="adwords-item">
      <div className="adwords-item-img"
           style={{
              background:'url('+Constants.linkApi+"/images/"+message.image+')',
             backgroundRepeat:'no-repeat',
              backgroundSize:'230px 130px',
             backgroundPosition:'50% 50%',
             border: '1px solid #14b577'
            }}/>
      <div className="div-table-2">
        <div className="ads-v-header">
          <div className="strong-title ads-v-header-title">
            <Link to={'/xem-quang-cao/'+message.id} className="text-overflow" title={message.title} style={{width:'95%'}}>{message.title}</Link>
            <div style={{fontSize: '14px', color: '#333'}}
                 className="ads-v-content clearfix"
                 dangerouslySetInnerHTML={{__html: _.sliceStringByLength(message.description, 250)}}>
            </div>
          </div>
          {message.imageIcon ?
            <div className="width10" style={{marginTop: '0px'}}>
              <span className="primary-color ads-v-header-acoin">
                <img src={Constants.linkApi + "/images/" + message.imageIcon}/>
              </span>
            </div>
            : ''
          }

        </div>

        <div className="ads-v-footer" style={{clear: 'both'}}>
          <div className="ads-v-footer-cell">
            <span className="primary-color"><img src={Constants.linkServerImage + "common/icon-count-view.png"} style={{marginRight:'3px'}}/>{message.count}</span>
          </div>
        </div>
        <div className="ads-v-footer-btn">
          <button className="button-primary margin-top-10 btn-v-ads" onClick={()=>browserHistory.push('/xem-quang-cao/'+message.id)}>{message.isView == Constants.VIEWED_ADS_VIDEO ? props.lng.ADVERTISE_WATCHED : props.lng.ADVERTISE_BUTTON_VIEW}</button>
          <div className="width10" style={{marginTop: '10px'}}>
			          <span className="primary-color ads-v-header-acoin">+{_.format_price(message.aCoin / 2)}
                  <img src={Constants.linkServerImage + "common/count-point.png"}/></span>
          </div>
        </div>
      </div>
    </div>
  );
}
AdsVideoRow.propTypes = {
  message: PropTypes.object.isRequired
};

export default AdsVideoRow;
