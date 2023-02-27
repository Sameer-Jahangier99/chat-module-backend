const express = require("express");
const app = express();
const colors = require("colors");
require("dotenv").config();

// DataBase Connection
const connectDb = require("./config/connectDb");
connectDb();

// middlewares
const { errorHandler, routeNotFound } = require('./middleware/errorMiddleware')

// Routes
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');


app.use(express.json());
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

// Socket Connection
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("A user connected");
});
