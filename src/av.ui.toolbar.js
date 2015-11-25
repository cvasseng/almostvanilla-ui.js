/******************************************************************************

Maply.js 

Copyright 2015, Chris Vasseng.
All rights reserved.

******************************************************************************/

av.Toolbar = function (meta, parent) {
  var container = av.cr('div', 'av-toolbar'),
      hint = av.cr('div', 'av-toolbar-hint av-transition-opacity', 'hello world'),
      ht = 0
  ;

  (meta || []).forEach(function (group, i) {
    var groupContents = [];
    
    
    
    Object.keys(group || {}).forEach(function (key) {
      var obj = group[key],
          icon = av.cr('span', 'icon fa fa-' + key)
      ;
      
      groupContents.push({
        obj: obj,
        icon: icon
      });
      
      if (obj.hotkey) {
       
        obj.hint = obj.hint ? obj.hint + ' - Hotkey: ' + obj.hotkey : 'Hotkey: ' + obj.hotkey;
      }
      
      if (obj.hint) {
        
        av.on(icon, 'mouseenter', function (e) {
          hint.innerHTML = av.tinject(obj.hint);
          
          clearTimeout(ht);
          
          ht = setTimeout(function () {
            av.style(hint, {
              display: '',
              left: (e.clientX - (av.size(hint).w / 2)) + 'px',
              top: 8 + av.pos(icon).y + av.size(icon).h + 'px',
              opacity: 1
            });          
          }, 700);         
        });
        
        av.on(icon, 'mouseleave', function (e) {
          clearTimeout(ht);
          av.style(hint, {
            display: 'none',
            opacity: 0
          });
        });
        
      }
      
      if (key.indexOf('-') === 0 || key === '-') {
        av.ap(container, av.cr('span', 'divider'));
        return;
      }
      
      
      function click() {
        if (obj.checkable) {
          obj.checked = !obj.checked;
          if (obj.checked) {
            groupContents.forEach(function (other) {
              if (obj !== other.obj && other.obj.checkable && other.obj.checked) {
                if (av.isFn(other.obj.checkstate)) {
                  other.obj.checkstate(false);
                }
                other.obj.checked = false;
                other.icon.className = other.icon.className.replace(' checked', '');
              }
            });
            icon.className += ' checked';
          } else {
            icon.className = icon.className.replace(' checked', '');
          }
          if (av.isFn(obj.checkstate)) {
            obj.checkstate(obj.checked);
          }
        }
      }
      
      av.on(icon, 'click', function () {
        click(obj);
         if (av.isFn(obj.click)) {
          obj.click(obj);
        }
      });
           
      if (obj.hotkey) {
        av.ready(function () {
          av.registerHotkey(obj.hotkey,  function () {
            if (obj.checkable && !obj.checked) {
              click();             
            } else if (!obj.checkable) {
              click();              
            }
            if (av.isFn(obj.click)) {
              obj.click(obj);
            }
          });          
        });
      }
    
      if (obj.checkable && obj.checked) {
        icon.className += ' checked';
      }
    
      av.ap(container, icon);
    });
    
    if (i < meta.length - 1) {
      av.ap(container, av.cr('span', 'divider'));      
    }
    
  });

  av.ready(function () {
   if (av.isStr(parent)) parent = document.getElementById(parent);  
    
   av.ap(parent || document.body, container); 
   av.ap(document.body, hint);  
  });
};
