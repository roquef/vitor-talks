var five = require("johnny-five");
var board = new five.Board();
var left_switch, up_switch, right_switch, down_switch;
var left_key, up_key, right_key, down_key;
var io = require("socket.io")(81);
var express = require("express");
var app = express();
var http = require("http").Server(app);

board.on("ready", function() {
  left_switch = new five.Button({ pin: 7, invert: true });
  up_switch = new five.Button({ pin: 8, invert: true });
  right_switch = new five.Button({ pin: 12, invert: true });
  down_switch = new five.Button({ pin: 13, invert: true });

  bindEvents(left_switch, "left");
  bindEvents(up_switch, "up");
  bindEvents(right_switch, "right");
  bindEvents(down_switch, "down");

  potentiometer = new five.Sensor({
    pin: "A0",
    freq: 700
  });

  board.repl.inject({
    pot: potentiometer
  });

  potentiometer.on("data", function() {
    console.log(this.value);
    io.emit("potentiometer", { value: this.value });
  });
});

function bindEvents(sw, key) {
  sw
    .on("hit", function() {
      console.log("hit " + key);
    })
    .on("hold", function() {
      console.log(key);
      console.log("hold " + key);
    })
    .on("release", function() {
      console.log(key);
      io.emit("release", { key: key });
    });
}

app.use(express.static("public"));
http.listen(3000, function() {
  console.log("listening on *:3000");
});
