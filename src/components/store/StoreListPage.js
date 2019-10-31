/*
 * Created by TrungPhat on 1/24/2017
 */
import React, {PropTypes} from 'react';
import StoreListRowPage from './StoreListRowPage';

const StoreListPage=(props)=>{
  let messages=props.messages;
  return(
    <div>
      {
        messages.map((item, index)=>
          <StoreListRowPage
            message={item}
            lng={props.lng}
            key={index}
            onDeleteShop={props.onDeleteShop.bind(this)}
          />
        )
      }
    </div>
  );
};

StoreListPage.propTypes = {
  messages: PropTypes.array.isRequired
};

export default StoreListPage;
