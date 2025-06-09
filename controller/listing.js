const Listing = require("../models/listing");
const GeoCoding = require("../utils/GeoCoding");

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing trying to Requested doesn't exist!");
    res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    let answer = await GeoCoding.LatLong(req.body.listing.location);
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    if (answer) {
      newListing.geometry = {
        type: "Point",
        coordinates: [parseFloat(answer.lon), parseFloat(answer.lat)], // [lng, lat]
      };
    }
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (e) {
    next(e);
  }
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing trying to Requested doesn't exist!");
    res.redirect("/listings");
  }
  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/w_250,e_blur:100");
  res.render("listing/edit.ejs", { listing, originalImage });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //Desturcturing
  let answer = await GeoCoding.LatLong(req.body.listing.location);
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    console.log(url);
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  if (answer) {
      listing.geometry = {
        type: "Point",
        coordinates: [parseFloat(answer.lon), parseFloat(answer.lat)], // [lng, lat]
      };
      await listing.save();
    }
  req.flash("success", "Listing Updated!");
  res.redirect("/listings");
  /* res.redirect(`/listings/${id}`) */ //redirect to show.ejs
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
