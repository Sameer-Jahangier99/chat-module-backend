const mongoose = require("mongoose");
const colors = require("colors");
mongoose.set("strictQuery", false);

const dbConnect = async () => {
  try {
    const connectionString = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      colors.brightMagenta(
        `\nDB connected: ${connectionString.connection.host}\n`
      )
    );
  } catch (error) {
    console.log(colors.brightRed("\nConnection to link DB failed\n", error));
  }
};

module.exports = dbConnect;
