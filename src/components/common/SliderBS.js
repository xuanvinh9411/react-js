/**
 * Created by TrungPhat on 02/03/2017
 */
import React from "react";
import {Link} from "react-router";

let Constants=require('../../services/Constants');

export const SliderBS = (props)=> {
  let data=props.data;
  let cpnLi=[], cpnImg=[];
  if(data){
    for(let i=0; i<data.length;i++){
      if(data[i]!=''){
        if(i==0){
          cpnLi.push(<li data-target="#carousel-id" data-slide-to={i} className="active" key={data[i]} style={{marginRight:'2px'}}/>);
          cpnImg.push(<div className="item active" key={i+'a'}>
            <img src={Constants.linkApi+'/images/'+data[i]}/>
          </div>);
        }else{
          cpnLi.push(<li data-target="#carousel-id" data-slide-to={i} className="" key={data[i]} style={{marginRight:'2px'}}/>);
          cpnImg.push(<div className="item" key={i+'d'}>
            <img src={Constants.linkApi+'/images/'+data[i]}/>
          </div>);
        }
      }
    }
  }
  return (
    <div id="carousel-id" className="carousel slide" data-ride="carousel" data-interval="60000">
      <ol className="carousel-indicators">
        {cpnLi}
      </ol>
      <div className="carousel-inner">
        {cpnImg}
      </div>
      {data?data.length>1?
        <div>
          <a className="left carousel-control" href="#carousel-id" data-slide="prev">
            <span className="glyphicon glyphicon-chevron-left"/>
          </a>
          <a className="right carousel-control" href="#carousel-id" data-slide="next">
            <span className="glyphicon glyphicon-chevron-right"/>
          </a>
        </div>:'':''}
    </div>
  );
}

export default SliderBS;
