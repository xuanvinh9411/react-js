/**
 * Created by THIPHUNG on 12/5/2016.
 */
import React from "react";

let Constants=require('../../services/Constants');
export const LoadingComment = ()=>{
  return(
    <div className="loading-comment">
      <img src={Constants.linkServerImage+'comment-loader.gif'}/>
    </div>
  );
}
