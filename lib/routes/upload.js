var fs;
var base64 = require('base64-stream');

fs = require('fs');

module.exports = function( event, io ){

  return {

    post: function(req, res) {
      var fstream;
      var maxLength;
      req.pipe(req.busboy);
      req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + val);
        if( fieldname === "max-length" ){
          maxLength = val;
        }
      });



      req.busboy.on('file', function (fieldname, file, filename) {
          console.log("Uploading: " + filename); 
          fstream = fs.createWriteStream(__dirname + '/../../upload/' + filename);

          file.pipe(fstream);

          var xx = new Buffer(0);
          file.on('data',function(chunk){
           console.log('data');
           console.log(xx.length);
           if(chunk) xx = Buffer.concat( [ xx ,chunk]);
          });
          file.on('end',function(){
            io.emit("chat message", { file: xx.toString('base64'), name: filename } );
          });

          fstream.on('close', function () {
            res.redirect('back');
          });
          

      });
    }
  }

}
