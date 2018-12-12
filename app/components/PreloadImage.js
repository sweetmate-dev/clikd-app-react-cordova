import React, { PropTypes } from 'react';
import bem from 'react-bem-classes';

import './PreloadImage.scss';

@bem({ block: 'preload-image' })
class PreloadImage extends React.Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    credit: PropTypes.string,
    placeholder: PropTypes.string,
    children: PropTypes.node,
  };

  state = {
    ready: false,
    aspectRatio: 100,
  };

  componentWillMount() {
    this.active = true;
    const image = new Image();
    image.onload = () => {
      if (this.active) {
        this.setState({ ready: true });
      }
    };
    image.src = this.props.src;
    if(this.props.fluidHeight) {
      this.interval = window.setInterval(() => {
        if(image.naturalHeight && image.naturalWidth){
          this.setState({ aspectRatio: (image.naturalHeight / image.naturalWidth) * 100 });
          window.clearInterval(this.interval);
        }
      }, 50);
    }
  }

  componentWillUnmount() {
    this.active = false;
    window.clearInterval(this.interval);
  }

  render() {
    const { placeholder, src, fluidHeight, credit } = this.props;
    const aspectRatio = this.state.aspectRatio;
    const placeholderStyle = { backgroundImage: placeholder ? `url(${placeholder})` : null };
    const style = { backgroundImage: `url(${src})` };
    return (
      <div className={this.block()} style={placeholderStyle}>
        <If condition={fluidHeight}>
          <div className={this.element('spacer')} style={{ paddingTop: `${aspectRatio}%` }} />
        </If>
        <div className={this.element('image', { mounted: this.state.ready })} style={style} />
        <If condition={credit}>
          <div className={this.element('credit')}>{credit}</div>
        </If>
        { this.props.children }
      </div>
    );
  }

}

export default PreloadImage;