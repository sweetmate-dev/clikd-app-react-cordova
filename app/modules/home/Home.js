import React, { Component } from 'react';

import { Content, Screen } from '^/components/layout';

import HomeNav from './components/HomeNav';

class Home extends Component {


  render() {
    return (
      <Screen>
        <Content>
          { this.props.children }
        </Content>
        <HomeNav />
      </Screen>
    );
  };
};

export default Home;