# LSITCM

![Terminal.app Demo of lsitcm](https://s22.postimg.cc/jinq68mtt/demo.png)

###### **Note: This project is incomplete, and is barely at an operating state; it will therefore have near constant updating. Only test this project if you understand that it could significantly change from what it is currently. Due to being based upon AppleScript, this module will not work on non-MacOS systems; please don't ask for a Windows or Linux-distro version.**

### Install
API | CLI
--- | ---
`npm i lsitcm` | `sudo npm i -g lsitcm`

### What is it?

LSITCM is a module for controlling iTunes on MacOS. It utilizes AppleScript to control the iTunes player to play a song, pause/play, skip a song, and play the previous song.

### Why use it?

Inside of external utilities such as SSH, the graphical portition of the host is not available, and only a console (bash) window is available. With the ability to control iTunes through the system console, it extends the capabilities of utilizing MacOS.

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
###### UPDATE (v1.0.2): This module can be used inside your project! just include it through `require('lsitcm')`. See [this](https://github.com/r2d2292/lsitcm/wiki/Using-lsitcm-in-a-program "lsitcm in a program guide") wiki page for more information.
