#!/usr/bin/env node
const program = require('commander')
const shell = require('shelljs')
const itunes = require('./lib/itunes')
const prompt = require('./lib/promptparse')
const config = require('./config.json')

const PROMPT_PATH = config.Prompt.Location.replace(/\./g, __dirname)

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
  .option('-o, --open-prompt', 'open the prompt configuration file, then display instructions to modify it')
  .option('-p, --playlist [playlist]', 'play a specified playlist')
  .option('-A, --playlist-add [playlist]', 'add the now playing song to the specified playlist')
  .parse(process.argv)

async function applyActions() {
  if (program.launch) await itunes.activate()
  if (program.previous) await itunes.gotoPrevious()
  if (program.skip) await itunes.gotoNext()
  if (program.playpause) await itunes.playPause()
  if (program.playlistAdd) await itunes.addToPlaylist(await itunes.getMetadata(), program.playlistAdd)

  // Open the prompt
  if (program.openPrompt) await shell.exec(`open -e ${PROMPT_PATH}`)

  if (program.song || program.artist || program.album) {
    await itunes.playSong({
      name: program.song,
      artist: program.artist,
      album: program.album
    })
  }
  else if (program.playlist) {
    await itunes.playPlaylist(program.playlist)
  }
}

async function showStatus() {
  console.log(
    await prompt.decode(
      PROMPT_PATH,
      program.noformatting
    )
  )
}

function showFormatGuide() {
  console.log(prompt.formatGuideMessage)
}

// Run the selected actions, then show the status of the player
applyActions().then(
  () => !program.silent && !program.openPrompt
    ? showStatus()
    : program.openPrompt
      ? showFormatGuide()
      : void(0)
)
