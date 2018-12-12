import React, { Component } from 'react';
import { connect } from 'react-redux';
import Hammer from 'react-hammerjs';

import { navigateTo } from '^/actions/NavigationActions';
import Button from '^/components/buttons/Button';

function mapStateToProps(state, ownProps) {
  return {
    genderId: state.forms.getIn(['registration', 'fields', 'genderId'])
  }
}

@connect(mapStateToProps, { navigateTo })
class RegistrationDetailsButton extends Component {

  onTap = () => {
    if(this.props.genderId){
      this.props.navigateTo('registration/interests')
    }
  }
  
  render(){
    const disabled = !this.props.genderId;
    return (
      <Button onTap={this.onTap} color={disabled ? null : "red"} disabled={disabled} className={this.props.className}>
        Continue
      </Button>
    )
  }

}

export default RegistrationDetailsButton;