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

av.Table = function (parent, attrs) {
  var properties = av.merge({
        checkable: true
      }, attrs),
      events = av.events(),
      meta = [],

      table = av.cr('table', 'av-table av-stretch av-transition'),
      body = av.cr('tbody'),
      header = av.cr('thead')
  ;

  /////////////////////////////////////////////////////////////////////////////
  
  function crmeta(col, val, fn, data) {
    var c = {
      input: function () {
        var n = av.cr('input', 'av-stretch');
        n.value = val;
        av.on(n, 'change', function () {
          data[col] = n.value;
          if (av.isFn(fn)) {
            fn(data);
          }
        });
        return n;
      },
      checkbox: function () {
        var n = av.cr('input');
        n.type = 'checkbox';
        n.checked = val === '1' || val === true;
        av.on(n, 'change', function () {
          data[col] = n.checked;
          if (av.isFn(fn)) {
            fn(data);
          }
        });
        return n;
      }
    };

    if (col >= meta.length) {
      return false;
    }

    return c[meta[col].type] ?  c[meta[col].type]() : av.cr('span', '', val);
  }

  function addHeadings(data) {
    header.innerHTML = '';

    if (properties.checkable) {

    }

    if (av.isArr(data)) {
      data.forEach(function (h) {
        var n = av.cr('th', '', h.title)
        ;

        if (!av.isNull(h.width)) {
          av.style(n, {
            width: h.width + 'px' 
          });
        }

        meta.push({
          type: h.type,
          name: h.name
        });

        av.ap(header, n);
      });
    }
  }

  function addRow(data, fn) {
    if (av.isArr(data)) {
      var tr = av.cr('tr');
      data.forEach(function (col, i) {
        var c = av.cr('td'),
            m = crmeta(i, col, fn, data)
        ;
        if (m) {
          av.ap(c, m);
          av.ap(tr, c);
        }
      });
      av.ap(body, tr);
    }
  }

  function clearData() {
    body.innerHTML = '';
  }

  /////////////////////////////////////////////////////////////////////////////

  table.cellPadding = 0;
  table.cellSpacing = 0;

  av.ap(parent, 
    av.ap(table,
      header,
      body
    ) 
  );

  /////////////////////////////////////////////////////////////////////////////

	return {
    on: events.on,
    addRow: addRow,
    addHeadings: addHeadings,
    clearData: clearData
  };
};
