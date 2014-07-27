var express = require('express') 
var methodOverride = require('method-override');
var busboy = require('connect-busboy');
var EventEmitter = require('events').EventEmitter;
var ECT = require('ect');
var path = require('path');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var redis = require('socket.io-redis');


var redisHost = ( true )? 'redis://redistogo:6f700421ae8c08792b422fa4ff002e20@hoki.redistogo.com' : 'localhost'; 
var redisPort = ( true  )? 9119 : 6379; 

io.adapter(redis({ host: redisHost, port: redisPort }));

var ev = new EventEmitter();

app.use(express.static(__dirname + '/public'));
app.use(busboy()); 
app.use(methodOverride());


var ectRenderer = ECT({ watch: true, root: __dirname + '/lib/tpls', ext : '.html' });
app.engine('html', ectRenderer.render);
app.set('views', path.join(__dirname, 'lib', 'tpls'));
app.set('view engine', 'html');

var routes = {
  upload : require( __dirname + '/lib/routes/upload' )(ev,io)
};

/****** routing *****/
app.get('/', function(req, res){
  res.render('index');
});

app.get('/upload_completed', function(req, res){
  res.render('upload_completed');
});

app.post('/upload', routes.upload.post );


/****** io ******/
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});


var port = Number(process.env.PORT || 3000);
http.listen(port, function(){

  require('dns').lookup( require('os').hostname(), function( err, add, fam){
    console.log( 'listening on ' + add + ':' + port );
  });
  
});
