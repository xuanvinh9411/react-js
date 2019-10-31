/*
 * Created by TrungPhat on 30/03/2017
 */
import React,{PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as adsAction from '../../actions/adsAction';
import * as actionType from '../../actions/actionTypes';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ReactPlayer from 'react-player'
import LoadingTable from '../controls/LoadingTable';
import { findDOMNode } from 'react-dom'
import {ToastContainer, ToastMessage} from "react-toastr";
import Duration from '../controls/Duaration';
import screenfull from 'screenfull';
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

let Aes=require('../../services/httpRequest');
let Constants=require('../../services/Constants');
let utils=require('../../utils/Utils');
class AdsVideoView extends React.Component{
  constructor(props, context){
    super(props, context);
    this.state={
      ads:{},
      error:[],
      isReady:false,
      playing: true,
      volume: 0.8,
      played: 0,
      loaded: 0,
      duration: 0,
      playbackRate: 1.0,
      timeFirst:false,
      timePlayed:0,
      percent:0,
      money:0
    }
    this.format=this.format.bind(this);
    this.pad=this.pad.bind(this);
  }

  componentWillMount(){
    this.setState({timeFirst:true});
    this.loadData();
  }
  loadData(){
    this.setState({isReady:true, firstLoad:true})
    this.props.actions.getAdsVideo({id:this.props.params.id});
  }
  componentDidMount(){
    window.scrollTo(0,0);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.dataMessage){
      let type=nextProps.dataMessage.type;
      let result={};
      switch (type){
        case actionType.GET_ADS_VIDEO_SUCCESS:
          result=nextProps.dataMessage.dataAds;
          if(result.code==Constants.RESPONSE_CODE_SUCCESS){
            this.setState({ads:result.data.ads, isReady:false});
          }else{
            if(result.code==Constants.RESPONSE_CODE_OTP_INVALID){
              this.loadData();
            }
          }
          break;
        case actionType.ADS_VIDEO_CREDIT_SUCCESS:
          result=nextProps.dataMessage.dataAds;
          break;
      }
    }
  }
  onProgress = state => {
    if (!this.state.seeking) {
      this.setState(state)
    }

    if(this.state.timeFirst){
      this.setState({timeFirst:false,timePlayed:this.format(this.state.duration*this.state.played)});
    }
    /*Thời gian xem hiện tại*/
    let timeCurrent=this.format(this.state.duration*this.state.played);
    /*Thời gian lúc bắt đầu xem*/
    let timePlayed=this.state.timePlayed.split(':');
    /*Thời gian xem */
    let timeMin=this.state.ads.time;
    for(let i=0; i<timeMin.length;i++){
      let time=this.format(timeMin[i].time);
      time=time.split(':');
      let hh=parseInt(timePlayed[0])+parseInt(time[0])
      let ss=(parseInt(timePlayed[2])+parseInt(time[2]))>=10?(parseInt(timePlayed[2])+parseInt(time[2])):('0'+(parseInt(timePlayed[2])+parseInt(time[2])))
      let timeRequest=hh+':'+parseInt(timePlayed[1])+parseInt(time[1])+':'+ss;

      if(timeCurrent==timeRequest){
        this.setState({percent:timeMin[i].percent});
        this.props.actions.creditAdsVideo({time:timeMin[i].time, id:this.props.params.id});
      }
    }

  }
  pad (string) {
    return ('0' + string).slice(-2);
  }
  /*Hàm định dạng thời gian H:MM:SS */
  format (seconds) {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = this.pad(date.getUTCSeconds());
    return `${hh}:${this.pad(mm)}:${ss}`;
  }
  onClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player));
  }

  render(){
    const duration = this.state;
    return(
      <div>
        <Helmet
          title="Xem quảng cáo video"
        />
        {this.state.isReady?<LoadingTable/>:
          <div id="v-ads" className="">
            <div className="box-video">
              <div className="box-video-head">
                <div className='player-wrapper'>
                  <ReactPlayer
                    ref={player => { this.player = player }}
                    className='react-player'
                    width='100%'
                    height='360px'
                    url={this.state.ads.urlVideo?this.state.ads.urlVideo:null}
                    playing={this.state.playing}
                    onProgress={this.onProgress}
                    onDuration={duration => this.setState({ duration })}
                  />
                  <div className="skip-video">
                    <button onClick={() => browserHistory.push('/danh-sach-quang-cao')}>{this.props.lng.ADVERTISE_VIEWPAGE_BUTTON}</button>
                  </div>
                </div>
              </div>
              <div className="btn-v-video">
                <button onClick={this.onClickFullscreen}>{this.props.lng.ADVERTISE_VIEWPAGE_BUTTON_ZOOM}</button>
                {
                  this.state.ads.isView == Constants.VIEW_ADS_VIDEO ?
                    this.state.percent>0?
                      this.state.percent<100?
                        <span className="pull-right">{this.props.lng.ADVERTISE_VIEWPAGE_TITLE_1}
                        {utils.format_price(Math.floor((this.state.percent / 100) * (this.state.ads.aCoin / 2)))}
                        {this.props.lng.ADVERTISE_VIEWPAGE_TITLE_2}</span>
                      :
                        <span className="pull-right">{this.props.lng.ADVERTISE_VIEWPAGE_TITLE_3}</span>
                    :
                      ''
                  :
                    ''
                }
              </div>
              <div className="box-video-content">
                <div className="box-video-content-img"
                     style={{
                       background:"url("+Constants.linkApi+"/images/"+this.state.ads.image+")",
                       backgroundRepeat:'no-repeat',
                       backgroundSize:'cover', backgroundPosition:'50% 50%'}}
                />
                <br/>
                <div className="div-table-2">
                  <div className="div-row">
                    <div className="div-cell strong-title" style={{width:'auto'}}>{this.state.ads.title}</div>
                  </div>
                  <div className="div-row">
                    <div className="div-cell">
                  <span className="primary-color">
                  <img src={Constants.linkServerImage+"common/icon-count-view.png"}/>
                    {this.state.ads.count}</span>
                    </div>
                  </div>
                </div>
              </div>
              <em>{this.props.lng.ADVERTISE_VIEWPAGE_TITLE_4}</em>
            </div>
            {/*<div className="list-adwords" style={{minHeight:'300px', marginBottom:'20px'}}>
              <h3>{this.props.lng.ADVERTISE_VIEWPAGE_TITLE_5}</h3>
              <div className="adwords-item">
                <div className="adwords-item-img" style={{background:'url('+Constants.linkServerImage+"/common/ad1.png"+')',backgroundRepeat:'no-repeat',
                  backgroundSize:'cover'}}></div>
                <div className="div-table-2">
                  <div className="ads-v-header">
                    <div className="strong-title ads-v-header-title"><Link to={'/xem-quang-cao/'}>Samsung</Link></div>
                    <div className="width10">
                      <span className="primary-color ads-v-header-acoin">+100<img src={Constants.linkServerImage+"common/count-point.png"}/></span>
                    </div>
                  </div>
                  <div className="ads-v-content clearfix">
                    Mo ta quang cao
                  </div>
                  <div className="ads-v-footer">
                    <div className="ads-v-footer-cell">
                      <span className="primary-color"><img src={Constants.linkServerImage+"common/icon-count-view.png"}/>0</span>
                    </div>
                  </div>
                  <div className="ads-v-footer-btn">
                    <button className="button-primary margin-top-10 btn-v-ads">Xem</button>
                  </div>
                </div>
              </div>
            </div>*/}
          </div>}
      </div>
    );
  }
}

AdsVideoView.propTypes={
  actions:PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.adsReducer,
    data:PropTypes.array
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(adsAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AdsVideoView);
