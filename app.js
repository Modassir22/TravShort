const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

app.get("/",(req,res)=>{
res.send("Working");
})

//Listing Route
// Index Route
app.get("/listings",async (req,res)=>{
   const allListing = await Listing.find({});
   res.render("listing/index.ejs" , {allListing});
})

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
})


//Show Routes
app.get("/listings/:id",async (req,res)=>{
   let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("listing/show.ejs", {listing});
})

//Create Route
app.post("/listings",async (req,res)=>{
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})


//Edit Route
app.get("/listings/:id/edit", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", {listing});
})

//Update Route
app.put("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); //Desturcturing
    res.redirect("/listings");
    /* res.redirect(`/listings/${id}`) */  //redirect to show.ejs
})

//Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings");
})
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

app.listen(8080,()=>{
    console.log("Server is running");
})