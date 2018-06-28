#!/usr/bin/env node
var program = require('commander')
var chalk = require('chalk')

var itunes = require('./lib/itunes')
var AAPL = require('applescript')

// Utilization as external module:
//   If this is included as a module inside another
//   node project, then the functions below can be
//   utilized, and the iTunes binding can be also used
//   through <this>.itunes.(...).
module.exports = {
  itunes: itunes,
  dispState: function(isColor, callback) {
    itunes.getPlayerState((state) => {
      if (!isColor) {
        if (state === 'playing') {
          AAPL.execString('tell application "iTunes" to return (get the name of current track) & " – " & (get the artist of current track) & " [" & (get the album of current track) & "]" as string', (err, c) => {
            console.log(chalk.green.bold('▶  PLAYING: ') + c)
          })
        }
        else {
          console.log(chalk.red.bold('❚❚ PAUSED'))
        }
      }
      else {
        // Color version: Very slow
        itunes.getMetadata((meta) => {
          let sTxt
          if (state === 'playing') {
            console.log(`${chalk.green.bold('▶  PLAYING:')} ${chalk.hex('#FFD700')(meta.name)} – ${chalk.hex('#7EC0EE')(meta.artist)} [${chalk.yellow(meta.album)}]`)
          }
          else {
            console.log(chalk.red.bold('❚❚ PAUSED'))
          }

          if (typeof callback === 'function') callback()
        })
      }
    })
  }
}

// Setup the command, if not a module
if (!module.parent) {
  program
    .version('1.1.0')
    .option('-S, --silent', 'disables result output')
    .option('-C, --nocolor', 'removes color from the output')
    .option('-P, --playpause', 'toggle the playing state of the music')
    .option('-N, --skip', 'skip this song')
    .option('-R, --previous', 'play the previous song')
    .option('-s, --song [song]', 'play [song] (requires --artist and --album)')
    .option('-a, --artist [artist]', 'play a song from [artist] (requires --song and --album also)')
    .option('-l, --album [album]', 'play a song in [album] (requires --song and --artist also)')
    .parse(process.argv)

  // Perform the selected action(s)
  if (program.playpause) itunes.playPause()
  if (program.previous)  itunes.gotoPrevious()
  if (program.skip)      itunes.gotoNext()

  if (program.song || program.artist || program.album) {
    itunes.playSong({
      name: program.song,
      artist: program.artist,
      album: program.album
    })
  }

  // Get and show state of player with metadata, if the silent flag isn't set
  if (!program.silent) {
    module.exports.dispState(!program.nocolor)
  }
}