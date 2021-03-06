import React, { Component } from 'react';
import {Track} from '../Track/Track'
import './TrackList.css'

export class TrackList extends Component {
  render() {
    return (
      <div className="TrackList">
        {this.props.tracks.map(track => {
          return <Track key={track.id} track={track} onRemove={this.props.onRemove} onAdd={this.props.onAdd} isRemoval={this.props.isRemoval} />
        })
      }
      </div>
    );
  }
}
