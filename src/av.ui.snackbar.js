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
  var snackBarNode = av.cr('div', 'av-snackbar av-transition noeslection'),
      showing = false,
      timer = 0
  ;
  
  function hider() {
    av.style(snackBarNode, {
      opacity: 0,
      pointerEvents: 'none',
      bottom: '-48px'
    })
    showing = false;    
  }
  
  av.on(snackBarNode, 'mouseover', function () {
    if (showing) {
      clearTimeout(timer);      
    }
  });
  
  av.on(snackBarNode, 'mouseout', function () {
    if (showing) {
      timer = setTimeout(hider, 1000);
    }  
  });
  
  av.SnackBar = function (text, action, fn) {
     var title = av.cr('span', '', (text || '').toUpperCase()),
         action = av.cr('span', 'av-transition action', action || '')
             
    snackBarNode.innerHTML = '';
    
    av.style(snackBarNode, {
      opacity: 1,
      pointerEvents: 'auto',
      bottom: '20px'
    });
  
    clearTimeout(timer);
   
    timer = setTimeout(hider, 3500);
  
    av.on(action, 'click', fn);
  
    av.ap(snackBarNode, action, title);
    
    showing = true;
  };

  //Append when ready
  av.ready(function() {
    av.ap(document.body, snackBarNode);
  });

})();
