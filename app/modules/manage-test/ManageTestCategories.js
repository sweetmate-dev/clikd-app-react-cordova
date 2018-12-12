import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import Immutable from 'immutable';

import { showAlert } from '^/actions/AppActions';
import { getQuestions, abortGetQuestions } from '^/actions/ApiActions';
import { setCurrentCategory } from '^/actions/ManageTestActions';
import AnalyticsService from '^/services/AnalyticsService';
import { Screen, ContentTransitionGroup } from '^/components/layout';
import Loader from '^/components/icons/Loader';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';
import { TitleBar, Title, BackButton } from '^/components/navigation';
import { MAX_TEST_QUESTIONS } from '^/constants/Settings';

import ManageTestFilmStrip from './components/ManageTestFilmStrip';
import ManageTestCategoriesContent from './components/ManageTestCategoriesContent';


function mapStateToProps(state) {
  const categoryId = state.manageTest.get('currentCategory');
  const category = state.manageTest.getIn(['categories', categoryId], new Immutable.Map());
  return {
    getQuestionsError: category.get('getQuestionsError'),
    categoryIds: state.manageTest.get('categoryIds'),
    categoriesFetched: state.manageTest.get('categoriesFetched'),
    currentCategory: state.manageTest.get('currentCategory'),
    numQuestions: state.manageTest.get('test').size,
  };
}

@connect(mapStateToProps, { setCurrentCategory, getQuestions, abortGetQuestions, showAlert })
class ManageTestCategories extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    currentCategory: PropTypes.number,
    getQuestionsError: PropTypes.any,
    navigationDirection: PropTypes.string,
    categoryIds: PropTypes.instanceOf(Immutable.List),
    setCurrentCategory: PropTypes.func.isRequired,
    getQuestions: PropTypes.func.isRequired,
    abortGetQuestions: PropTypes.func.isRequired,
    categoriesFetched: PropTypes.bool,
    resetManageTest: PropTypes.func,
    showAlert: PropTypes.func.isRequired,
  }

  onCarouselChange = (index) => {
    const id = this.props.categoryIds.get(index);
    this.props.setCurrentCategory(id);
  }

  componentWillMount() {
    if (!this.props.categoriesFetched) {
      this.cReqId = this.props.getQuestions();
    }
  }

  componentWillUnmount() {
    this.props.abortGetQuestions(this.qReqId);
  }

  componentDidMount() {
    AnalyticsService.logPageView('Manage test - Questions');
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.currentCategory && !nextProps.currentCategory) {
      const id = nextProps.categoryIds.first();
      this.props.setCurrentCategory(id);
    }
    if (!this.props.getQuestionsError && nextProps.getQuestionsError) {
      this.props.showAlert({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
    }
  }

  render() {
    const {
      categoryIds,
      currentCategory,
      numQuestions,
    } = this.props;
    return (
      <Screen>
        <ManageTestFilmStrip
          onChange={this.onCarouselChange}
          currentCategory={currentCategory}
          categoryIds={categoryIds}
        />
        <ContentTransitionGroup>
            <ManageTestCategoriesContent categoryId={currentCategory} key="questions" />
        </ContentTransitionGroup>
      </Screen>
    );
  }
}

export default ManageTestCategories;
