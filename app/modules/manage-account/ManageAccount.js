import React, { Component } from 'react';

import { Screen, Content } from '^/components/layout';
import { List } from '^/components/lists';
import { TitleBar, BackButton, Title } from '^/components/navigation';

import AnalyticsService from '^/services/AnalyticsService';
import ManageAccountInstagramConnect from './components/ManageAccountInstagramConnect';
import ManageAccountApp from './components/ManageAccountApp';
import ManageAccountLegal from './components/ManageAccountLegal';
import ManageAccountSettings from './components/ManageAccountSettings';
import ManageAccountNotificationSettings from './components/ManageAccountNotificationSettings';


class ManageAccount extends Component {

  componentDidMount() {
    AnalyticsService.logPageView('Account');
  }

  render() {
    return (
      <Screen>
        <TitleBar>
          <BackButton defaultRoute="home/me" />
          <Title>Account</Title>
        </TitleBar>
        <Content>
          <List form>
            <ManageAccountNotificationSettings />
            <ManageAccountInstagramConnect />
            <ManageAccountApp />
            <ManageAccountLegal />
            <ManageAccountSettings />
          </List>
        </Content>
      </Screen>
    );
  }
}

export default ManageAccount;
