(function(win, doc){
    function dialog(){
        this.init();
    }

    var dl = {
        init: function(){
                  var me = this, br = $.browser;
                  if(br.msie && br.version === '6.0'){
                      var dh = $(doc).height();
                      var dw = $(doc).width();
                      $('.back').css({'position':'absolute', 'left':'0', 'top':'0', 'width':'100%', 'height':dh+'px', 'width':dw+'px'});
                  }
                  me._initEvent();
                  me._resize();
              },
        _initEvent: function(){
                        var me = this;
                        $(win).bind('resize.dialog', function(e){
                            me._resize();
                            e.preventDefault();
                        });
                    },
        _resize: function(){
                    var ww = $(win).width();
                    var wh = $(win).height();

                    var pw = $('.front').width();
                    var ph = $('.front').height();
                    var leftP = (ww - pw) / 2;
                    var topP = (wh - ph) / 2;
                    $('.front').css({'left':leftP+'px', 'top':topP+'px'});
                },
        show: function(){
                  $('.front').show();
              }
    }

    dialog.prototype = dl;
	
	win.Dialog = dialog;

})(window, document);
