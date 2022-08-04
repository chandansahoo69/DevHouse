// setting the dotenv file
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
//initializing express module here
const app = express();
//connecting the database here
const DbConnect = require("./database");
//setting the routes here
const routes = require("./routes/routes");
//setting the cors module
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ACTIONS = require("./actions");
//create a server and pass the app to connect with one server
const server = require("http").createServer(app);

//setting the cookies to use it in our project
app.use(cookieParser());

//set the webSocket server
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST"],
  },
});

const corsOption = {
  credentials: true,
  origin: [process.env.FRONT_URL],
};

app.use(cors(corsOption));
app.use("/storage", express.static("storage"));

//initializing the port
const PORT = process.env.PORT || 5500;
//init the database
DbConnect();
app.use(express.json({ limit: "8mb" }));

// setting the routes
app.use(routes);

//Sockets connetion

const socketUserMapping = {
  // this object will map all the socket id with user id
};

io.on("connection", (socket) => {
  //when connect a user
  //   console.log("new connection ", socket.id);
  //this is a event which will be sent to everyone over there connect to the server
  //   io.emit(
  //     "Hello this is socket server",
  //     "User ",
  //     socket.id,
  //     "joined in the room"
  //   );

  //listen the event
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMapping[socket.id] = user;

    // io.sockets.adapter.rooms.get(roomId) will return a map so convert it to array
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      //send an event to all the client available there i.e a new user joined to the room
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      //send an event to ourself as we are not connected in the room
      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId],
      });
    });

    //now we are creating a room if not exist then join into the room
    socket.join(roomId);
    // console.log("All user in the room", clients);
    // console.log(clients);
  });

  //handle relay ice
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    //we have to forward the peerId to next client to be connected
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  //handle relay SDP(session description)
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  });

  //Handle mute/unmute
  socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
    //get all the clients
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    //iterate over all the clients and send the socketId to all user
    clients.forEach((clientId) => {
      //forward the mute event to all other users
      io.to(clientId).emit(ACTIONS.MUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  //unmute user
  socket.on(ACTIONS.UN_MUTE, ({ roomId, userId }) => {
    //get all the clients
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    //iterate over all the clients and send the socketId to all user
    clients.forEach((clientId) => {
      //forward the mute event to all other users
      io.to(clientId).emit(ACTIONS.UN_MUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  socket.on(ACTIONS.MUTE_INFO, ({ userId, roomId, isMute }) => {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      if (clientId !== socket.id) {
        io.to(clientId).emit(ACTIONS.MUTE_INFO, {
          userId,
          isMute,
        });
      }
    });
  });

  //Leaving the room
  const leaveRoom = ({ roomId }) => {
    //get all the rooms
    const { rooms } = socket;

    //remove all the clients
    Array.from(rooms).forEach((roomId) => {
      //get all the clients
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

      //remove all the clients
      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMapping[socket.id]?.id,
        });

        //remove yourself from all clients
        // socket.emit(ACTIONS.REMOVE_PEER, {
        //   peerId: clientId,
        //   userId: socketUserMapping[clientId]?.id,
        // });
      });

      //remove youself from the room
      socket.leave(roomId);
      //   console.log("Remaining user in the room", rooms, "are : ", clients);
    });

    //delete from the map also
    delete socketUserMapping[socket.id];
  };
  //if someone leave the room
  socket.on(ACTIONS.LEAVE, leaveRoom);

  //if someone close the browser
  socket.on("disconnecting", leaveRoom);
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
