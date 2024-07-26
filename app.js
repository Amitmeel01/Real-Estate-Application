// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// require('dotenv').config();
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const path = require('path');

// // Create an Express app
// const app = express();

// // Create an HTTP server and integrate it with the Express app
// const server = http.createServer(app);

// // Create a Socket.IO server and attach it to the HTTP server
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// let onlineUser = [];

// const adduser = (userId, socketId) => {
//   const userExist = onlineUser.find(user => user.userId === userId);
//   if (!userExist) {
//     onlineUser.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   onlineUser = onlineUser.filter(user => user.socketId !== socketId);
// };

// const getuser = (userId) => {
//   return onlineUser.find(user => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   socket.on("newUser", (userId) => {
//     adduser(userId, socket.id);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getuser(receiverId);
//     if (receiver) {
//       io.to(receiver.socketId).emit("getMessage", data);
//     }
//   });

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });

// // Middleware
// app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// app.use(express.json());
// app.use(cookieParser());

// // Routes
// app.use('/api/auth', require('./routes/auth.route'));
// app.use('/api/posts', require('./routes/post.route'));
// app.use('/api/test', require('./routes/test.route'));
// app.use('/api/user', require('./routes/user.route'));
// app.use('/api/chat', require('./routes/chat.route'));
// app.use('/api/message', require('./routes/message.route'));

// // Serve static files from the React app
// const frontendBuildPath = path.join(__dirname, 'frontened', 'build');
// app.use(express.static(frontendBuildPath));

// // Serve the index.html file
// app.get('*', (req, res) => {
//   const index = path.join(frontendBuildPath, 'index.html');
//   res.sendFile(index);
// });

// // Start the server
// const PORT = process.env.PORT || 8080;
// server.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });



const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Create an Express app
const app = express();

// Create an HTTP server and integrate it with the Express app
const server = http.createServer(app);

// Create a Socket.IO server and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// MongoDB Connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};

let onlineUser = [];

const adduser = (userId, socketId) => {
  const userExist = onlineUser.find(user => user.userId === userId);
  if (!userExist) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter(user => user.socketId !== socketId);
};

const getuser = (userId) => {
  return onlineUser.find(user => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log('A user connected');
  socket.on("newUser", (userId) => {
    adduser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getuser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    }
  });

  socket.on("disconnect", () => {
    console.log('User disconnected');
    removeUser(socket.id);
  });
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/posts', require('./routes/post.route'));
app.use('/api/test', require('./routes/test.route'));
app.use('/api/user', require('./routes/user.route'));
app.use('/api/chat', require('./routes/chat.route'));
app.use('/api/message', require('./routes/message.route'));

// Serve static files from the React app
const frontendBuildPath = path.join(__dirname, 'frontened', 'build');
app.use(express.static(frontendBuildPath));

// Serve the index.html file
app.get('*', (req, res) => {
  const index = path.join(frontendBuildPath, 'index.html');
  res.sendFile(index);
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, async () => {
  await connectDb();
  console.log(`Server started on port ${PORT}`);
});
