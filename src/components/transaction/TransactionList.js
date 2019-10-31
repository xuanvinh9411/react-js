/*
 * Created by TrungPhat on 28/03/2017
 */
import React, {PropTypes} from 'react';
import TransactionListRow from'./TransactionListRow';

const TransactionList =(props)=>{
  let messages=props.messages;
  return(
    <div className="">
      <div className="p-ads-row">
        <table className="table table-hover">
          <thead>
          <tr>
            {/*<th>{props.lng.TRANSACTION_ID}</th>*/}
            <th>{props.lng.TRANSACTION_TIME}</th>
            <th>{props.lng.TRANSACTION_GD}</th>
            <th className="text-center">{props.lng.TRANSACTION_MONEY}</th>
          </tr>
          </thead>
          <tbody>
          {
            messages.map(message =>
              <TransactionListRow
                key={message.id}
                lng={props.lng}
                message={message}
              />)
          }
          </tbody>
        </table>
      </div>
    </div>
  );
}
TransactionList.propTypes = {
  messages: PropTypes.array.isRequired
};
export default TransactionList;
