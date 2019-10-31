/**
 * Created by THIPHUNG on 11/21/2016.
 */
import React from "react";
import {Link, browserHistory} from 'react-router';
import {withGoogleMap, GoogleMap, Marker, InfoWindow} from './react-google-maps-master';
import withScriptjs from "react-google-maps/lib/async/withScriptjs";
import InfoBox from './react-google-maps-master/lib/addons/InfoBox';
let functionCommon = require('../common/FunctionCommon');

let Constants=require('../../services/Constants');
let _=require('../../utils/Utils');
const urlOnPage = require('../../url/urlOnPage');
let moment=require('moment');
export const AroundMap =/*withScriptjs(*/
  withGoogleMap(
    props => (
      <GoogleMap
        defaultZoom={15}
        center={props.markers.length>0?props.markers[0].position:null}
        onClick={props.onMapClick}
        defaultOptions={{ styles:
          [
            {
              "featureType": "administrative",
              "elementType": "geometry",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "transit",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            }
          ]
        }}
      >
        {props.currentLocation == true ? props.markers.map(marker => (
          <Marker key={marker.key}
            onClick={() => props.onClickMarker(marker)?props.onClickMarker(marker):null}
            position={marker.position}
            icon={{
              scaledSize: new google.maps.Size(40, 40), // scaled size
              origin: new google.maps.Point(0,0), // origin
              anchor: new google.maps.Point(0, 0),
              url:
                props.icon?
                  props.icon.name!=""?
                    props.icon.status==0?
                      Constants.linkApi+'/tmp/'+props.icon.name
                      :
                      Constants.linkApi+'/images/'+props.icon.name
                    :
                    Constants.linkServerImage+'/icon.png'
                  :
                  marker.icon?
                    marker.icon.logoState==1?
                      marker.icon.logoStatus>0?
                        Constants.linkApi+'/images/'+marker.icon.logo
                        :
                        Constants.linkServerImage+'/location_normal.png'
                      :
                      Constants.linkServerImage+'/location_normal.png'
                    :
                    Constants.linkServerImage+'/icon.png'
              }}
          >
            {marker.showInfo && marker.showInfo == true ?
              <InfoBox>
                {props.infoMarker ?
                  <div id="info-marker">
                    <div className="header-rel" style={{position:'relative'}}>
                      <h4 className="pull-left s-h4" >
                        <Link to={urlOnPage.shop.shopView + functionCommon.createSlug( props.infoMarker.name) + '-' +  props.infoMarker.id + '.html?utm=map'}
                              onClick={()=>{
                                _.setTemporaryData(Constants.locationCheckPoint, {
                                  lat: props.query.lat,
                                  lng: props.query.lng
                                })
                              }}
                              title={props.infoMarker.name}
                              className='text-overflow'>
                        {props.infoMarker.name}</Link></h4>
                    </div>
                    <div className="img-result">
                      <div
                        onClick={()=>{
                          _.setTemporaryData(Constants.locationCheckPoint, {
                            lat: props.query.lat,
                            lng: props.query.lng
                          });
                          browserHistory.push(urlOnPage.shop.shopView + functionCommon.createSlug( props.infoMarker.name) + '-' +  props.infoMarker.id + '.html?utm=map');
                        }}
                        style={{
                          background:'url('+Constants.linkApi+'/images/'+props.infoMarker.coverImage+')',
                          backgroundPosition:'center center',
                          backgroundSize:'cover',
                          backgroundRepeat:'no-repeat',
                          width:'100%',
                          height:'110px',
                          borderBottom:'3px solid #14b577'
                        }}
                        className="primary-bg"/>
                    </div>
                    <div className="content-rel">
                      <div className="tr-rel">
                        <div className="rel-left">
                          <p className="fa fa-map-marker fa-2x"/>
                        </div>
                        <div className="rel-right">
                          <p>{props.infoMarker.address?props.infoMarker.address:'Chưa có dữ liệu'}</p>
                        </div>
                      </div>
                      <div className="tr-rel">
                        <div className="rel-left">
                          <p className="fa fa-phone fa-2x"/>
                        </div>
                        <div className="rel-right">
                          <p>{props.infoMarker.phone?props.infoMarker.phone:'Chưa có dữ liệu'}</p>
                        </div>
                      </div>
                      {props.infoMarker.email?<div className="tr-rel">
                        <div className="rel-left">
                          <p className="fa fa-envelope fa-2x" />
                        </div>
                        <div className="rel-right">
                          <p>{props.infoMarker.email}</p>
                        </div>
                      </div>:''}
                    </div>
                    <div className="arrow-down"/>
                  </div>
                : null}
              </InfoBox>:''}
          </Marker>
        )):''}
      </GoogleMap>
    )
  )/*)*/;
export default AroundMap;
