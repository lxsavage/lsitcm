#!/usr/bin/env node
var program = require('commander')
var chalk = require('chalk')

var itunes = require('./lib/itunes')

// Setup the command
program
  .version('1.0.0')
  .option('-S, --silent', 'disables result output')
  .option('-P, --playpause', 'toggle the playing state of the music')
  .option('-N, --skip', 'skip this song')
  .option('-R, --previous', 'play the previous song')
  .option('-s, --song [song]', 'play [song] (requires --artist and --album)')
  .option('-a, --artist [artist]', 'play a song from [artist] (requires --song and --album also)')
  .option('-l, --album [album]', 'play a song in [album] (requires --song and --artist also)')
  .parse(process.argv)

// Perform the selected action(s)
if (program.playpause) itunes.playPause()
if (program.previous) itunes.gotoPrevious()
if (program.skip) itunes.gotoNext()
if (typeof program.song !== 'undefined' && typeof program.artist !== 'undefined' && typeof program.album !== 'undefined') {
  itunes.playSong({
    name: program.song,
    artist: program.artist,
    album: program.album
  })
}

// Get and show state of player with metadata, if the silent flag isn't set
if (!(program.silent || program.playpause)) {
  itunes.getPlayerState((state) => {
    if (state === 'playing') {
      itunes.getMetadata((meta) => {
        console.log(`${chalk.green.bold('[PLAYING]')} ${chalk.hex('#FFD700')(meta.name)} – ${chalk.hex('#7EC0EE')(meta.artist)} [${chalk.yellow(meta.album)}]`)
      })
    }
    else {
      console.log(chalk.red.bold('[PAUSED]'))
    }
  })
}