$(function(){
    function dialog(){
        this.init();
    }

    var dl = {
        init: function(){
                  var br = $.browser;
                  if(br.msie && br.version === '6.0'){
                      var dh = $(document).height();
                      var dw = $(document).width();
                      $('.back').css('position', 'absolute').css('left', '0').css('top', '0').css('width', '100%').css('height',dh + 'px').css('width', dw + 'px');
                  }
                  resize();
              },
_initEvent: function(){
                $(window).bind('resize.dialog', function(e){
                    resize();
                    e.preventDefault();
                })
            },
resize: function(){
            var ww = $(window).width();
            var wh = $(window).height();

            var pw = $('.front').width();
            var ph = $('.front').height();		
            var leftP = (ww - pw) / 2;
            var topP = (wh - ph) / 2;		
            $('.front').css('left', leftP + 'px').css('top', topP + 'px');
        },
show: function(){
          $('.front').show();
      }
    }

    dialog.prototype = dl;
	
	window.Dialog = dialog;

})
