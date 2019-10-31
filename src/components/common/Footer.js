/**
 * Created by THIPHUNG on 11/4/2016.
 */
import React from "react";
import {Link} from "react-router";
import {browserHistory} from "react-router";
import {connect} from 'react-redux';
import * as userAction from '../../actions/userAction';
import * as actionType from '../../actions/actionTypes';
import {bindActionCreators} from 'redux';

let Constants=require('../../services/Constants');
let _=require('../../utils/Utils');

export class Footer extends React.Component{
  constructor(props, context){
    super(props, context);
  }
  render(){
    return (
      <footer>
        <div className="wrap-footer">
          <div className="footer-left pull-left" style={{width: '50%'}}>
            <h1 className="fa fa-copyright">  <span className="span-font">Bản quyền thuộc về</span> <p>CÔNG TY CỔ PHẦN TRUYỀN THÔNG VÀ CÔNG NGHỆ LITTLEWORLD</p></h1>
          </div>
          <div className="footer-right pull-right">
            <ul>
              <li><span className="fa fa-map-marker"/>307 Lê Văn Lương, Phường Tân Quy, Quận 7, TPHCM</li>
              <li><span className="fa fa-phone"/>(0283) 6207712 – (0283) 6208727</li>
              <li><span className="fa fa-envelope-o"/>info@littleworld.vn</li>
            </ul>
          </div>
        </div>


        <div className="text-center" style={{clear: 'both'}}>
          <a href="http://online.gov.vn/HomePage/WebsiteDisplay.aspx?DocId=35260" target="_blank">
            <img alt="" title="" src="static/img/fY8udT6WayTfmQSHvcbmhg==.jpgx" />
            <br/><br/>
          </a>
        </div>


      </footer>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.userReducer
  };
}

function mapDispatchToProps(dispatch) {

  return {
    actions: bindActionCreators(userAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Footer);
