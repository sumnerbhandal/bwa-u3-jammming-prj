import React, { Component } from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify'

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        {
          name: 'exampleName',
          artist: 'artistName',
          album: 'albumName'
        }, {
          name: 'exampleName',
          artist: 'artistName',
          album: 'albumName'
        }, {
          name: 'exampleName',
          artist: 'artistName',
          album: 'albumName'
        }
      ],
      playlistName: 'My playlist',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  updatePlaylistName(name){
    this.setState({
      playlistName: name
    });
  }
  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    })
  }
  savePlaylist() {
    let trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: [],
      });
    });
  }
   addTrack(track) {
     const currentTracks = this.state.playlistTracks;
     const currentTrackIds = this.state.playlistTracks.map(track => track.id);
     const isOnPlaylist = currentTrackIds.includes(track.id);
     if (!isOnPlaylist) {
       currentTracks.push(track);
       this.setState({playlistTracks: currentTracks});
     }
   }
  removeTrack(track) {
    let currentTracks = this.state.playlistTracks;
    currentTracks = currentTracks.filter(currentTrack =>
      currentTrack.id !== track.id);
    this.setState({playlistTracks: currentTracks});
  }
  render() {
    return (
      <div className="height">
        <div className="fixed"><h1>Ja<span className="highlight">mmm</span>ing</h1></div>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
