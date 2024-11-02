const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const passport = require("passport");
const {saveredirecturl} = require("../middileware.js");


// signUp

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",async (req,res)=>{
    try{
        let {username,email,password} = req.body;
    const newuser = new User({username,email});
     const registeredUser = await User.register(newuser,password);
     req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Welcome to Airbnb");
        res.redirect("/listings");
     })
     console.log(registeredUser);
    }
    catch(error){
         req.flash("error",error.message);
         res.redirect("/signup");
    }
});


// login
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login", saveredirecturl , passport.authenticate("local",{failureRedirect :"/login",failureFlash : true}),async (req,res)=>{
    req.flash("success","successfully loged in");
     let redirect = res.locals.redirecturl || "/listings";
    res.redirect(redirect);
});

// logout
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You successfully logged out");
        res.redirect("/listings");
    })
})



module.exports = router;