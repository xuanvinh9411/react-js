/**
 * Created by TrungPhat on 24/03/2017.
 */
import React, {PropTypes} from 'react';
import {Link} from 'react-router';
let Constants=require('../../services/Constants');
export const Pagination =(props)=> {
  /*Lấy ra trang hiện tại*/
  function PageCurrent() {
    let page;
    if(location.search.split('page=')[1]){
      page=location.search.split('page=')[1];
    }else{
      page=1;
    }
    return page;
  }
  let limit=props.totalItemPaging;/*Số mẫu tin trong 1 trang*/
  let total=props.total;/*Tổng số mẫu tin*/
  let current=PageCurrent();/*Trang hiện tại*/
  let url=props.url;/*Đường dẫn phân trang*/
  /*Phân trang*/
  function PagePer(total, current, limit, url) {
    if(total==0){
      return '';
    }
    let numPage=Math.ceil(total/limit);
    if((total/limit)-numPage>0){
      numPage+=1;
    }
    let cpnItem=[];
    if(numPage==1){
      return '';
    }
    if(current==1){
      cpnItem.push(<li className = 'hidden-xs' key={current+'b'}>
        <Link className="fa fa-angle-double-left" data-toggle="tooltip" data-placement="top" title="Trang đầu"/></li>);
      cpnItem.push(<li key={current+'a'}>
        <Link className="fa fa-angle-left" data-toggle="tooltip" data-placement="top" title="Trước"/></li>)
    }else{
      cpnItem.push(<li className = 'hidden-xs' key={current+'c'}>
        <Link to={url + '?page=1'} className="fa fa-angle-double-left" data-toggle="tooltip" data-placement="top" title="Trang đầu"/></li>);
      cpnItem.push(<li key={current+'d'}>
        <Link to={url + '?page=' + (current - 1)} className="fa fa-angle-left" data-toggle="tooltip" data-placement="top" title="Trước"/></li>)
    }
    if(current<=3){
      for(let i=1; (i<=5)&&(i<=numPage); i++){
        if(i==current){
          cpnItem.push(<li className = 'active' key={i+'e'}><Link>{i}</Link></li>)
        }else{
          cpnItem.push(<li key={i+'f'}><Link to={url+'?page='+i}>{i}</Link></li>)
        }
      }
    }else{
      if(numPage>=(parseInt(current)+2)){
        for (let i=parseInt(current)-2; (i<=parseInt(current)+2)&&(i<=numPage);i++){
          if(i==current){
            cpnItem.push(<li className = 'active' key={i+'g'}><Link>{i}</Link></li>)
          }else{
            cpnItem.push(<li key={i+'h'}><Link to={url+'?page='+i}>{i}</Link></li>)
          }
        }
      }else{
        for (let i=numPage-4; i<=numPage;i++){
          if(i>0){
            if(i==current){
              cpnItem.push(<li className = 'active' key={i+'i'}><Link>{i}</Link></li>)
            }else{
              cpnItem.push(<li key={i+'j'}><Link to={url+'?page='+i}>{i}</Link></li>)
            }
          }
        }
      }
    }
    if(current==numPage){
      cpnItem.push(<li key={current+'k'}>
        <Link className="fa fa-angle-right" data-toggle="tooltip" data-placement="top" title="Sau"/></li>)
      cpnItem.push(<li className = 'hidden-xs' key={current+'l'}>
        <Link className="fa fa-angle-double-right" data-toggle="tooltip" data-placement="top" title="Trang cuối"/></li>)
    }else{
      cpnItem.push(<li key={current+'m'}>
        <Link to={url + '?page=' + (parseInt(current) + 1)} className="fa fa-angle-right" data-toggle="tooltip" data-placement="top" title="Sau"/></li>)
      cpnItem.push(<li className = 'hidden-xs' key={current+'n'}>
        <Link to={url + '?page=' + numPage} className="fa fa-angle-double-right" data-toggle="tooltip" data-placement="top" title="Trang cuối"/></li>)
    }
    return cpnItem;
  }
  let cpnPagination=PagePer(total, current, limit, url);
  return (
    <div id="pagination">
      <ul className="pagination pagination-sm">
        {cpnPagination}
      </ul>
    </div>
  );
};

export default Pagination;
