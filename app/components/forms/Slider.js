import React from 'react';
import bem from 'react-bem-classes';
import _ from 'lodash';
import RcSlider from 'rc-slider';

import './Slider.scss';

@bem({ block: 'slider' })
class Slider extends React.Component {

  render() {
    const sliderProps = _.omit(this.props, ['className']);
    return (
      <div className={this.block()}>
        <RcSlider {...sliderProps} tipFormatter={null} />
      </div>
    );
  }

}

export default Slider;
