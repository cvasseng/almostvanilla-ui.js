av.Tree = function(parent, attrs) {
  var props = av.merge({
        
      }, attrs),  
      events = av.events(),
      container = av.cr('div', 'av-tree'),
      selected = false
  ;

  /////////////////////////////////////////////////////////////////////////////
  
  function resize() {
    
  }
      
  function loadSubset(data, p) {        
    //Object.keys(data || {}).forEach(function (key) {
    (data || []).forEach(function (obj) {
      var key = obj.title,
          node = av.cr('div', 'child'),
          children = av.cr('div', 'children'),
          title = av.cr('span', '', key),
          expander = av.cr('span', 'expander fa fa-angle-down'),
          icons = av.cr('div', 'icons'),
          licon = av.cr('span', 'expander fa'),
          adder = av.cr('span', 'adder fa fa-plus-circle'),
          expanded = true
      ;
      
      function hasChildren() {
        av.ap(node, 
          expander,
          licon,
          title,
          icons
        );
        
        title.innerHTML = key.toUpperCase();
        
        av.on(node, 'click', function () {
          expanded = !expanded;
          av.style(children, {
            height: expanded ? '' : '0px'
          });
          if (expanded) {
            av.style(expander, {
              '-webkit-transform': 'rotate(0deg)'
            });
          } else {
            av.style(expander, {
              '-webkit-transform': 'rotate(-90deg)'
            });
          }
        });
      }
      
      av.ap(p, 
        av.ap(node,
          licon,
          title,
          icons
        ), 
        children
      );
      
      obj.children = obj.children || {};
      obj.icons = obj.icons || {};
      
      function addIcons() {
        Object.keys(obj.icons).forEach(function (key) {
          var icon = av.cr('span', 'icon fa fa-' + key);
          av.on(icon, 'click', function (e) {
            if (obj.icons[key].click) {
              obj.icons[key].click();              
            }
            return av.nodefault(e);
          });
          av.ap(icons, icon);
        });
      }
      
      function select() {
        if (selected) {
          selected.className = 'child';
        } 
        selected = node;
        node.className = 'child highlight';
      }
                  
      if (Object.keys(obj.children).length > 0) {        
        hasChildren();
        loadSubset(obj.children, children);
      } else if (!obj.canAdd) {
        av.on(node, 'click', function () {
          select();
          events.emit('Selected', obj);
          if (av.isFn(obj.click)) {
            obj.click();
          }
        });
      }
      
      av.on(node, 'mouseover', function () {
        av.style(icons, {
          opacity: 1
        });
      });
      
      av.on(node, 'mouseout', function () {
        av.style(icons, {
          opacity: 0
        });
      });
      
      if (obj.canAdd) {        
        av.ap(icons, adder);
        
        av.on(adder, 'click', function (e) {
          var name = prompt('Name'), 
              nobj = {}
          ;
          
          if (obj.children[name]) {
            alert(name + ' already exists');
            return av.nodefault(e);
          }
          
          if (name && name.length > 0) {
            nobj[name] = {};
            av.merge(obj.children, nobj);
            hasChildren();
            loadSubset(nobj, children);          
          }
          
          return av.nodefault(e);
        });  
      }
      
      if (obj.selected) {
        select();
      }
      
      addIcons();
      
      if (obj.licon) {
        licon.className += ' fa-' + obj.licon;
      } else {
        av.style(licon, {
          display: 'none'
        });
      }
      
      if (obj.dropTarget) {
        av.DropTarget(node, obj.dropTarget).on('Drop', obj.drop);
        av.DropTarget(children, obj.dropTarget).on('Drop', obj.drop);
      }
      
      if (obj.draggable) {
        av.Draggable(node, obj.draggable, obj.dragData).on('Drop', obj.dragEnd);
      }
      
    });
  }
  
  function load(data) {
    clear();
    loadSubset(data, container);
  }
  
  function clear() {
    container.innerHTML = '';
  }
  
  function show() {
    av.style(container, {
      opacity: 1
    });
  }
  
  function hide() {
    av.style(container, {
      opacity: 0
    });
  }
  
  /////////////////////////////////////////////////////////////////////////////

  av.ready(function () {
    if (parent) {
      av.ap(parent, container);
    }
  });
  
  return {
    on: events.on,
    load: load,
    clear: clear,
    show: show,
    hide: hide
  };
};
