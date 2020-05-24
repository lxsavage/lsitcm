tell application "iTunes"
	set n to the name of current track
	set a to the artist of current track
	set l to the album of current track
	set y to the year of current track
	set r to the album artist of current track
	set b to the bpm of current track
	set c to the composer of current track
	set g to the genre of current track
	set t to the round(((time of current track) / 1000) mod 60) rounding down
	set p to player position
	set u to the track number of current track
end tell
return { n, a, l, y, r, b, c, g, t, p, u }
