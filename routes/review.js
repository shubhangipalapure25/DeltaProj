const express = require("express");
const route = express.Router({mergeParams:true}); //parent to child sending id not geeting need to write mergeParams
const wrapAsync = require("../util/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor,validateReview } = require("../middleware.js");
const reviewController = require("../controllers/review.js");


// Reviews
//Review Create Route 
route.post("/",
isLoggedIn,
validateReview,
wrapAsync(reviewController.createReview));
  
  // Delete Review Route
  route.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync (reviewController.destroyReview));

  module.exports = route;