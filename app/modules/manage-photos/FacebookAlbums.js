import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bem from 'react-bem-classes';
import Immutable from 'immutable';

import { Screen, Content } from '^/components/layout';
import { TitleBar, ActionButton, Title } from '^/components/navigation';
import Button from '^/components/buttons/Button';
import { GENERIC_ERROR_MESSAGE, GENERIC_ERROR_TITLE } from '^/constants/Messages';
import { getFacebookAlbums } from '^/actions/PhotosActions';
import { navigateBack, navigateTo } from '^/actions/NavigationActions';
import { toggleLoader, showAlert } from '^/actions/AppActions';

import './FacebookAlbums.scss';
import FacebookAlbumsList from './components/FacebookAlbumsList';

function mapStateToProps(state) {
  return {
    getAlbumsBusy: state.photos.get('getFacebookAlbumsBusy'),
    getAlbumsError: state.photos.get('getFacebookAlbumsError'),
    nextPage: state.photos.get('facebookAlbumsNextPage'),
    albums: state.photos.get('facebookAlbumIds').map(id =>
      state.photos.getIn(['facebookAlbums', id])
    ),
  };
}

@connect(mapStateToProps, { getFacebookAlbums, toggleLoader, navigateBack, navigateTo, showAlert })
@bem({ block: 'facebook-albums-screen' })
class FacebookAlbums extends Component {

  static propTypes = {
    albums: PropTypes.instanceOf(Immutable.List),
    getAlbumsBusy: PropTypes.bool,
    getAlbumsError: PropTypes.bool,
    nextPage: PropTypes.string,
    getFacebookAlbums: PropTypes.func,
    toggleLoader: PropTypes.func,
    navigateBack: PropTypes.func,
    showAlert: PropTypes.func.isRequired,
  }

  componentWillMount() {
    if (!this.props.albums.size) this.props.getFacebookAlbums();
  }

  componentWillReceiveProps(newProps) {
    if (this.props.getAlbumsBusy !== newProps.getAlbumsBusy) {
      this.props.toggleLoader(newProps.getAlbumsBusy);
    }
    if (!this.props.getAlbumsError && newProps.getAlbumsError) {
      this.props.showAlert({
        title: GENERIC_ERROR_TITLE,
        message: GENERIC_ERROR_MESSAGE,
        buttons: [{
          callback: () => {
            this.props.navigateBack('manage-photos');
          },
        }],
      });
    }
  }

  onCancelTap = () => {
    this.props.navigateBack('manage-photos');
  }

  onLoadMoreTap = () => {
    this.props.getFacebookAlbums(this.props.nextPage);
  }

  onAlbumTap = (albumId) => {
    this.props.navigateTo(`manage-photos/facebook/${albumId}`);
  }

  render() {
    const { albums, nextPage } = this.props;
    return (
      <Screen className={this.block()}>
        <TitleBar className={this.element('title')}>
          <ActionButton left onTap={this.onCancelTap}>Cancel</ActionButton>
          <Title>Albums</Title>
        </TitleBar>
        <Content>
          <FacebookAlbumsList albums={albums} onTap={this.onAlbumTap} />
          <If condition={nextPage}>
            <Button className={this.element('button')} color="facebook" onTap={this.onLoadMoreTap}>Load More</Button>
          </If>
        </Content>
      </Screen>
    );
  }
}

export default FacebookAlbums;
