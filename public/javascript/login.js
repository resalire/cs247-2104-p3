(function() {

  var cur_video_blob = null;
  var fb_instance;

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
