require('css-modules-require-hook')({
  generateScopedName: '[name]__[local]___[hash:base64:5]',
});
require('babel-register')({
  presets: ['react', 'es2015', 'stage-2']
});

var path = require('path');
import Open from 'open';
import Express from 'express';
import Webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import Config from './webpack.config.dev';
var compression = require('compression');
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import React from 'react';
import { Provider } from 'react-redux';
import { match, RouterContext, Router } from 'react-router';
import configureStore from './src/store/configureStore';
import Helmet from 'react-helmet';
import * as Controller from './controller';

const linkUrlWeb = 'http://test.around.com.vn'
const linkUrlImagesWeb = 'https://api.around.com.vn/images/'

const server = Express();
const port = 8080;

const compiler = Webpack(Config);

server.use(compression());

server.use(WebpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: Config.output.publicPath
}));

server.use('/static', Express.static(path.join( __dirname, './styles')));
server.use(WebpackHotMiddleware(compiler));

server.get('/san-pham/:title-:id.html', (req, res) => {
  handleRoutes(req, res, 2)
});

server.get('/xem-cua-hang/:title-:id.html', (req, res) => {
  handleRoutes(req, res, 1)
});

server.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './src/index.html'));
});


function handleRoutes(request, response, linkState) {
  var  routes = require('./src/routes').default;
  console.log("request.params.id request.params.id", request.params.id);
  let arrSplit = request.params.id ? request.params.id.split("-") : [];
  let idGetVal = arrSplit[arrSplit.length -1];
  let httpGetValue = '';
  console.log("linkState ", linkState, typeof linkState);
  if (linkState === 2) {
    httpGetValue =  Controller.getPostToId(idGetVal);
  } else {
    httpGetValue =  Controller.getStoreToId(idGetVal);
  }

  return httpGetValue.then(rss => {
    console.log("rss rss rss ", rss);
    match({ routes, location: request.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        response.status(500).send(error.message);
      } else if (redirectLocation) {
        response.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        let objectData = {
          name: 'Around - Mạng xã hội địa điểm',
          description: `Around - Mạng xã hội địa điểm kết hợp mua bán, 
              tìm kiếm địa điểm xung quanh. Với hàng ngàn 
              sản phẩm cập nhật mỗi ngày, rao miễn phí, đơn giản, uy tín.`,
          images: '',
          url: request.url
        };
        if (rss.data && rss.data.id) {

          objectData.name = rss.data.name;
          objectData.description = rss.data.description;
          if (linkState === 1) {
            objectData.images = rss.data.coverImage  ? rss.data.coverImage : '';

          } else {
            objectData.images = rss.data.images && rss.data.images[0] ? rss.data.images[0] : '';

          }
        }

        handleRender(response, renderProps, objectData);
      } else {
        response.status(404).send('Not found');
      }
    })
  }).catch(err => {
    console.log("err err err", err);
    response.status(404).send('Not found 1');
  })

}

function handleRender(response, renderProps, objectData) {
  const store = configureStore();
  console.log("vao day roi", objectData);
  const html = renderToString(
    <Provider store={store}>
      <RouterContext {...renderProps} />
    </Provider>
  );
  const preloadedState = store.getState();
  // response.status(200).send(renderFullPage(html, preloadedState));
  response.send(renderFullPage(html, preloadedState, objectData));
}

function renderFullPage(html, preloadedState, objectData) {
  let head = Helmet.rewind();
  return `
    <!doctype html>
    <html>
      <head>
         <meta http-equiv="content-type" content="text/html; charset=utf-8">
          <link rel="icon" href="/static/img/around.ico">
            <meta name="description" content="Around - Mạng xã hội địa điểm kết hợp mua bán, tìm kiếm địa điểm xung quanh. Với hàng ngàn
        sản phẩm cập nhật mỗi ngày, rao miễn phí, đơn giản, uy tín.">
            <meta name="keywords" content="rao vặt, mua bán, rao vặt toàn quốc, tìm kiếm địa điểm, đăng tin miễn phí ,around, atm, ngan hang, cay xang, xung quanh">
            <title>Around</title>
            <title>${head.title}</title>
              ${head.meta}
              ${head.link}
                <meta property="og:title" content="${objectData.name}">
                <meta property="title" content="${objectData.name}">
                <meta property="description" content="${objectData.description}">
                <meta property="og:site_name" content="${linkUrlWeb}">
                <meta property="og:type" content="website">
                <meta property="og:url" content="${linkUrlWeb + objectData.url}" >
                <meta property="og:description" content="${objectData.description}">
                <meta property="og:image" content="${linkUrlImagesWeb + objectData.images}">
                <meta property="og:site_name" content="test.around.com.vn">
            <link rel="stylesheet" href="/static/css/bootstrap.min.css">
            <link rel="stylesheet" href="/static/css/font-awesome.min.css">
            <link rel="stylesheet" href="/static/css/ionicons.min.css">
            <link rel="stylesheet" href="/static/css/animate.min.css">
            <link rel="stylesheet" href="/static/css/toastr.min.css">
            <link rel="stylesheet" href="/static/css/AdminLTE.css">
            <link rel="stylesheet" href="/static/css/skin-blue.css">
            <link rel="stylesheet" href="/static/css/around-style.css">
            <link rel="stylesheet" href="/static/css/common.css">
            <link rel="stylesheet" href="/static/css/rangeslider.css">
            <link href='/static/css/google-font.css' rel='stylesheet' type='text/css'>
            <meta name="google-site-verification" content="B176mz6DZj4-4-YUVY3JveOKCbIcsKPH36vgFxT539M" />
        
            <script src="/static/js/jquery-2.2.3.min.js"></script>
            <script src="/static/js/bootstrap.min.js"></script>
            <script src="/static/js/app.js"></script>
            <script src="/static/js/demo.js"></script>
            <script type="text/javascript" src="/static/js/accounting.js"></script>
            <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyD5MFGyd1B71EFLU-RQwzy4bz6c3N-NUZo"></script>
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
        </script>
        <script src="/bundle.js"></script>
         <script type="text/javascript">
      /* <![CDATA[ */
      var google_conversion_id = 848393165;
      var google_custom_params = window.google_tag_params;
      var google_remarketing_only = true;
      /* ]]> */
    </script>
    <script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js">
    </script>
    <noscript>
      <div style="display:inline;">
        <img height="1" width="1" style="border-style:none;"
             alt="" src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/848393165/?guid=ON&amp;script=0"/>
      </div>
    </noscript>



    <!--------webmastertools--->

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-105563202-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'UA-105563202-1');
    </script>

    <!-- Facebook Pixel Code -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '769111586606235');
      fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
                   src="https://www.facebook.com/tr?id=769111586606235&ev=PageView&noscript=1"
    /></noscript>
    <script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v2.11&appId=595121690592812';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
      </body>
    </html>
    `;
}

server.listen(port, function(err) {
  /* eslint-disable no-console */

  if (err) {
    console.log(err);
  } else {
    console.log('server running @ port ' + port);
    Open(`http://localhost:${port}`);
  }
});
