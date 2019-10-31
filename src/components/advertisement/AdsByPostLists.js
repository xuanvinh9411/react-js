/*
 * Created by TrungPhat on 23/03/2017
 */
import React, {PropTypes} from 'react';
import AdsByPostListRow from'./AdsByPostListRow';

const AdsByPostLists =(props)=>{
  let messages=props.messages;
  return(
    <div className="">
      <div className="p-ads-row">
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{width:'186px'}}>{props.lng.POST_ADS_CREATE_NAME_HINT}</th>
              <th>{props.lng.POST_ADS_COL_TIME}</th>
              <th className="text-center">{props.lng.POST_ADS_COL_ACOIN}</th>
              <th className="text-center">{props.lng.POST_ADS_COL_CLICk}</th>
              <th className="text-center">{props.lng.POST_ADS_COL_VIEW}</th>
              <th className="text-center" style={{width:'70px'}}>{props.lng.POST_ADS_COL_ACTION}</th>
            </tr>
          </thead>
          <tbody>
          {
            messages.map(message =>
              <AdsByPostListRow
                lng={props.lng}
                key={message.id}
                message={message}
                changStateAds={props.changStateAds.bind(this)}
                delAds={props.delAds.bind(this)}
              />)
          }
          </tbody>
        </table>
      </div>
    </div>
  );
}
AdsByPostLists.propTypes = {
  messages: PropTypes.array.isRequired
};
export default AdsByPostLists;
