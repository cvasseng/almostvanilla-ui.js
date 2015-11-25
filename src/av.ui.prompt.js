(function () {
  var win = av.Window({
        title: '',
        width: 300,
        height: 120,
        canResize: false,
        canMove: false,
        canDock: false,
        canClose: false
      }),
      txt = av.cr('div'),
      inp = av.cr('input', 'av-stretch'),
      ok = av.cr('button', 'av-btn av-btn-ok', 'OK'),
      ca = av.cr('button', 'av-btn av-btn-cancel', 'CANCEL'),
      cb = false,
      cbs = false
  ;

  av.ap(win.body,
    txt,
    inp,
    av.cr('br'),
    av.cr('br'),
    ok,
    ca
  );
  
  av.on(ca, 'click', win.hide);

  av.Prompt = function (title, value, fn) {
    if (av.isFn(value) && av.isNull(fn)) {
      fn = value;
      value = '';
    }
    txt.innerHTML = title;
    //win.setTitle(title);
    
    inp.value = '';
    
    if (cb) {
      cb();
    }
    
    if (cbs) cbs();
    
    function doOk() {
      if (av.isFn(fn)) {
        fn(inp.value);
      }
      win.hide();
    }
    
    cb = av.on(ok, 'click', doOk);
    cbs = av.on(inp, 'keyup', function (e) {
      if (e.keyCode === 13) {
        doOk();
      }
    });
    
    win.show(true);
    inp.focus();
  };
  
  win.hide();

})();