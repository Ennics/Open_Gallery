const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define the schema for a citizen
let artworkSchema = Schema({
    name: String,
    artist: String,
    year: String,
    category: String,
    medium: String,
    description: String,
    image: String
});

// export schema
module.exports = mongoose.model("artworks", artworkSchema);
