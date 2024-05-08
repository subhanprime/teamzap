require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http');
const PORT = process.env.PORT || 3005;
const bodyParser = require("body-parser");
const apiRoutes = require("./routes/index");
const connectDB = require('./config/connectDB.js');
const corsOptions = require('./config/corsOptions.js');
const ErrorHandler = require('./errors/errorHandler.js');
const sendSuccessResponse = require('./middleware/successResponse.js');
const socketsHandlers = require("./sockets/sockets.js");
const { Server } = require('socket.io');
connectDB(process.env.DATABASE_URL);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(sendSuccessResponse);
app.use("/", apiRoutes);
app.use("*", ErrorHandler);

const server = http.createServer(app);
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: corsOptions,
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => socketsHandlers(socket, io));

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});