/*
* Created by TrungPhat on 1/17/2017
*/
import React, {PropTypes} from 'react';

class AdsListRow extends React.Component{
  render(){
    return(
      <div className="adwords-item">
        <img className="adwords-item-img" src="static/img/common/ad1.png"/>
        <div className="div-table ads-table">
          <div className="div-row">
            <div className="div-cell strong-title">SAMSUNG</div>
            <div className="div-cell-small">
                    <span className="primary-color">+40
                      <img src="static/img/common/count-point.png"/></span>
            </div>
          </div>
          <div className="div-row">
            <div className="div-cell">Game 3D đồ họa cực khủng</div>
          </div>
          <div className="div-row">
            <div className="div-cell">
                  <span className="primary-color">
                  <img src="static/img/common/icon-count-view.png"/>
                  1255</span>
            </div>
          </div>
          <div className="div-row">
            <button className="button-primary margin-top-10">Xem</button>
          </div>
        </div>
      </div>
    );
  }
}

export default AdsListRow;
