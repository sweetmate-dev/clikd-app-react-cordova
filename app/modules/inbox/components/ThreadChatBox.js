import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bem from 'react-bem-classes';
import Hammer from 'react-hammerjs';

import TextArea from '^/components/forms/TextArea';
import { saveUnsentMessage } from '^/actions/ChatActions';

import './ThreadChatBox.scss';

@connect(null, { saveUnsentMessage })
@bem({ block: 'thread-chat-box' })
class ThreadInboxBox extends Component {

  state = {
    message: '',
  };

  static propTypes = {
    sendMessageHandler: PropTypes.func.isRequired,
    alertHandler: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.saveUnsentMessage(this.props.threadId, this.state.message);
    window.Keyboard.hide();
  }

  componentWillMount() {
    const unsentMessage = this.props.thread.get('unsentMessage');
    if (unsentMessage) {
      this.setState({ message: unsentMessage });
    }
  }

  componentDidMount() {
    // crude i know, but one has to be a pragmatist sometimes!
    // and this doesn't work on ios
    const me = this;
    setTimeout(function() {
      me.inputElement.focus();
      setTimeout(function() {
        window.Keyboard.hide();
      });
    });
  }

  onChange = (value) => {
    this.setState({ message: value });
  };

  onSendTap = (evt) => {
    evt.preventDefault(); // Prevent textarea losing focus
    
    if (this.state.message) {
      this.props.sendMessageHandler(this.state.message);
      this.setState({ message: '' });
    }
  };

  render() {
    const message = this.state.message;
    return (
      <div className={this.block()}>
        <TextArea
          onChange={this.onChange}
          value={message}
          className={this.element('textarea')}
          inputRef={ el => this.inputElement = el }
        />
        <Hammer onTap={this.onSendTap}>
          <div className={this.element('button', { disabled: !message })}>
            <span>Send</span>
          </div>
        </Hammer>
      </div>
    );
  }

}

export default ThreadInboxBox;