/*
 * Created by TrungPhat on 1/17/2017
 */
import React, {PropTypes} from 'react';
let Constants =require('../../services/Constants');
let Aes=require('../../services/httpRequest');

const LoadingTable =(props)=>{
  return(
    <div className="loading-table" style={{height:props.height?props.height:'', width:props.width?props.width:''}}>
      <img src={Constants.linkServerImage+'/loading_7.gif'}/>
    </div>
  );
}

export default LoadingTable
