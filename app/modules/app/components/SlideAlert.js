import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';
const nl2br = require('react-nl2br');

import { ButtonList, Button } from '^/components/buttons';

import './SlideAlert.scss';

@bem({ block: 'slideAlert' })
class SlideAlert extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    body: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Immutable.List)
    ]),
    buttons: PropTypes.instanceOf(Immutable.List).isRequired,
    dismissHandler: PropTypes.func.isRequired,
  };

  onButtonTap = (idx) => {
    const button = this.props.buttons.get(idx);
    const callback = button.get('callback');
    if (callback) callback();
    if (button.get('closeOnTap')) this.closeAlert();
  }

  closeAlert = (idx) => {
      this.props.dismissHandler(this.props.id);
  }

  render() {
    let { title, body, buttons } = this.props;
    if (Immutable.Iterable.isIterable(body)) {
      body = body.toJS();
    }
    const transparentLast = buttons.last().get('color') === 'transparent';
    return (
      <div className={this.block()}>
        <div onClick={this.closeAlert} className={this.element('close')}>
        </div>
        <If condition={title}>
          <h4 className={this.element('title')}>{title}</h4>
        </If>
        <If condition={body}>
          <p className={this.element('body')}>{nl2br(body)}</p>
        </If>
      </div>
    );
  }
}


export default SlideAlert;
