/**
 * itunes.js-binding (v1.1.4)
 *
 * Copyright (c) 2019 Logan Savage.
 * Licensed Under the MIT License.
 */

var AAPL = require('applescript')
var os = require('os')

// Determine if running Catalina, so as to use iTunes or Music
const itom = require('macos-version').is('>=10.15') ? 'Music' : 'iTunes'

module.exports = {
  /** Plays if the player is paused, or pauses if the player is playing */
  playPause: function() {
    AAPL.execString(`tell application "${itom}" to playpause`)
  },

  /** Goes to the previous song */
  gotoPrevious: function() {
    AAPL.execString(`tell application "${itom}" to previous track`)
  },

  /** Skips the current song, goes to the next song */
  gotoNext: function() {
    AAPL.execString(`tell application "${itom}" to next track`)
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
      AAPL.execString(`tell application "${itom}" to get the ${name} of the current track`, (error, output) => {
        callback(output, error)
      })
    }

    else throw new Error(`[${itom}] [Error] Invalid input.`)
  },

  /**
   * Gets all the metadata for the specific song
   * @param {module.exports~requestCallback} callback - The function to be executed when the information is recieved. Gets a SongObject with the basic metadata of the currently playing song and possible error in format (object, error)
   */
  getMetadata: function(callback, isVerbose) {
    let filename = `${__dirname}/applescript/metadata.${ itom === 'Music' ? 'music.' : '' }applescript`
    AAPL.execFile(filename, (err, meta) => {
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
   */
  getPlayerState: function(callback) {
    AAPL.execString(`tell application "${itom}" to get player state as text`, (error, output) => {
      callback(output === 'playing')
    })
  },

  /**
   * Launches iTunes, if it isn't already open
   * @param {module.exports~requestCallback} callback The function to be executed when the state is recieved.
   */
  launchITunes: function(callback) {
    AAPL.execString(`tell application "${itom}" to activate`, error => {
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

    // Add the song name tag if it isn't null
    let responseName = (isNotNullName)
      ? `name is "${options.name}"`
      : ''

    // Add the artist tag if it isn't null
    let responseArtist = (isNotNullArtist)
      ? `${(isNotNullName)
            ? ' and '
            : ' '
        }artist is "${options.artist}"`
      : ''

    // Add the album tag if it isn't null
    let responseAlbum = (isNotNullAlbum)
      ? `${(isNotNullName || isNotNullArtist)
            ? ' and '
            : ' '
        }album is "${options.album}"`
      : ''

    if (isNotNullName || isNotNullArtist || isNotNullAlbum) {
      try {
        // Concatenate all of the non-null tags generated above to create an AppleScript
        // command to be executed on the target
        AAPL.execString(`tell application "${itom}" to play (first track whose ${responseName} ${responseArtist} ${responseAlbum})`)
      }
      catch(e) { throw e }
    }
    else {
      // Throw an error if no information is given
      throw Error(`[${itom}] [Error] Not enough info in options, requires "name", "artist", or "album".`)
    }
  }
}
