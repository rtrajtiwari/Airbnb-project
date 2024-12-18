const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const {schema,reviewschema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isloggedin,isowner} = require("../middileware.js");

const validatelisting = (req,res,next)=>{
    let result = schema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    else{
        next();
    }
};

// index route
router.get("/", async (req, res, next) => {
    try {
        const dbdata = await Listing.find({});
        res.render("listings/index.ejs", { dbdata });
    } catch (err) {
        next(err);  
    }
});

// New route
router.get("/new",isloggedin, (req, res, next) => {
    try {
        res.render("listings/new.ejs");
    } catch (err) {
        next(err);
    }
});

// Create a new listing
router.post("/",validatelisting, async (req, res, next) => {
    try {
        const newlisting = new Listing(req.body.listing);
        newlisting.owner = req.user._id; 
        await newlisting.save();
        req.flash("success","listing successfully created");

        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});

// show route
router.get("/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        const data = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
       
        if(!data){
            req.flash("error","listing not found");
             res.redirect("/listings");
        }
        res.render("listings/show.ejs", { data });
    } catch (err) {
        next(err);
    }
});

// Edit route
router.get("/:id/edit",isloggedin, async (req, res, next) => {
    try {
        let { id } = req.params;
        const data = await Listing.findById(id);
        if(!data){
            req.flash("error","listing not found");
             res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { data });
    } catch (err) {
        next(err);
    }
});

// Update route
router.put("/:id",isloggedin,isowner,validatelisting, async (req, res, next) => {
    try {
        let { id } = req.params;
        const updated = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success","listing updated successfully ");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
});

// Delete route
router.delete("/:id",isloggedin,isowner, async (req, res, next) => {
    try {
        let { id } = req.params;
        const deleted = await Listing.findByIdAndDelete(id);
        console.log(deleted);
        req.flash("success","listing deleted successfully ");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});

module.exports = router;