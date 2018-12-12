import React, { Component } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';

import './RegistrationFooter.scss';

const mapStateToProps = (state) => ({
  step: state.app.get('registrationStep')
})

@connect(mapStateToProps)
@bem({block: 'registration-footer'})
class RegistrationFooter extends Component {
  render() {
    const step = this.props.step || 0;
    const style = { width: (step/2 * 100) + "%" }
    return (
      <div className={this.block()}>
        <p>Nearly done. {step} of 2</p>
        <div className={this.element('bar')}>
          <div className={this.element('fill')} style={style} />
        </div>
      </div>
    )
  }
}

export default RegistrationFooter;
       