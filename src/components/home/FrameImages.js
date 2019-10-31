import React, {PropTypes} from 'react';
import {Link, browserHistory} from 'react-router';
import moment from 'moment';
let _ = require('../../utils/Utils');
let Constant = require('../../services/Constants');
class FrameImages extends React.Component {

  constructor(context, props) {
    super(context, props);
  }
  render() {
    let {totalImages, arrImages} = this.props;
    return (
      <div className="frameImagesNewsfeed">
          { totalImages == 1 ?
              <div className="pull-left"
                 style={{
                   background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[0] + '?w=680&h=394'+')',
                   width: '100%',
                   height: '394px',
                   backgroundPosition: 'center center',
                   backgroundRepeat: 'no-repeat',
                   backgroundSize: 'cover',
                   cursor: 'pointer'
                 }}
              />
              :
            ''
          }

        { totalImages == 2 ?
          <div className="pull-left" style={{ width: '100%'}}>
              <div className="pull-left-2 pull-left-2-1"
                   style={{
                     background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[0] +  '?w=320' + ')',
                     backgroundPosition: 'center center',
                     backgroundRepeat: 'no-repeat',
                     backgroundSize: 'cover'

                   }}
              >
              </div>

              <div className="pull-left-2 pull-left-2-2"
                   style={{
                     background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[1] + '?w=320' +')',
                     backgroundPosition: 'center center',
                     backgroundRepeat: 'no-repeat',
                     backgroundSize: 'cover'
                   }}
              >
              </div>
          </div>
          :
          ''
        }

        { totalImages == 3 ?
          <div className="pull-left" style={{width: '100%'}}>
              <div className="pull-left-3-1-1"
                   style={{
                     background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[0] + '?w=480&h=360' + ')',
                     backgroundPosition: 'center center',
                     backgroundRepeat: 'no-repeat',
                     backgroundSize: 'cover'

                   }}
              >
              </div>
              <div className="pull-left-3-1-2">
                <div className="pull-left-3-2-1"
                     style={{
                       background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[1] + '?w=320' +')',
                       backgroundPosition: 'center center',
                       backgroundRepeat: 'no-repeat',
                       backgroundSize: 'cover'
                     }}
                >
                </div>

                <div className="pull-left-3-2-2"
                     style={{
                       background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[2] + '?w=320' +')',
                       backgroundPosition: 'center center',
                       backgroundRepeat: 'no-repeat',
                       backgroundSize: 'cover'
                     }}
                >
                </div>
            </div>

          </div>
          :
          ''
        }

        { totalImages == 4 ?
          <div className="pull-left" style={{width: '100%'}}>
            <div className="pull-left-4-1-1"
                 style={{
                   background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[0] + '?w=480&h=360' + ')',
                   backgroundPosition: 'center center',
                   backgroundRepeat: 'no-repeat',
                   backgroundSize: 'cover'

                 }}
            >
            </div>
            <div className="pull-left-4-1-2">
              <div className="pull-left-4-2-1"
                   style={{
                     background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[1] + '?w=320&h=180' + ')',
                     backgroundPosition: 'center center',
                     backgroundRepeat: 'no-repeat',
                     backgroundSize: 'cover'
                   }}
              >
              </div>

              <div className="pull-left-4-2-2"
                   style={{
                     background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[2] + '?w=320&h=180' + ')',
                     backgroundPosition: 'center center',
                     backgroundRepeat: 'no-repeat',
                     backgroundSize: 'cover'
                   }}
              >
              </div>

              <div className="pull-left-4-2-3"
                   style={{
                     background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[3] + '?w=320&h=180' + ')',
                     backgroundPosition: 'center center',
                     backgroundRepeat: 'no-repeat',
                     backgroundSize: 'cover'
                   }}
              >
              </div>
            </div>

          </div>
          :
          ''
        }

        { totalImages == 5 ?
          <div className="pull-left" style={{width: '100%'}}>
              <div className="pull-left-5-1">
                <div className="pull-left-5-1-1"
                     style={{
                       background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[0] + '?w=320&h=180' + ')',
                       backgroundPosition: 'center center',
                       backgroundRepeat: 'no-repeat',
                       backgroundSize: 'cover'
                     }}
                >
                </div>

                <div className="pull-left-5-1-2"
                     style={{
                       background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[1] + '?w=320&h=180' + ')',
                       backgroundPosition: 'center center',
                       backgroundRepeat: 'no-repeat',
                       backgroundSize: 'cover'
                     }}
                >
                </div>

              </div>
              <div className="pull-left-5-2">
                <div className="pull-left-5-2-1"
                     style={{
                       background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[2] + '?w=220&h=180'+ ')',
                       backgroundPosition: 'center center',
                       backgroundRepeat: 'no-repeat',
                       backgroundSize: 'cover'
                     }}
                >
                </div>

                <div className="pull-left-5-2-2"
                     style={{
                       background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[3] + '?w=220&h=180' + ')',
                       backgroundPosition: 'center center',
                       backgroundRepeat: 'no-repeat',
                       backgroundSize: 'cover'
                     }}
                >
                </div>

                <div className="pull-left-5-2-3"
                     style={{
                       background: 'url(' + Constant.linkImagesStatic + '/images/' + arrImages[4] + '?w=220&h=180' + ')',
                       backgroundPosition: 'center center',
                       backgroundRepeat: 'no-repeat',
                       backgroundSize: 'cover'
                     }}
                >
                </div>
              </div>
          </div>
          :
          ''
        }
      </div>
    )

  }

}

export default FrameImages;
