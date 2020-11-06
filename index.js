const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();

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

const connectionString =
  "mongodb+srv://uzairnaseem:hassan234@freecluster.wojcd.mongodb.net/<dbname>?retryWrites=true&w=majority";
mongoose
  .connect(connectionString, {
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
