# LSITCM

![Terminal.app Demo of lsitcm](https://s22.postimg.cc/jinq68mtt/demo.png)

###### **Note: This project is incomplete, and is barely at an operating state. Only test this project if you understand that it could significantly change from what it is currently.**

### Install
`npm i lsitcm`

[See npmjs page...](https://www.npmjs.com/package/lsitcm)

### What is it?

LSITCM is a CLI for controlling iTunes on OSX/MacOS. It utilizes AppleScript to control the iTunes player to play a song, pause/play, skip a song, and play the previous song.

### Why use it?

Inside of external utilities such as SSH, the graphical portition of the host is not available, and only a console window is available. With the ability to control iTunes through the system console, it extends the capabilities of utilizing OSX/MacOS.

### How to use it?

LSITCM has 3 main uses (as of now):
1. Play a specific song:
  - `lsitcm -s [SONG NAME] -a [ARTIST NAME] -l [ALBUM NAME]`
2. Show the playing status of iTunes:
  - `lsitcm`
3. Control iTunes' flow:
  - `lsitcm -P` Pause
  - `lsitcm -N` Next song
  - `lsitcm -R` Previous song
