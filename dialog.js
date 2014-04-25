(function($,window,undefined){

  var elems = $([]),
  jq_resize = $.resize = $.extend( $.resize, {} ),
  timeout_id,
  str_setTimeout = 'setTimeout',
  str_resize = 'resize',
  str_data = str_resize + '-special-event',
  str_delay = 'delay',
  str_throttle = 'throttleWindow';
  jq_resize[ str_delay ] = 250;
  jq_resize[ str_throttle ] = true;

  $.event.special[ str_resize ] = {

    setup: function() {
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

      var elem = $(this);

      elems = elems.add( elem );

      $.data( this, str_data, { w: elem.width(), h: elem.height() } );

      if ( elems.length === 1 ) {
        loopy();
      }
    },

    teardown: function() {
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

      var elem = $(this);

      elems = elems.not( elem );

      elem.removeData( str_data );

      if ( !elems.length ) {
        clearTimeout( timeout_id );
      }
    },

    add: function( handleObj ) {
      if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

      var old_handler;


      function new_handler( e, w, h ) {
        var elem = $(this),
            data = $.data( this, str_data );

        data.w = w !== undefined ? w : elem.width();
        data.h = h !== undefined ? h : elem.height();

        old_handler.apply( this, arguments );
      };

      if ( $.isFunction( handleObj ) ) {
        old_handler = handleObj;
        return new_handler;
      } else {
        old_handler = handleObj.handler;
        handleObj.handler = new_handler;
      }
    }

  };

  function loopy() {
    timeout_id = window[ str_setTimeout ](function(){
      elems.each(function(){
        var elem = $(this), width = elem.width(), height = elem.height(), data = $.data( this, str_data );

        if ( width !== data.w || height !== data.h ) {
          elem.trigger( str_resize, [ data.w = width, data.h = height ] );
        }

      });

      loopy();

    }, jq_resize[ str_delay ] );

  };

})(jQuery,this);

if(typeof QNR=="undefined"){ var QNR={}; }
$(function(){
  function dialog(html){
    var args = Array.apply(null,arguments), me = this;
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
    me.cfg = {
      onShow: function(){}
    }
    if(two && Object.prototype.toString.call(two) === "[object Function]"){
      $.extend(me.cfg, {onShow: two});
    }

    if($html ){
      me._init($html);
    }
  };

  var dl = {
    _init: function($html){
      var me = this;
      me.resized = false;
      me.doc = $(document);
      me.win = $(window);
      me.body = $('body');
      me._initDraw($html);
      me._initEvent();
      me._resize();
    },

    _initDraw: function(con){
      var me = this;
      me.dom = {};
      var backDom = $("<div></div>");
      backDom.attr('style', 'width:100%;height:100%;left: 0;top: 0;opacity:0.5;position:fixed;background-color:#000;_filter:alpha(opacity=50);z-index:6666');
      me.dom.backDOM = backDom;

      var fntDom = $("<div></div>");
      fntDom.attr('style', 'display:none;width:auto;height:auto;position:fixed;z-index:6667');
      me.dom.fntDOM = fntDom;
      fntDom.append(con);
      me.body.append(backDom).append(fntDom);

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
      me.win.bind('resize.dialog', function(e){
        me.resized = true;
        me._resize();
        e.preventDefault();
      });

      me.dom.fntDOM.bind('resize.dialog', function(e){
        me.resized = true;
        me._resize();
        e.preventDefault();
      });

      if(br.msie && br.version === '6.0'){
        me.win.scroll(function(e){
          me.resized = true;
          me._resize();
          e.preventDefault();
        })
      }
    },

    _resize: function(){
      var me = this;
      var fntDom = me.dom.fntDOM, backDom = me.dom.backDOM, br = $.browser;
      var ww = me.win.width();
      var wh = me.win.height();

      var pw = fntDom.width();
      var ph = fntDom.height();

      var leftP = (ww - pw) / 2;
      var topP = (wh - ph) / 2;
      if(!(br.msie && br.version === '6.0')){
        fntDom.css({'left':leftP+'px', 'top':topP+'px'});
      }else{
        var dh = $(me.body).outerHeight(true);
        var dw = $(me.body).outerWidth(true);//浏览器时下窗口文档body的总宽度 包括border padding margin不包括滚动条；

        var scrollLeft = me.doc.scrollLeft();
        var scrollTop = me.doc.scrollTop();
        backDom.css({'height':dh + 'px','width':dw + 'px'});
        fntDom.css({'left': leftP + scrollLeft +'px', 'top': topP + scrollTop +'px'});
      }
      me.resized = false;
    },

    show: function(){
      var me = this, dom = me.dom;
      me.cfg.onShow();
      me.resized && me._resize();
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
  QNR.Dialog = dialog;
});
