const express = require("express");
const app = express();
const colors = require("colors");
require("dotenv").config();
const cors = require("cors");
const socketio = require("socket.io");

// DataBase Connection
const connectDb = require("./config/connectDb");
connectDb();

// middlewares
const { errorHandler, routeNotFound } = require('./middleware/errorMiddleware')

// Constants
const { Frontend_URL } = require('./utils/constants'); 

// Routes
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');


app.use(express.json());
app.use(cors());
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res)=> {
  res.json({message: 'hi from server'})
})

// Error handling routes
app.use(routeNotFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT || 7000, () => {
 console.log(
    colors.brightMagenta(`\nServer is UP on PORT ${process.env.PORT || 7000}`)
  );
  console.log(
    `Visit  ` + colors.underline.blue(`localhost:${process.env.PORT || 7000}`)
  );
}
);

const io = socketio(server, {
  transports: ["polling", "websocket"],
  cors: {
    origin: Frontend_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
});

const socketIoObject = io;
module.exports.ioObject = socketIoObject;