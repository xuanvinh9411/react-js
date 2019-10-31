/*
 * Created by TrungPhat on 28/03/2017
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
const Constants=require('../../services/Constants');
const Aes=require('../../services/httpRequest');
const _=require('../../utils/Utils');
const TransactionListRow = (props) =>{
  let message = props.message;
  let user=Aes.aesDecrypt(localStorage.getItem('user'));
   if (!message.idUserReceived || message.idUserReceived.id) {
     message.idUserReceived = {};
     message.idUserReceived.id = 'null';
     message.idUserReceived.fullname = 'Admin ';
   }
  return(
    <tr>
      {/*<td>{message.id}</td>*/}
      <td>{message.createdAt}</td>
      <td>{
        message.type==5?
          message.idProduct.name?
            props.lng.TRANSACTION_TYPE_PT+message.idProduct.name
          :
            '-'
        :
        message.type==6?
          message.idPost.name?
            props.lng.TRANSACTION_TYPE_BUY_ADS+message.idPost.name
          :''
        :

        message.type==3?
           message.idUserReceived.id==user.id?
            props.lng.TRANSACTION_TYPE_RECEIVED_COIN+message.idUser.fullname + '. '+ message.description
          :
            props.lng.TRANSACTION_TYPE_MOVE_COIN + message.idUserReceived.fullname + '. '+ message.description
        :message.type==7?
          message.idVideoAds?
            props.lng.TRANSACTION_TYPE_VIEW_ADS+message.idVideoAds.title
          :
            '-'
        :message.type==1?
          props.lng.TRANSACTION_TYPE_ADD
        :message.type==9?
          message.idVideoAds?
            props.lng.TRANSACTION_TYPE_BUY_VIDEO_ADS+message.idVideoAds.title
          :
            '-'
        :
              message.type == 11 ?
                props.lng.TRANSACTION_MONEY_BACK
        :
                message.type == 13 ?
                  'Up Top bài viết'
       :
                  message.type == 12 ?
                    'Reup bài viết'
        :
                props.lng.TRANSACTION_TYPE_BUY_LOGO
      }</td>
      <td className="text-center">
        {
          message.amount==0?
            message.amount
          :
            message.type==3&&message.idUserReceived.id==user.id?
              '+'+_.format_price(message.amount)
            :
              message.type==7?
                '+'+_.format_price(message.amount)
              :
                message.type==1?
                  '+'+_.format_price(message.amount)
                :
                  message.type == 11 ?
                    '+'+_.format_price(message.amount)
                  :
                    '-'+_.format_price(message.amount)
        }</td>
    </tr>
  );
}
TransactionListRow.propTypes = {
  message: PropTypes.object.isRequired
};

export default TransactionListRow;
