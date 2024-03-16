require("dotenv").config();
const app = require("./app");
const connectDB = require("./db/connect");

const port = process.env.PORT || 4000;
let server;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server = app.listen(
      port,
      () => console.log(`Server is listening on port ${port}...`) //eslint-disable-line
    );
  } catch (err) {
    console.log(err); //eslint-disable-line
    if (server) {
      server.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  }
};

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down..."); //eslint-disable-line
  server.close(() => {
    console.log("Process terminated!"); //eslint-disable-line
  });
});

start();
