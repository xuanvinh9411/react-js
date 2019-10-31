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
import {AroundMap} from '../controls/AroundMapRaoVat';
import {Helmet} from "react-helmet";
let functionCommon = require('../common/FunctionCommon');

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
    let queryId = this.props.params.id;
    let levelCat = "-1";
    queryId = queryId == 1 ? "-1" : queryId;
    levelCat = queryId == -1 ? "-1" : "1";

    let queryIdChild = this.props.location.query.cat ? this.props.location.query.cat : false;
    let stateSearch = this.initialStateSearch()
    let queryPage = this.props.location.query.page  ? parseInt(this.props.location.query.page) -1  : 0;
    let nameCatActive = this.props.location.query.catName ? this.props.location.query.catName :  'TẤT CẢ'

    if (this.props.location.query.cat) {
      levelCat = "2";
    }

    let picImg = this.props.location.query.pic ?
          Constants.linkApi + '/images/' +  this.props.location.query.pic
        :
          Constants.linkServerImage + 'common/ic_all_category.png';

    stateSearch.page = queryPage;
    let pagination = this.initialPagination();
    pagination.activePage = queryPage + 1;
    this.state = {
      imgAllCat : picImg,
      data: {},
      search: stateSearch,
      messages: [],
      error: {},
      onShowModal: false,
      category: {
        dataParent: [],
        dataChild: [],
        categoryParent: {
          name: this.props.lng.SHOP_CREATE_CATETORY_01,
          id: queryId
        },
        categoryChild: {
          name: this.props.lng.SHOP_CREATE_CATETORY_02,
          id: queryIdChild ? queryIdChild : "-1"
        }
      },
      levelCat: levelCat,
      queryId: queryId,
      queryIdChild: queryIdChild,
      isClickParent: ((queryId != "-1" && !queryIdChild) || queryIdChild) ? false : true,
      isClickChild: false,
      idFriend: '',
      status: this.initialStateStatus(),
      pagination: pagination,
      styleView : 1,
      currentLocation: false,
      searchSuccess: false,
      isFirstSubmit: false,
      nameCatActive: nameCatActive,
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
    this.handleMapClick = this.handleMapClick.bind(this);


  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    //window.scrollTo(0, 0);
    $(document).ready(function(){
      let checkHasActive = false;
      $('#carousel-id .carousel-inner div').each(function () {
          if ($(this).hasClass("active")) {
            checkHasActive = true
          };
      });

      if (!checkHasActive) {
        $('.carousel-inner div').removeClass('active');
        $('.carousel-inner div').first().addClass('active');
      }
    })
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

    let queryId = this.state.queryId;
    let queryIdChild = this.state.queryIdChild;
    this.onLoadCategory(queryId);
    // console.log(" queryId queryId queryId", queryId);
    if (queryId != "-1") {
      this.autoSearch();
    }
    else {
      this.onLoadNewsPost();
    }
    let dataRequestSearchCRV = Session.getTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV) ? Session.getTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV) : {};
    if (!dataRequestSearchCRV.isClickViewPostOrProfile || dataRequestSearchCRV.isClickViewPostOrProfile == false) {
      /* Xin phép truy cập vị trí */
      // console.log("dataRequestSearchCRV dataRequestSearchCRV", dataRequestSearchCRV);

      let options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition(this.success, this.error, options);
    }
    else {
      if (dataRequestSearchCRV.unMountFromSearch == searchAction.LOAD_DATA_METHOD) {
        // console.log("onLoadNewsPost onLoadNewsPost onLoadNewsPost 111111");
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

  }

  componentWillUnmount() {
    // let dataRequestSearchCRV = Session.getTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV) ? Session.getTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV) : {};
    // if (this.state.status.isClickViewPostOrProfile) {
    //   if (this.state.status.loadDataOrSearch == searchAction.SEARCH_METHOD) {
    //     dataRequestSearchCRV.unMountFromSearch = searchAction.SEARCH_METHOD;
    //   } else {
    //     dataRequestSearchCRV.unMountFromSearch = searchAction.LOAD_DATA_METHOD;
    //   }
    //   dataRequestSearchCRV.isClickViewPostOrProfile = true;
    // } else {
    //   dataRequestSearchCRV.isClickViewPostOrProfile = false;
    // }
    //
    // Session.setTemporaryData(Constants.DATA_REQUEST_SEARCH_CRV, dataRequestSearchCRV)

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
    // console.log("111 onLoadNewsPost onLoadNewsPost onLoadNewsPost",  this.state.search);
    let status = this.state.status;
    status.isLoadData = true;
    this.setState({status: status,isFirstSubmit: true});
    let pagination = this.state.search;
    let page = pagination.page ? pagination.page : 0;
    this.props.actions.newest_post(location, page);
  }

  onLoadCategory(id) {
    // console.log("onLoadCategory onLoadCategory", id);
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

              let data = [];
              for (let i = 0; i < result.data.posts.length; i++) {
                data.push({
                  position: {
                    lat: result.data.posts[i].location[1],
                    lng: result.data.posts[i].location[0],
                  },
                  key: result.data.posts[i].id,
                  icon: {
                    logoState: 0
                  },
                  //showInfo: false
                });
              }
              // if (this.state.isGetLocation || (this.props.location.query && this.props.location.query.keywords.length > 0)) {
              //   data.unshift(this.state.markersDefault[0]);
              // }

              let search = this.state.search;
              this.setState({
                markers: data,
                isGetLocation: true,
                messages: result.data.posts,
                pagination: pagination,
                searchSuccess: true,
                isFirstSubmit: true,
                currentLocation: true
              });
              let status = this.state.status;
              status.isSearch = false;
              status.loadDataOrSearch = searchAction.SEARCH_METHOD;
              let error = this.state.error;
              error.keywords = false;
              this.setState({status: status, error: error});
            }
          } else {
            // console.log("autoSearch autoSearch goi lai nhe");
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
          // console.log("GET_CATEGORY_SUCCESS GET_CATEGORY_SUCCESS GET_CATEGORY_SUCCESS ", result);
          if (result.code == Constants.RESPONSE_CODE_SUCCESS) {
            if (this.state.status.isGetCategory) {
              let data = result.data;
              // console.log("data data data category ", data);
              data.unshift({
                name: "Tất cả",
                id: Constants.DEFAULT_PARENT
              });
              let category = this.state.category;
              if (result.parentId != '-1') {
                this.setState({isChild: true});
                category.dataChild = data;
              } else {
                category.dataParent = data;
              }
                let status = this.state.status;
                status.isGetCategory = false;
                this.setState({category, status: status});
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
              pagination.pageNumber = Math.ceil(result.data.total / result.data.totalItemPaging);
              let data = [];
              for (let i = 0; i < result.data.posts.length; i++) {
                data.push({
                  position: {
                    lat: result.data.posts[i].location[1],
                    lng: result.data.posts[i].location[0],
                  },
                  key: result.data.posts[i].id,
                  icon: {
                    logoState: 0
                  },
                  //showInfo: false
                });
              }

              this.setState({
                messages: result.data.posts,
                pagination: pagination,
                markers: data,
                isGetLocation: true,
                searchSuccess: true,
                isFirstSubmit: true,
                currentLocation: true
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
      // console.log("autoSearch autoSearch nextProps.location.key", nextProps.location.key)
      window.scrollTo(0, 0);
      let queryPage = nextProps.location.query.page ? nextProps.location.query.page : 1;
      let newActivePage = Session.isInt(queryPage) ? queryPage : this.state.pagination.activePage;
      let pagination = this.state.pagination;
      pagination.activePage = parseInt(newActivePage);
      let search = this.state.search;
      search.page = parseInt(newActivePage - 1);
      this.setState({pagination: pagination, search});
      // console.log("autoSearch autoSearch nextProps.location.key ", pagination, nextProps.location, this.props.location )
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
      // console.log("autoSearch autoSearch onSearch");
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
    // console.log("onClickCategory onClickCategory", item);
      let picImg = item.image;
      if (item.id != '-1' && item.parentId == "-1") {
        let category = this.state.category;
        category.categoryParent = item;
        let levelCat = "1";
        let imgAllCat = Constants.linkApi + '/images/' + item.image;
        this.setState({
          category: category,
          isClickParent: false,
          nameCatActive : item.name,
          levelCat,
          imgAllCat
        });
        this.onLoadCategory(item.id);
        let location  = `/rao-vat/${functionCommon.createSlug(item.name) + '-' +item.id}.html?catName=` + item.name + '&pic='+ picImg;
        browserHistory.push(location);

      } else {
        //this.setState({category: category});

        const location = Object.assign({}, browserHistory.getCurrentLocation());
        delete location.query['page'];
        if (item.id != "-1") {
          Object.assign(location.query, {cat: item.id, catName: item.name});
        }
        else {
          Object.assign(location.query, {catName: item.name, cat: -1});
        }
        let category = this.state.category;
        category.categoryChild = item;


        let levelCat = "2";
        this.setState({
          category: category,
          isClickChild: false,
          nameCatActive : item.name,
          queryIdChild : item.id,
          levelCat,
          pic: picImg,
        });
        browserHistory.push(location);
      }

    Session.setTemporaryData('onShowModalCategory', false);
    //this.autoSearch();
  }

  /* Hàm gọi tìm kiếm khi thay đổi danh mục */
  autoSearch() {
    let category = this.state.category;
    let search = this.state.search;
    search.category01 = category.categoryParent.id;
    search.category02 = category.categoryChild.id;

    // console.log("autoSearch autoSearch",search );
    /* Kiểm tra Modal đã ẩn hay chưa, nếu ẩn mới thực hiện gọi search */
    //if(!Session.getTemporaryData('onShowModalCategory') || Session.getTemporaryData('onShowModalCategory') == false){
    /* Có từ khóa hoặc danh mục cấp 1 mới search */
    if (search.keywords.length > 0 || search.category01 != Constants.DEFAULT_PARENT) {
      let status = this.state.status;
      status.isSearch = true;
      this.setState({status: status});
      if (search.km == 0) {
        search.km = 100;
      }
      // console.log("search.location search.location", search);

      this.props.actions.searchPost(search);
    } else {
      // console.log("search.location search.location", search.location);
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
    const location = Object.assign({}, browserHistory.getCurrentLocation());
    delete location.query['page'];
    Object.assign(location.query, query: query);

    browserHistory.push(location);
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
    browserHistory.push(urlOnPage.post.postViewPage + id);
  }

  onLoadMoreShop() {
    let query = this.props.location.query;
    let pageNumber = this.state.pagination.pageNumber;
    let page = query.page ?  parseInt(query.page) + 1 : 2;
    if (pageNumber <  page) return;
    query.page = page;

    if (this.state.status.loadDataOrSearch == searchAction.SEARCH_METHOD) {
      /* Lưu thông tin tìm kiếm vào Session */
      this.onSaveDataInSession();
    }
    const location = Object.assign({}, browserHistory.getCurrentLocation());
    delete location.query['page'];
    Object.assign(location.query, query: query);
    browserHistory.push(location);

  }

  categoryChildBuldFc(dataChild) {
    let arrAll = [], arrItem = [];
    if (dataChild && dataChild.length < 6) {
      arrAll.push(dataChild);
    }
    else if (dataChild && dataChild[0]) {
      dataChild.forEach((item, index) => {
        arrItem.push(item);
        if (index % 6 == 5) {
          arrAll.push(arrItem);
          arrItem = [];
        }
      })
    }
    if (arrItem.length > 0 ) {
      arrAll.push(arrItem);
    }

    return arrAll;

  }

  onChangeStyleView () {
    let styleView = this.state.styleView;
    styleView = styleView == 1 ? 2 : 1;
    this.setState({styleView});
  }

  handleMapClick(event) {
    let markers = this.state.markers;
    for (let i in markers) {
      if (markers[i]) {
        markers[i].showInfo = false;
      }
    }
    this.setState({markers: markers});
  }


  onCheckMarkers(marker) {
    if ((typeof marker.position.lat == 'function' && typeof marker.position.lng == 'function') || this.checkMarkers(marker.position) == true) {
      return false;
    } else {
      return true;
    }
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
      if (this.onCheckMarkers(marker)) {
        let markers = this.state.markers;
        for (let i in markers) {
          if (markers[i]) {
            if (markers[i].key == marker.key) {
              markers[i].showInfo = true;
            } else {
              markers[i].showInfo = false;
            }
          }
        }
        let messages = this.state.messages;
        let data = this.state.data;
        for (let i = 0; i < messages.length; i++) {
          if (marker.key == messages[i].id) {
            data = messages[i];
            data.coverImage = ( messages[i].images && messages[i].images[0] ) ? messages[i].images[0] : '';
          }//ab
        }
        this.setState({data: data, markers: markers});
      }
    }
  }



  render() {
    const formatkg = value => value + ' Km';
    let empty = this.state.category.categoryParent.id == '-1' ? true : false;
    let dataCategory = !this.state.isClickParent  ? this.state.category.dataChild : this.state.category.dataParent;
    let categoryChildBuld = this.categoryChildBuldFc(dataCategory)

    let queryIdChild = this.state.queryIdChild;
    let imgAllCat = this.state.imgAllCat;
    // console.log("categoryChildBuld categoryChildBuld", categoryChildBuld);

    return (
      <div>
        <Helmet
          title="Chợ rao vặt"
        />
        <div id="search-2">
          <div className="rao-vat-back-home">
            <Link to={'/'}>
              Trở về danh mục
            </Link>
          </div>
          <div className="form-left">
            <FormGroup validationState={this.state.error.keywords ? 'error' : null} className="cus-input">
              <FormControl
                type="text"
                className="form-control raovat-input-keyword"
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
          </div>
          <div className="form-right">
            <button type="button" className="btns btn-flat btn-search button-hover raovat-btn-search"
                    onClick={!this.state.isSubmit ? this.onSearch : null}
                    disabled={this.state.isSubmit}>
              {
                this.state.isSubmit ?
                  this.props.lng.SEARCH_BUTTON_SEARCHING
                  :
                  this.props.lng.SEARCH_BUTTON_SEARCH
              }
              </button>
          </div>
        </div>
        <div className="raovat-maps">
          <div className="raovat-maps-left">
            <span className="primary-color" style={{fontSize: '18px'}}>{this.state.nameCatActive}</span>
          </div>
          <div className="raovat-maps-right form-right">
            {this.state.styleView == 1 ?
              <img
                onClick={this.onChangeStyleView.bind(this)}
                width="30px" height="30px"
               src={Constants.linkServerImage  +  '/common/ic_map_raovat_distance.png' }
              />
              :
              <img
                onClick={this.onChangeStyleView.bind(this)}
                width="30px" height="30px"
                src={Constants.linkServerImage  +  '/common/ic_list_raovat_distance.png' }
              />
            }
          </div>
        </div>
        { ( this.state.styleView == 1 && categoryChildBuld.length > 0 ) ?
          <div id="carousel-id"
               className="carousel slide"
               data-ride="carousel"
               data-interval="false"
               style={{height: '182px', width: '100%'}}
          >
            <div className="carousel-inner">
              {
                categoryChildBuld.length > 0 ?
                  categoryChildBuld.map((arrChild, indexBuild1) =>
                    <div className={(indexBuild1 == 0 ||  indexBuild1 == "0" ) ? 'item active' : "item"} key={indexBuild1} data-data={indexBuild1}>
                      { arrChild ? arrChild.map((item, index2) =>
                        <div className="raovat-menu-item" key={item.id} onClick={() => this.onClickCategory(item)}>
                          <div
                            className="bg-shopss"
                            style={{
                              background: item.image ?
                                'url(' + Constants.linkApi + '/images/' + item.image + ')'
                                :
                                'url(' + imgAllCat + ')',
                              backgroundPosition: 'center',
                              backgroundSize: 'cover',
                              backgroundRepeat: 'no-repeat',
                              width: '112px',
                              height: '112px',
                              border: queryIdChild  == item.id ? '1px solid #14b577' : 'none'
                            }}
                          />
                          <div className={item.id != "-1" ?  "name-category-raovat" : "name-category-raovat-all"}>
                            <span>{item.name} </span>
                          </div>
                        </div>
                      )
                        : ''
                      }

                    </div>
                  )
                  : ''
              }
            </div>
            <div style={{display: dataCategory.length > 6 ? 'block' : 'none'}}>
              <a
                className="left carousel-control"
                href="#carousel-id"
                data-slide="prev"
                style={{
                  marginLeft: "6px",
                  marginTop: "30px",
                  height: "40px",
                  width: '20px',
                  color: "#fff !important"
                }}
              >
                <span className="glyphicon glyphicon-chevron-left"/>
              </a>
              <a
                className="right carousel-control"
                href="#carousel-id"
                data-slide="next"
                onClick={() => this.onLoadMoreShop.bind(this)}
                style={{
                  marginRight: "2px",
                  marginTop: "30px",
                  height: "40px",
                  width: '20px',
                  color: "#fff !important"
                }}
              >
                <span className="glyphicon glyphicon-chevron-right"/>
              </a>
            </div>
          </div>
          : ''
        }

        <div id="div-wait" className="rao-vat-show-post">
          {
            this.state.status.isLoadData == true || this.state.status.isSearch == true ?
              <LoadingTable/>
              :
              this.state.messages.length > 0 ?
                this.state.styleView == 1 ?
                  <SearchPostList
                    messages={this.state.messages}
                    onTrackingFriend={this.onTrackingFriend.bind(this)}
                    onClickToPost={this.onClickToPost.bind(this)}
                    lng={this.props.lng}
                    levelCat={this.state.levelCat}

                  />
                  :
                  <div className="maps-google">
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
                      infoMarker={this.state.data}
                      onShowInfo={this.state.styleView}
                      onMapClick={this.handleMapClick}
                      onClickMarker={this.onClickMarker.bind(this)}
                      query={this.props.location.query}
                      markers={this.state.searchSuccess == true ? this.state.markers : this.state.markersDefault}
                    />
                    <div className="rao-vat-map-load-more">
                      <img width="30px" height="30px"
                           src= { Constants.linkServerImage  +  '/common/ic_more_location.png'}
                           alt="Thêm dữ liệu"
                           onClick={this.onLoadMoreShop.bind(this)}
                      />
                    </div>
                  </div>
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
