const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views" ,path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const sessionOption = {
    secret: " mysecretkey",
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOption));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

const MONGO_URL = "mongodb://127.0.0.1:27017/TravShort";

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
   await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
res.send("Working");
})



app.use("/listings" , listingRoutes)
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/" , userRoutes);



//If no route or page Found then this route will work for Handling error
app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
})


app.use((err,req,res,next)=>{
    let {statusCode = 505, message = "Something went wrong!"} = err;
    res.render("Error.ejs", {err,statusCode});
    // res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("Server is running");
})