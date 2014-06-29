/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    sio = require('socket.io'),
    crypto = require('crypto'),
    async = require('async'),
    five = require("johnny-five"),
    tank = {},
    _leftMotorFront  = 6,
    _leftMotorBack   = 7,
    _rightMotorFront = 8,
    _rightMotorBack  = 9,
    _speed = 180,
    app = module.exports = express.createServer(),
    io = sio.listen(app);


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


// Configuration
app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

app.listen(3000);
console.log('Listening %d in %s mode', app.address().port, app.settings.env);

tank.initPins = function(){

//  async.parallel([
//    board.analogWrite(_leftMotorFront, 0),
//    board.analogWrite(_leftMotorBack, 0),
//    board.analogWrite(_rightMotorFront, 0),
//    board.analogWrite(_rightMotorBack, 0)
//  ]);

};

tank.moveForward = function(){
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
 async.parallel([function(callback) { board.analogWrite(_leftMotorFront, 0) },                                    
   function(callback) { board.analogWrite(_leftMotorBack, 0) },
   function(callback) { board.analogWrite(_rightMotorFront, _speed) },
   function(callback) { board.analogWrite(_rightMotorBack, 0) }],
   function(err, results) {
     res.end();
   }
 );
};

tank.turnRight = function(){
 async.parallel([function(callback) { board.analogWrite(_leftMotorFront, _speed) },                                    
   function(callback) { board.analogWrite(_leftMotorBack, 0) },
   function(callback) { board.analogWrite(_rightMotorFront, 0) },
   function(callback) { board.analogWrite(_rightMotorBack, 0) }],
   function(err, results) {
     res.end();
   }
 );
};

tank.stopAllMotors = function(){
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
  
  socket.on('keydown', function(dir) {
    switch(dir){
     case 'up':
        tank.moveForward();
        break;
      case 'down':
        tank.moveBackward();
        break;
      case 'left':
        tank.turnLeft();
        break;
      case 'right':
        tank.turnRight();
        break;
    }
  });

  socket.on('keyup', function(dir){
    tank.stopAllMotors();
  });

});

tank.initPins();
