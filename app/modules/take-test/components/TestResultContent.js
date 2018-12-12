import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';

import { navigateBackTo } from '^/actions/NavigationActions';
import { Content } from '^/components/layout';
import { ButtonList, Button } from '^/components/buttons';
import Logo from '^/components/icons/Logo';
import PreloadImage from '^/components/PreloadImage';

import './TestResultContent.scss';

@bem({ block: 'test-result-content'})
class TestResultContent extends Component {

  static propTypes = {
    profilePhoto: PropTypes.string.isRequired,
    matchProfilePhoto: PropTypes.string.isRequired,
    matchStatusId: PropTypes.number,
    chatHandler: PropTypes.func.isRequired,
    skipHandler: PropTypes.func.isRequired,
  }

  render() {
    const { 
      profilePhoto, 
      matchProfilePhoto,
      matchStatusId,
      chatHandler, 
      skipHandler } = this.props;
    return (
      <Content flex className={this.block()}>
        <Logo />
        <div className={this.element('result')}>
          <div className={this.element('venn')}>
            <If condition={matchStatusId === 4}>
              <h1>Boom, a perfect match!</h1>
            </If>
            <div className={this.element('wrapper')}>
              <PreloadImage src={profilePhoto} className={this.element('circle', { left: true })} />
              <PreloadImage src={matchProfilePhoto} className={this.element('circle', { right: true })} />
            </div>
          </div>

          <If condition={matchStatusId === 4}>
            <div className={this.element('matchInfo')}>
              Amazing, you both got every question right...
              you've really CLiKD!<br />
              So get on it, start chatting now!
            </div>
          </If>
          <If condition={matchStatusId !== 4}>
            <div className={this.element('matchInfo')}>
              Awesome you've CLiKD,<br />
              now you can start chatting.
            </div>
          </If>
        </div>
        <ButtonList>
          <Button color="red" onTap={chatHandler}>Start Chat</Button>
          <Button onTap={skipHandler} >Maybe Later</Button>
        </ButtonList>
      </Content>  
    );
  }

}

export default TestResultContent;
