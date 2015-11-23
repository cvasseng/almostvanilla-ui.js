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

av.PGRID_TABLE = 1;
av.PGRID_FORM = 2;

av.PropertyGrid = function (parent, gtype) {
  var container = av.cr('table', 'av-property-grid'),
      events = av.events(),
      callbacks = []
  ;
  
  
  //Inspect an object
  function inspect(obj, meta, fn, name, noClear, adder) {    
    var table = av.cr('div', 'av-property-grid'); 
    
    if (!noClear) {
      container.innerHTML = ''; 
      callbacks = callbacks.filter(function (fn) {
        fn();
        return false;
      });     
    }   
    
    av.ap(container,
      av.cr('div', 'group', name),
      table
    );      
    
    Object.keys(obj).forEach(function (key) {
      var tcol = av.cr(gtype === av.PGRID_TABLE ? 'td' : 'div', 'title', key),
          dcol = av.cr(gtype === av.PGRID_TABLE ? 'td' : 'div'),
          rcol = av.cr('td'),
          row = av.cr('tr'),
          rem = av.cr('span', 'fa fa-trash'),
          editor = false,
          tps = {
            id: function () {
              editor = av.cr('div', 'stretch', obj[key]);
            },
            checkbox: function () {
              editor = av.cr('input', 'stretch pg-editor');
              editor.type = 'checkbox';
              editor.checked = obj[key];
            },
            slider: function () {
              editor = av.cr('input', 'stretch pg-editor');
              editor.type = 'range';
              editor.max = '255';
              editor.min = '0';
              editor.value = obj[key];
            },
            dropdown: function () {
              editor = av.cr('select', 'stretch pg-editor');
              (meta[key].options || []).forEach(function (k) {
                av.ap(editor, av.cr('option', '', k.title, k.id));
              });
            },
            button: function () {
              editor = av.cr('button', 'stretch pg-editor', meta[key] ? meta[key].title : key);
              tcol.innerHTML = '';
              av.on(editor, 'click', meta[key].click);
            },
            textarea: function () {
              editor = av.cr('textarea', 'stretch outline prettyscroll');
              editor.value = obj[key];
              av.style([dcol, editor], {
                height: '200px',
                width: '100%'
              });
            },
            default: function () {
              editor = av.cr('input', 'stretch pg-editor');
              editor.value = obj[key];  
            }
          }          
      ;
      
      tcol.valign = 'top';
      
      if (!av.isBasic(obj[key])) {
        inspect(obj[key], (meta || {})[key], fn, meta && meta[key] ? meta[key].title || key : key, true, true);
        return;
      }
      
      if (meta && meta[key]) {
        tcol.innerHTML = meta[key].title || key; 
      }
      
      if (meta && meta[key] && tps[meta[key].type]) {
        tps[meta[key].type]();
      } else {
        tps['default']();
      }
      
      if (editor) {
        av.ap(dcol, editor);
        
        av.on(editor, 'change', function () {
          obj[key] = editor.value;
          if (av.isFn(fn)) {
            fn(obj, key);
          }
        });
      }
      
      if (gtype === av.PGRID_TABLE) {
        av.ap(table, 
          av.ap(row,
            tcol,
            dcol
          )
        );        
      } else {
        av.ap(table, 
          //av.ap(row,
            tcol,
            dcol
          //)
        );
      }
      
      if (meta && meta.allowRemove) {
        av.ap(row, av.ap(rcol, rem));
      }
      
      av.on(rem, 'click', function () {
        delete obj[key];
        table.removeChild(row);
        if (av.isFn(fn)) {
          fn();
        }
      });
      
    });
    
    if (meta && meta.canAddTo) {
      //Add a plus thingy 
    }
    
  }
  
  av.ap(parent, container);

  return {
    on: events.on,
    inspect: inspect
  }
};


