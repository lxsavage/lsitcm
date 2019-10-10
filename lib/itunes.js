/**
 * itunes.js-binding (v2.0.0)
 *
 * Copyright (c) 2019 Logan Savage.
 * Licensed Under the MIT License.
 */

var AAPL = require('applescript')
const itom = require('macos-version').is('>=10.15') ? 'Music' : 'iTunes'

module.exports = {
  /** Plays if the player is paused, or pauses if the player is playing */
  playPause: async() => new Promise(resolve => {
    AAPL.execString(`tell application "${itom}" to playpause`, () => resolve())
  }),

  /** Goes to the previous song */
  gotoPrevious: async() => new Promise(resolve => {
    AAPL.execString(`tell application "${itom}" to previous track`, () => resolve())
  }),

  /** Skips the current song, goes to the next song */
  gotoNext: async() => new Promise(resolve => {
    AAPL.execString(`tell application "${itom}" to next track`, () => resolve())
  }),

  /**
   * Gets a specific piece of metadata on the song currently playing
   * @param {string} name The name of the parameter wanted. Options include: 'name', 'artist', and 'album'.
   */
  get: async(name, isVerbose) => new Promise((resolve, reject) => {
    let isValidKey = name === 'name' || name === 'artist' || name === 'album'

    if (typeof isVerbose === 'boolean' && isVerbose && isValidKey) {
      console.log(`Valid string recieved: ${name}`)
    }
    else if (typeof isVerbose === 'boolean' && isVerbose) {
      console.log(`Invalid string recieved: ${name}`)
    }
    if (typeof name === 'string' && isValidKey) {
      AAPL.execString(`tell application "${itom}" to get the ${name} of the current track`, (error, output) => {
        resolve(output, error)
      })
    }
    else reject(`[${itom}] [Error] Invalid input.`)
  }),

  /**
   * Gets all the metadata for the specific song
   * @param {module.exports~requestCallback} callback - The function to be executed when the information is recieved. Gets a SongObject with the basic metadata of the currently playing song and possible error in format (object, error)
   */
  getMetadata: async() => new Promise((resolve, reject) => {
    let filename = `${__dirname}/applescript/metadata.${ itom === 'Music' ? 'music.' : '' }applescript`
    AAPL.execFile(filename, (err, meta) => {
      if (err) reject(err)

      if (typeof meta !== 'undefined') {
        resolve({
          name: meta[0],
          artist: meta[1],
          album: meta[2]
        })
      }
      else {
        resolve({
          name: undefined,
          artist: undefined,
          album: undefined
        })
      }
    })
  }),

  /**
   * Gets the playpause state of the player
   * @param {module.exports~requestCallback} callback The function to be executed when the state is recieved. Has the format (state)
   */
  getPlayerState: async() => new Promise((resolve, reject) => {
    AAPL.execString(`tell application "${itom}" to get player state as text`, (error, output) => {
      if (error) reject(error)
      resolve(output === 'playing')
    })
  }),

  /**
   * Launches iTunes, if it isn't already open
   * @param {module.exports~requestCallback} callback The function to be executed when the state is recieved.
   */
  launchITunes: async() => new Promise((resolve, reject) => {
    AAPL.execString(`tell application "${itom}" to activate`, error => {
      if (error) reject()
      else resolve()
    })
  }),

  /**
   * Plays the song specified
   * @param {SongObject} options The metadata of the song to be played.
   */
  playSong: async(options) => new Promise((resolve, reject) => {
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
        AAPL.execString(`tell application "${itom}" to play (first track whose ${responseName} ${responseArtist} ${responseAlbum})`, () => resolve())
      }
      catch(e) { reject(e) }
    }
    else {
      // Throw an error if no information is given
      reject(`[${itom}] [Error] Not enough info in options, requires "name", "artist", or "album".`)
    }
  })
}
