function showLoading(){
  var $loadingDiv = $('.COMPONENT-PROGRESS');
  $loadingDiv.addClass("ACTIVE").promise();
  setTimeout(function(){
    $loadingDiv.addClass("VISIBLE");
  },50);
}

$(document).ready( function(){
  $('.upload-image-button').on('click',function(){
    showLoading();
  });
  // 写真をとったら画面に反映
  $('input[name=image]').on('change', function () {

    var file, fileReader;
    if (!this.files.length) {
      return;
    }
    file = this.files[0];
    $_img = $("#message-image");
    fileReader = new FileReader();
    fileReader.onload = function(event) {
      return $('.bummybtn').css("background-image", "url("+ event.target.result +")");
    };
    return fileReader.readAsDataURL(file);

  });
});
