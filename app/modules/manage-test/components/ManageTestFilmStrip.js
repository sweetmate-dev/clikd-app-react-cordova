import React, { Component, PropTypes } from 'react';
import bem from 'react-bem-classes';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import FilmStrip from '^/components/carousel/FilmStrip';

import './ManageTestFilmStrip.scss';
import ManageTestFilmStripItem from './ManageTestFilmStripItem';

function mapStateToProps(state, ownProps) {
  let currentIndex = 0;
  const categories = ownProps.categoryIds.map((categoryId, index) => {
    if (categoryId === ownProps.currentCategory) {
      currentIndex = index;
    }
    const category = state.manageTest.getIn(['categories', categoryId]);
    const test = state.manageTest.get('test');
    return {
      isActive: categoryId === ownProps.currentCategory,
      image: category.get('url'),
      label: category.get('category'),
    };
  });
  return { categories, currentIndex: currentIndex };
}

@connect(mapStateToProps)
@bem({ block: 'manage-test-film-strip' })
class ManageTestFilmStrip extends Component {

  static propTypes = {
    categoryIds: PropTypes.instanceOf(Immutable.List),
    categories: PropTypes.instanceOf(Immutable.List),
    onChange: PropTypes.func.isRequired,
  }

  getCarouselOptions = () => {
    return {
      offset: window.innerWidth / 2 - 64,
      infinite: true,
      onBeforeChange: this.onBeforeChange,
      currentIndex: this.props.currentIndex,
    };
  }

  onTap = (index) => {
    this.filmStrip.toIndex(index);
  }

  onBeforeChange = (index) => {
    this.props.onChange(index);
  }

  renderCategories() {
    const output = [];
    this.props.categories.forEach((category, index) => {
      const el = (
        <ManageTestFilmStripItem
          {...category}
          context={index}
          key={category}
          onTap={this.onTap}
        />);
      output.push(el);
    });
    return output;
  }

  render() {
    return (
      <FilmStrip className={this.block()} options={this.getCarouselOptions()} ref={(c) => { this.filmStrip = c; }}>
        { this.renderCategories() }
      </FilmStrip>
    );
  }

}

export default ManageTestFilmStrip;
