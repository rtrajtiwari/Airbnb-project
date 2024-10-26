const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");

app.use(session({ secret : "mysecretkey", resave :false,saveUninitialized :true}));
app.use(flash());


app.get("/",(req,res)=>{
      const {name} = req.query;
      req.flash("success",`hlo ${name}`);
    res.send(`${name}`);
})
app.listen(8080,()=>{
    console.log("server is listning on 8080");
});