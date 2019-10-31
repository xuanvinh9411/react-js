/*
 * Created by TrungPhat on 30/03/2017
 */
import React, {PropTypes} from 'react';
import AdsVideoRow from'./AdsVideoRow';

const AdsVideoList =(props)=>{
  let messages=props.messages;
  return(
    <div className="ads-v-wrap">
      {
        messages.map(message =>
          <AdsVideoRow
            lng={props.lng}
            key={message.id}
            message={message}
          />)
      }
    </div>
  );
}
AdsVideoList.propTypes = {
  messages: PropTypes.array.isRequired
};
export default AdsVideoList;
