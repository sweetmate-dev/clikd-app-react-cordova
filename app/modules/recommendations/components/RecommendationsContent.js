import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bem from 'react-bem-classes';
import Immutable from 'immutable';
import { showAlert } from '^/actions/AppActions';

import Content from '^/components/layout/Content';
import UserGrid from '^/components/user-grid/UserGrid';

import './RecommendationsContent.scss';


@connect(null, { showAlert })
@bem({ block: 'recommendations-content' })
class RecommendationsContent extends Component {

  static propTypes = {
    recommendations: PropTypes.instanceOf(Immutable.List),
    maxRecommendations: PropTypes.number,
    onUserTap: PropTypes.func,
    onIconTap: PropTypes.func,
    showAlert: PropTypes.func,
    onDelete: PropTypes.func,
  };

  handleScroll = (e) => {
    const scrollBottom = (Math.floor(this.innerContent.getBoundingClientRect().height) - e.target.scrollTop == e.target.clientHeight);
    if (scrollBottom && !window.localStorage.getItem('intro-recommendations-scroll')) {
      this.props.showAlert({
        message: `We send you ${this.props.maxRecommendations} recommendations a day, based on your ` +
          'interests and preferences.  Update them and get new people tomorrow!',
      });

      window.localStorage.setItem('intro-recommendations-scroll', true);
    }
  }

  componentDidMount() {
    if (window.localStorage.getItem('recommendation-scroll')) {
      this.content.scrollTop = window.localStorage.getItem('recommendation-scroll');
    }
  }

  componentWillUnmount() {
    window.localStorage.setItem('recommendation-scroll', this.content.scrollTop);
  }

  render() {
    return (
      <Content className={this.block()} onScroll={this.handleScroll} useRef={(c) => { this.content = c; }}>
        <div className={this.element('inner')} ref={(c) => { this.innerContent = c; }}>
          <UserGrid
            users={this.props.recommendations}
            onTap={this.props.onUserTap}
            onIconTap={this.props.onIconTap}
            onDelete={this.props.onDelete}
          />
        </div>
      </Content>
    );
  }

}

export default RecommendationsContent;
