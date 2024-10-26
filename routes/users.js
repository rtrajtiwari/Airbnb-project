const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const passport = require("passport");


// signUp

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",async (req,res)=>{
    try{
        let {username,email,password} = req.body;
    const newuser = new User({username,email});
     const registeredUser = await User.register(newuser,password);
     console.log(registeredUser);
     req.flash("success","new user created");
     res.redirect("/listings");
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

router.post("/login",passport.authenticate("local",{failureRedirect :"/login",failureFlash : true}),async (req,res)=>{
    req.flash("success","successfully loged in");
    res.redirect("/listings");
});



module.exports = router;