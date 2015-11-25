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


av.List = function (parent, attrs) {
  var properties = av.merge({
        beforeAdd: function () { return true; },
        icons: {
          'plus-circle': {}    
        },
        checkable: true,
        selectable: true,
        draggable: false
      }, attrs),
      events = av.events(),
      container = av.cr('div', 'av-list'),
      itemsNode = av.cr('div', 'av-prettyscroll items'),
      iconBar = av.cr('div', 'icons'),
      selection = [],
      selectedItem = false
  ;
  
  /////////////////////////////////////////////////////////////////////////////
  
  function resize() {
    var ps = av.size(parent);
    av.style(itemsNode, {
      height: ps.h - av.size(iconBar).h + 'px'
    });
  }
  
  function clear() {
    selection = [];
    itemsNode.innerHTML = '';
  }
  
  function addItems(items) {
    if (av.isArr(items)) {
      items.forEach(addItem);
    }
  }
  
  function addItem(meta) {
    var item = av.cr('div', 'item'),
        title = av.cr('span', 'title', meta.title),
        left = av.cr('div', 'left'),
        right = av.cr('div', 'right', ''),
        cb = false
    ;
    
    function updateSelections() {
      if (meta.checked) {
        selection.push(meta);
      } else {
        selection = selection.filter(function (o) {
          return o !== meta;
        });
      }
      events.emit('SelectionUpdate', selection);
    }
    
    if (properties.checkable) {
      cb = av.cr('input', 'input');
      cb.type = 'checkbox';
      cb.checked = meta.checked;
      updateSelections();
      
      av.on(cb, 'change', function () {
        meta.checked = cb.checked;
        events.emit('SelectState', meta);
        if (meta.checkchange) {
          meta.checkchange(meta.checked);
        }
        updateSelections();
      });
      av.ap(left, cb);
    }
    
    if (properties.selectable) {
      av.on(item, 'click', function () {
        if (selectedItem) {
          selectedItem.className = 'item';
        }
        item.className = 'item item-selected';
        selectedItem = item;
        events.emit('Select', meta);
      });
    }
    
    if (properties.draggable) {
      av.Draggable(item, properties.dragType, meta);
    }
    
    if (meta.icons) {
      Object.keys(meta.icons).forEach(function (key) {
        var icon = meta.icons[key],
            i = av.cr('span', 'icon fa fa-' + key);
       
        av.on(i, 'click', icon.click); 
        
        av.ap(right, i);
      });
    }
    
    av.ap(itemsNode, 
      av.ap(item,
        right,
        left,
        title
      )
    );
  }
  
  /////////////////////////////////////////////////////////////////////////////
  
  //Add icons
  Object.keys(properties.icons).forEach(function (key) {
    var obj = properties.icons[key],
        icon = av.cr('span', 'icon fa fa-' + key)
    ;
    
    av.on(icon, 'click', function () {
      if (av.isFn(obj.click)) {
        obj.click();
      }
    });
    
    av.ap(iconBar, icon);
  });
  
  
  
  av.ready(function () {
    av.ap(parent, 
      av.ap(container,
        itemsNode,
        iconBar
      )  
    );
    resize();    
  });
  
  // addItem({
  //   title: 'Test Item',
  //   checkable: true,
  //   icons: {
  //     'trash': {
        
  //     },
  //     'pencil-square-o': {
        
  //     }    
  //   }
    
  // });
  
  // addItem({
  //   title: 'Test Item',
  //   checkable: true
  // });
  
  return {
    on: events.on,
    resize: resize,
    addItem: addItem,
    addItems: addItems,
    clear: clear
  }
};
