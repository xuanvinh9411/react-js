/*
 * Created by TrungPhat on 01/03/2017
 */
import React, {PropTypes} from 'react';
import ItemListRow from './ItemListRow';

const ItemsList=(props)=>{
  let messages=props.messages;
  return(
    <div>
      {
        messages.map(message=>
          <ItemListRow
            key={message.id}
            message={message}
            lng={props.lng}
            onBuyItem={props.onBuyItem.bind(this)}
            isBuy={props.isBuy}
            dataShop=""
            parent={props.parent}
            onPushLink={props.onPushLink.bind(this)}
          />
        )
      }
    </div>
  );
};

ItemsList.propTypes = {
  messages: PropTypes.array.isRequired
};

export default ItemsList
