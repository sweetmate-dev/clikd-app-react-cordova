import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import bem from 'react-bem-classes';

import IconLoading from '^/assets/icons/loader.svg';
import Icon from '^/components/icons/Icon';

import './BlockingLoader.scss';

function mapStateToProps(state) {
  return {
    show: state.app.get('loaderVisible'),
  };
}

@connect(mapStateToProps)
@bem({ block: 'blocking-loader' })
class BlockingLoader extends Component {

  static propTypes = {
    show: PropTypes.bool,
  }

  render() {
    return (
      <CSSTransitionGroup
        transitionName="animate"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={200}
      >
        <If condition={this.props.show}>
          <div className={this.block()}>
            <Icon src={IconLoading} className={this.element('icon')} />
          </div>
        </If>
      </CSSTransitionGroup>
    );
  }
}


export default BlockingLoader;
