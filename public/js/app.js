function showLoading(){
  $('.COMPONENT-PROGRESS').addClass("ACTIVE");
}

$(document).ready( function(){
  $('.upload-image-button').on('click',function(){
    showLoading();
  });
  $('input[name=image]').on('change', function () {
  	var v = this.value;
  	$('.inputfile_wrap').addClass('selected');
  	$('.bummybtn').css("background-image", "url("+v+")");
  })
});
