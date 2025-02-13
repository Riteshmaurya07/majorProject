const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


//new Route
router.get("/new", isLoggedIn,listingControllers.renderNewForm );


router.route("/")
    .get( wrapAsync(listingControllers.index))  //index Route
    .post(isLoggedIn,  upload.single('listing[image]'), validateListing, wrapAsync(listingControllers.createListing));   //create Route
    
router.route("/:id")
    .get(wrapAsync(listingControllers.showListings))  //show Route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingControllers.updateListing))  //update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing));  //delete Route



//edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditForm));




module.exports = router;