const mongoose = require("mongoose");
const { Server } = require("socket.io");
require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 🎇 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./index");
// const {
//   addNewUser,
//   removeUser,
//   getUserById,
//   getUserByRole,
// } = require("./utils/onlineUsersHandler");

const DB = process.env.DATABASE_ATLAS;

mongoose.set("strictQuery", false);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB connected.!"));

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// io.on("connection", (socket) => {
//   socket.on("newUser", ({ userId, userRole }) => {
//     addNewUser(userId, userRole, socket.id);
//   });

//   socket.on(
//     "sendNotification",
//     ({ receiverId, notificationText, notificationRead, forAdmin = false }) => {
//       if (forAdmin === false) {
//         const receiver = getUserById(receiverId);
//         if (receiver) {
//           io.to(receiver.socketId).emit("getNotification", {
//             notificationText,
//             notificationRead,
//           });
//         }
//       } else {
//         const receivers = getUserByRole();
//         receivers.map((r) => {
//           return io.to(r.socketId).emit("getNotification", {
//             notificationText,
//             notificationRead,
//           });
//         });
//       }
//     }
//   );

//   socket.on("disconnect", () => {
//     removeUser(socket.id);
//   });
// });

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 🎇 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
