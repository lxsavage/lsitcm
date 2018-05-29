/**
 * @name itunes.js-binding
 * @version 1.0.0
 * @author Logan Savage (r2d2292)
 * @copyright Copyright (c) 2018 Logan Savage (r2d2292). Some Rights Reserved. See LICENSE for more info.
 */

var AAPL = require('applescript')

module.exports = {
  // Player play controls
  playPause: () => {
    AAPL.execString('tell application "iTunes" to playpause')
  },

  gotoPrevious: () => {
    AAPL.execString('tell application "iTunes" to previous track')
  },

  gotoNext: () => {
    AAPL.execString('tell application "iTunes" to next track')
  },

  // Player metadata retrieval
  get: (name, callback) => {
    if (typeof name === 'string' && (name === 'name' || name === 'artist' || name === 'album')) {
      AAPL.execString(`tell application "iTunes" to get the ${name} of the current track`, (err, ot) => {
        callback(ot, err)
      })
    }
    else throw new Error('[iTunes] [Error] Invalid input.')
  },

  getMetadata: (callback) => {
    let out = {}
    module.exports.get('name', (name) => {
      module.exports.get('artist', (artist) => {
        module.exports.get('album', (album) => {
          out.name = name
          out.artist = artist
          out.album = album
          callback(out)
        })
      })
    })
  },

  getPlayerState: (callback) => {
    AAPL.execString('tell application "iTunes" to get player state as text', (err, ot) => {
      callback(ot)
    })
  },

  // Player song selection
  playSong: (optObj) => {
    if (optObj.name !== undefined || optObj.artist !== undefined || optObj.album !== undefined) {
      try {
        AAPL.execString(`tell application "iTunes" to play (first track whose name ${(optObj.nameStrict) ? 'is' : 'contains'} "${optObj.name}" and artist is "${optObj.artist}" and album is "${optObj.album}")`)
      }
      catch(e) {
        throw e
      }
    }
    else {
      throw Error('[iTunes] [Error] Not enough info in optObj, requires "name", "artist", and "album".')
    }
  }
}