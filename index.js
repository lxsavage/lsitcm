#!/usr/bin/env node
const program = require('commander')
const shell = require('shelljs')
const Table = require('cli-table3')

const itunes = require('./lib/itunes')
const prompt = require('./lib/promptparse')
const config = require('./config.json')

const suggestions = require('./suggestions.json')

const PROMPT_PATH = `${__dirname}/prompts/${config.Prompt}.prompt`

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
  .option('-C, --open-config', 'opens the configuration file in the default text editor')
  .option('-p, --playlist [playlist]', 'play a specified playlist')
  .option('-A, --playlist-add [playlist]', 'add the now playing song to the specified playlist')
  .option('-y, --ls-playlist [playlist]', 'displays the songs in the playlist specified')
  .parse(process.argv)

async function applyActions() {
  if (program.launch) await itunes.activate()
  if (program.previous) await itunes.gotoPrevious()
  if (program.skip) await itunes.gotoNext()
  if (program.playpause) await itunes.playPause()
  if (program.playlistAdd) await itunes.addToPlaylist(await itunes.getMetadata(), program.playlistAdd)
  if (program.lsPlaylist) createPlaylistChart(program.lsPlaylist).then(chrt => console.log(chrt))
  if (program.openPrompt) shell.exec(`open "${__dirname}/prompts"`)
  if (program.openConfig) shell.exec(`${config.Editor} "${__dirname}/config.json"`)

  if (program.song || program.artist || program.album) {
    await itunes.playSong({
      name: program.song,
      artist: program.artist,
      album: program.album
    }).catch(err => console.log(err))
  }
  else if (program.playlist) {
    await itunes.playPlaylist(program.playlist)
      .catch(err => console.log(err))
  }
}

async function createPlaylistChart(name) {
  let playlist = await itunes.getPlaylistMetadata(name)
  let chart = new Table({
    head: [ '#', 'Name', 'Artist', 'Album', 'Length' ]
  })

  for (let i = 0; i < playlist.length; i++) {
    let song = playlist[i]
    chart.push([ (i + 1).toString(), song.name, song.artist, song.album, song.length ])
  }

  return chart.toString()
}

async function showStatus() {
  try {
    await prompt.decode(PROMPT_PATH, program.noformatting)
      .then(output => console.log(output))
      .catch(() => console.log(`No music is currently playing. ${suggestions[Math.floor(Math.random() * suggestions.length)]}`))
  }
  catch (e) {
    console.log(`No music is currently playing. ${suggestions[Math.floor(Math.random() * suggestions.length)]}`)
  }
}

// Run the selected actions, then show the status of the player
applyActions().then(() =>
  !program.silent && !program.openPrompt
    ? showStatus()
    : void(0)
)
