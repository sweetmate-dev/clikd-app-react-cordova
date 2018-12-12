import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { slideAlert } from '^/actions/AppActions';

import { showAlert, toggleLoader } from '^/actions/AppActions';
import AnalyticsService from '^/services/AnalyticsService';
import { NAVIGATION_BACKWARDS, navigateTo, navigateBackTo } from '^/actions/NavigationActions';
import { updateTest, removeFromTest } from '^/actions/ManageTestActions';
import { saveTest } from '^/actions/ApiActions';
import { Screen, Content } from '^/components/layout';
import { TitleBar, Title, BackButton, ActionButton } from '^/components/navigation';
import { MAX_TEST_QUESTIONS } from '^/constants/Settings';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';
import Button from '^/components/buttons/Button';

import './ManageTest.scss';
import ManageTestGrid from './components/ManageTestGrid';

function mapStateToProps(state) {
  return {
    test: state.manageTest.get('test').map((question) => {
      const id = question.get('questionId');
      return state.manageTest.getIn(['questions', id]).merge(question);
    }),
    saveTestBusy: state.user.get('saveTestBusy'),
    saveTestError: state.user.get('saveTestError'),
  };
}

@connect(mapStateToProps, {
  updateTest,
  saveTest,
  removeFromTest,
  showAlert,
  toggleLoader,
  navigateTo,
  navigateBackTo,
  slideAlert,
})
@bem({ block: 'manage-test-screen' })
class ManageTest extends Component {

  static propTypes = {
    updateTest: PropTypes.func.isRequired,
    saveTest: PropTypes.func.isRequired,
    removeFromTest: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    toggleLoader: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
    navigateBackTo: PropTypes.func.isRequired,
    test: PropTypes.instanceOf(Immutable.List).isRequired,
    saveTestError: PropTypes.any,
    saveTestBusy: PropTypes.bool.isRequired,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.saveTestBusy !== this.props.saveTestBusy) {
      // this.props.toggleLoader(newProps.saveTestBusy);
    }
    if (this.props.saveTestBusy && !newProps.saveTestBusy) {
      if (newProps.saveTestError) {
        this.props.showAlert({
          title: GENERIC_ERROR_TITLE,
          message: GENERIC_ERROR_MESSAGE,
          buttons: [{
            label: 'OK',
            callback: () => {
              this.props.navigateBackTo('/home/manage-test');
            },
          }],
        });
      }
    }
  }

  componentDidMount() {
    AnalyticsService.logPageView('Manage test - My test');
  }

  onChange = (oldIndex, newIndex) => {
    const test = this.props.test;
    if (newIndex < test.size) {
      const item = test.get(oldIndex);
      const newTest = test.delete(oldIndex).insert(newIndex, item);
      this.props.updateTest(newTest);
    }
    this.save();
  }

  onDelete = (id) => {
    this.props.showAlert({
      title: 'Confirm',
      message: 'Are you sure you want to remove this question?',
      buttons: [{
        label: 'Yes',
        callback: () => {
          this.props.removeFromTest(id);
        },
      }, {
        label: 'No',
        color: 'transparent',
      }],
    });
  }

  onAddTap = () => {
    this.props.navigateTo('/home/manage-test/categories');
  }

  save = () => {
    const test = this.props.test;
    if (test.size === MAX_TEST_QUESTIONS) {
      const props = test.map(question => ({
        questionId: question.get('questionId'),
        answerId: question.get('answerId'),
        categoryId: question.get('categoryId'),
      }));
      this.props.saveTest(props.toJS());
    }
  }

  onEditTap = (id) => {
    this.props.navigateTo(`/manage-test/question/${id}`);
  }

  showHints = (e) => {
    this.props.slideAlert({
      title: 'Hint and Tips!',
      message: 'You have 3 questions to ask a potential match. ' +
      'Choose from our questions, or submit your own.\n\n' +
      'Tips:\n\n' +
      '1. Your test is a representation of you, so imagine what you would ask on a first date\n\n' +
      '2. A match has get 2 our of 3 answers right.  So, if you have any deal breaks, now is the time to ask them\n\n' +
      '3. Remember to pick the answer you want a match to choose.  This might not be what you would answer...' +
      'they do say opposites attract after all!',
    });
  }

  render() {
    const isDisabled = this.props.test.size < MAX_TEST_QUESTIONS;
    const test = this.props.test;
    return (
      <Screen className={this.block()}>
        <Content className={this.element('content')}>
          <ManageTestGrid
            test={this.props.test}
            onChange={this.onChange}
            onDelete={this.onDelete}
            onAddTap={this.onAddTap}
            onTap={this.onEditTap}
          />
          <p className={this.element('intro')}>Drag and drop to rearrange the order.</p>
          <p onClick={this.showHints} className={this.element('hints')}>
            <span className={'information-icon'}>i</span>Hints and tips
          </p>
        </Content>
      </Screen>
    );
  }
}

export default ManageTest;
