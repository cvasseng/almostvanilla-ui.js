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

av.TabControl = function (parent, noBodies) {
  var events = av.events(),
      container = av.cr('div', 'av-tabctrl'),
      headings = av.cr('div', 'tabs'),
      body = av.cr('div', 'tab-bodies'),
      marker = av.cr('div', 'av-transition tab-marker'),
      tabs = [],
      openTab = false
  ;

  /////////////////////////////////////////////////////////////////////////////

  function resolveTab(selector, fn) {
    tabs.some(function (tab, index) {
      var hit = true;
      
      Object.keys(selector).some(function (key) {
        if (tab.meta[key] !== selector[key]) {
          hit = false;
          return true;  
        }
        return false;
      });
      
      if (hit && av.isFn(fn)) {
        fn(tab, index);
      }
      
      return hit;  
    });
  }

  function resize() {
    
  }

  function addTab(meta) {
    var itmHeader = av.cr('div', 'av-transition tab', meta.title.toUpperCase()),
        itmBody = av.cr('div', 'tab-body'),
        res
    ;
    
    av.style(itmBody, {
      display: 'none'  
    });
    
    av.ap(headings, itmHeader);
    if (!noBodies) {
      av.ap(body, itmBody);      
    }
    
    av.on(itmHeader, 'click', function () {
      showTab(meta);
    });
    
    res = {
      meta: meta,
      header: itmHeader, 
      body: itmBody  
    };
    
    events.emit('AddTab', res);
    
    tabs.push(res);
    showTab(meta);
    
    return res;      
  }
  
  function remTab(selector) {
    
  }
  
  function showTab(selector) {
    if (openTab) {
      openTab.header.className = 'av-transition tab'; 
      av.style(openTab.body, {
        display: 'none'  
      });
      openTab = false; 
    }
    
    resolveTab(selector, function (tab) {
      openTab = tab;
      tab.header.className = 'av-transition tab tab-selected';
      
      if (!noBodies) {
        av.style(tab.body, {
          display: 'block'  
        });        
      }
      
      av.style(marker, {
        left: av.pos(tab.header).x + 'px',
        width: av.size(tab.header).w + 'px'
      });
      
      events.emit('ShowTab', tab);
    });
  }

  /////////////////////////////////////////////////////////////////////////////

  av.ready(function () {
    av.ap(parent, 
      av.ap(container,
        av.ap(headings,
          marker
        ),
        body
      )
    );      
    resize();
  });

  return {
    on: events.on,
    addTab: addTab,
    remTab: remTab, 
    showTab: showTab,
    resize: resize
  }  
};
