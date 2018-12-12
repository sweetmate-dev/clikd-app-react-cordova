import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';

import { initForm, destroyForm } from '^/actions/FormActions';
import { Screen, Content } from '^/components/layout';
import TransitionGroup from '^/components/TransitionGroup';

import './Registration.scss';
import RegistrationFooter from './components/RegistrationFooter';


function mapStateToProps(state) {
  return {
    genderId: state.user.getIn(['profile', 'genderId']),
  };
}

@connect(mapStateToProps, { initForm, destroyForm })
@bem({ block: 'registration-screen' })
class Registration extends Component {

  static contextTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func,
    }),
  };

  static propTypes = {
    initForm: PropTypes.func,
    destroyForm: PropTypes.func,
    genderId: PropTypes.number,
    children: PropTypes.node,
  };

  componentWillMount() {
    const state = this.context.store.getState();
    const initialValues = state.user.get('profile').toJS();
    this.props.initForm('registration', initialValues);
  }

  componentWillUnmount() {
    this.props.destroyForm('registration');
  }

  render() {
    return (
      <Screen className={this.block()}>
        <Content className={this.element('content')}>
          <TransitionGroup>
            {this.props.children}
          </TransitionGroup>
        </Content>
        <If condition={!this.props.genderId}>
          <RegistrationFooter />
        </If>
      </Screen>
    );
  };

};

export default Registration;
