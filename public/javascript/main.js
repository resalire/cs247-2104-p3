// Initial code by Borui Wang, updated by Graham Roth
// For CS247, Spring 2014

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
    connect_to_chat_firebase();
    connect_webcam();
  });

  function connect_to_chat_firebase(){
    /* Include your Firebase link here!*/
    fb_instance = new Firebase("https://emcheng-cs247-p3.firebaseio.com");

    // generate new chatroom id or use existing id
    var url_segments = document.location.href.split("/#");
    if(url_segments[1]){
      fb_chat_room_id = url_segments[1];
    }else{
      fb_chat_room_id = Math.random().toString(36).substring(7);
    }
    
    $("#share_url").append("Share this url with a friend to join chat: "+ document.location.origin+"/#"+fb_chat_room_id);
    //share_url({m:"Share this url with your friend to join this chat: "+ document.location.origin+"/#"+fb_chat_room_id,c:"red"})
   //display_msg({m:"Share this url with your friend to join this chat: "+ document.location.origin+"/#"+fb_chat_room_id,c:"red"})

    // set up variables to access firebase data structure
    var fb_new_chat_room = fb_instance.child('chatrooms').child(fb_chat_room_id);
    var fb_instance_users = fb_new_chat_room.child('users');
    var fb_instance_stream = fb_new_chat_room.child('stream');
    var my_color = "#"+((1<<24)*Math.random()|0).toString(16);

    // listen to events
    fb_instance_users.on("child_added",function(snapshot){
      
      
       if (snapshot.val().name != username) {
       	 $("#partner").empty().append(snapshot.val().name);
       	 display_partner_msg({m:snapshot.val().name+" joined the room",c: snapshot.val().c});
       }
    });
    fb_instance_stream.on("child_added",function(snapshot){
 
      if (snapshot.val().name == username) { // if user's own message sent, display in own bubble
        display_own_msg(snapshot.val());
        //relay_emotion(snapshot.val());
      } else { 
        // if partner's message, display in partner speech bubble
       	// also upon partner's message, user immediately sends a video reaction blob to partner
       	display_partner_msg(snapshot.val());
       	relay_emotion(snapshot.val());
      }
    });

    // block until username is answered
    //var username = window.prompt("Welcome, warrior! please declare your name?");
    if(!username){
      username = "anonymous"+Math.floor(Math.random()*1111);
    }
    fb_instance_users.push({ name: username,c: my_color});
    $("#waiting").remove();
    if(username.slice(-1)=="/") {
    	$("#username").append(username.slice(0,-1));
    } else {
      $("#username").append(username);
    }
    // bind submission box
    $("#submission input").keydown(function( event ) {
      if (event.which == 13) {
        if(has_emotions($(this).val())){
          fb_instance_stream.push({m:$(this).val(), v:cur_video_blob, c: my_color, name:username});
        }else{
          fb_instance_stream.push({m:$(this).val(), c: my_color, name:username});
        }
        $(this).val("");
      }
    });
  }
  
  // creates a message node and appends it to the conversation
  function display_own_msg(data){
    $("#msg_sent").empty().append(data.m);
//     if(data.v){
//       // for video element
//       var video = document.createElement("video");
//       video.autoplay = true;
//       video.controls = false; // optional
//       video.loop = true;
//       video.width = 120;
// 
//       var source = document.createElement("source");
//       source.src =  URL.createObjectURL(base64_to_blob(data.v));
//       source.type =  "video/webm";
// 
//       video.appendChild(source);
// 
//       document.getElementById("conversation").appendChild(video);
//     }
  }

  function display_partner_msg(data){
    $("#msg_received").empty().append(data.m);
//     if(data.v){
//       // for video element
//       var video = document.createElement("video");
//       video.autoplay = true;
//       video.controls = false; // optional
//       video.loop = true;
//       video.width = 120;
// 
//       var source = document.createElement("source");
//       source.src =  URL.createObjectURL(base64_to_blob(data.v));
//       source.type =  "video/webm";
// 
//       video.appendChild(source);
// 
//       document.getElementById("conversation").appendChild(video);
//     }
  }
  
  // VIDEO ELEMENT
  function relay_emotion(data) {
      // wait 4 seconds for user to process partner's message, then send reaction video
   //    setTimeout(function(){
// 		if(data.v){
// 		  // for video element
// 		  var video = document.createElement("video");
// 		  video.autoplay = true;
// 		  video.controls = false; // optional
// 		  video.loop = false;
// 		  video.width = 400;
// 	
// 		  var source = document.createElement("source");
// 		  source.src =  URL.createObjectURL(base64_to_blob(data.v));
// 		  source.type =  "video/webm";
// 	
// 		  video.appendChild(source);
// 	      var video_container = document.createElement("div");
// 	      video_container.className = "webcam_mask";
// 	      video_container.appendChild(video);
// 		  document.getElementById("partner_head").replaceChild(video_container,document.getElementById("partner_head").children[0]);
// 		}
// 			
// 		
// 		
//       },4000);
//       
//       	 // after 3 second video is done, revert to default face
// 		  setTimeout(function(){
// 			 document.getElementById("partner_head").innerHTML = '<img src="images/filler_girl.png"/>';
// 		  },10000);
        
		if(data.v){
		  // for video element
		  var video = document.createElement("video");
		  video.autoplay = true;
		  video.controls = false; // optional
		  video.loop = false;
		  video.width = 400;
	
		  var source = document.createElement("source");
		  source.src =  URL.createObjectURL(base64_to_blob(data.v));
		  source.type =  "video/webm";
	
		  video.appendChild(source);
	      var video_container = document.createElement("div");
	      video_container.className = "webcam_mask";
	      video_container.appendChild(video);
		  document.getElementById("partner_head").replaceChild(video_container,document.getElementById("partner_head").children[0]);
		}
      	 // after 3 second video is done, revert to default face
		  setTimeout(function(){
			 document.getElementById("partner_head").innerHTML = '<img src="images/filler_girl.png"/>';
		  },4000);
  }



  function connect_webcam(){
    // we're only recording video, not audio
    var mediaConstraints = {
      video: true,
      audio: false
    };
    // <div id="webcam_stream" class="webcam_mask">
    
    // callback for when we get video stream from user.
    var onMediaSuccess = function(stream) {
      // create video element, attach webcam stream to video element
      var video_width= 400;
      var video_height= 400;
      //var webcam_stream = document.getElementById('webcam_stream');
      var video = document.createElement('video');
      //webcam_stream.innerHTML = "";
      

      // adds these properties to the video
      video = mergeProps(video, {
          controls: false,
          width: video_width,
          height: video_height,
          src: URL.createObjectURL(stream)
      });
      
      //webcam_stream.appendChild(video);
      	var video_container = document.createElement("div");
	      video_container.className = "webcam_mask";
	      video_container.appendChild(video);
	      video.play();
		  document.getElementById("user_head").replaceChild(video_container,document.getElementById("user_head").children[0]);
		  
		  
      // counter
      var time = 0;
      var second_counter = document.getElementById('second_counter');
      var second_counter_update = setInterval(function(){
        second_counter.innerHTML = time++;
      },1000);

      // now record stream in 5 seconds interval
      var video_container = document.getElementById('video_container');
      var mediaRecorder = new MediaStreamRecorder(stream);
      var index = 1;

      mediaRecorder.mimeType = 'video/webm';
      // mediaRecorder.mimeType = 'image/gif';
      // make recorded media smaller to save some traffic (80 * 60 pixels, 3*24 frames)
      mediaRecorder.video_width = video_width/2;
      mediaRecorder.video_height = video_height/2;

      mediaRecorder.ondataavailable = function (blob) {
          //console.log("new data available!");
          //video_container.innerHTML = "";

          // convert data into base 64 blocks
          blob_to_base64(blob,function(b64_data){
            cur_video_blob = b64_data;
          });
      };
      setInterval( function() {
        mediaRecorder.stop();
        mediaRecorder.start(4000);
      }, 4000 );
      console.log("connect to media stream!");
    }

    // callback if there is an error when we try and get the video stream
    var onMediaError = function(e) {
      console.error('media error', e);
    }

    // get video stream from user. see https://github.com/streamproc/MediaStreamRecorder
    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
  }

  // check to see if a message qualifies to be replaced with video.
  var has_emotions = function(msg){
    var options = [':)', ':(', '=)', '=(', '=]', '=[', ':[', ':]', ':-[',':-]', ':P', ':D' 
        ,':-)', ':-(', ':-P', ':-D' , 'hahah', '=P',  '=D', 'D=', 'xD', 'XD', 'DX', 'Dx', 'D:',
    	'^_^', ';)', ':3', ':*', '<3' , 'lol', 'lmao', 'haha',';-)',':-3','</3','hehe'];
    for(var i=0;i<options.length;i++){
      if(msg.indexOf(options[i])!= -1){
        return true;
      }
    }
    return false;
  }


  // some handy methods for converting blob to base 64 and vice versa
  // for performance bench mark, please refer to http://jsperf.com/blob-base64-conversion/5
  // note useing String.fromCharCode.apply can cause callstack error
  var blob_to_base64 = function(blob, callback) {
    var reader = new FileReader();
    reader.onload = function() {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(',')[1];
      callback(base64);
    };
    reader.readAsDataURL(blob);
  };

  var base64_to_blob = function(base64) {
    var binary = atob(base64);
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    var blob = new Blob([view]);
    return blob;
  };

})();
