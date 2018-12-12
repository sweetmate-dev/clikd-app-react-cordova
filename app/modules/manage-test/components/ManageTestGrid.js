import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import QuestionThumb from '^/components/questions/QuestionThumb';
import DraggableGrid from '^/components/draggable-grid/DraggableGrid';
import DraggableGridAddButton from '^/components/draggable-grid/DraggableGridAddButton';
import DraggableGridDeleteIcon from '^/components/draggable-grid/DraggableGridDeleteIcon';
import { MAX_TEST_QUESTIONS } from '^/constants/Settings';

import './ManageTestGrid.scss';

@bem({ block: 'manage-test-grid' })
class ManageTestGrid extends Component {

  static propTypes = {
    test: PropTypes.instanceOf(Immutable.List),
    onDelete: PropTypes.func,
    onAddTap: PropTypes.func,
    onChange: PropTypes.func,
    onTap: PropTypes.func,
  }

  onDeleteTap(id) {
    this.props.onDelete(id);
  }

  renderChildren() {
    // const { photos, onDelete, onAddTap } = this.props;
    const output = [];
    const { test, onAddTap, onTap, onDelete } = this.props;
    test.forEach((question) => {
      const id = question.get('questionId');
      output.push((
        <QuestionThumb
          className={this.element('thumb')}
          key={id}
          onTap={onTap}
          questionId={id}
          answers={question.get('answers')}
          selectedAnswer={question.get('answerId')}
          question={question.get('question')}
        >
        <DraggableGridDeleteIcon onTap={onDelete} context={id} />
        </QuestionThumb>
      ));
    });
    if (test.size < MAX_TEST_QUESTIONS) {
      output.push(<DraggableGridAddButton onTap={onAddTap} key="add" />);
    }
    return output;
  }

  render() {
    return (
      <DraggableGrid
        className={this.block()}
        numBlocks={MAX_TEST_QUESTIONS}
        blockClass={this.element('block')}
        onChange={this.props.onChange}
      >
        {this.renderChildren()}
      </DraggableGrid>
    );
  }

}

export default ManageTestGrid;
