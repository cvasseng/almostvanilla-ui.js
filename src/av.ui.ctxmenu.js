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
  var ctxnode = av.cr('div', 'av-context-frame transition-opacity');
  
  av.ready(function () {
    av.ap(document.body, ctxnode);
  });
  
  av.ContextMenu = function (defMeta) {
    var items = av.cr('div', ''),
        visible = false,
        events = av.events(),
        openPos = {
          x: 0,
          y: 0
        }
    ;
  
    function build(meta) {
      if (!av.isArr(meta)) {        
        return;
      }
      items.innerHTML = '';
      //Build from meta 
      (meta || []).forEach(function (group, i) {
        if (i > 0) {
          av.ap(items, av.cr('div', 'separator'));        
        }
        
        Object.keys(group || {}).forEach(function (key) {
          var obj = group[key],
              item = av.cr('div', 'item'),
              licon = av.cr('span', 'licon'),
              ricon = av.cr('span', 'ricon', obj.rtitle),
              title = av.cr('span', 'title', key)          
          ;
          
          function click() {
            if (obj.checkable) {
              obj.checked = !obj.checked;
              if (obj.checked) {
                licon.className = 'licon fa fa-check';            
              } else {
                licon.className = 'licon';            
              }
              if (av.isFn(obj.checkstate)) {
                obj.checkstate(obj.checked);
              }
            }
    
            events.emit('Select', obj);
            hide();
          }
          
          obj.doclick = click;
          
          obj.check = function () {
            obj.checked = true;
            licon.className = 'licon fa fa-check'; 
          };
          
          obj.uncheck = function () {
            obj.checked = false;
            licon.className = 'licon'; 
          };
          
          if (key.indexOf('-') >= 0) {
            av.ap(items, av.cr('div', 'separator'));
            return;
          }
          
          if (obj.ricon) {
            ricon.className = 'ricon fa fa-' + obj.ricon;
          }
          
          if (obj.licon) {
            licon.className = 'licon fa fa-' + obj.licon;
          }
          
          av.on(item, 'click', obj.click || false);      
          
          av.on(item, 'click', function () {
            click();
          });
          
          if (obj.checkable && obj.checked) {
            licon.className = 'licon fa fa-check';
          }
          
          if (av.isFn(obj.create)) {
            obj.create(obj);
          }
          
          av.ap(items, 
            av.ap(item,
              licon,
              title,
              ricon
            )
          );  
        });
      });
    
    };
    ///////////////////////////////////////////////////////////////////////////
  
    function show(x, y) {
      var bs = av.size(document.body),
          cs
      ;
                  
      ctxnode.innerHTML = '';
      av.ap(ctxnode, items);
      
      cs = av.size(ctxnode);
      
      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x + cs.w > bs.w) x = bs.w - cs.w - 2;
      if (y + cs.h > bs.h) y = bs.h - cs.h - 2;
      
      av.style(ctxnode, {
        pointerEvents: 'auto',
        opacity: 1,
        left: (x || 0) + 'px',
        top: (y || 0) + 'px'
      });    
      
      visible = true;
      
      openPos.x = x;
      openPos.y = y;
    }
    
    function hide() {
      av.style(ctxnode, {
        opacity: 0,
        pointerEvents: 'none'
      });
      events.emit('Hide');
      visible = false;
    }
    
    function toggle(w, h) {
      visible = !visible;
      if (visible) {
        return show(w, h);
      }
      hide();
    }
  
    ///////////////////////////////////////////////////////////////////////////
    
    build(defMeta);
    
    return {
      on: events.on,
      build: build,
      show: show,
      hide: hide,
      toggle: toggle,
      visible: function () {return visible;},
      openPos: openPos
    };  
  };

})();
