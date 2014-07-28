var express = require('express') 
var methodOverride = require('method-override');
var busboy = require('connect-busboy');
var EventEmitter = require('events').EventEmitter;
var ECT = require('ect');
var path = require('path');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);



////////// redis experiment ////////////
///////// START START START ////////////

/* 環境変数WITHOUT_REDIS=YESの場合はRedisを使わない */
/* REDIS_TO_GOURLが存在する場合はRedis to go へ接続 */
/* REDIS_TO_GOURLが存在しない場合はlocalhost:6379へ接続 */
if( process.env.WITHOUT_REDIS !== "YES" ){
  var redis = require('socket.io-redis');

  if( process.env.REDISTOGO_URL ){
    // on HEROKU
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var pubRedisClient = require("redis").createClient(rtg.port, rtg.hostname, {return_buffers: true});
    var subRedisClient = require("redis").createClient(rtg.port, rtg.hostname, {return_buffers: true});

    pubRedisClient.auth(rtg.auth.split(":")[1]);
    subRedisClient.auth(rtg.auth.split(":")[1]);

    io.adapter(redis({pubClient: pubRedisClient, subClient: subRedisClient })  );

  }else{
    // on LOCAL HOST REDIS
    var redisHost = 'localhost'; 
    var redisPort = 6379; 
    io.adapter(redis({ host: redisHost, port: redisPort }));
  }

}
////////// redis experiment ////////////
//////////// END END END ///////////////



var ev = new EventEmitter();

app.use(express.static(__dirname + '/public'));
app.use(busboy()); 
app.use(methodOverride());


var ectRenderer = ECT({ watch: true, root: __dirname + '/lib/tpls', ext : '.html' });
app.engine('html', ectRenderer.render);
app.set('views', path.join(__dirname, 'lib', 'tpls'));
app.set('view engine', 'html');

var routes = {
  upload : require( __dirname + '/lib/routes/upload' )(ev,io),
  upload2 : require( __dirname + '/lib/routes/upload2' )(ev,io)
};


/****** routing *****/
app.get('/', function(req, res){
  res.render('index');
});

app.get('/upload_completed', function(req, res){
  res.render('upload_completed');
});

app.post('/upload', routes.upload.post );
app.post('/upload2', routes.upload2.post );


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
