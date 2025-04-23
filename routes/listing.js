const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");


const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}

router.get("/", wrapAsync(async (req,res)=>{
   const allListing = await Listing.find({});
   res.render("listing/index.ejs" , {allListing});
}))

//New Route
router.get("/new",isLoggedIn , (req,res)=>{
    res.render("listing/new.ejs");
})


//Show Routes
router.get("/:id", wrapAsync(async (req,res)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id).populate("reviews");
   if(!listing){
    req.flash("error" , "Listing trying to Requested doesn't exist!");
    res.redirect("/listings");
   }
   res.render("listing/show.ejs", {listing});
}))

//Create Route
router.post("/",
    validateListing,
     wrapAsync(async (req,res,next)=>{
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success" , "New Listing Created!");
    res.redirect("/listings");
}))


//Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "Listing trying to Requested doesn't exist!");
        res.redirect("/listings");
       }
    res.render("listing/edit.ejs", {listing});
}))

//Update Route
router.put("/:id",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); //Desturcturing
    req.flash("success" , "Listing Updated!");
    res.redirect("/listings");
    /* res.redirect(`/listings/${id}`) */  //redirect to show.ejs
}))

//Delete Route
router.delete("/:id",isLoggedIn, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
}))

module.exports = router;