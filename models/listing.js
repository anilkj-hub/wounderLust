const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listeningSchema = new Schema({
    title:{
        type: String,
        requird:true,
    },
    description: String,
    image:{
        type: String,
        default:"null",
        set: (v) => v === "" ? "default link" : v,
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listeningSchema);
module.exports = Listing;