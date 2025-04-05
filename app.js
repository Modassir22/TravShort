const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const  {listingSchema , reviewSchema}  = require("./schema.js");
const Review = require("./models/review.js");


app.set("view engine", "ejs");
app.set("views" ,path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/TravShort";

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
   await mongoose.connect(MONGO_URL);
}

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
}

const validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    }
}

app.get("/",(req,res)=>{
res.send("Working");
})

//Listing Route
// Index Route
app.get("/listings", wrapAsync(async (req,res)=>{
   const allListing = await Listing.find({});
   res.render("listing/index.ejs" , {allListing});
}))

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
})


//Show Routes
app.get("/listings/:id", wrapAsync(async (req,res)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews");
   res.render("listing/show.ejs", {listing});
}))

//Create Route
app.post("/listings",
    validateListing,
     wrapAsync(async (req,res,next)=>{
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}))


//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", {listing});
}))

//Update Route
app.put("/listings/:id",
    validateListing,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); //Desturcturing
    res.redirect("/listings");
    /* res.redirect(`/listings/${id}`) */  //redirect to show.ejs
}))

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings");
}))


//post Route Reviews
app.post("/listings/:id/reviews", validateReview ,wrapAsync(async (req,res,next)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}))


/*app.get("/testListing",async (req,res)=>{
    let sampleListing = new Listing({
        title:"My new Villa",
        description:"The rich Society",
        price:1200,
        location:"London",
        country:"London",
    })
    await sampleListing.save();
    console.log("sample was saved");
    res.send("Successfull send");
})*/

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