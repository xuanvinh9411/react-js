// @flow
import fetch from 'node-fetch';
import { linkApi } from './src/services/Constants'


export const getPostToId = (id) => {
  console.log("@@@@@ id la ", id);
    return fetch(linkApi + '/v1/publicAccess/shoppost/getShareFb?id=' + id)
      .then(res => res.json())
      .then(rss => {
          return rss ;
       }).catch(err => {
        return {err: true, data: null}
      })
}

export const getStoreToId = (id) => {
  return fetch(linkApi + '/v1/publicAccess/shop/getShareFb?id=' + id)
    .then(res => res.json())
    .then(rss => {
      return rss ;
    }).catch(err => {
      return {err: true, data: null}
    })
}

