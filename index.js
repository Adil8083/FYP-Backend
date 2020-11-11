const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();
require("dotenv/config");

const auth = require("./routes/auth");
const achievements = require("./routes/achievements");
const sportInfo = require("./routes/sportInfo");
const statistics = require("./routes/statistics");
const users = require("./routes/user");
const ConcertDetails = require("./routes/ConcertDetails");
const Poster = require("./routes/Poster");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKet not defined.");
  process.exit(1);
}

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDb... ", err));

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/achievements", achievements);
app.use("/api/sportInfo", sportInfo);
app.use("/api/statistics", statistics);
app.use("/api/users", users);
app.use("/api/concert", ConcertDetails);
app.use("/api/poster", Poster);

const port = 3000 || process.env.PORT;
app.listen(port, () => console.log(`listening on port ${port}...`));
