const clientId = '5fa02b06d3974322a8e59195c5a2f653';
const redirectURI = 'http://freezing-side.surge.sh';
let Token = '';
let urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
let urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

export const Spotify = {
  getAccessToken() {
    if (Token) {
      return Token;
    } else {
      if (window.location.href.match(/access_token=([^&]*)/) &&
          window.location.href.match(/expires_in=([^&]*)/))  {
            Token = window.location.href.match(/access_token=([^&]*)/)[1];
            const Expire = Number(window.location.href.match(/expires_in=([^&]*)/)[1]);
            window.setTimeout(() => Token = '', Expire * 1000);
            window.history.pushState('Access Token', null, '/');
            return Token;
          } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
          }
    }
  },
  search(term) {
    const Token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Token}`}
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed - Could not get access token!');
    }, networkError => {
      console.log(networkError.message);
    }).then(jsonResponse => {
      if (jsonResponse.tracks) {
        return jsonResponse.tracks.items.map(track => (
          {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
          }
        ))
      } else {
        return []
      }}
    )
  },

  savePlaylist(playlistName, trackUris) {
    //double pipe operator to resolve?
    if (!playlistName || !trackUris.length) {
      return '';
    }
    const Token = Spotify.getAccessToken();
    let playlistId = undefined;
    const headers = {Authorization: `Bearer ${Token}`};
    let userId = '';

    // check codecademy projects to write correctly
    return fetch('https://api.spotify.com/v1/me', {
      headers: headers}).then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request Failed - Could not get profile!');
      }, networkError => {
        console.log(networkError.message);
      }).then(jsonResponse => {
        userId = jsonResponse.id;


        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: playlistName})
        }).then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Request failed - Could not create playlist!');
          }, networkError => {
            console.log(networkError.message);
          }).then(jsonResponse => {
            const playlistId = jsonResponse.id;


            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
              headers: headers,
              method: 'POST',
              body: JSON.stringify({uris: trackUris})
            }).then(response => {
              if (response.ok) {
                return response.json()
              }
              throw new Error('Request failed - Could not get tracks!');
              }, networkError => {
                console.log(networkError.message);
              })
          })
    })
  }
}
