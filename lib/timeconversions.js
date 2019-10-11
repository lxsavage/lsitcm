module.exports = {
    toMS: seconds => {
        let minutes = 0

        while (seconds >= 60) {
            minutes ++
            seconds -= 60
        }

        return {
            minutes: minutes,
            seconds: Math.floor(seconds)
        }
    }
}
