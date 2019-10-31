import React, {PropTypes} from 'react';
import {browserHistory, Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
let Constants=require('../../services/Constants');
const urlRequestApi = require('../../url/urlRequestApi');
import {AroundMap} from '../controls/AroundMap';
let httpRequest = require('../../services/httpRequest');

class Banner extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      height_banner_left_right : 280,
      height_banner_half: 155,
      banner_half_1 : false,
      banner_half_2 : false,
      banner_right_1 : false,
      banner_right_2 : false,
      banner_left_1 : false,
      banner_left_1 : false,
    };
    this.onClickBanner = this.onClickBanner.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  componentWillMount() {
    let height = window.innerHeight;
    if(height > 630 && height <= 680) {
      let  height_banner_left_right = 280;
      let  height_banner_half = 155;
      this.setState({
        height_banner_left_right: height_banner_left_right,
        height_banner_half: height_banner_half
      })
    }

    let arrBannerWeb = this.props.arrBannerWeb;

    this.setBannerFc(arrBannerWeb, this);

  }


  setBannerFc (arrBannerWeb, that) {
    // console.log("arrBannerWeb arrBannerWeb arrBannerWeb", arrBannerWeb);
    let arrHalf1 = [];
    let arrHalf2 = [];
    let arrRight1 = [];
    let arrRight2 = [];
    let arrLeft1 = [];
    let arrLeft2 = [];
    arrBannerWeb.forEach(item => {
      if (item.kind == 2) {
        arrLeft1.push(item);
      }
      if (item.kind == 5) {
        arrLeft2.push(item);
      }
      if (item.kind == 3) {
        arrRight1.push(item);
      }
      if (item.kind == 6) {
        arrRight2.push(item);
      }
      if (item.kind == 4) {
        arrHalf1.push(item);
      }
      if (item.kind == 7) {
        arrHalf2.push(item);
      }
    })

    let { banner_half_1, banner_half_2, banner_right_1, banner_right_2, banner_left_1, banner_left_2 } = that.state;
    banner_half_1 = that.random_item(arrHalf1, banner_half_1, 0);
    banner_half_2 = that.random_item(arrHalf2, banner_half_2, 0);
    banner_right_1 = that.random_item(arrRight1, banner_right_1, 0);
    banner_right_2 = that.random_item(arrRight2, banner_right_2, 0);
    banner_left_1 = that.random_item(arrLeft1, banner_left_1, 0);
    banner_left_2 = that.random_item(arrLeft2, banner_left_2, 0);
    that.setState({ banner_half_1, banner_half_2, banner_right_1, banner_right_2, banner_left_1, banner_left_2 });
  }


  random_item(arr, itemOld, count = 0) {
   //console.log("random_item random_item", arr, itemOld, count);
    var rand = arr[Math.floor(Math.random() * arr.length)];
    //console.log("rand rand rand rand ", rand);
    // if  (rand == itemOld && count < 2) {
    //   this.random_item(arr, itemOld, ++count)
    // } else {
    // console.log("rand rand", rand, arr);
      return rand;
   // }

  }

  timer(arrBannerWeb, that) {
    this.setBannerFc(arrBannerWeb, that)
  }


  componentDidMount() {
    let arrBannerWeb = this.props.arrBannerWeb;
    let  intervalId = setInterval(this.timer.bind(this, arrBannerWeb, this), 10000);
    this.setState({intervalId: intervalId});
  }

  onClickBanner (val) {
    console.log("onClickBanner onClickBanner");
    this.props.onClickBannerAction(val);
  }

  componentDidUpdate() {
    let { banner_half_1, banner_half_2, banner_right_1, banner_right_2, banner_left_1, banner_left_2, arrViewBanner} = this.state;
    this.props.onViewBanner(banner_left_1);
    this.props.onViewBanner(banner_left_2);
    this.props.onViewBanner(banner_half_1);
    this.props.onViewBanner(banner_half_2);
    this.props.onViewBanner(banner_right_1);
    this.props.onViewBanner(banner_right_2);
  }


  render() {
    let { height_banner_left_right, height_banner_half }= this.state;
    let { banner_half_1, banner_half_2, banner_right_1, banner_right_2, banner_left_1, banner_left_2 } = this.state;

    return (
      <div className="banner-shop-web">
          <div className="banner-shop-web-left">
            { banner_left_1 ?
              <div className="banner-shop-web-left-item" onClick={() => {this.onClickBanner(banner_left_1)}}>
                <a href={banner_left_1.targetUrl} target="_blank" >
                  <img  width="120" height={height_banner_left_right} src={Constants.linkApi+ '/images/' + banner_left_1.image} />
                </a>
              </div>
              : ''
            }
            { banner_left_2 ?
              <div className="banner-shop-web-left-item" onClick={() => {this.onClickBanner(banner_left_2)}}>
                <a href={banner_left_2.targetUrl} target="_blank" >
                  <img width="120" height={height_banner_left_right} src={Constants.linkApi+ '/images/' + banner_left_2.image} />
                </a>
              </div>
                : ''
            }
          </div>


          <div className="banner-shop-web-right">
            { banner_right_1 ?
              <div className="banner-shop-web-right-item"onClick={() => {this.onClickBanner(banner_right_1)}}>
                <a href={banner_right_1.targetUrl} target="_blank" >
                  <img  width="120" height={height_banner_left_right} src={Constants.linkApi+ '/images/' +  banner_right_1.image} />
                </a>
              </div>
              : ''
            }

            { banner_right_2 ?
              <div className="banner-shop-web-right-item" onClick={() => {this.onClickBanner( banner_right_2)}}>
                <a href={banner_right_2.targetUrl} target="_blank" >
                <img  width="120" height={height_banner_left_right} src={Constants.linkApi+ '/images/' +  banner_right_2.image} />
                </a>
              </div>
                : ''
            }

          </div>
        <div  className="banner-shop-web-half">
          { banner_half_1 ?
            <div className="banner-shop-web-haft-item" onClick={() => {this.onClickBanner( banner_half_1)}}>
              <a href={banner_half_1.targetUrl} target="_blank" >
              <img width="210" height={height_banner_half} src={Constants.linkApi+ '/images/' +  banner_half_1.image } />
              </a>
            </div>
            : ''
          }

          { banner_half_2 ?
            <div className="banner-shop-web-haft-item" onClick={() => {this.onClickBanner(banner_half_2)}}>
              <a href={banner_half_2.targetUrl} target="_blank" >
              <img width="210" height={height_banner_half} src={Constants.linkApi+ '/images/' +  banner_half_2.image } />
              </a>
            </div>
            : ''
          }

        </div>
      </div>
    )
  }

}

function mapStateToProps(state, ownProps) {
  return {
  };
}




export default Banner;


