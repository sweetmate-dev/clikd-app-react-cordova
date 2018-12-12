import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import AnalyticsService from '^/services/AnalyticsService';
import { getUser, abortGetUser } from '^/actions/ApiActions';
import { Screen, ContentTransitionGroup } from '^/components/layout';
import { TitleBar, BackButton, Title } from '^/components/navigation';
import ErrorMessage from '^/components/info-message/ErrorMessage';
import Loader from '^/components/icons/Loader';
import PreloadImage from '^/components/PreloadImage';
import { MAX_TEST_QUESTIONS } from '^/constants/Settings';

import './TakeTest.scss';

function mapStateToProps(state, ownProps) {
  const userId = Number(ownProps.params.userId);
  const user = state.users.get(userId);
  return {
    userId,
    user,
    profileFetched: user.get('fullProfileFetched'),
    getProfileBusy: user.get('getProfileBusy'),
    getProfileError: user.get('getProfileError'),
  };
}

@connect(mapStateToProps, { getUser, abortGetUser })
@bem({ block: 'take-test-screen' })
class TakeTest extends Component {

  static propTypes = {
    params: PropTypes.shape({
      userId: PropTypes.string,
      questionIndex: PropTypes.string,
    }),
    children: PropTypes.node,
    user: PropTypes.instanceOf(Immutable.Map),
    userId: PropTypes.number,
    profileFetched: PropTypes.bool,
    getProfileBusy: PropTypes.bool,
    getProfileError: PropTypes.any,
    getUser: PropTypes.func.isRequired,
    abortGetUser: PropTypes.func.isRequired,
  };

  componentWillMount() {
    if (!this.props.profileFetched) this.fetch();
  }

  componentWillUnmount() {
    this.props.abortGetUser(this.reqId);
  }

  componentDidMount() {
    AnalyticsService.logPageView('Take test');
  }

  fetch = () => {
    this.reqId = this.props.getUser(this.props.userId);
  }

  render() {
    const index = Number(this.props.params.questionIndex) + 1;
    const { profileFetched, getProfileBusy, getProfileError, userId, user } = this.props;
    const defaultRoute = `user/${userId}`;
    const profilePhotos = user.getIn(['profile', 'profilePhoto']);
    return (
      <Screen className={this.block()}>
        <TitleBar>
          <BackButton defaultRoute={defaultRoute} />
          <Title>
            <PreloadImage src={profilePhotos.getIn(['images', '100x100'])} className={this.element('title-image')} />
            Question {index}/{MAX_TEST_QUESTIONS}
          </Title>
        </TitleBar>
        <ContentTransitionGroup>
          <Choose>
            <When condition={profileFetched}>
              {this.props.children}
            </When>
            <When condition={getProfileBusy}>
              <Loader centered size="large" color="grey" key="loader" />
            </When>
            <When condition={getProfileError}>
              <ErrorMessage key="error-message" retry={this.fetch} >
                There was a problem fetching this user's test.
              </ErrorMessage>
            </When>
          </Choose>
        </ContentTransitionGroup>
      </Screen>
    );
  }

}

export default TakeTest;
