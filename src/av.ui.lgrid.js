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

av.LayoutGrid = function (parent) {
  var container = av.cr('div', 'av-layout-grid'),
      rows = []
  ;
  
  //Add a row to the grid 
  function addRow() {
    var row = av.cr('div', 'lg-row'),
        rsize = av.size(row),
        sizers = [],
        columns = [],
        ret = {}
    ;
    
    //Add a column to the row
    /*
      {
        minSize: {w: .., h: ...},
        allowResize: true|false 
      }    
    */
    function addCol(props) {
      var node = av.cr('div', 'lg-col'),
          col = {}
      ;
      
      av.ap(row, node);
      
      col = {
        size: {w: 0, h: 0},
        ap: function () {
          av.ap.apply(undefined, [node].concat(Array.prototype.slice.call(arguments)));
        },
        resize: function () {
          av.style(node, {
            width: col.size.w + 'px',
            height: col.size.h + 'px'
          });    
        }
      };
      
      columns.push(col);
      resizeRow();
      createColSizers();
      
      return {
        ap: col.ap,
        resize: col.resize 
      };
    }
    
    function createColSizers() {
      var x = 0;
      
      //Destroy the sizers
      sizers.forEach(function (sizer) {
        sizer.n.parentNode.removeChild(sizer.n);
        sizer.sizer.destroy();
      });
      
      //Create sizers
      for (var i = 0; i < columns.length - 1; i++) {
        //Place the sizer at columns[i].w
        (function (col) {
          var n = av.cr('div', 'lg-vsizer'),
              sizer = av.Mover(n, n, 'X')
          ;  
          
          av.style(n, {
            left: x + col.size.w + 'px'
          });
          
          x += col.size.w;
          
          sizer.on('Moving', function (nx, ny) {
            col.size = nx - x;
            col.resize();  
          });
          
          av.ap(container, n);
          
          sizers.push({
            node: n,
            sizer: sizer
          });
        })(columns[i]);
      }        
    }
    
    function resizeRow() {
      var assigned = 0,
          squeue = [],
          psize = av.size(container)
      ;
      
      av.style(row, {
        width: psize.width + 'px',
        height: psize.height + 'px'
      });      
      
      rsize = av.size(row);
      
      //First calculate sizes
      columns.forEach(function (c, i) {
        if (c.size.w === 0) {
          squeue.push(c);
        } else {
          assigned += c.size.w;
        }        
      });
      
      squeue.forEach(function (c) {
        c.size.w = (rsize.w - assigned) / squeue.length;
        c.size.h = 200;  
        console.log(rsize);
      });
      
      columns.forEach(function (c) {
        c.resize();
      });
    }
    
    av.ap(container, row);
    
    ret = {
      addCol: addCol,
      resize: resizeRow
    };
    
    rows.push(ret);
    return ret;
  }
  
  function resize() {
    rows.forEach(function (r) {
      r.resize();
    });
  }
  
  av.ready(function () {
    av.ap(parent, container);
    resize();
  });

  return {
    addRow: addRow,
    resize: resize
  }
};
