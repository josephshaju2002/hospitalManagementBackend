// 7. import .env
require("dotenv").config();

// 1. import express
const express = require("express");

// 5. import cors
const cors = require("cors");

// NEW: http & socket.io
const http = require("http");
const { Server } = require("socket.io");

// 8. import router
const router = require("./router");

// 11. import connection file
require("./db/connection");

const ChatMessage = require("./model/chatMessageModel");


// 2. create express app
const HospitalServer = express();

// 3. create http server
const server = http.createServer(HospitalServer);

// 4. create socket server
const io = new Server(server, {
  cors: {
    origin: "*", // frontend access
  },
});

// 6. tell server to use cors
HospitalServer.use(cors());

// 10. parse request
HospitalServer.use(express.json());

// 9. tell server to use router
HospitalServer.use(router);

// serve uploaded images
HospitalServer.use("/imgUploads", express.static("./imgUploads"));

/* ================= SOCKET.IO LOGIC ================= */
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // JOIN ROOM
  socket.on("joinRoom", async ({ appointmentId }) => {
    socket.join(appointmentId);

    const messages = await ChatMessage.find({ appointmentId })
      .sort({ createdAt: 1 });

    socket.emit("chatHistory", messages);
  });

  // SEND MESSAGE
  socket.on("sendMessage", async (data) => {
    const role =
    data.sender.role === "user" ? "patient" : data.sender.role;
    const savedMessage = await ChatMessage.create({
      appointmentId: data.appointmentId,
      senderId: data.sender._id,
      senderRole: data.sender.role,
      message: data.message,
    });

    io.to(data.appointmentId).emit("receiveMessage", savedMessage);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// 3. create port
const PORT = process.env.PORT || 3000;

// 4. listen using HTTP server (IMPORTANT)
server.listen(PORT, () => {
  console.log(`HospitalServer running on port ${PORT}`);
});








// 7. import .env
// require("dotenv").config()

// 1.import express
// const express = require("express")

// 5. import cors
// const cors = require("cors")

// 8. import router
// const router = require("./router")

// 11. import connection file
// require("./db/connection")

// 2.create server
// const HospitalServer = express()

// 6. tell server to use cors
// HospitalServer.use(cors())

// 10. parse request
// HospitalServer.use(express.json())

// 9. tell server to use router
// HospitalServer.use(router)

// to make images visible using static
// HospitalServer.use("/imgUploads",express.static("./imgUploads"))

// 3.create port 
// const PORT = 3000

// 4. Tell server to listen
// HospitalServer.listen(PORT,()=>{
//     console.log(`HospitalServer Started Successfully at ${PORT}`);
    
// })