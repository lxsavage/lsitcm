# LSITCM

![Terminal.app Demo of lsitcm](site_assets/images/cover-photo.png)

**Note**: MacOS Catalina support has been added this version (2.0.0)

### Install

`sudo npm i -g lsitcm`

### What is it?

LSITCM is a module for controlling iTunes on MacOS. It utilizes AppleScript to control the iTunes player to play a song, pause/play, skip a song, and play the previous song.

### Why use it?

Inside of external utilities such as SSH, the graphical portition of the host is not available, and only a console (shell) window is available. With the ability to control iTunes through the system console, it extends the capabilities of utilizing MacOS.

### How to use it?

A few examples of how the program can be used are as follows:
1. Play a specific song:
  - `lsitcm [-s <SONG NAME>] [-a <ARTIST NAME>] [-l <ALBUM NAME>]`
2. Show the playing status of iTunes:
  - `lsitcm`
3. Control iTunes' flow:
  - `lsitcm -P` Pause
  - `lsitcm -N` Next song
  - `lsitcm -R` Previous song
4. Preview a playlist:
  - `lsitcm -y [PLAYLIST NAME]`

All commands that are available are shown through `lsitcm -h`
