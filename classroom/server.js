const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const path = require("path");



app.set("view engine", "ejs");
app.set("views" ,path.join(__dirname,"views"));

const sessionOptions = {
    secret: "secretstring ",
    resave: false,
    saveUninitialized: true,
}

app.use(session(sessionOptions));
app.use(flash())
app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register" , (req,res)=>{
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "user not Registered");
    }else{
        req.flash("success", "user registered Successfully");
    }
    res.redirect("/hello");
})

app.get("/hello", (req,res)=>{
   res.render("page.ejs", { name : req.session.name } );
})

// app.get("/req" , (req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`request count ${req.session.count}`)
// })

app.listen(3000, ()=>{
    console.log(`server is running on 3000 port number`)
})