import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bem from 'react-bem-classes';

import { Screen, Content } from '^/components/layout';
import { navigateTo } from '^/actions/NavigationActions';

import './Interactions.scss';
import InteractionsTabs from './components/InteractionsTabs';

function mapStateToProps(state) {
  return {
    path: state.navigation.get('route'),
  };
}

@connect(mapStateToProps, { navigateTo })
@bem({ block: 'interactions-screen' })
class Interactions extends Component {

  static propTypes = {
    setHomeTab: PropTypes.func,
    children: PropTypes.node,
    path: PropTypes.string,
  }

  onTabSelect = (path) => {
    this.props.navigateTo(path);
  }

  render() {
    const { path, children } = this.props;
    return (
      <Screen className={this.block()}>
        <InteractionsTabs onSelect={this.onTabSelect} path={path} />
        <Content>
          {children}
        </Content>
      </Screen>
    );
  }

}

export default Interactions;