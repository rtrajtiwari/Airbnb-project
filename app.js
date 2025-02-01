require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingroute = require("./routes/listings.js");
const reviewroute = require("./routes/review.js");
const usersrouter =  require("./routes/users.js");  
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
const passportlocal = require("passport-local");
const User = require("./models/users.js");



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({ extended: true }));    
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs',ejsmate);
app.use(flash());
app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    cookie: {
    expires : Date.now() + 10 * 24 * 60 * 60 *1000,
    maxAge :  10 * 24 * 60 * 60 * 1000,
    httpOnly : true
    }
  }));


// mongoose
console.log(process.env.MONGODB_URI);
async function main() {
    await mongoose.connect(`{process.env.MONGODB_URI}`)
}
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
     console.log(err);
})

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportlocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/demo", async(req,res)=>{
        let demouser = {
            email : "akashbarwar@gmail.com",
            username : "Akash Barwar"
        }
     let newuser =   await User.register(demouser,"pikachu");
     res.send(newuser);
}) 

app.get("/",(req,res)=>{
    res.send("working");
});


// map

async function getBoundingBox(city) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json`);
    const data = await response.json();
  
    if (data.length > 0) {
      const [minLon, maxLat, maxLon, minLat] = data[0].boundingbox;
      return { minLon, maxLat, maxLon, minLat };
    } else {
      throw new Error("City not found");
    }
  }

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentuser = req.user; 
    next();
});


// listing and review
app.use("/listings",listingroute);
app.use("/listings/:id/review",reviewroute);
app.use("/",usersrouter);



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
