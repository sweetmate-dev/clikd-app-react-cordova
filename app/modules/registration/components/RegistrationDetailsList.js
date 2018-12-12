import React, { Component, PropTypes } from 'react';

import { List, ListLabel, ListRow, ListContent, ListRowWrapper } from '^/components/lists';
import RegistrationGenderSelect from './RegistrationGenderSelect';
import { getGender } from '^/services/Utils';

class RegistrationDetailsList extends Component {

  render() {
    const { genderId } = this.props;
    return (
      <List theme="dark" size="small">
        <If condition={genderId}>
          <ListRow>
            <ListLabel>Gender</ListLabel>
            <ListContent>{ getGender(genderId) }</ListContent>
          </ListRow>
        </If>
        <If condition={!genderId}>
          <RegistrationGenderSelect />
        </If>
      </List>
    );
  };
};

export default RegistrationDetailsList;
