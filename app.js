/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http');
var app = express(); //- ONLY FOR NEWER 3.x express
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var dualShock = require('dualshock-controller');
 
var async = require('async'),
    five = require("johnny-five"),
    raspi = require('raspi-io'),
    tank = {},
//  GPIO pins are 7, 11, 12, 13, 15, 16, 18 22
    _leftMotorFront  = 11,
    _leftMotorBack   = 12,
    _rightMotorFront = 13,
    _rightMotorBack  = 15,
/*
    _leftMotorFront  = 7,
    _leftMotorBack   = 11,
    _rightMotorFront = 12,
    _rightMotorBack  = 13,
*/
    _turnTime = 100,
    _speed = 1; //only possible when using arduino when we can use analogWrite instead of digitalWrite

//this is to use the Pi's GPIO pins:
var board = new raspi();
//var board = new five.Board({
//	io: new raspi()
//});

board.on("ready", function() {

this.pinMode(_leftMotorFront, board.MODES.OUTPUT);
this.pinMode(_leftMotorBack, board.MODES.OUTPUT);
this.pinMode(_rightMotorFront, board.MODES.OUTPUT);
this.pinMode(_rightMotorBack, board.MODES.OUTPUT);

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
//server.listen(3000);
server.listen(80);

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

tank.turnLeftShort = function(){
 tank.turnLeft();
 setTimeout(tank.stopAllMotors, _turnTime);
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

tank.turnRightShort = function(){
 tank.turnRight();
 setTimeout(tank.stopAllMotors, _turnTime);
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
      tank.turnLeftShort();
    }
    if (command == 'turn-right') {
      tank.turnRightShort();
    }
    if (command == 'stop') {
      tank.stopAllMotors();
    }
  });


});

  //pass options to init the controller.
  var controller = dualShock(
      {
          //you can use a ds4 by uncommenting this line.
          //config: "dualshock4-generic-driver",
          //if using ds4 comment this line.
          config : "dualShock3",
          //smooths the output from the acelerometers (moving averages) defaults to true
          accelerometerSmoothing : true,
          //smooths the output from the analog sticks (moving averages) defaults to false
          analogStickSmoothing : false
      });

  //make sure you add an error event handler
  controller.on('error', function(data) {
    console.log("Controller has done a whoopsie")
    //...someStuffDidNotWork();
  });

  //add event handlers:
  controller.on('left:move', function(data) {
    //...doStuff();
  });
  controller.on('right:move', function(data) {
    //...doStuff();
  });

  controller.on('connected', function(data) {
    console.log("dualShock3 connected")
  });
  controller.on('dpadUp:press', function (data) {
    tank.moveForward();
  });
  controller.on('dpadUp:release', function (data) {
    tank.stopAllMotors();
  });

  controller.on('dpadLeft:press', function (data) {
    tank.turnLeft();
  });
  controller.on('dpadLeft:release', function (data) {
    tank.stopAllMotors();
  });

  controller.on('dpadDown:press', function (data) {
    tank.moveBackward();
  });
  controller.on('dpadDown:release', function (data) {
    tank.stopAllMotors();
  });

  controller.on('dpadRight:press', function (data) {
    tank.turnRight();
  });
  controller.on('dpadRight:release', function (data) {
    tank.stopAllMotors();
  });


  //controller status
  //as of version 0.6.2 you can get the battery %, if the controller is connected and if the controller is charging
  controller.on('battery:change', function (value) {
       //...doStuff();
  });
  controller.on('connection:change', function (value) {
       console.log("Connection state changed")
  });
  controller.on('charging:change', function (value) {
       //...doStuff();
  });

  //connect the controller
  controller.connect();




tank.initPins();
