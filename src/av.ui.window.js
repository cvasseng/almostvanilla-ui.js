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


(function () {
  var windows = {};

  function CreateWindow (attrs) {
    var properties = av.merge({
          title: 'My Window',
          canResize: true,
          canMove: true,
          canDock: false,
          canClose: true,
          x: 10,
          y: 10,
          width: 200,
          height:200,
          id: Object.keys(windows).length //uuid.v4()
        }, attrs),  
        events = av.events(),
        container = av.cr('div', 'av-window av-window-undocked transition-opacity'),
        titlebar = av.cr('div', 'titlebar'),
        title = av.cr('div', 'title', properties.title),
        closer = av.cr('div', 'close fa'),
        undocker = av.cr('div', 'undock fa'),
        body = av.cr('div', 'body', ''),
        resizeh = av.cr('div', 'resizer'),
        mover = false,
        resizer = false,
        docked = false,
        isVisible = false,
        dockedToNode = false
    ;
    
    if (!properties.canDock) {
      av.style(undocker, {
        display: 'none'
      });
    }
    
    function resize() {
      var s = av.size(container);
      
      av.style(body, {
        height: s.h - av.size(titlebar).h - av.size(resizeh).h + 'px'
      });
      
      events.emit('Resize');
    }
    
    function show(center) {
      av.style(container, {
        pointerEvents: '',
        display: '',
        opacity: 1
      });
      resize();
      isVisible = true;
      
      if (center) {
        var bs = av.size(document.body),
            s = av.size(container)
        ;
        av.style(container, {
          left: (bs.w / 2) - (s.w / 2) + 'px',
          top: (bs.h / 2) - (s.h / 2) + 'px'
        }); 
      }
      
      events.emit('Show');
    }
    
    function hide() {
      av.style(container, {
        pointerEvents: 'none',
        opacity: 0,
        display: 'none'
      });
      isVisible = true;
      events.emit('Hide');
    }
    
    function toggle() {
      if (isVisible) return hide();
      show();
    }
  
    function visible(flag) {
      if (flag) return show();
      hide();
    }
    
    function setTitle(t) {
      title.innerHTML = t;
    }
    
    //Dock the window
    function dock(parent) {
      if (container.parentNode) {
        container.parentNode.removeChild(container);        
      }
      av.ap(parent, container);
      container.className = 'av-window av-window-docked transition-opacity';
      resizeh.className = 'resizer-docked';
      resizeh.innerHTML = '<span class="fa fa-ellipsis-h"></span>';
      docked = true;
      mover.disable();
      dockedToNode = parent;
      av.style(container, {
        width: '',
        left: '',
        top: ''
      });
      resizer.setAxis('Y');
      resize();
    }
    
    //Undock the window
    function undock() {
      av.ap(document.body, container);
      container.className = 'av-window av-window-undocked transition-opacity';
      resizeh.className = 'resizer';
      resizeh.innerHTML = '';
      docked = false;
      mover.enable();
      av.style(container, {
        width: properties.width + 'px',
        height: properties.height + 'px',
        left: properties.x + 'px',
        top: properties.y + 'px'
      });
      resizer.setAxis('XY');
      resize();
    }
  
    /////////////////////////////////////////////////////////////////////////////
  
    av.ap(container,
      av.ap(titlebar,
        title,
        undocker
      ),
      body,
      resizeh
    );
    
    mover = av.Mover(titlebar, container);
    resizer = av.Resizer(resizeh, container);
    
    if (properties.canClose) {
      av.ap(titlebar, closer);
    }
    
    if (!properties.canMove) {
      mover.disable();
    }
    
    if (!properties.canResize) {
      resizer.disable();
    }
    
    mover.on('Done', function (x, y) {
      properties.x = x;
      properties.y = y;
    });
    
    resizer.on('Done', function (w, h) {
      if (!docked) {
        properties.width = w;
        properties.height = h;        
      }      
    });
    
    resizer.on('Resizing', function (w, h) {
      resize(w, h);
    });
    
    av.style(container, {
      width: properties.width + 'px',
      height: properties.height + 'px',
      left: properties.x + 'px',
      top: properties.y + 'px'
    });
    
    av.ready(function () {        
         
      if (!docked) {
        av.ap(document.body, 
          container
        );              
      }   
      resize();
    });
    
    av.on(undocker, 'click', function () {
      if (docked) {
        undock();
      } else if (dockedToNode) {
        dock(dockedToNode);
      }
    });
    
    av.on(closer, 'click', hide);
    
    return {
      on: events.on,
      show: show,
      hide: hide,
      toggle: toggle,
      visible: visible,
      properties: properties,
      dock: dock,
      body: body,
      resize: resize,
      setTitle: setTitle,
      isVisible: function () {
        return isVisible;
      }
    }
  };
  
  //Wrap it so it's added to the collection automagically
  av.Window = function (attrs) {
    var w = CreateWindow(attrs);
    windows[w.properties.id] = w;
    return w;
  };
  
  av.getWindow = function (id, fn) {
    if (av.isFn(fn) && windows[id]) {
      fn(windows[id]);      
    }
    return windows[id] || false;
  };
  
})();
