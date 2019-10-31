/*
 * Created by TrungPhat on 23/03/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
const Constants=require('../../services/Constants');
import {Button} from 'react-bootstrap';
const AdsByPostListRow = (props) =>{
  let message=props.message;
  return(
    <tr>
      <td><Link onClick = {() => {
        browserHistory.push('/advertisement/'+message.id+'/update');
      }} className="primary-color">{message.name}</Link></td>
      <td>{message.dateStart}</td>
      <td className="text-center">{message.budget.toLocaleString()}</td>
      <td className="text-center">{parseInt(message.totalClick-message.totalClicked)}</td>
      <td className="text-center">{parseInt(message.totalAds-message.totalAdsShown)}</td>
      <td>
        <div className="p-action-list-ads">
          {message.state == Constants.STATE_ADS_PAUSE || message.state == Constants.STATE_ADS_PENDING || message.totalAdsShown == 0 || message.totalClicked == 0?
            <Button bsStyle="link"
                    className="fa fa-play"
                    data-toggle="tooltip"
                    data-placement="top"
                    disabled={message.totalAdsShown == 0 || message.totalClicked == 0}
                    title={props.lng.POST_ADS_LIST_MENU_ACTIVE}
                    onClick={()=>props.changStateAds({id:message.id, state:message.state})}
            />
            :
            <Button bsStyle="link"
                    className="fa fa-pause-circle"
                    data-toggle="tooltip"
                    data-placement="top"
                    title={props.lng.POST_ADS_LIST_MENU_DEACTIVE}
                    onClick={()=>props.changStateAds({id:message.id, state:message.state})}
            />}
          <Link onClick = {() => {
            browserHistory.push('/advertisement/'+message.id+'/update');
          }}
                className="fa fa-pencil-square-o"
                data-toggle="tooltip"
                data-placement="top"
                disabled={message.state == 1}
                title={props.lng.POST_ADS_LIST_MENU_EDIT}/>
          <Button bsStyle="link"
                  className="fa fa-trash"
                  data-toggle="tooltip"
                  data-placement="top"
                  title={props.lng.POST_ADS_LIST_MENU_DELETE}
                  onClick={()=>{
                    if(message.state != Constants.STATE_ADS_PLAY){
                      props.delAds({id:message.id});
                    }else{
                      if((parseInt(message.totalClicked) == 0) || parseInt(message.totalAdsShown) == 0){
                        props.delAds({id:message.id});
                      }
                    }
                  }}
          />
        </div>
      </td>
    </tr>
  );
}
AdsByPostListRow.propTypes = {
  message: PropTypes.object.isRequired
};

export default AdsByPostListRow;
