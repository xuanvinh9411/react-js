/*
 * Created by TrungPhat on 1/10/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as searchAction from '../../actions/searchAction';
import * as actionTypes from '../../actions/actionTypes';
import {Button, ControlLabel, FormControl, HelpBlock, FormGroup, Form, Radio, Modal} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {AroundMap} from '../controls/AroundMap';
import {ToastContainer, ToastMessage} from "react-toastr";
import LoadingTable from '../controls/LoadingTable';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import Autocomplete from '../controls/Autocomplete';
import {Helmet} from "react-helmet";

const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let Constants = require('../../services/Constants');
let Session = require('../../utils/Utils');
let Aes = require('../../services/httpRequest');
let functionCommon = require('../common/FunctionCommon');

class SearchPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listAddress: [],
      address: '',
      data: {},
      isSubmit: false,
      search: {
        user: {},
        keywords: '',
        location: [],
        newLocation: [],
        km: 10
      },
      messages: [],
      markers: [
        {
          position: {
            lat: 10.8230989,
            lng: 106.6296638
          },
          key: Date.now(),
        }
      ],
      markersDefault: [
        {
          position: {
            lat: 10.8230989,
            lng: 106.6296638
          },
          key: Date.now(),
        }
      ],
      error: {},
      shop: {},
      showTab: false,
      isReady: false,
      isGetLocation: false,
      isFirstSubmit: false,
      ishandelMap: false,
      currentLocation: false,
      isClick: false,
      isLoading: false,
      searchSuccess: false,
      style: false,
      statusMap: false,
      isSearch: false
    }
    this.onSearch = this.onSearch.bind(this);
    this.updateState = this.updateState.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.onClickAround = this.onClickAround.bind(this);
    this.onHideModal = this.onHideModal.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentWillMount() {
    //if (!Session.checkSession()) {
    //  browserHistory.push("/login");
   // } else {
      let user = Aes.aesDecrypt(localStorage.getItem('user'));
      this.setState({user: user, isReady: true});
      if (this.props.location.query) {
        if (this.props.location.query.show == 'true') {
          this.setState({statusMap: true});
        }
      }
      if (this.props.location.query.keywords) {
        let query = this.props.location.query;
        let search = this.state.search;
        if (query) {
          if (query.keywords && query.keywords.length > 0) {
            this.setState({isFirstSubmit: true});
            search.keywords = query.keywords;
            if ((query.lat && parseFloat(query.lat) > 0) && (query.lng && parseFloat(query.lng) > 0)) {
              search.location = [parseFloat(query.lat), parseFloat(query.lng)];
              search.km = parseInt(query.km);
              this.setState({
                markersDefault: [
                  {
                    position: {
                      lat: parseFloat(query.lat),
                      lng: parseFloat(query.lng),
                    },
                    key: Date.now(),
                  }
                ]
              })
            } else {
              search.location.length = 0;
            }
            this.setState({search: search});
            this.props.actions.search(search);
          } else {
            browserHistory.push('/tim-kiem');
          }
        } else {
          browserHistory.push('/tim-kiem');
        }
      } else {
        navigator.geolocation.getCurrentPosition(function (location) {//console.log(location)
          if (location.coords.latitude != 0 && location.coords.longitude != 0) {
            this.setState({
              isGetLocation: true, currentLocation: true,
              markers: [
                {
                  position: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                  },
                  key: Date.now(),
                }
              ],
              markersDefault: [
                {
                  position: {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                  },
                  key: Date.now(),
                }
              ]
            });
          }
        }.bind(this));
      }
    //}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.key != this.props.location.key) {
      this.setState({statusMap: false});
    }
  }

  onSearch(e) {
    if (this.validatorForm() == true) {
      let markersDefault = this.state.markersDefault;
      let search = this.state.search;
      if (this.state.ishandelMap == true && this.state.isClick == true) {
        search.location[0] = search.newLocation[0];
        search.location[1] = search.newLocation[1];
      } else {
        if (markersDefault[0].position.lat != 0 && markersDefault[0].position.lng != 0) {
          search.location[0] = markersDefault[0].position.lat;
          search.location[1] = markersDefault[0].position.lng;
        }
      }
      if (this.state.isSelect == false || this.state.currentLocation == false) {
        search.location.length = 0;
      }
      this.setState({isSubmit: true, isReady: false, isFirstSubmit: true});
      let query = this.props.location.query;
      query.keywords = search.keywords;
      if (search.location.length > 0) {
        query.lat = search.location[0];
        query.lng = search.location[1];
      }
      query.km = search.km;
      query.nk = this.state.isClick;
      browserHistory.push({pathname: '/tim-kiem-cua-hang', query: query});
    }
  }

  validatorForm() {
    let error = this.state.error;
    let dataForm = this.state.search;
    let check = true;
    if (dataForm.keywords.length == 0) {
      error['keywords'] = true;
      check = false;
    }
    this.setState({error: error});
    return check;
  }

  updateState(event) {
    const field = event.target.name;
    let valueField = event.target.value;
    let error = this.state.error;
    let search = this.state.search;
    search.keywords = valueField;
    search.keywords.length > 0 ? error[field] = false : '';
    return this.setState({search: search, error: error});
  }

  handleChange = (value) => {
    let search = this.state.search;
    search.km = value;
    this.setState({
      search: search
    })
  }

  checkMarkers(marker) {
    let markersDefault = this.state.markersDefault;
    let check = false;
    if (marker.lat == markersDefault[0].position.lat && marker.lng == markersDefault[0].position.lng) {
      check = true;
    }
    return check;
  }

  onClickMarker(marker) {
    if (this.state.isFirstSubmit == true) {
      if ((typeof marker.position.lat == 'function' && typeof marker.position.lng == 'function') || this.checkMarkers(marker.position) == true) {
        this.setState({showTab: false});
      } else {
        this.setState({showTab: true});
      }
    }
    let messages = this.state.messages;
    let data = this.state.data;
    for (let i = 0; i < messages.length; i++) {
      if (marker.key == messages[i].id) {
        data = messages[i];
      }
    }
    if (this.state.isFirstSubmit == true) {
      this.setState({data: data, isLoading: true});
    }
  }

  handleMapClick(event) {
    if (this.state.isFirstSubmit == true && this.state.ishandelMap == false && typeof event.latLng.lat != 'function' && typeof event.latLng.lng != 'function') {
      this.setState({showTab: true});
    }
    this.setState({ishandelMap: true});
    /*if(this.state.isGetLocation==false){
     let nextMarkers = [
     {
     position: event.latLng,
     key: Date.now(),
     },
     ];
     let search=this.state.search;
     search.newLocation=[nextMarkers[0].position.lat(),nextMarkers[0].position.lng()];
     this.setState({
     markers: nextMarkers,
     search:search
     });
     }else{
     if(this.state.isClick){
     let nextMarkers = [
     {
     position: event.latLng,
     key: Date.now(),
     },
     ];
     let search=this.state.search;
     search.newLocation=[nextMarkers[0].position.lat(),nextMarkers[0].position.lng()];
     this.setState({
     markers: nextMarkers,
     search:search
     });
     }else{
     let search=this.state.search;
     search.newLocation=[];
     this.setState({
     search:search
     })
     }
     }*/
    if (this.state.isClick || this.state.isGetLocation == false) {
      let nextMarkers = [
        {
          position: event.latLng,
          key: Date.now(),
        },
      ];
      let search = this.state.search;
      search.newLocation = [nextMarkers[0].position.lat(), nextMarkers[0].position.lng()];
      this.setState({
        markers: nextMarkers,
        search: search
      })
    } else {
      let search = this.state.search;
      search.newLocation = [];
      this.setState({
        search: search
      });
    }
  }

  onClickAround() {
    /*if(this.state.isGetLocation==false){
     this.refs.container.warning('Bạn không chia sẻ vị trí hoặc không thể xác định được vị trí của bạn !', `Thông báo.`, {
     closeButton: true,
     });
     }*/
    this.setState({isClick: false, markers: []});
  }

  onAutoComAddress(event) {
    let keyword = event.target.value;
    let address = this.state.address;
    let error = this.state.error;
    if (keyword.length > 0) {
      error.address = false;
      this.props.actions.getAddress(keyword.replace(/\s/g, ''));
    } else {
      error.address = true;
    }
    address = keyword
    this.setState({address: address, isSelect: false});
  }

  onHideModal() {
    if (!this.state.isSelect || this.state.isSelect == false) {
      this.refs.container.warning(this.props.lng.SEARCH_ORTHER_WARNING, `Thông báo.`, {
        closeButton: true,
      });
    } else {
      this.setState({statusMap: false})
    }
  }

  search() {
    this.onSearch();
  }

  render() {
    let style = {bg: '#14b577', cl: '#fff'};
    let cpnTab = '';
    const formatkg = value => value + ' Km';
    let urlImage = this.state.data.coverImage ? Constants.linkApi + '/images/' + this.state.data.coverImage : Constants.linkServerImage + '/common/bg-place.png'
    //CSS FOR AUTOCOMPLETE
    let styles = {
      item: {
        padding: '5px 6px',
        cursor: 'default',
      },

      highlightedItem: {
        color: 'white',
        background: 'hsl(200, 50%, 50%)',
        padding: '5px 6px',
        cursor: 'default',
      },

      menu: {
        border: 'solid 1px #ccc'
      }
    };
    $(function () {
        let heightScreen = $(window).height();
        if (heightScreen > 638) {
          $(window).resize(function () {
            $('.maps-google, #maps-show').css("min-height", ($(window).height() - 320) + "px")
          }).resize();
        } else {
          $('.maps-google, #maps-show').css("min-height", ($(window).height()) + "px")
        }
      }
    );
    return (
      <div id="display-search">
        <Helmet
          title="Tìm kiếm địa điểm"
        />
        <div id="search">
          <div className="form-left">
            <FormGroup validationState={this.state.error.keywords ? 'error' : null} className="cus-input">
              <FormControl
                type="text"
                className="form-control keyword-search-shop"
                name="keywords"
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    this.search();
                  }
                }}
                placeholder={this.props.lng.SEARCH_KEYWORD_HINT}
                value={this.state.search.keywords}
                onChange={this.updateState}
              />
            </FormGroup>
            <div className="list-btn">
              <button type="button"
                      className="btns css-btn-sr  btn-flat"
                      onClick={() => this.onClickAround()}
                      style={{
                        background: this.state.isClick == false ?
                          style.bg
                          :
                          style.cl
                        ,
                        border: '1px solid #14b577',
                        color: this.state.isClick == false ?
                          style.cl
                          :
                          style.bg
                      }}>{this.props.lng.SEARCH_BUTTON_AROUND}</button>
              <button type="button"
                      onClick={() => {
                        browserHistory.push('/tim-kiem-noi-khac');
                        //this.setState({isClick: true, statusMap: true});
                      }}
                      style={{
                        background: this.state.isClick ?
                          style.bg
                          :
                          style.cl,
                        border: '1px solid #14b577'
                        ,
                        color: this.state.isClick ?
                          style.cl
                          :
                          style.bg
                      }}
                      className="btns css-btn-sr btn-flat">{this.props.lng.SEARCH_BUTTON_OTHER}</button>
            </div>
            <div className="maps">
              <div className="maps-left">
                <span className="primary-color">{this.props.lng.SEARCH_DISTANCE}</span>
                <Slider
                  min={0}
                  max={20}
                  value={this.state.search.km}
                  onChange={this.handleChange}
                  format={formatkg}
                  labels={{0: '0Km', 10: '10Km', 20: '20Km'}}
                />
              </div>
            </div>
          </div>
          <div className="form-right">
            <button type="button" className="btns btn-flat" onClick={!this.state.isSubmit ? this.onSearch : null}
                    disabled={this.state.isSubmit}>{this.state.isSubmit ? this.props.lng.SEARCH_BUTTON_SEARCHING :
              this.props.lng.SEARCH_BUTTON_SEARCH}</button>
            <button type="button"
                    onClick={() => {
                      this.setState({style: !this.state.style, showTab: false});
                    }}
                    className={this.state.style ? 'btn-list-rs fa fa-map-marker' : 'btn-list-rs fa fa-list'}/>
          </div>
        </div>
        <div style={{position: 'relative'}} id="maps-show">
          {
            this.state.style == false ?
              <div className="maps-google">
                {this.state.isReady == false ? <LoadingTable/> :
                  <AroundMap
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDtPEnxZi9s2ngovnLyFs89_RPAWVzEFfE&amp;v=3.exp&amp;signed_in=true"
                    loadingElement={
                      <div style={{height: `100%`}}>
                      </div>
                    }
                    containerElement={
                      <div style={{height: `100%`}}/>
                    }
                    mapElement={
                      <div style={{height: `100%`}}/>
                    }
                    currentLocation={this.state.currentLocation}
                    onMapClick={this.handleMapClick}
                    onClickMarker={this.onClickMarker.bind(this)}
                    markers={this.state.searchSuccess == true ? this.state.markers : this.state.markersDefault}
                  />}
              </div>
              :
              <div className="list-result" style={{
                background: this.state.searchSuccess ? '#e9e9e9' : '#fff'
              }}>
                {
                  this.state.searchSuccess ? this.state.messages.length > 0 ? this.state.messages.map((item, index) =>
                    <div className="item-rs-shop" key={index} style={{zIndex: 9999}}>
                      <div className="item-rs-shop-left pull-left"
                           onClick={() => browserHistory.push('/xem-cua-hang/' + item.id)}
                           style={{
                             background: 'url(' + Constants.linkApi + '/images/' + item.avatar[0] + ')',
                             backgroundPosition: 'center center',
                             backgroundSize: 'cover',
                             backgroundRepeat: 'no-repeat',
                             width: '200px',
                             height: '200px',
                             cursor: 'pointer'
                           }}
                      />
                      <div className="item-rs-shop-right pull-left">
                        <div className="item-rs right-header">
                          <h2><Link to={'/xem-cua-hang/' + functionCommon.createSlug(item.name) + '-' + item.id + '.html'}>{item.name}</Link></h2>
                          <p>{item.address}</p>
                        </div>
                        <div className="item-rs right-content">
                          <p>{item.description.length > 150 ? item.description.slice(0, 150) + '...' : item.description}</p>
                        </div>
                      </div>
                    </div>
                  ) :
                    <div className="no-rs-shop">
                    </div> :
                    <div className="no-rs-shop">
                    </div>
                }
              </div>
          }
        </div>
        {cpnTab}
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
        <Modal show={this.state.statusMap} onHide={this.onHideModal} bsSize="large"
               aria-labelledby="contained-modal-title-lg"
               className="modal-custom"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">{this.props.lng.SEARCH_ORTHER_TITLE}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <center>
              <form>
                <div>
                  <Autocomplete
                    inputProps={{name: "address", id: "states-autocomplete", className: "form-control"}}
                    ref="autocomplete"
                    placeholder="Nhập địa chỉ"
                    value={this.state.address}
                    items={this.state.listAddress}
                    getItemValue={(item) => item.formatted_address}
                    onSelect={(value, item) => {
                      this.setState({
                        currentLocation: true,
                        address: item.formatted_address,
                        markersDefault: [{
                          position: {
                            lat: item.geometry.location.lat,
                            lng: item.geometry.location.lng
                          },
                          key: Date.now(),
                        }],
                        statusMap: false,
                        isSelect: true
                      })
                    }}
                    onChange={this.onAutoComAddress.bind(this)}
                    renderItem={(item, isHighlighted) => (
                      <div style={isHighlighted ? styles.highlightedItem : styles.item}>{item.formatted_address}</div>
                    )}
                  />
                </div>
              </form>
            </center>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

SearchPage.propTypes = {
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    dataMessage: state.searchReducer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(searchAction, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
