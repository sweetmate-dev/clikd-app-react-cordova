
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bem from 'react-bem-classes';

import { toggleLoader, showAlert } from '^/actions/AppActions';
import { initForm, destroyForm } from '^/actions/FormActions';
import { navigateBack } from '^/actions/NavigationActions';
import { updateSelf } from '^/actions/ApiActions';
import { invalidateSearch } from '^/actions/SearchActions';
import { Screen, Content } from '^/components/layout';
import { List } from '^/components/lists';
import CheckboxListRow from '^/components/forms-connected/CheckboxListRow';
import MultiSelectRow from '^/components/forms-connected/MultiSelectRow';
import { TitleBar, BackButton, ActionButton } from '^/components/navigation';
import { SORTABLES } from '^/constants/Settings';
import { Interests } from '^/constants/Interests';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';

import './RefineSearch.scss';

function mapStateToProps(state) {
  return {
    busy: state.user.get('updateSelfBusy'),
    error: state.search.get('updateSelfError'),
  };
}

@connect(mapStateToProps, { navigateBack, toggleLoader, initForm, destroyForm, updateSelf, invalidateSearch, showAlert })
@bem({ block: 'refine-search-screen' })
class RefineSearch extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
    }).isRequired,
  }

  static propTypes = {
    toggleLoader: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,
    initForm: PropTypes.func.isRequired,
    destroyForm: PropTypes.func.isRequired,
    updateSelf: PropTypes.func.isRequired,
    invalidateSearch: PropTypes.func.isRequired,
    busy: PropTypes.bool,
    error: PropTypes.any,
  }

  componentWillMount() {
    /* Initialise form */
    const state = this.context.store.getState();
    const preferences = state.user.getIn(['profile', 'searchPreferences']);
    const initialValues = {};
    if (preferences) {
      const interests = preferences.getIn(['filter', 'interests']);
      const sort = preferences.getIn(['sort', 0]);
      initialValues.interests = interests ? interests.toJS() : [];
      initialValues.sort = sort ? sort.toJS() : SORTABLES[0];
    }
    this.props.initForm('refine-search', initialValues);
  }

  componentWillUnmount() {
    this.props.destroyForm('refine-search');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.busy !== this.props.busy) {
      this.props.toggleLoader(newProps.busy);
    }
    if (this.props.busy && !newProps.busy) {
      if (newProps.error) {
        this.props.showAlert({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
      } else {
        this.props.invalidateSearch();
        this.props.navigateBack('/home/search');
      }
    }
  }

  onSaveTap = () => {
    const state = this.context.store.getState();
    const values = state.forms.getIn(['refine-search', 'fields']).toJS();
    const searchPreferences = {
      filter: {
        interests: values.interests,
      },
      sort: [values.sort],
    };
    this.props.updateSelf({ searchPreferences });
  }

  getInterests() {
    return Interests.map(interest => ({ value: interest.id, label: interest.name }));
  }

  render() {
    return (
      <Screen className={this.block()}>
        <TitleBar>
          <BackButton defaultRoute="/home/search" />
          <ActionButton right onTap={this.onSaveTap}>Done</ActionButton>
        </TitleBar>
        <Content>
          <List type="form" className={this.element('form')}>
            <MultiSelectRow
              itemTheme="white"
              label="Filter by"
              items={this.getInterests()}
              formName="refine-search"
              field="interests"
              placeholder="Interests"
            />
            <CheckboxListRow
              itemTheme="white"
              label="Results order"
              formName="refine-search"
              field="sort"
              items={SORTABLES}
              allowEmpty={false}
            />
          </List>
        </Content>
      </Screen>
    );
  }

}

export default RefineSearch;
