import React, { Component } from 'react';
import {TrackList} from '../TrackList/TrackList';
import './SearchResults.css';

export class SearchResults extends Component {
  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList onAdd={this.props.onAdd} onRemove={this.props.onRemove} tracks={this.props.searchResults} />
      </div>
    );
  }
}
