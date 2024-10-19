const mongoose = require("mongoose");

const listingschema = new mongoose.Schema({
    title : {
        type: String,
        required : true
    },
    description : String,
    image : {
         filename : {
            type : String
         },
         url : { 
            type : String , 
            default : "https://cubanvr.com/wp-content/uploads/2023/07/ai-image-generators.webp"
        }
    },
    price : Number,
    location : String,
    country : String
}) 

const Listing = mongoose.model("Listing",listingschema);

module.exports = Listing;
