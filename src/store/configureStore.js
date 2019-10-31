//if (process.env.NODE_ENV === 'production') {
//  module.exports = require('./configureStore.prod');
//} else {
//  module.exports = require('./configureStore.dev');
//}
import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk)
  );
}
