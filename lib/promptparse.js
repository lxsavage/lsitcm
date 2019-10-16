//==========================================================================
const FORMAT_GUIDE = `Format:
$P is played or paused icon
$s is song name
$a is artist
$l is album
$y is year

Colors:
    NOTE: format items that are capitalized shouldn't have a
    color set to them.
%0xabc123% Color, as represented by hex
%#% Close formatting (always required to close before opening another color,
    or the end of the prompt)
`
//==========================================================================

const ansi = require('ansi-styles')
const fs = require('fs')

const itunes = require('./itunes')
const tc = require('./timeconversions')

module.exports = {
    formatGuideMessage: FORMAT_GUIDE,
    decode: async(path, disableColors) => new Promise((resolve, reject) => {
        fs.readFile(path, async(err, data) => {
            if (err) reject(err)

            let state = await itunes.getPlayerState()
            let metadata = await itunes.getMetadata()

            let playPausePrompt = disableColors
                ? state
                    ? 'Playing: '
                    : 'Paused: '
                : state
                    ? `${ansi.green.open}▶${ansi.green.close} `
                    : `${ansi.red.open}❚❚${ansi.red.close}`

            // Split up by groups with a color tag then the content
            //   (or no tag before if uncolored, tag indices start with `%`)
            let dataGroups = data.toString()
                .split(/(%[^%]+)%([^%]*)%#%/g)

            // Set coloring, if not disabled
            if (!disableColors) {
                for (let i = 0; i < dataGroups.length; i++) {
                    if (dataGroups[i].startsWith('%')) {
                        let lineOut = dataGroups[i + 1]
                        if (dataGroups[i].substring(1).startsWith('0x')) {
                            lineOut = `${ansi.color.ansi16m.hex(dataGroups[i].substring(3))}${dataGroups[i + 1]}${ansi.color.close}`
                        }
                        dataGroups[i + 1] = lineOut
                    }
                }
            }

            // Merge together, remove %-prefixed indices
            let output = dataGroups
                .filter(word => !word.startsWith('%'))
                .join('')

            // Set macros
            output = output
                .replace(/\$P/g, playPausePrompt)
                .replace(/\$s/g, metadata.name)
                .replace(/\$a/g, metadata.artist)
                .replace(/\$l/g, metadata.album)
                .replace(/\$y/g, metadata.year)
                .replace(/\$r/g, metadata.albumArtist)
                .replace(/\$b/g, metadata.bpm)
                .replace(/\$c/g, metadata.composer)
                .replace(/\$g/g, metadata.genre)
                .replace(/\$t/g, metadata.length)
                .replace(/\$p/g, tc.toDispMS(metadata.progress))
                .replace(/\$u/g, metadata.trackNumber)

            resolve(output)
        })
    })
}
