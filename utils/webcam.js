var video = document.querySelector('#videoElement');

function RaloadWebcam(video) {
    var stream = video.srcObject;
    if (navigator.mediaDevices.getUserMedia) {
        if(video == true && stream == null) {
            var tracks = stream.getTracks();
            tracks.play();
        }
    }
}

function StartWebcam(video) {
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function (stream) {
            video.srcObject = stream;
          })
          .catch(function (err0r) {
            document.getElementById('UserCamtext').innerHTML = 'WebCam not found'
          });
      }
}

function StopWebcam(e) {
    var stream = video.srcObject;
    if(stream == null || stream == undefined) {
     document.getElementById('UserCamtext').innerHTML = 'WebCam not started';
     return
   }
   var tracks = stream.getTracks();
   
    for (var i = 0; i < tracks.length; i++) {
       var track = tracks[i];
       track.stop();
    }
   
     video.srcObject = null;
}

module.exports = {
    StartWebcam,
    StopWebcam,
    RaloadWebcam
}