import React from 'react';
import { Route, IndexRoute } from 'react-router';
import StoreService from '^/services/Store';

import App from '../modules/app/App';
import Login from '../modules/login/Login';
import Home from '../modules/home/Home';
import Registration from '../modules/registration/Registration';
import RegistrationDetails from '../modules/registration/RegistrationDetails';
import RegistrationInterests from '../modules/registration/RegistrationInterests';
import InboxWrapper from '../modules/inbox/InboxWrapper';
import ThreadWrapper from '../modules/inbox/ThreadWrapper';
import ActivityWrapper from '../modules/activity/ActivityWrapper';
import NudgesWrapper from '../modules/nudges/NudgesWrapper';
import Interactions from '../modules/interactions/Interactions';
import RecommendationsWrapper from '../modules/recommendations/RecommendationsWrapper';
import SearchWrapper from '../modules/search/SearchWrapper';
import RefineSearch from '../modules/search/RefineSearch';
import Me from '../modules/me/Me';
import ManageProfile from '../modules/manage-profile/ManageProfile';
import ManageInterests from '../modules/manage-interests/ManageInterests';
import ManageTestWrapper from '../modules/manage-test/ManageTestWrapper';
import ManageTest from '../modules/manage-test/ManageTest';
import ManageTestCategories from '../modules/manage-test/ManageTestCategories';
import ManageTestSubmit from '../modules/manage-test/ManageTestSubmit';
import ManageTestQuestion from '../modules/manage-test/ManageTestQuestion';
import ManagePhotos from '../modules/manage-photos/ManagePhotos';
import FacebookAlbums from '../modules/manage-photos/FacebookAlbums';
import FacebookPhotos from '../modules/manage-photos/FacebookPhotos';
import InstagramPhotos from '../modules/manage-photos/InstagramPhotos';
import ResizePhoto from '../modules/manage-photos/ResizePhoto';
import ManageAccount from '../modules/manage-account/ManageAccount';
import Privacy from '../modules/registration/Privacy';
import Terms from '../modules/registration/Terms';
import Share from '../modules/share/Share';
import Profile from '../modules/profile/Profile';
import TakeTest from '../modules/take-test/TakeTest';
import TestResult from '../modules/take-test/TestResult';
import TakeTestQuestion from '../modules/take-test/components/TakeTestQuestion';

function getManageTest(nextState, callback) {
  const store = StoreService.getStore();
  const state = store.getState();
  if (!state.user.get('test').size && !state.manageTest.get('test').size) {
    callback(null, ManageTestCategories);
  } else {
    callback(null, ManageTest);
  }
}

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Login} />
    <Route path="registration" component={Registration} >
      <Route path="details" component={RegistrationDetails} />
      <Route path="interests" component={RegistrationInterests} />
      <Route path="privacy" component={Privacy} />
      <Route path="terms" component={Terms} />
    </Route>
    <Route path="home" component={Home} >
      <Route path="interactions" component={Interactions} >
        <IndexRoute component={InboxWrapper} />
        <Route path="activity" component={ActivityWrapper} />
      </Route>
      <Route path="me" component={Me} />
      <Route path="chat" component={InboxWrapper} />
      <Route path="manage-test" component={ManageTestWrapper} >
        <IndexRoute component={ManageTest} />
        <Route path="categories" component={ManageTestCategories} />
        <Route path="submit" component={ManageTestSubmit} />
      </Route>
      <Route path="recommendations" component={RecommendationsWrapper} />
    </Route>
    <Route path="refine-search" component={RefineSearch} />
    <Route path="chat/:userId" component={ThreadWrapper} />
    <Route path="manage-profile" component={ManageProfile} />
    <Route path="manage-interests" component={ManageInterests} />
    <Route path="manage-photos" component={ManagePhotos} />
    <Route path="manage-photos/resize" component={ResizePhoto} />
    <Route path="manage-photos/instagram" component={InstagramPhotos} />
    <Route path="manage-photos/facebook" component={FacebookAlbums} />
    <Route path="manage-photos/facebook/:id" component={FacebookPhotos} />
    <Route path="manage-test/question/:questionId" component={ManageTestQuestion} />
    <Route path="manage-account" component={ManageAccount} />
    <Route path="share" component={Share} />
    <Route path="user/:userId" component={Profile} />
    <Route path="user/:userId/test/result" component={TestResult} />
    <Route path="user/:userId/test" component={TakeTest} >
      <Route path=":questionIndex" component={TakeTestQuestion} />
    </Route>
  </Route>
);
