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

av.FileMenu = function (meta, parent) {
  var container = av.cr('div', 'av-filemenu'),
      active = false,
      events = av.events()
  ;

  Object.keys(meta || {}).forEach(function (key) {
    var obj = meta[key],
        item = av.cr('span', 'item', key),
        ctxmenu = false
    ;
  
    av.on(item, 'mouseover', function () {
      if (active) {
        active.hide();
        //active = false;
                
        if (ctxmenu) {
          ctxmenu.show(av.pos(item).x, av.pos(item).y + av.size(item).h + 6);
          active = ctxmenu;
        }
      }
    });
    
    if (obj.bold) {
      av.style(item, {
        'font-weight': '400'
      });
    }
    
    if (obj.children) {                  
      ctxmenu = av.ContextMenu(obj.children, true); 
           
      av.on(item, 'click', function () {
        ctxmenu.toggle(av.pos(item).x, av.pos(item).y + av.size(item).h + 6);        
        active = ctxmenu.visible() ? ctxmenu : false;
      });
      
      ctxmenu.on('Select', function () {
        active = false;
      });
    }
    
    av.ap(container, item);
  });

  //Append to body when ready
  av.ready(function () {
    if (av.isStr(parent)) parent = document.getElementById(parent);
    av.ap(parent || document.body, container);    
  });
  
  return {
    on: events.on
  }
};
