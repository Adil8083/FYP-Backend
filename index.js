const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();

const auth = require("./routes/auth");
const cricketStatistics = require("./routes/cricketStatistics");
const footballStatistics = require("./routes/footballStatistics");
const sportsAchievements = require("./routes/sportsAchievements");
const users = require("./routes/user");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKet not defined.");
  process.exit(1);
}

const connectionString = "mongodb://localhost/WhiteLabelApp";
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
app.use("/api/cricketStatistics", cricketStatistics);
app.use("/api/footballStatistics", footballStatistics);
app.use("/api/sportsAchievements", sportsAchievements);
app.use("/api/users", users);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
