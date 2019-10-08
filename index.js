#!/usr/bin/env node
var program = require('commander')
var chalk = require('chalk')
var itunes = require('./lib/itunes')

program
  .version(require('./package.json').version)
  .option('-S, --silent', 'disables result output')
  .option('-L, --launch', 'launches iTunes, if it isn\'t already open')
  .option('-n, --noformatting', 'removes color from the output')
  .option('-P, --playpause', 'toggle the playing state of the music')
  .option('-N, --skip', 'skip this song')
  .option('-R, --previous', 'play the previous song')
  .option('-s, --song [song]', 'play [song] (requires --artist and --album)')
  .option('-a, --artist [artist]', 'play a song from [artist] (requires --song and --album also)')
  .option('-l, --album [album]', 'play a song in [album] (requires --song and --artist also)')

  .parse(process.argv)

// Perform the selected action(s)
if (program.launch)    itunes.launchITunes()
if (program.previous)  itunes.gotoPrevious()
if (program.skip)      itunes.gotoNext()
if (program.playpause) itunes.playPause()

if (program.song || program.artist || program.album) {
  itunes.playSong({
    name: program.song,
    artist: program.artist,
    album: program.album
  })
}

// Get and show state of player with metadata, if the silent flag isn't set
if (!program.silent) {
  itunes.getPlayerState(state => {
    itunes.getMetadata(meta => {
      if (program.noformatting) {
        console.log(`${state ? 'PLAYING' : 'PAUSED'}: "${meta.name}" – ${meta.artist} [${meta.album}]`)
      }
      else {
        console.log(`${state ? chalk.green.bold('▶') : chalk.red.bold('❚❚')} ${chalk.white(meta.name)} – ${chalk.blue(meta.artist)} [${chalk.yellow(meta.album)}]`)
      }
    })
  })
}
