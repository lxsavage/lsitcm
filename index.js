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

async function applyActions() {
  if (program.launch)    await itunes.launchITunes()
  if (program.previous)  await itunes.gotoPrevious()
  if (program.skip)      await itunes.gotoNext()
  if (program.playpause) await itunes.playPause()

  if (program.song || program.artist || program.album) {
    await itunes.playSong({
      name: program.song,
      artist: program.artist,
      album: program.album
    })
  }
  showStatus()
}

async function showStatus() {
  let state = await itunes.getPlayerState()
  let meta = await itunes.getMetadata()

  if (program.noformatting) {
    console.log(`${state ? 'Playing' : 'Paused'}: "${meta.name}" – ${meta.artist} [${meta.album}]`)
  }
  else {
    console.log(`${state ? chalk.green.bold('▶') : chalk.red.bold('❚❚')} ${chalk.white(meta.name)} – ${chalk.blue(meta.artist)} [${chalk.yellow(meta.album)}]`)
  }
}

applyActions()
