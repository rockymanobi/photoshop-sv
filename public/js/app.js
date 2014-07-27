function showLoading(){
  var $loadingDiv = $('.COMPONENT-PROGRESS');
  $loadingDiv.addClass("ACTIVE").promise();
  setTimeout(function(){
    $loadingDiv.addClass("VISIBLE");
  },50);
}

function reflectImage(targetSelector, file){

  console.log(123);
  var fileReader = new FileReader();
  fileReader.onload = function(event) {
    return $(targetSelector).css("background-image", "url("+ event.target.result +")");
  };
  return fileReader.readAsDataURL(file);
}

$(document).ready( function(){
  $('.upload-image-button').on('click',function(){
    showLoading();
  });
  // 写真をとったら画面に反映
  $('input[name=image]').on('change', function () {

    console.log(this);
    if (!this.files.length) {
      return;
    }
    var file = this.files[0];

    // file size validation
    var fileSizeMB = file.size / 1024 / 1024;
    if ( fileSizeMB <= 3 ) { 
    }else{
      alert( "デカい！");
      return; 
    }

    // OKだったら反映
    reflectImage( '.bummybtn', file );
  });
});
