const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/TravShort";

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err.errors.category.properties.message);
})

async function main(){
   await mongoose.connect(MONGO_URL);
}


const initDB = async ()=>{
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=>({...obj , owner: "680911771a43f05eb33b49d6"}));
   await Listing.insertMany(initData.data);
   console.log("Data was Initialized");
}

initDB();