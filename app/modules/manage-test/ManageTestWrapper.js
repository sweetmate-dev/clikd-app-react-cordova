import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Screen, Content } from '^/components/layout';
import { NAVIGATION_BACKWARDS, navigateTo } from '^/actions/NavigationActions';
import { initTest, resetManageTest, updateTest, removeFromTest } from '^/actions/ManageTestActions';
import { showAlert } from '^/actions/AppActions';
import ManageTestTabs from './components/ManageTestTabs';

function mapStateToProps(state) {
  return {
    path: state.navigation.get('route'),
  };
}

@connect(mapStateToProps, { navigateTo, initTest, resetManageTest, showAlert })
class ManageTestWrapper extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    initTest: PropTypes.func.isRequired,
    resetManageTest: PropTypes.func.isRequired,
    setHomeTab: PropTypes.func,
    children: PropTypes.node,
    path: PropTypes.string,
  }

  componentWillMount() {
    const state = this.context.store.getState();
    if (state.navigation.get('direction') !== NAVIGATION_BACKWARDS) {
      const test = state.user.get('test');
      this.props.initTest(test);
    }
  }

  componentWillUnmount() {
    const state = this.context.store.getState();
    if (state.navigation.get('direction') === NAVIGATION_BACKWARDS) {
      this.props.resetManageTest();
    }
  }

  componentDidMount() {
    if (!window.localStorage.getItem('intro-test')) {
      const state = this.context.store.getState();
      if (!state.user.get('test').size) {
        this.props.showAlert({
          message: 'You get to ask potential matches 3 questions to see if you clik. ' +
            'Scroll through the categories at the top to find questions that mean something to you.',
        });
      }

      window.localStorage.setItem('intro-test', true);
    }
  }

  onTabSelect = (path) => {
    this.props.navigateTo(path);
  }

  render() {
    const { path, children } = this.props;
    return (
      <Screen>
        <ManageTestTabs onSelect={this.onTabSelect} path={path} />
        <Content>
          {children}
        </Content>
      </Screen>
    );
  }

}

export default ManageTestWrapper;