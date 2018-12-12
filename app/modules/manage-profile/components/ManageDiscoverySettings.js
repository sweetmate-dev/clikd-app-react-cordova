import React, { Component, PropTypes } from 'react';

import { List, ListLabel, ListRow } from '^/components/lists';
import { MIN_AGE_RANGE, MAX_AGE_RANGE, MIN_DISTANCE_RANGE, MAX_DISTANCE_RANGE } from '^/constants/Settings';
import SliderRow from '^/components/forms-connected/SliderRow';

class ManageDiscoverySettings extends Component {

  formatAgeRange(value) {
    const min = value[0];
    let max = value[1];
    if(max === MAX_AGE_RANGE) max += '+';
    return `${min}-${max}`;
  }

  formatDistance(value) {
    let output = `${value}km`;
    if(value === 100) output += '+';
    return output;
  }

  render() {
    return (
      <ListRow stacked>
        <List>
          <SliderRow
            template={this.formatDistance}
            theme="white"
            label="Distance"
            formName="manage-profile"
            field="distanceRange"
            min={MIN_DISTANCE_RANGE}
            max={MAX_DISTANCE_RANGE}
          />
          <SliderRow
            template={this.formatAgeRange}
            theme="white"
            label="Age range"
            formName="manage-profile"
            field="ageFrom"
            field2="ageTo"
            min={MIN_AGE_RANGE}
            max={MAX_AGE_RANGE}
          />
        </List>
      </ListRow>
    )
  }
}

export default ManageDiscoverySettings;