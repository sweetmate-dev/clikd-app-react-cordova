import React, { PropTypes } from 'react';
import bem from 'react-bem-classes';

import './Pagination.scss';

@bem({ block: 'pagination', modifiers: ['light'] })
class Pagination extends React.Component {
  static propTypes = {
    length: PropTypes.number,
    index: PropTypes.number,
  }
  renderDots() {
    const dots = [];
    const idx = this.props.index;
    for (let i = 0, len = this.props.length; i < len; i++) {
      dots.push(<div key={i} className={this.element('dot', { active: i === idx })} />);
    }
    return dots;
  }
  render() {
    return (
      <div className={this.block()}>
        {this.renderDots()}
      </div>
    );
  }

}

export default Pagination;
