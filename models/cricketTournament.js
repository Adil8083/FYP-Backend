const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  tournaments: {
    type: Array,
    required: true,
  },
});
const tournaments = mongoose.model("cricketTournament", tournamentSchema);

exports.Tournaments = tournaments;
