/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http');
var app = express(); //- ONLY FOR NEWER 3.x express
////var app = express.createServer();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
 
var    crypto = require('crypto'),
    async = require('async'),
    five = require("johnny-five"),
    tank = {},
    _leftMotorFront  = 6,
    _leftMotorBack   = 7,
    _rightMotorFront = 8,
    _rightMotorBack  = 9,
    _speed = 180;

var bodyParser = require('body-parser');

board = five.Board();

board.on("ready", function() {

 this.pinMode(6, five.Pin.PWM);
 this.pinMode(7, five.Pin.PWM);
 this.pinMode(8, five.Pin.PWM);
 this.pinMode(9, five.Pin.PWM);

 async.parallel([function(callback) { board.analogWrite(_leftMotorFront, 0) },
   function(callback) { board.analogWrite(_leftMotorBack, 0) },
   function(callback) { board.analogWrite(_rightMotorFront, 0) },
   function(callback) { board.analogWrite(_rightMotorBack, 0) }],
   function(err, results) {
     res.end();
   }
 );

});


// Access server through port 80
server.listen(3000);


//http.listen(3000, function(){
//  console.log('Starting server, listening on *:3000');
//});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies

// Set '/public' as the static folder. Any files there will be directly sent to the viewer
app.use(express.static(__dirname + '/public'));

// Set index.html as the base file
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


tank.initPins = function(){

//  async.parallel([
//    board.analogWrite(_leftMotorFront, 0),
//    board.analogWrite(_leftMotorBack, 0),
//    board.analogWrite(_rightMotorFront, 0),
//    board.analogWrite(_rightMotorBack, 0)
//  ]);

};

tank.moveForward = function(){
 console.log("Forward function");
 async.parallel([function(callback) { board.analogWrite(_leftMotorFront, _speed) },                                    
   function(callback) { board.analogWrite(_leftMotorBack, 0) },
   function(callback) { board.analogWrite(_rightMotorFront, _speed) },
   function(callback) { board.analogWrite(_rightMotorBack, 0) }],
   function(err, results) {
     res.end();
   }
 );
};

tank.moveBackward = function(){
 console.log("Backward function");
 async.parallel([function(callback) { board.analogWrite(_leftMotorFront, 0) },                                    
   function(callback) { board.analogWrite(_leftMotorBack, _speed) },
   function(callback) { board.analogWrite(_rightMotorFront, 0) },
   function(callback) { board.analogWrite(_rightMotorBack, _speed) }],
   function(err, results) {
     res.end();
   }
 );
};

tank.turnLeft = function(){
 console.log("Turn left function");
 async.parallel([function(callback) { board.analogWrite(_leftMotorFront, 0) },                                    
   function(callback) { board.analogWrite(_leftMotorBack, _speed) },
   function(callback) { board.analogWrite(_rightMotorFront, _speed) },
   function(callback) { board.analogWrite(_rightMotorBack, 0) }],
   function(err, results) {
     res.end();
   }
 );
};

tank.turnRight = function(){
 console.log("Turn right function");
 async.parallel([function(callback) { board.analogWrite(_leftMotorFront, _speed) },                                    
   function(callback) { board.analogWrite(_leftMotorBack, 0) },
   function(callback) { board.analogWrite(_rightMotorFront, 0) },
   function(callback) { board.analogWrite(_rightMotorBack, _speed) }],
   function(err, results) {
     res.end();
   }
 );
};

tank.stopAllMotors = function(){
 console.log("Stop function");
 async.parallel([function(callback) { board.analogWrite(_leftMotorFront, 0) },                                    
   function(callback) { board.analogWrite(_leftMotorBack, 0) },
   function(callback) { board.analogWrite(_rightMotorFront, 0) },
   function(callback) { board.analogWrite(_rightMotorBack, 0) }],
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
