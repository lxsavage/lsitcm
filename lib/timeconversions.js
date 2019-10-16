module.exports = {
    toDispMS: seconds => {
        let minutes = 0

        while (seconds >= 60) {
            minutes ++
            seconds -= 60
        }

        return `${minutes}:${ Math.floor(seconds) < 10 ? '0' + Math.floor(seconds) : Math.floor(seconds) }`
    }
}
