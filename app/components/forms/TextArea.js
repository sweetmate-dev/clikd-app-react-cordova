import React, { PropTypes } from 'react';
import bem from 'react-bem-classes';

import './TextArea.scss';

@bem({ 'block': 'textarea' })
class TextArea extends React.Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  onChange = (e) => {
    this.props.onChange(e.target.value);
  }

  parseVal() {
    if (!this.props.value) {
      return '&nbsp';
    } else if(this.props.value[this.props.value.length - 1] == '\n'){
      return this.props.value + "&nbsp;";
    } else {
      return this.props.value;
    }
  }

  render() {
    const inputRef = this.props.inputRef || "";
    return (
      <div className={this.block()}>
        {this.parseVal()}
        <textarea
          ref={inputRef}
          onChange={this.onChange}
          value={this.props.value || ''}
        />
      </div>
    );
  }

}

export default TextArea;
