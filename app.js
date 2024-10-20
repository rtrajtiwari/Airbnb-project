const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const schema = require("./schema.js");
const reviewschema = require("./schema.js");
const Review = require("./models/review.js");

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

const validatelisting = (req,res,next)=>{
    let result = schema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    else{
        next();
    }
};
const validatereview = (req,res,next)=>{
    let result = reviewschema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    else{
        next();
    }
};

// Get all listings
app.get("/listings", async (req, res, next) => {
    try {
        const dbdata = await Listing.find({});
        res.render("listings/index.ejs", { dbdata });
    } catch (err) {
        next(err);  
    }
});

// New listing form
app.get("/listings/new", (req, res, next) => {
    try {
        res.render("listings/new.ejs");
    } catch (err) {
        next(err);
    }
});

// Create a new listing
app.post("/listings",validatelisting, async (req, res, next) => {
    try {
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});

// Show a single listing by ID
app.get("/listings/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        const data = await Listing.findById(id).populate("reviews");
        res.render("listings/show.ejs", { data });
    } catch (err) {
        next(err);
    }
});

// Edit form for a listing by ID
app.get("/listings/:id/edit", async (req, res, next) => {
    try {
        let { id } = req.params;
        const data = await Listing.findById(id);
        res.render("listings/edit.ejs", { data });
    } catch (err) {
        next(err);
    }
});

// Update a listing by ID
app.put("/listings/:id",validatelisting, async (req, res, next) => {
    try {
        let { id } = req.params;
        const updated = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
});

// Delete a listing by ID
app.delete("/listings/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        const deleted = await Listing.findByIdAndDelete(id);
        console.log(deleted);
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});

// review 
// post
app.post("/listings/:id/review",validatereview, async (req,res)=>{
      let {id} = req.params;
      let  listing = await Listing.findById(req.params.id);
      let review1 = new Review(req.body.review);
 
     listing.reviews.push(review1);

    await listing.save();
    await review1.save();
    console.log(review1);
    res.redirect(`/listings/${id}`);
});

// review delete
app.delete("/listings/:id/review/:reviewid", async(req,res)=>{
        let {id,reviewid} = req.params;
        await  Listing.findByIdAndUpdate(id,{$pull :{reviews: reviewid}});
        await Review.findByIdAndDelete(reviewid);
        res.redirect(`/listings/${id}`);
});


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
       
     let {status=500,message= "something went wrong"} = err;
    //  res.status(status).send(message);
     res.render("listings/error.ejs",{err});
})

app.listen(3000,()=>{
    console.log("server is listning on 3000");
});
