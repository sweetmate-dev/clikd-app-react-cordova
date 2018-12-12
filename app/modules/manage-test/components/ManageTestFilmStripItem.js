import React, { Component, PropTypes } from 'react';
import Hammer from 'react-hammerjs';
import bem from 'react-bem-classes';

import PreloadImage from '^/components/PreloadImage';

import './ManageTestFilmStripItem.scss';

@bem({ block: 'manage-test-film-strip-item' })
class ManageTestFilmStripItem extends Component {

  static propTypes = {
    image: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    context: PropTypes.number.isRequired,
    isActive: PropTypes.bool,
    onTap: PropTypes.func.isRequired,
  }

  onTap = () => {
    this.props.onTap(this.props.context);
  }

  render() {
    const { image, label, isActive } = this.props;
    return (
      <Hammer onTap={this.onTap}>
        <PreloadImage src={image} className={this.block({ current: isActive })}>
          <span className={this.element('background')}>
          </span>
          <span className={this.element('label')}>
            {label}
          </span>
        </PreloadImage>
      </Hammer>
    );
  };
};

export default ManageTestFilmStripItem;
