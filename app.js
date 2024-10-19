const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js")
const path = require("path");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({ extended: true }));    
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs',ejsmate);

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust")
}
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
     console.log(err);
})

app.get("/",(req,res)=>{
    res.send("working");
});
app.get("/testing",(req,res)=>{
     let samplelisting = new Listing({
        title : "new house",
        description : "house is great",
        price : 200000,
        location : "gb road",
        country : "delhi"
     })
     samplelisting.save();
     res.send(samplelisting);
});

app.get("/listings", async(req,res)=>{
    const dbdata = await Listing.find({});
    
    res.render("listings/index.ejs",{dbdata});
});

//new route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

//new route
app.post("/listings", async(req,res)=>{
    const newlisting = new Listing(req.body.listing);
     await newlisting.save();
    res.redirect("/listings");
});

//show route
app.get("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id);
    
    res.render("listings/show.ejs",{data});
});

//edit
app.get("/listings/:id/edit", async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id);
    
    res.render("listings/edit.ejs",{data});
});

//edited
app.put("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id);
    const updated = await Listing.findByIdAndUpdate(id,{...req.body.listing});
   
    res.redirect(`/listings/${id}`); 
});
app.delete("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    const data = await Listing.findById(id);
    const deleted = await Listing.findByIdAndDelete(id);
   console.log(deleted);
    res.redirect("/listings"); 
});



app.listen(3000,()=>{
    console.log("server is listning on 3000");
});
