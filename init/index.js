require('dotenv').config({ path: '../.env' });
console.log("MONGODB_URI:", process.env.MONGODB_URI);
const  mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listings.js");


async function main() {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
}
main()  
.then(()=>{
    console.log("connected to db");
})

const initdb = async ()=>{
    await Listing.deleteMany({});
     initdata.data = initdata.data.map((obj)=>({...obj,owner:"671b4c494d13dcc31bc88318"}));
    await Listing.insertMany(initdata.data);
    console.log("data was saved");
}

initdb();
