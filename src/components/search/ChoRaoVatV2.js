/*
 * Created by TrungPhat on 19/06/2017
 */
import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import * as searchAction from '../../actions/searchAction';
import * as actionTypes from '../../actions/actionTypes';
import {Button, Pagination, FormControl, HelpBlock, FormGroup, Form, Radio, Modal} from 'react-bootstrap';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ToastContainer, ToastMessage} from "react-toastr";
import LoadingTable from '../controls/LoadingTable';
import SearchPostList from './SearchPostList';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import {Helmet} from "react-helmet";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);
let Constants = require('../../services/Constants');
let Session = require('../../utils/Utils');
let Aes = require('../../services/httpRequest');
let urlOnPage = require('../../url/urlOnPage');
let functionCommon = require('../common/FunctionCommon');


class ChoRaoVat extends React.Component {
  initialStateSearch() {
    return {
      keywords: '',
      location: [],
      km: 10,
      page: 0,
      category01: '',
      category02: ''
    }
  }

  initialStateStatus() {
    return {
      isSearch: false,
      isLoadData: false,
      isTracking: false,
      isGetCategory: false,
      loadDataOrSearch: searchAction.LOAD_DATA_METHOD,
      isClickViewPostOrProfile: false
    }
  }

  initialPagination() {
    return {
      pageNumber: 1,
      activePage: 1,
      total: 0
    }
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      data: {},
      search: this.initialStateSearch(),
      messages: [],
      error: {},
      onShowModal: false,
      category: {
        dataParent: [],
        dataChild: [],
        categoryParent: {
          name: this.props.lng.SHOP_CREATE_CATETORY_01,
          id: '-1'
        },
        categoryChild: {
          name: this.props.lng.SHOP_CREATE_CATETORY_02,
          id: '-1'
        }
      },
      isClickParent: false,
      isClickChild: false,
      idFriend: '',
      status: this.initialStateStatus(),
      pagination: this.initialPagination(),
      styleView: 1
    };
    this.onClickCategory = this.onClickCategory.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.onLoadCategory = this.onLoadCategory.bind(this);
    this.onSaveDataInSession = this.onSaveDataInSession.bind(this);
  }

  componentDidMount() {
    // window.scrollTo(0, 0);
  }

  componentWillMount() {
    let notRedirect = this.props.location.query.notRedirect;
    if (notRedirect == 'true') {
      localStorage.setItem("notRedirect", 'true');
    }
    else {
      let getRedirect = localStorage.getItem("notRedirect")
      if (!getRedirect) {
        if (Session.isMobile.iOS() || Session.isMobile.Android()) {
          window.location = 'https://around.com.vn/share/index.html';
        }
      }
    }

    /* Lấy danh mục */
    this.onLoadCategory('-1');
    // if(!Session.checkSession()){
    // browserHistory.push(urlOnPage.loginRegister.lrLogin);
    // }else{
    let dataRequestSearchCRV = Session.getTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV) ? Session.getTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV) : {};
    if (!dataRequestSearchCRV.isClickViewPostOrProfile || dataRequestSearchCRV.isClickViewPostOrProfile == false) {
      /* Xin phép truy cập vị trí */
      let options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition(this.success, this.error, options);
    }
    else {
        let category = this.state.category;
        category.categoryParent = dataRequestSearchCRV.dataCategoryParentSearch;
        category.categoryChild = dataRequestSearchCRV.dataCategoryChildSearch;
        this.setState({category: category});
    }

    Session.setTemporaryData('onShowModalCategory', true);
    let isShowModelFirst = localStorage.getItem("isShowModelFirst")
    if (isShowModelFirst != 'isset') {
      localStorage.setItem("isShowModelFirst", 'isset');
      this.setState({onShowModal: true, isClickParent: true})
    }

  }

  componentWillUnmount() {
    let dataRequestSearchCRV = Session.getTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV) ? Session.getTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV) : {};
    if (this.state.status.isClickViewPostOrProfile) {
      if (this.state.status.loadDataOrSearch == searchAction.SEARCH_METHOD) {
        dataRequestSearchCRV.unMountFromSearch = searchAction.SEARCH_METHOD;
      } else {
        dataRequestSearchCRV.unMountFromSearch = searchAction.LOAD_DATA_METHOD;
      }
      dataRequestSearchCRV.isClickViewPostOrProfile = true;
    } else {
      dataRequestSearchCRV.isClickViewPostOrProfile = false;
    }

    Session.setTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV, dataRequestSearchCRV)

  }

  success(pos) {
    let crd = pos.coords;
    let search = this.state.search;
    search.location = [crd.latitude, crd.longitude];
    this.setState({search: search});
    /* Lấy danh sách tin rao vặt mới trên chợ, có vị trí */
    // this.onLoadNewsPost(search.location);
  };

  error(err) {
    /* Lấy danh sách tin rao vặt mới trên chợ, không đưa lên vị trí */
    // this.onLoadNewsPost();
  };

  onLoadCategory(id) {
    let status = this.state.status;
    status.isGetCategory = true;
    this.setState({status: status});
    this.props.actions.loadCategory({parentId: id});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataMessage) {
      let type = nextProps.dataMessage.type;
      let result = '';
      switch (type) {
        case actionTypes.GET_CATEGORY_SUCCESS:
          result = nextProps.dataMessage.dataSearch;
          if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
            if (this.state.status.isGetCategory) {
              let data = result.data;
              data.unshift({
                name: this.props.lng.CATEGORY_ALL,
                id: Constants.DEFAULT_PARENT
              });
              let category = this.state.category;
              if (result.parentId != '-1') {
                this.setState({isChild: true});
                category.dataChild = data;
              } else {
                category.dataParent = data;
              }
              this.setState({
                category: category
              });
              let status = this.state.status;
              status.isGetCategory = false;
              this.setState({status: status});
            }
          } else {
            if (result.code == Constants.RESPONSE_CODE_OTP_INVALID) {
              this.onLoadCategory('-1');
            } else {
              this.refs.container.error(this.props.lng.TEXT_ERROR, `Thông báo.`, {
                closeButton: true,
              });
            }
          }

          break;
      }
    }
  }

  /*  Hàm thay đổi danh mục*/
  onClickCategory(item) {
    if (this.state.isClickParent) {
      if (item.id != '-1' && item.id != 0) {
        let category = this.state.category;
        category.categoryParent = item;
        this.setState({
          category: category,
          isClickParent: false
        });
        this.onLoadCategory(item.id);
      } else {
        let category = this.state.category;
        category.categoryParent = {
          name: this.props.lng.SHOP_CREATE_CATETORY_01,
          id: '-1'
        };
        category.categoryChild = {
          name: this.props.lng.SHOP_CREATE_CATETORY_02,
          id: '-1'
        };
        this.setState({onShowModal: false, category: category});
      }
    } else {
      if (item.id != '-1') {
        let category = this.state.category;
        category.categoryChild = item;
        this.setState({
          category: category,
          isClickChild: false,
          onShowModal: false
        });
      } else {
        let category = this.state.category;
        category.categoryChild = {
          name: this.props.lng.CATEGORY_ALL,
          id: '-1'
        };
        this.setState({onShowModal: false, category: category});
      }
    }
    Session.setTemporaryData('onShowModalCategory', false);
    this.autoSearch();
  }

/* Hàm khi nhấn phân trang */
  handleSelect(eventKey) {
    let query = this.props.location.query;
    if (eventKey == 1) {
      delete query.page;
    } else {
      query.page = eventKey;
    }
    if (this.state.status.loadDataOrSearch == searchAction.SEARCH_METHOD) {
      /* Lưu thông tin tìm kiếm vào Session */
      this.onSaveDataInSession();
    }
    browserHistory.push({pathname: this.props.location.pathname, query: query});
  }

  onSaveDataInSession() {
    let dataRequestSearchCRV = Session.getTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV) ? Session.getTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV) : {};
    dataRequestSearchCRV.category01 = this.state.search.category01;
    dataRequestSearchCRV.category02 = this.state.search.category02;
    dataRequestSearchCRV.km = this.state.search.km;
    dataRequestSearchCRV.keywords = this.state.search.keywords;
    dataRequestSearchCRV.dataCategoryParentSearch = this.state.category.categoryParent;
    dataRequestSearchCRV.dataCategoryChildSearch = this.state.category.categoryChild;
    dataRequestSearchCRV.lat = this.state.search.location[0];
    dataRequestSearchCRV.lng = this.state.search.location[1];
    dataRequestSearchCRV.page = this.state.search.page;
    Session.setTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV, dataRequestSearchCRV);
  }
  changeStyleView () {
    let styleView = this.state.styleView;
    styleView = styleView == 1 ? 2 : 1;
    this.setState({styleView});
  }

  render() {
    const formatkg = value => value + ' Km';
    let empty = this.state.category.categoryParent.id == '-1' ? true : false;
    return (
      <div>
        <Helmet
          title="Chợ rao vặt"
        />
        <div id="search-2">
            <div className="raovat-cat-parent">
              <div className="left">DANH MỤC</div>
              <div className="right" onClick={this.changeStyleView.bind(this)}>
                <img width="20px" height="20px"

                     src={ this.state.styleView == 1 ?
                       Constants.linkServerImage  +  '/common/icon-list-02.png'
                       :
                       Constants.linkServerImage  +  '/common/icon thumbnail-02.png'
                     }
                     alt="Hiển thị"

                />
              </div>
            </div>
            <div className="categort-list-raovat">
              { this.state.styleView == 1 ?
                this.state.category.dataParent.map((item, index) =>

                  <div key={item.id} className="categort-list-raovat-item-1" style={{width: '25%', float: 'left'}}>
                    <Link to={'rao-vat/' + functionCommon.createSlug(item.name) + '-' + item.id + '.html?catName=' + item.name + (item.image ? '&pic=' + item.image : '')  }>
                        <div className="categort-list-raovat-item-1-img"
                          style={{
                            background:  item.image ?
                                'url(' + Constants.linkApi + '/images/' + item.image + ')'
                              :
                                'url(' + Constants.linkServerImage  + '/common/ic_all_category.png' + ')',
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            width: '100%',
                            height: '140px',
                            cursor: 'pointer'
                          }}
                        >

                        </div>
                        <div className="categort-list-raovat-item-1-text">
                            <span>{item.name} </span>
                        </div>

                      </Link>
                  </div>

                )
                :
                this.state.category.dataParent.map((item, index) =>
                  <div key={item.id} className="categort-list-view-1" style={{width: '100%'}}>
                    <Link to={'rao-vat/' + functionCommon.createSlug(item.name) + '-' + item.id + '.html?catName=' + item.name + (item.image ? '&pic=' + item.image : '')  } >
                      <div className="categort-list-raovat-view-item-left">
                        <img
                          src={
                            item.image ?
                              Constants.linkApi + '/images/' + item.image
                            :
                              Constants.linkServerImage + '/common/ic_all_category.png'
                          }

                          alt={item.name}
                          width="80px"
                          height="80px"

                        />
                      </div>
                      <div className="categort-list-raovat-view-item-right">
                        <div className="cat-parent-name"> {item.name} </div>
                        <div className="cat-parent-description">
                          {item.description ? item.description : ''}
                        </div>
                      </div>

                    </Link>
                  </div>

                )
              }

            </div>
        </div>
      </div>
    );
  }
}

ChoRaoVat.propTypes = {
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
export default connect(mapStateToProps, mapDispatchToProps)(ChoRaoVat);
