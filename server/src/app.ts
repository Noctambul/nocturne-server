import express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import e from "express";
import SocketRecorder from "./socket-recorder";

const cors = require("cors");
const app = express();

app.use(cors());

app.set("port", process.env.PORT || 3000);

let http = require("http").Server(app);
// set up socket.io and bind it to our http server.
let io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:1234",
    credentials: true,
  },
});

io.on("connection", function (socket: any) {
  const socketObject = new SocketRecorder(socket);
});

const server = http.listen(3000, function () {
  console.log("listening on *:3000");
});
