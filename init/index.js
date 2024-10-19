const  mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listings.js");


async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust")
}
main()
.then(()=>{
    console.log("connected to db");
})

const initdb = async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("data was saved");
}

initdb();
