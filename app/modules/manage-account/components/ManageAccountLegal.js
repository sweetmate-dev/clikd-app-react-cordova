import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { navigateTo } from '^/actions/NavigationActions';
import { List, ListLabel, ListRow, ListButton } from '^/components/lists';

@connect(null, { navigateTo })
class PreferencesLegal extends Component {

  static propTypes = {
    navigateTo: PropTypes.func,
  };

  render() {
    const navigate = this.props.navigateTo;
    return (
      <ListRow stacked>
        <ListLabel>Legal</ListLabel>
        <List>
          <ListButton theme="white" onTap={navigate} context="registration/privacy">Privacy policy</ListButton>
          <ListButton theme="white" onTap={navigate} context="registration/terms">Terms</ListButton>
        </List>
      </ListRow>
    );
  }
}

export default PreferencesLegal;
