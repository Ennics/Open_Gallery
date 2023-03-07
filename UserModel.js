const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the schema for a citizen
let userSchema = Schema({
    username: String,
    password: String,
    followers: Array,
    following: Array,
    artworks: Array,
    profile: String
});

// export schema
module.exports = mongoose.model("users", userSchema);