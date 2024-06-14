const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const {storage} = require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage })   // third party cloud storage
// const upload = multer({ dest: 'uploads/' }) //it will create folder 'uploads' in 'majorproject' and store images or files


// search Route

router.get("/search",wrapAsync(listingController.searchListing));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


//index route with category filter and without category also call bz '?'
router
.route("/category/:category?")
.get( wrapAsync( listingController.index))

// Index Route //Create Route
router
.route("/")
.get( wrapAsync( listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,
  wrapAsync(listingController.createListing)
);
// to upload single image using multeruplaod in third party cloudinary middleware 'upload.single('listing[image]'
// .post(upload.single('listing[image]'),(req,res) =>{
//    res.send(req.body.listing);
// });

router
.route("/:id")
.get( wrapAsync(listingController.showListing))  // Show Route
.patch(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  wrapAsync(listingController.updateListing)
)  //Update Route
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);    //Delete Route


// edit Route
router.get("/:id/edit",  isLoggedIn,  isOwner, 
   wrapAsync(listingController.editListing));   //Edit Route


   
module.exports = router;
