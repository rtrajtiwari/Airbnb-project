const Listing = require("./models/listings.js");
const Review = require("./models/review.js");


module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirecturl = req.originalUrl;
        req.flash("error","you must log in");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveredirecturl = (req,res,next)=>{
     if(req.session.redirecturl){
        res.locals.redirecturl = req.session.redirecturl;
     }
     next();
};

module.exports.isowner = async (req,res,next)=>{
        let { id } = req.params;
        let listing = await Listing.findById(id);
      if(!listing.owner._id.equals(res.locals.currentuser._id)){
            req.flash("error","you dont have permissions to edit this");
           return res.redirect(`/listings/${id}`);
        }
        next();
};
module.exports.isreviewauthor = async (req,res,next)=>{
        let { id,reviewid } = req.params;
        let review = await Review.findById(reviewid);
      if(!review.author._id.equals(res.locals.currentuser._id)){
            req.flash("error","you dont have permissions to delete this review");
           return res.redirect(`/listings/${id}`);
        }
        next();
};