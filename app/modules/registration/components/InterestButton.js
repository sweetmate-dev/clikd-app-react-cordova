import React, { Component, PropTypes } from 'react';
import Button from '^/components/buttons/Button';
import { MIN_INTERESTS } from '^/constants/Interests';

class InterestButton extends Component {

  static propTypes = {
    numSelected: PropTypes.number,
    onTap: PropTypes.func,
  }

  render() {
    const { numSelected, onTap } = this.props;
    const disabled = numSelected < MIN_INTERESTS;
    const label = disabled ? `Pick ${MIN_INTERESTS - numSelected} More` : 'Continue';
    const color = disabled ? null : "red";
    return (
      <Button onTap={onTap} color={color} disabled={disabled}>
        { label }
      </Button>
    );
  }

}

export default InterestButton;
