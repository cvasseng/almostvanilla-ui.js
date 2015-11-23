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
  var container = av.cr('div', 'av-cmd-pal transition'),
      input = av.cr('input', 'input'),
      results = av.cr('div', 'results'),
      
      commands = [],
      activeCommands = [],
      currentCommand = 0,
      visible = false
  ;

  /////////////////////////////////////////////////////////////////////////////

  function show() {
    input.value = '';
    input.focus();
    
    results.innerHTML = '';
    
    av.style(container, {
      opacity: 1,
      pointerEvents: 'all'
    });
    visible = true;
  }
  
  function hide() {
    av.style(container, {
      opacity: 0,
      pointerEvents: 'none'
    });
    visible = false;
  }
  
  function search(str) {
    activeCommands = [];
    currentCommand = 0;
    results.innerHTML = '';
    
    if (str.length > 0) {
      commands.forEach(function (cmd) {      
        if (cmd.name.toUpperCase().indexOf(str.toUpperCase()) >= 0) {
          var item = av.cr('div', 'item', cmd.name);        
          item.innerHTML = cmd.name.toLowerCase().replace(str.toLowerCase(), '<span class="match">' + str.toLowerCase() + '</span>')        
          av.ap(results, item);
          
          av.on(item, 'click', function () {
            if (av.isFn(cmd.fn)) {
              hide();
              cmd.fn();
            }
          });
          
          activeCommands.push({
            node: item,
            cmd: cmd
          });    
        }
      });  
      if (activeCommands.length > 0) {
        activeCommands[0].node.className = 'item active';
      }
    }
  }
  
  function doCurrent() {
    if (av.isFn(activeCommands[currentCommand].cmd.fn)) {
      activeCommands[currentCommand].cmd.fn();
    }
  }


  /////////////////////////////////////////////////////////////////////////////
  
  input.placeholder = 'type ? for help';
  
  av.on(input, 'keyup', function (e) {
    if (activeCommands.length > 0) {      
      if (e.keyCode === 38) {
        //Go up
        activeCommands[currentCommand].node.className = 'item';
        
        currentCommand = (currentCommand - 1) % activeCommands.length;
        currentCommand = currentCommand >= 0 ? currentCommand : activeCommands.length - 1;
        //$(results).find('.active').removeClass('active');
        //$(activeCommands[currentCommand].node).addClass('active');
        activeCommands[currentCommand].node.className = 'item active';
        return av.nodefault(e);
      }
      if (e.keyCode === 40) {
        //Go down
        activeCommands[currentCommand].node.className = 'item';
        
        currentCommand = ++currentCommand % activeCommands.length;
        activeCommands[currentCommand].node.className = 'item active';
        //$(results).find('.active').removeClass('active');
        //$(activeCommands[currentCommand].node).addClass('active');
        return av.nodefault(e);
      }
      if (e.keyCode === 13) {
        hide();
        doCurrent();
      }
      if (e.keyCode === 27) {
        hide();
      }
    }
    search(input.value);
  });
  
  av.ap(container,
    input,
    results
  );

  //Append to body when ready
  av.ready(function () {
    av.ap(document.body, container);
    av.on(document.body, 'keydown', function (e) {
      if (e.metaKey && e.keyCode === 80) {
        if (visible) {
          hide();
        } else {
          show();          
        }
        return av.nodefault(e);
      }
      if (visible && e.keyCode === 27) {
        hide();
      }
    });
  });
  
  //Register function
  av.RegCommand = function (command, fn) {
    commands.push({
      name: command,
      fn: fn
    });
  };
  
  //Clear commands
  av.ClearCommands = function () {
    commands = [];
    activeCommands = [];
    currentCommand = 0;
  };
  
  av.cmdPalShow = show;
  
})();
