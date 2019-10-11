/*
Format:
$P is played or paused icon
$n is name
$a is artist
$l is album
$y is year

Colors:
    NOTE: format items that are capitalized shouldn't have a
    color set to them.
%[LETTER]% Color, as represented by hex
%#% Close formatting
*/

const ansi = require('ansi-styles')
const fs = require('fs')

const itunes = require('./itunes')
const tc = require('./timeconversions')

module.exports = {
    decode: async(path) => new Promise((resolve, reject) => {
        fs.readFile(path, async(err, data) => {
            if (err) reject(err)

            let state = await itunes.getPlayerState()
            let metadata = await itunes.getMetadata()

            let playPausePrompt = state
                ? `${ansi.green.open}▶${ansi.green.close} `
                : `${ansi.red.open}❚❚${ansi.red.close}`

            // Split up by groups with a color tag then the content
            //   (or no tag before if uncolored, tag indices start with `%`)
            let dataGroups = data.toString()
                .split(/(%[^%]+)%([^%]*)%#%/g)

            // Set coloring
            for (let i = 0; i < dataGroups.length; i++) {
                if (dataGroups[i].startsWith('%')) {
                    let lineOut = dataGroups[i + 1]
                    if (dataGroups[i].substring(1).startsWith('0x')) {
                        lineOut = `${ansi.color.ansi16m.hex(dataGroups[i].substring(3))}${dataGroups[i + 1]}${ansi.color.close}`
                    }
                    dataGroups[i + 1] = lineOut
                }
            }

            // Merge together, remove %-prefixed indices
            let output = dataGroups
                .filter(word => !word.startsWith('%'))
                .join('')

            // Set macros
            let progress = tc.toMS(metadata.progress)
            progress = `${progress.minutes}:${progress.seconds}`

            output = output
                .replace(/\$P/g, playPausePrompt)
                .replace(/\$n/g, metadata.name)
                .replace(/\$a/g, metadata.artist)
                .replace(/\$l/g, metadata.album)
                .replace(/\$y/g, metadata.year)
                .replace(/\$r/g, metadata.albumArtist)
                .replace(/\$b/g, metadata.bpm)
                .replace(/\$c/g, metadata.composer)
                .replace(/\$g/g, metadata.genre)
                .replace(/\$t/g, metadata.length)
                .replace(/\$p/g, progress)
                .replace(/\$u/g, metadata.trackNumber)

            resolve(output)
        })
    })
}
