set trackNames to {}
set trackArtists to {}
set trackAlbums to {}
set trackYears to {}
set trackLengths to {}
set trackList to {}

tell application "iTunes"
	repeat with aTrack in tracks of playlist playlistName
		set trackNames to trackNames & name of aTrack
		set trackArtists to trackArtists & artist of aTrack
		set trackAlbums to trackAlbums & album of aTrack
		set trackYears to trackYears & year of aTrack
		set trackLengths to trackLengths & time of aTrack
	end repeat
end tell

repeat with i from 1 to the length of trackNames
	set currentTrack to {name:item i of trackNames, artist:item i of trackArtists, album:item i of trackAlbums, year:item i of trackYears, length:item i of trackLengths}
	set trackList's end to currentTrack
end repeat

return trackList
