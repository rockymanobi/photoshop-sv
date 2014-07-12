function showLoading(){
  $('.COMPONENT-PROGRESS').addClass("ACTIVE");
}

$(document).ready( function(){
  $('.upload-image-button').on('click',function(){
    showLoading();
  }); 
});
