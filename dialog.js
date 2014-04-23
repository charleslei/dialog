(function(win, doc){
  function dialog(html){
    html = html || '';
    if(!html){
      return;
    }
    var $html = $(html);
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
        //TODO:100% or ?
        me.dom.backDOM.css({'position':'absolute'});
      }
    },
    _initEvent: function(){
      var me = this;
      $(win).bind('resize.dialog', function(e){
        me._resize();
        e.preventDefault();
      });
    },

    _resize: function(){
      var me = this;
      var fntDom = me.dom.fntDOM, br = $.browser;
      if(!(br.msie && br.version === '6.0')){
        var ww = $(win).width();
        var wh = $(win).height();

        var pw = fntDom.width();
        var ph = fntDom.height();

        var leftP = (ww - pw) / 2;
        var topP = (wh - ph) / 2;
        fntDom.css({'left':leftP+'px', 'top':topP+'px'});
      }else{
        var dh = $(doc).height();
        var dw = $(doc).width();
        //TODO:width=100% or ?
        me.dom.backDOM.css({'height':dh+'px','width':dw+'px'});
        //TODO: front;
      }
    },

    show: function(){
      var me = this, dom = me.dom;
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
