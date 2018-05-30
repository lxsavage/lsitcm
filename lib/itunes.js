/**
 * @name itunes.js-binding
 * @version 1.0.1
 * @author Logan Savage (r2d2292)
 * @copyright Copyright (c) 2018 Logan Savage (r2d2292). Some Rights Reserved. See LICENSE for more info.
 */

var AAPL = require('applescript')

module.exports = {
  playPause: () => {
    AAPL.execString('tell application "iTunes" to playpause')
  },

  gotoPrevious: () => {
    AAPL.execString('tell application "iTunes" to previous track')
  },

  gotoNext: () => {
    AAPL.execString('tell application "iTunes" to next track')
  },

  get: (name, callback) => {
    let isValidKey = name === 'name' || name === 'artist' || name === 'album'

    if (typeof name === 'string' && isValidKey) {
      AAPL.execString(`tell application "iTunes" to get the ${name} of the current track`, (error, output) => {
        callback(output, error)
      })
    }
    else throw new Error('[iTunes] [Error] Invalid input.')
  },

  getMetadata: (callback) => {
    let metadata = {}
    module.exports.get('name', (name) => {
      module.exports.get('artist', (artist) => {
        module.exports.get('album', (album) => {
          metadata.name = name
          metadata.artist = artist
          metadata.album = album

          callback(metadata)
        })
      })
    })
  },

  getPlayerState: (callback) => {
    AAPL.execString('tell application "iTunes" to get player state as text', (error, output) => {
      callback(output)
    })
  },

  // Player song selection
  playSong: (options) => {
    let isNotNullName   = typeof options.name   !== 'undefined'
    let isNotNullArtist = typeof options.artist !== 'undefined'
    let isNotNullAlbum  = typeof options.album  !== 'undefined'

    let responseName = (isNotNullName)
      ? `name is "${options.name}"`
      : ''

    // Nested ternary expression to determine if the word 'and' should
    // be added based upon if the name is not null.
    let responseArtist = (isNotNullArtist)
      ? `${(isNotNullName)
            ? ' and '
            : ' '
        }artist is "${options.artist}"`
      : ''

    // Nested ternary expression to determine if the word 'and' should
    // be added based upon if the name and/or artist are not null.
    let responseAlbum = (isNotNullAlbum)
      ? `${(isNotNullName || isNotNullArtist)
            ? ' and '
            : ' '
        }album is "${options.album}"`
      : ''

    if (isNotNullName || isNotNullArtist || isNotNullAlbum) {
      try {
        AAPL.execString(`tell application "iTunes" to play (first track whose ${responseName} ${responseArtist} ${responseAlbum})`)
      }
      catch(e) {
        throw e
      }
    }
    else {
      throw Error('[iTunes] [Error] Not enough info in options, requires "name", "artist", or "album".')
    }
  }
}