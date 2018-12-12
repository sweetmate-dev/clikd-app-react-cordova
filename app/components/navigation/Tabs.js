import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { findDOMNode } from 'react-dom';

import './Tabs.scss';

@bem({ block: 'tabs' })
class Tabs extends Component {

  tabs = {};

  state = {
    indicatorWidth: 0,
    indicatorOffset: 0,
  };

  static propTypes = {
    children: PropTypes.node,
    selectedIndex: PropTypes.number,
  };

  componentDidMount() {
    this.updateIndicator(this.props.selectedIndex);
    window.addEventListener('resize', this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedIndex != nextProps.selectedIndex) {
      this.updateIndicator(nextProps.selectedIndex);
    }
  }

  componentWillUnmount(){
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    this.updateIndicator(this.props.selectedIndex);
  }

  updateIndicator(selectedIndex) {
    if (!this.tabs[selectedIndex]) return null;
    const el = findDOMNode(this.tabs[selectedIndex]);
    this.setState({
      indicatorWidth: el.offsetWidth,
      indicatorOffset: el.offsetLeft,
    });
  }

  cloneElement(element, index) {
    return React.cloneElement(element, {
      key: index,
      isActive: this.props.selectedIndex == index,
      ref: (c) => {
        this.tabs[index] = c;
      },
    });
  }

  render() {
    const style = {
      width: `${this.state.indicatorWidth}px`,
      left: `${this.state.indicatorOffset}px`,
    };
    return (
      <div className={this.block()}>
        {this.props.children.map((el, index) => this.cloneElement(el, index))}
        <div style={style} className={this.element('indicator')} />
      </div>
    );
  }
}

export default Tabs;
