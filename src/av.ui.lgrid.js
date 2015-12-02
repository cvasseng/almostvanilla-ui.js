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
      rows = [],
      rsizers = []
  ;
  
  //Add a row to the grid 
  function addRow() {
    var row = av.cr('div', 'lg-row'),
        rsize = av.size(row),
        sizers = [],
        columns = [],
        ret = {},
        cevents = av.events()
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
        events: cevents,
        node: node,
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
        on: cevents.on,
        node: node,
        ap: col.ap,
        resize: col.resize 
      };
    }
    
    function createColSizers() {
      var x = 0;
      
      //Destroy the sizers
      sizers = sizers.filter(function (sizer) {
        sizer.node.parentNode.removeChild(sizer.node);
        return false;
      });
      
      //Create sizers
      for (var i = 0; i < columns.length - 1; i++) {
        //Place the sizer at columns[i].w
        (function (col, colnext) {
          var n = av.cr('div', 'lg-vsizer'),
              sizer = av.Mover(n, n, 'X'),
              myIndex = sizers.length,
              ox = x//,
              //x = av.pos(col.node).x
          ;  
          
          x += col.size.w;
          
          function update(nx) {
            var total = col.size.w + colnext.size.w;
            col.size.w = nx - av.pos(col.node).x;
            colnext.size.w = total - col.size.w;
            col.resize();  
            colnext.resize(); 
            
            col.events.emit('Resize');                       
          }
          
          sizer.on('Start', function () {
            av.style(n, {
              height: col.size.h + 'px'  
            });
          });
          
          sizer.on('Moving', update);
          sizer.on('Done', update);
          
          av.ap(row, n);
          
          av.style(n, {
            left: ox + col.size.w + 'px',
            height: col.size.h + 'px'
          });
          
          sizers.push({
            node: n,
            sizer: sizer
          });
        })(columns[i], columns[i + 1]);
      }        
    }
    
    function resizeRow() {
      var assigned = 0,
          squeue = [],
          psize = av.size(container),
          height = 0
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
      });
      
      columns.forEach(function (c) {
        if (rsize.h === 0) {
          if (c.size.h > height) {
            height = c.size.h;
          }
        } else {
          c.size.h = rsize.h;
        }
        c.resize();
      });
      
      if (rsize.h === 0) {
        av.style(row, {
          height: height + 'px'  
        });        
      }
      
      createColSizers();
    }
    
    av.ap(container, row);
    
    ret = {
      node: row,
      addCol: addCol,
      resize: resizeRow
    };
    
    rows.push(ret);
    createRowSizers();
    return ret;
  }
  
  function createRowSizers() {
    rsizers = rsizers.filter(function (row) {
      row.node.parentNode.removeChild(row.node);
      return false;
    });  
    
    
    for (var i = 0; i < rows.length - 1; i++) {
      (function (row, rownext) {
        var n = av.cr('div', 'lg-hsizer'),
            sizer = av.Mover(n, n, 'Y')
        ;
        
        av.style(n, {
          top: av.pos(row.node).y + av.size(row.node).h + 'px' 
        });
        
        sizer.on('Moving', function (nx, ny) {
          var rs = av.pos(row.node),          
              total = av.size(row.node).h + av.size(rownext.node).h
          ;
          
          av.style(row.node, {
            height: ny - rs.y + 'px'  
          });
          
          av.style(rownext.node, {
            height: total - (ny - rs.y) + 'px' 
          });
            
          row.resize();   
          rownext.resize();
            
        });
        
        av.ap(container, n);
        
        rsizers.push({
          node: n,
          sizer: sizer
        });
        
      })(rows[i], rows[i + 1]);
    }
    
  }
  
  function resize() {
    rows.forEach(function (r) {
      r.resize();
    });
    createRowSizers();
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
