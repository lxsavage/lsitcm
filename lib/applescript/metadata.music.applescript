tell application "Music"
	set n to the name of current track
	set a to the artist of current track
	set l to the album of current track
end tell
return {n, a, l}
