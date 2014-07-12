/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http');
var app = express(); //- ONLY FOR NEWER 3.x express
var server = http.createServer(app);
var io = require('socket.io').listen(server);
 
var async = require('async'),
    five = require("johnny-five"),
    raspi = require('raspi-io'),
    tank = {},
    _leftMotorFront  = 7,
    _leftMotorBack   = 11,
    _rightMotorFront = 12,
    _rightMotorBack  = 13,
    _speed = 1; //only possible when using arduino when we can use analogWrite instead of digitalWrite

//this is to use the Pi's GPIO pins:
var board = new raspi();
//var board = new five.Board({
//	io: new raspi()
//});

board.on("ready", function() {

this.pinMode(7, board.MODES.OUTPUT);
this.pinMode(11, board.MODES.OUTPUT);
this.pinMode(12, board.MODES.OUTPUT);
this.pinMode(13, board.MODES.OUTPUT);

 async.parallel([function(callback) { board.digitalWrite(_leftMotorFront, 0) },
   function(callback) { board.digitalWrite(_leftMotorBack, 0) },
   function(callback) { board.digitalWrite(_rightMotorFront, 0) },
   function(callback) { board.digitalWrite(_rightMotorBack, 0) }],
   function(err, results) {
     res.end();
   }
 );

});


// Access server through port 80
server.listen(3000);

var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies

// Set '/public' as the static folder. Any files there will be directly sent to the viewer
app.use(express.static(__dirname + '/public'));

// Set index.html as the base file
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index4.html');
});


tank.initPins = function(){

console.log("Tank ready");

};

tank.moveForward = function(){
 console.log("Forward function");
 async.parallel([function(callback) { board.digitalWrite(_leftMotorFront, _speed) },                                    
   function(callback) { board.digitalWrite(_leftMotorBack, 0) },
   function(callback) { board.digitalWrite(_rightMotorFront, _speed) },
   function(callback) { board.digitalWrite(_rightMotorBack, 0) }],
   function(err, results) {
     res.end();
   }
 );
};

tank.moveBackward = function(){
 console.log("Backward function");
 async.parallel([function(callback) { board.digitalWrite(_leftMotorFront, 0) },                                    
   function(callback) { board.digitalWrite(_leftMotorBack, _speed) },
   function(callback) { board.digitalWrite(_rightMotorFront, 0) },
   function(callback) { board.digitalWrite(_rightMotorBack, _speed) }],
   function(err, results) {
     res.end();
   }
 );
};

tank.turnLeft = function(){
 console.log("Turn left function");
 async.parallel([function(callback) { board.digitalWrite(_leftMotorFront, 0) },                                    
   function(callback) { board.digitalWrite(_leftMotorBack, _speed) },
   function(callback) { board.digitalWrite(_rightMotorFront, _speed) },
   function(callback) { board.digitalWrite(_rightMotorBack, 0) }],
   function(err, results) {
     res.end();
   }
 );
};

tank.turnRight = function(){
 console.log("Turn right function");
 async.parallel([function(callback) { board.digitalWrite(_leftMotorFront, _speed) },                                    
   function(callback) { board.digitalWrite(_leftMotorBack, 0) },
   function(callback) { board.digitalWrite(_rightMotorFront, 0) },
   function(callback) { board.digitalWrite(_rightMotorBack, _speed) }],
   function(err, results) {
     res.end();
   }
 );
};

tank.stopAllMotors = function(){
 console.log("Stop function");
 async.parallel([function(callback) { board.digitalWrite(_leftMotorFront, 0) },                                    
   function(callback) { board.digitalWrite(_leftMotorBack, 0) },
   function(callback) { board.digitalWrite(_rightMotorFront, 0) },
   function(callback) { board.digitalWrite(_rightMotorBack, 0) }],
   function(err, results) {
     res.end();
   }
 );
};


io.sockets.on('connection', function(socket) {
  
  console.log("Socket.IO connected");
  socket.emit('robot connected', { data: 'Connected' });

  socket.on('robot command', function (data) {
    //processRobotCommand (data.data);
    console.log("Received command: " + data.command);
    var command = data.command;
    if (command == 'forward') {
      tank.moveForward();
    }
    if (command == 'reverse') {
      tank.moveBackward();
    }
    if (command == 'turn-left') {
      tank.turnLeft();
    }
    if (command == 'turn-right') {
      tank.turnRight();
    }
    if (command == 'stop') {
      tank.stopAllMotors();
    }
  });


});

tank.initPins();
