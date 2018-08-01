/**
 * @name itunes.js-binding
 * @version 1.1.3
 * @author Logan Savage (r2d2292)
 * @copyright Copyright (c) 2018 Logan Savage (r2d2292). Some Rights Reserved. See LICENSE for more info.
 * @module itunesjsbinding
 */

var AAPL = require('applescript')

module.exports = {
  /** Plays if the player is paused, or pauses if the player is playing */
  playPause: function() {
    AAPL.execString('tell application "iTunes" to playpause')
  },

  /** Goes to the previous song */
  gotoPrevious: function() {
    AAPL.execString('tell application "iTunes" to previous track')
  },

  /** Skips the current song, goes to the next song */
  gotoNext: function() {
    AAPL.execString('tell application "iTunes" to next track')
  },

  /**
   * Gets a specific piece of metadata on the song currently playing
   * @param {string} name The name of the parameter wanted. Options include: 'name', 'artist', and 'album'.
   * @param {module.exports~requestCallback} callback The function to be executed when the information is recieved. Gets a string for the selected metadata and possible error in format (string, error)
   */
  get: function(name, callback, isVerbose) {
    let isValidKey = name === 'name' || name === 'artist' || name === 'album'
    if (typeof isVerbose === 'boolean' && isVerbose && isValidKey) {
      console.log(`Valid string recieved: ${name}`)
    }
    else if (typeof isVerbose === 'boolean' && isVerbose) {
      console.log(`Invalid string recieved: ${name}`)
    }
    if (typeof name === 'string' && isValidKey) {
      AAPL.execString(`tell application "iTunes" to get the ${name} of the current track`, (error, output) => {
        callback(output, error)
      })
    }

    else throw new Error('[iTunes] [Error] Invalid input.')
  },

  /**
   * Gets all the metadata for the specific song
   * @param {module.exports~requestCallback} callback - The function to be executed when the information is recieved. Gets a SongObject with the basic metadata of the currently playing song and possible error in format (object, error)
   */
  getMetadata: function(callback, isVerbose) {
    AAPL.execFile(`${__dirname}/applescript/metadata.applescript`, (err, meta) => {
      if (typeof isVerbose === 'boolean' && isVerbose) {
        console.log('Error object:')
        console.dir(err)
        console.log('Metadata object:')
        console.dir(meta)
      }

      if (typeof meta !== 'undefined')
        callback({
          name: meta[0],
          artist: meta[1],
          album: meta[2]
        })
      else
        callback({
          name: undefined,
          artist: undefined,
          album: undefined
        })
    })
  },

  /**
   * Gets the playpause state of the player
   * @param {module.exports~requestCallback} callback The function to be executed when the state is recieved. Has the format (state)
   * @todo Reverse the format of the callback args
   */
  getPlayerState: function(callback) {
    AAPL.execString('tell application "iTunes" to get player state as text', (error, output) => {
      callback(output)
    })
  },

  /**
   * Launches iTunes, if it isn't already open
   * @param {module.exports~requestCallback} callback The function to be executed when the state is recieved.
   */
  launchITunes: function(callback) {
    AAPL.execString('tell application "iTunes" to activate', (error) => {
      try { callback() } catch (e) { }
    })
  },

  /**
   * Plays the song specified
   * @param {SongObject} options The metadata of the song to be played.
   */
  playSong: function(options) {
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