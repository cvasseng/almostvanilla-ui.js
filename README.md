# almostvanilla-ui.js
UI Module for [almostvanilla.js](https://github.com/cvasseng/almostvanilla.js)

**!! Work in progress !!**
The code in this repository is not production ready, and is full of missing (crucial) functionality.
Most of the widgets/controls do not yet render properly.

## What & Why

This is a UI extension to [almostvanilla.js](https://github.com/cvasseng/almostvanilla.js).
It adds a number of UI widgets/controls to the `av` namespace. It follows 
the same concept as almostvanilla.js itself; mainly keeping a strong emphasis on 
being lightweight (both in size and in implementation), and easy to deal with. 

Does the world really need another JS UI library? Probably not.
But personally, I strongly prefer to work with this style of interfaces over
e.g. pre-processor heavy libraries that mixes JavaScript and HTML, or 
libraries that's written using more traditional OOP concepts rather than being written in a more functional manner.
 
I built this for myself, to sped up development of web apps. Maybe it will speed things up for you too. 

##  Widgets/Controls

### Included
  * `av.ContextMenu`
  * `av.SnackBar`
  * `av.FileMenu`
  * `av.TabControl`
  * `av.PropertyGrid`
  * `av.Window`
  * `av.CommandPalette` (console-ish input, like the command palette in sublime/vscode/etc)
  * `av.List`
  * `av.Tree`
  
## Getting started

Build by running `bakor` in the root directory. This will build the selected
themes, and minify the sources, and store it all in `builds/`.

Samples are included in `samples/`, which can be served by doing
`npm install` and running `node bin/www`. 

##License

MIT.
