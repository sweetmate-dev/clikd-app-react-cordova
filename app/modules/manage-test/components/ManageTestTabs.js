import React, { Component, PropTypes } from 'react';

import Tabs from '^/components/navigation/Tabs';
import TabButton from '^/components/navigation/TabButton';

class ManageTestTabs extends Component {

  static propTypes = {
    path: PropTypes.string,
    onSelect: PropTypes.func,
  }

  getSelectedIndex() {
    return [
      '/home/manage-test/categories',
      '/home/manage-test',
      '/home/manage-test/submit',
    ].indexOf(this.props.path);
  }

  render() {
    const onSelect = this.props.onSelect;
    return (
      <Tabs selectedIndex={this.getSelectedIndex()}>
        <TabButton onTap={onSelect} context="/home/manage-test/categories">
          Questions
        </TabButton>
        <TabButton onTap={onSelect} context="/home/manage-test">
          My Test
        </TabButton>
        <TabButton onTap={onSelect} context="/home/manage-test/submit">
          Submit
        </TabButton>
      </Tabs>
    );
  }

}

export default ManageTestTabs;
