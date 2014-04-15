(function() {

  var cur_video_blob = null;
  var fb_instance;

  WebFontConfig = {
    google: { families: [ 'Amatic+SC::latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();
  
  $(document).ready(function(){
    var hidden_elem_uri = document.getElementById('uri');
      hidden_elem_uri.innerHTML = document.location.href;

  });

// not the best way but it's 5am.
$("form").submit(function(e){
    var form = $(this);
    var obj = document.getElementById("username");
    var keyword = obj.value;
    var dst = document.location.href + "chat?username=" + keyword;
    
    var url_segments = document.location.href.split("/#");
    if(url_segments[1]){
       dst = url_segments[0] + "/chat?username=" + keyword + "/#" + url_segments[1];
    }
    
    $.ajax({ 
         url   : dst,
         type  : "GET",
         data  : form.serialize(), // data to be submitted
         success: function(response){
            window.location = dst; // what to do with response
         }
    });
    return false;
 });

})();
