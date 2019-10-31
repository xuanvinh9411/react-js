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
      pagination: this.initialPagination()
    };
    this.onSearch = this.onSearch.bind(this);
    this.updateState = this.updateState.bind(this);
    this.onClickCategory = this.onClickCategory.bind(this);
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
    this.onLoadNewsPost = this.onLoadNewsPost.bind(this);
    this.onLoadCategory = this.onLoadCategory.bind(this);
    this.autoSearch = this.autoSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.onClickToPost = this.onClickToPost.bind(this);
    this.onSaveDataInSession = this.onSaveDataInSession.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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
      this.onLoadNewsPost();
      navigator.geolocation.getCurrentPosition(this.success, this.error, options);
    }
    else {
      if (dataRequestSearchCRV.unMountFromSearch == searchAction.LOAD_DATA_METHOD) {
        this.onLoadNewsPost([dataRequestSearchCRV.lat, dataRequestSearchCRV.lng]);
      } else {
        let category = this.state.category;
        category.categoryParent = dataRequestSearchCRV.dataCategoryParentSearch;
        category.categoryChild = dataRequestSearchCRV.dataCategoryChildSearch;
        let search = this.state.search;
        search.keywords = dataRequestSearchCRV.keywords;
        search.km = dataRequestSearchCRV.km;
        search.category01 = dataRequestSearchCRV.category01;
        search.category02 = dataRequestSearchCRV.category02;
        search.location = [dataRequestSearchCRV.lat, dataRequestSearchCRV.lng];
        search.page = dataRequestSearchCRV.page;
        let pagination = this.state.pagination;
        pagination.activePage = parseInt(dataRequestSearchCRV.page + 1);
        let status = this.state.status;
        status.isSearch = true;
        this.setState({status: status, search: search, category: category, pagination: pagination});
        this.props.actions.searchPost(search);
      }
    }

    Session.setTemporaryData('onShowModalCategory', true);
    let isShowModelFirst = localStorage.getItem("isShowModelFirst")
    console.log("isShowModelFirst isShowModelFirst", isShowModelFirst);
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

  onLoadNewsPost(location) {
    let status = this.state.status;
    status.isLoadData = true;
    this.setState({status: status});
    this.props.actions.newest_post(location);
  }

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
        /* Case tìm kiếm tin đăng */
        case actionTypes.SEARCH_POST_SUCCESS:
          /* Chống trả về dữ liệu khi không có thao tác gọi */
          result = nextProps.dataMessage.dataSearch;
          if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
            if (this.state.status.isSearch) {
              let pagination = this.state.pagination;
              pagination.total = result.data.total;
              pagination.pageNumber = Math.ceil(result.data.total / result.data.totalItemPaging);
              this.setState({
                messages: result.data.posts,
                pagination: pagination
              });
              let status = this.state.status;
              status.isSearch = false;
              status.loadDataOrSearch = searchAction.SEARCH_METHOD;
              let error = this.state.error;
              error.keywords = false;
              this.setState({status: status, error: error});
            }
          } else {
            this.autoSearch();
          }
          break;
        case actionTypes.TRACKING_FRIEND_SUCCESS:
          result = nextProps.dataMessage.dataShops;
          if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
            if (this.state.status.isTracking) {
              Session.setTemporaryData('infoFriend', result.data);
              browserHistory.push(urlOnPage.user.userViewProfileFriend + result.data.user.id);
              let status = this.state.status;
              status.isTracking = false;
              this.setState({status: status});
            }
          } else {
            this.onTrackingFriend(this.state.idFriend);
          }
          break;
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
        /* Case lấy danh sách tin đăng mới nhất*/
        case actionTypes.SEARCH_NEW_POST_SUCCESS:
          result = nextProps.dataMessage.dataSearch;
          if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
            if (this.state.status.isLoadData) {
              let pagination = this.state.pagination;
              pagination.total = result.data.total;
              pagination.pageNumber = 1//Math.ceil(result.data.total / result.data.totalItemPaging);
              this.setState({
                messages: result.data.posts,
                pagination: pagination
              });
              let status = this.state.status;
              status.isLoadData = false;
              this.setState({status: status});
            }
          } else if (result.code == Constants.RESPONSE_CODE_OTP_INVALID) {
            this.onLoadNewsPost(this.state.search.location);
          }

          break;
      }
    }
    if (nextProps.location.key != this.props.location.key) {
      window.scrollTo(0, 0);
      let queryPage = nextProps.location.query.page ? nextProps.location.query.page : 1;
      let newActivePage = Session.isInt(queryPage) ? queryPage : this.state.pagination.activePage;
      let pagination = this.state.pagination;
      pagination.activePage = parseInt(newActivePage);
      let search = this.state.search;
      search.page = parseInt(newActivePage - 1);
      this.setState({pagination: pagination, search});
      this.autoSearch();
    }
  }

  /* Thay đổi số KM */
  handleChange = (value) => {
    let search = this.state.search;
    search.km = value;
    this.setState({
      search: search
    })
  }
  /* Hàm tìm kiếm*/
  onSearch(e) {
    if (this.validatorForm() == true) {
      //let category=this.state.category;
      this.autoSearch();
    }
  }

  /* Kiểm tra dữ lệu khi nhấn Search */
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

  /* Cập nhật keywords khi người dùng gõ */
  updateState(event) {
    const field = event.target.name;
    let valueField = event.target.value;
    let error = this.state.error;
    if (field == 'keywords') {
      error[field] = valueField.length == 0;
    }
    let search = this.state.search;
    search.keywords = valueField;
    return this.setState({search: search, error: error});
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

  /* Hàm gọi tìm kiếm khi thay đổi danh mục */
  autoSearch() {
    let category = this.state.category;
    let search = this.state.search;
    search.category01 = category.categoryParent.id;
    search.category02 = category.categoryChild.id;
    /* Kiểm tra Modal đã ẩn hay chưa, nếu ẩn mới thực hiện gọi search */
    //if(!Session.getTemporaryData('onShowModalCategory') || Session.getTemporaryData('onShowModalCategory') == false){
    /* Có từ khóa hoặc danh mục cấp 1 mới search */
    if (search.keywords.length > 0 || search.category01 != Constants.DEFAULT_PARENT) {
      let status = this.state.status;
      status.isSearch = true;
      this.setState({status: status});
      if (search.km == 0) {
        search.km = 1;
      }
      this.props.actions.searchPost(search);
    } else {
      this.onLoadNewsPost(search.location);
    }
    //}
  }

  /* Search khi nhấn Enter */
  search() {
    this.onSearch();
  }

  /* Hàm gọi API khi muốn xem tường người khác */
  onTrackingFriend(id) {
    let user = Aes.aesDecrypt(localStorage.getItem('user'));
    let status = this.state.status;
    status.isClickViewPostOrProfile = true;
    this.setState({status: status});
    this.onSaveDataInSession();
    if (!user || !user.id) {
      browserHistory.push('/login?require=true');
    }
    else {
      if (user.id == id) {
        browserHistory.push(urlOnPage.user.userMyProfile);
      } else {
        let status = this.state.status;
        status.isTracking = true;
        this.setState({idFriend: id, status: status});
        this.props.actions.trackingFriend({userIdFriend: id, shopinfo: 1});
      }
    }
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

  onClickToPost(id) {
    let status = this.state.status;
    status.isClickViewPostOrProfile = true;
    this.setState({status: status});
    this.onSaveDataInSession();
    browserHistory.push(urlOnPage.post.postViewPage +  id);
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
          <div className="form-left">
            <FormGroup validationState={this.state.error.keywords ? 'error' : null} className="cus-input">
              <FormControl
                type="text"
                className="form-control"
                name="keywords"
                onKeyPress={event => {
                  if (event.key === "Enter") {
                    this.search();
                  }
                }}
                placeholder={this.props.lng.FORRUM_SEARCH_TEXT_BOX_HINT}
                value={this.state.search.keywords}
                onChange={this.updateState}
              />
            </FormGroup>
            <div className="category-search-post">
              <button className="btn-category-search pull-left text-left 1111" onClick={() => {
                Session.setTemporaryData('onShowModalCategory', true);
                this.setState({onShowModal: true, isClickParent: true})
              }}>
                {this.state.category.categoryParent ? this.state.category.categoryParent.name.length > 25 ?
                  this.state.category.categoryParent.name.slice(0, 25) + '...' :
                  this.state.category.categoryParent.name : ''}
                <span className="fa fa-sort-desc pull-right"/></button>
              <button className="btn-category-search pull-right text-left"
                  onClick={() => {
                    if (empty) {
                      this.refs.container.error(this.props.lng.SHOP_CREATE_VALIDATE_CATETORY_01 + ' trước', `Thông báo.`, {
                        closeButton: true,
                      });
                    } else {
                      Session.setTemporaryData('onShowModalCategory', true);
                      this.setState({onShowModal: true, isClickChild: true})
                    }
                  }}
              >{this.state.category.categoryChild ? this.state.category.categoryChild.name.length > 25 ? this.state.category.categoryChild.name.slice(0, 25) + '...' : this.state.category.categoryChild.name : ''}
                <span className="fa fa-sort-desc pull-right"/></button>
            </div>
            <Modal show={this.state.onShowModal} onHide={() => {
              //if (!this.state.isClickParent) {
                this.setState({onShowModal: false });
              //}
            }} bsSize="large" aria-labelledby="contained-modal-title-lg" dialogClassName="my-modal">
              <Modal.Header closeButton="true">
                <Modal.Title id="contained-modal-title-lg">{this.props.lng.CATEGORY_TITLE}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {
                  this.state.isClickParent ?
                    this.state.category.dataParent.map((item, index) =>
                      <div className="item-cate"
                           key={index}
                           onClick={() => this.onClickCategory(item)}>
                        <a href="javascript:void(0)" title={item.name}>
                          <img
                            src={item.image ? Constants.linkApi + '/images/' + item.image : Constants.linkServerImage + 'common/no_image.png'}
                            style={{width: '50px', height: '50px'}}/>
                          <p className="text-center">{item.name}</p>
                        </a>
                      </div>
                    )
                    :
                    this.state.category.dataChild.map((item, index) =>
                      <div className="item-cate" key={index} onClick={() => this.onClickCategory(item)}>
                        <a href="javascript:void(0)" title={item.name}>
                          <img
                            src={item.image ? Constants.linkApi + '/images/' + item.image : Constants.linkServerImage + 'common/no_image.png'}
                            style={{width: '50px', height: '50px'}}/>
                          <p className="text-center">{item.name}</p>
                        </a>
                      </div>
                    )
                }
              </Modal.Body>
            </Modal>
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
            <button type="button" className="btns btn-flat btn-search button-hover"
                    onClick={!this.state.isSubmit ? this.onSearch : null}
                    disabled={this.state.isSubmit}>{this.state.isSubmit ? this.props.lng.SEARCH_BUTTON_SEARCHING : this.props.lng.SEARCH_BUTTON_SEARCH}</button>
          </div>
        </div>
        <div id="div-wait">
          {
            this.state.status.isLoadData == true || this.state.status.isSearch == true ?
              <LoadingTable/>
              :
              this.state.messages.length > 0 ?
                <SearchPostList
                  messages={this.state.messages}
                  onTrackingFriend={this.onTrackingFriend.bind(this)}
                  onClickToPost={this.onClickToPost.bind(this)}
                  lng={this.props.lng}
                />
                :
                <div className="cpn-null" style={{height: '638px'}}></div>
          }
          <div className="center-btn">
            {this.state.pagination.pageNumber > 1 ?
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                bsSize="normal"
                maxButtons={Constants.MAX_BUTTON_PAGGING}
                items={this.state.pagination.pageNumber}
                activePage={this.state.pagination.activePage}
                onSelect={this.handleSelect}/>
              :
              null}
          </div>
        </div>
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="container"
          className="toast-top-right"
        />
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
