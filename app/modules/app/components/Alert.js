import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import { ButtonList, Button } from '^/components/buttons';
import PreloadImage from '^/components/PreloadImage';

import './Alert.scss';

@bem({ block: 'alert' })
class Alert extends Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    body: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Immutable.List)
    ]),
    image: PropTypes.instanceOf(Immutable.Map),
    cssClass: PropTypes.string,
    buttons: PropTypes.instanceOf(Immutable.List).isRequired,
    dismissHandler: PropTypes.func.isRequired,
  };

  onButtonTap = (idx) => {
    const button = this.props.buttons.get(idx);
    const callback = button.get('callback');
    if (callback) callback();
    if (button.get('closeOnTap')) this.props.dismissHandler(this.props.id);
  }

  render() {
    let { title, body, buttons, image, cssClass } = this.props;
    let className = this.block();
    if (cssClass) {
      className += ' ' + cssClass;
    }

    if (Immutable.Iterable.isIterable(body)) {
      body = body.toJS();
    }
    const transparentLast = buttons.last().get('color') === 'transparent';
    return (
      <div className={className}>
        <If condition={image}>
          <PreloadImage src={image.get('src')} credit={image.get('credit')} className={this.element('image')} />
        </If>
        <div className={this.element('content')}>
          <If condition={title}>
            <h4 className={this.element('title')}>{title}</h4>
          </If>
          <If condition={body}>
            <p className={this.element('body')}>{body}</p>
          </If>
          <ButtonList className={this.element('buttons', { transparentLast })}>
            <For each="button" index="idx" of={buttons}>
              <Button
                full-width
                key={idx}
                color={button.get('color')}
                context={idx}
                onTap={this.onButtonTap}
              >
                {button.get('label')}
              </Button>
            </For>
          </ButtonList>
        </div>
      </div>
    );
  }
}


export default Alert;
