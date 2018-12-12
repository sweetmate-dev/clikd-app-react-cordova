import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { toggleLoader, showAlert } from '^/actions/AppActions';
import { updateSelf, abortUpdateSelf } from '^/actions/ApiActions';
import { navigateBack } from '^/actions/NavigationActions';
import { TitleBar, Title, ActionButton } from '^/components/navigation';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';


function mapStateToProps(state){
  return {
    updateSelfBusy: state.user.get('updateSelfBusy'),
    updateSelfError: state.user.get('updateSelfError'),
  };
}

@connect(mapStateToProps, { toggleLoader, updateSelf, abortUpdateSelf, navigateBack, showAlert })
class ManagePhotosTitleBar extends Component {
  
  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func
    }),
  };

  onCancelTap = () => {
    this.props.showAlert({
      title: 'Are you sure?',
      message: 'Any changes you\'ve made will be lost',
      buttons: [{
        label: 'Yes',
        callback: () => {
          this.props.navigateBack('manage-profile');
        },
      }, {
        label: 'No',
        color: 'transparent',
      }],
    });
  }

  onDoneTap = () => {
    const state = this.context.store.getState();
    const photos = state.forms.getIn([this.props.formName, 'fields', 'photos']);
    const data = { photos: photos.map(photo => _.omit(photo, ['images', 'deviceUrl'])) };
    this.props.updateSelf(data);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.updateSelfBusy != this.props.updateSelfBusy){
      this.props.toggleLoader(nextProps.updateSelfBusy)
    }
    if(this.props.updateSelfBusy && !nextProps.updateSelfBusy){
      if(nextProps.updateSelfError){
        this.props.showAlert({ title: GENERIC_ERROR_TITLE, message: GENERIC_ERROR_MESSAGE });
      } else {
        this.props.navigateBack('manage-profile');
      }
    }
  }

  render() {
    return (
        <TitleBar>
          <ActionButton left onTap={this.onCancelTap}>Cancel</ActionButton>
          <Title>Manage Photos</Title>
          <ActionButton right onTap={this.onDoneTap}>Done</ActionButton>
        </TitleBar>
    );
  };
};

export default ManagePhotosTitleBar;
