var fs = require('fs');

module.exports = function( event, io ){

  return {
    post: function(req, res) {
      var maxLength;
      var xx = new Buffer(0);
      req.pipe(req.busboy);
      req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + val);
        if( fieldname === "max-length" ){
          maxLength = val;
        }
      });

      req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 

        file.on('data',function(chunk){
         if(chunk) xx = Buffer.concat( [ xx ,chunk]);
        });
        file.on('end',function(){
          io.emit("chat message", { file: xx.toString('base64'), name: filename } );
          res.render('upload_completed',{ hoge: "yarimashitana" });
        });

      });

    }
  }

}
