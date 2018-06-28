tell application "iTunes"
	set nom to the name of current track
	set art to the artist of current track
	set alb to the album of current track
end tell
return {nom, art, alb}