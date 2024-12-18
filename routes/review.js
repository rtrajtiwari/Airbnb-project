const express = require("express");
const router = express.Router({mergeParams:true});
const {schema,reviewschema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const {isloggedin,isowner,isreviewauthor} = require("../middileware.js");

const validatereview = (req,res,next)=>{
    let result = reviewschema.validate(req.body);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    else{
        next();
    }
};


// review 
// post
router.post("/",isloggedin,validatereview, async (req,res,next)=>{
    try{
        let {id} = req.params;
        let  listing = await Listing.findById(req.params.id);
        let review1 = new Review(req.body.review);
        review1.author = req.user._id;
       listing.reviews.push(review1);
    
      await listing.save();
      await review1.save();
      console.log(review1);
      req.flash("success","new review created");
      res.redirect(`/listings/${id}`);
    }
    catch(err){
        next(err);
    }
    
});

// review delete
router.delete("/:reviewid",isloggedin,isreviewauthor ,async(req,res,next)=>{
    try{
        let {id,reviewid} = req.params;
        await  Listing.findByIdAndUpdate(id,{$pull :{reviews: reviewid}});
        await Review.findByIdAndDelete(reviewid);
        req.flash("success","review deleted ");
        res.redirect(`/listings/${id}`);
    }
    catch(err){
        next(err);
    }
});

module.exports = router;