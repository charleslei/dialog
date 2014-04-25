(function(win, doc){
  function dialog(html){
    var args = Array.apply(null,arguments);
    var $html;
    if(args.length === 0) return;

    var one = args[0];
    if(one instanceof jQuery){
      $html = one;
    } else if(Object.prototype.toString.call(one) === '[object String]'){
      $html = $(one);
    }else{
      return;
    }

    var two = args[1];
    this.cfg = {
      onShow: function(){}
    }
    if(two && Object.prototype.toString.call(two) === "[object Function]"){
      $.extend(this.cfg, {onShow: two});
    }

    if($html && $html.length > 0){
      this._init($html);
    }
  };

  var dl = {
    _init: function($html){
      var me = this;
      me._initEvent();
      me._initDraw($html);
      me._resize();
    },

    _initDraw: function(con){
      var me = this;
      me.dom = {};
      var backDom = $("<div></div>");
      backDom.attr('style', 'width:100%;height:100%;left: 0;top: 0;opacity:0.5;position:fixed;background-color:#000;filter:alpha(opacity=50);');
      this.dom.backDOM = backDom;

      var fntDom = $("<div></div>");
      fntDom.attr('style', 'display:none;width:auto;height:auto;background-color:#FFF;position:fixed;');
      this.dom.fntDOM = fntDom;
      fntDom.append(con);
      $('body').append(backDom).append(fntDom);

      //IE6
      me._drawIE6();
    },
    _drawIE6: function(){
      var me = this, br = $.browser;
      if(br.msie && br.version === '6.0'){
        me.dom.backDOM.css({'position':'absolute'});
        me.dom.fntDOM.css({'position':'absolute'});
        me._resize();
      }
    },
    _initEvent: function(){
      var me = this, br = $.browser;;
      $(win).bind('resize.dialog', function(e){
        me._resize();
        e.preventDefault();
      });


      if(br.msie && br.version === '6.0'){
        $(window).scroll(function(e){
          me._resize();
          e.preventDefault();
        })
      }
    },

    _resize: function(){
      var me = this;
      var fntDom = me.dom.fntDOM, backDom = me.dom.backDOM, br = $.browser;
      var ww = $(win).width();
      var wh = $(win).height();

      var pw = fntDom.width();
      var ph = fntDom.height();

      var leftP = (ww - pw) / 2;
      var topP = (wh - ph) / 2;
      if(!(br.msie && br.version === '6.0')){
        fntDom.css({'left':leftP+'px', 'top':topP+'px'});
      }else{
        var dh = $(document.body).outerHeight(true);
        var dw = $(document.body).outerWidth(true);//浏览器时下窗口文档body的总宽度 包括border padding margin不包括滚动条；

        var scrollLeft = $(document).scrollLeft();
        var scrollTop = $(document).scrollTop();
        backDom.css({'height':dh + 'px','width':dw + 'px'});
        fntDom.css({'left': leftP + scrollLeft +'px', 'top': topP + scrollTop +'px'});
      }
    },

    show: function(){
      var me = this, dom = me.dom;
      me.cfg.onShow();
      dom.fntDOM.show();
      dom.backDOM.show();
    },

    hide: function(){
      var me = this, dom = me.dom;
      dom.fntDOM.hide();
      dom.backDOM.hide();
    },

    remove: function(){
      var me = this;
      me.dom.fntDOM.remove();
      me.backDOM.remove();

    }
  };

  dialog.prototype = dl;

  win.Dialog = dialog;

})(window, document);
