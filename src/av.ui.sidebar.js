/******************************************************************************

almostvanilla.ui.js
https://github.com/cvasseng/almostvanilla-ui.js/

Copyright (c) 2015 Chris Vasseng

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


******************************************************************************/

av.SideBar = function(parent) {
  var container = av.cr('div', 'av-sidebar'),
      splitter = av.cr('div', 'av-sidebar-splitter fa fa-ellipsis-v'),
      mover = av.Mover(splitter, splitter, 'X'),
      events = av.events(),
      width = 0
  ;
  
  function resize() {
    var ds = av.size(document.body);
    av.style([container, splitter], {
      height: ds.h - 28 + 'px'
    });
    av.style(splitter, {
      lineHeight: ds.h + 'px'
    });
    av.style(container, {
      width: ds.w - av.pos(splitter).x - av.size(splitter).w - 1 + 'px'
    });
    
    width = ds.w - av.pos(splitter).x - av.size(splitter).w - 1;
    events.emit('Resize');
  }
  
  av.on(splitter, 'dblclick', function () {
    var ds = av.size(document.body);
    if (av.pos(splitter).x >= ds.w - av.size(splitter).w) {
      av.style(splitter, {
        left: ds.w - 200 + 'px'
      });
    } else {
      av.style(splitter, {
        left: ds.w - av.size(splitter).w + 'px'
      });        
    }
    resize();
  });
  
  mover.on('Moving', function (x, y) {
    var ds = av.size(document.body);
    av.style(container, {
      width: ds.w - x - av.size(splitter).w - 1 + 'px'
    });
    events.emit('Resize');
    width = ds.w - x - av.size(splitter).w - 1;
  });
  
  av.ready(function () {
    if (av.isStr(parent)) parent = document.getElementById(parent);
    av.ap(parent || document.body, container, splitter);  
    resize();      
  });
    
  return {
    on: events.on,
    resize: resize,
    width: function() { return width + av.size(splitter).w; },
    container: container
  } 
};
  

