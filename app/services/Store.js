import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import reduxThunk from 'redux-thunk';

import userReducer from '^/reducers/UserReducer';
import appReducer from '^/reducers/AppReducer';
import formReducer from '^/reducers/FormReducer';
import photosReducer from '^/reducers/PhotosReducer';
import navigationReducer from '^/reducers/NavigationReducer';
import manageTestReducer from '^/reducers/ManageTestReducer';
import recommendationsReducer from '^/reducers/RecommendationsReducer';
import searchReducer from '^/reducers/SearchReducer';
import testsReducer from '^/reducers/TestsReducer';
import chatReducer from '^/reducers/ChatReducer';
import usersReducer from '^/reducers/UsersReducer';
import activityReducer from '^/reducers/ActivityReducer';

import subscribeMiddleware from './Subscriptions';

let store;

export default {
  init() {
    const reducers = combineReducers({
      activity: activityReducer,
      forms: formReducer,
      app: appReducer,
      navigation: navigationReducer,
      manageTest: manageTestReducer,
      user: userReducer,
      photos: photosReducer,
      recommendations: recommendationsReducer,
      search: searchReducer,
      tests: testsReducer,
      chat: chatReducer,
      users: usersReducer,
    });
    const devTools = window.device.platform === 'browser' && window.devToolsExtension ? window.devToolsExtension() : f => f;
    store = createStore(reducers, {}, compose(
        applyMiddleware(reduxThunk, subscribeMiddleware), devTools
    ));
    return store;
  },
  getStore() {
    return store;
  },
}

