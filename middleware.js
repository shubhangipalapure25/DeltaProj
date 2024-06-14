const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const ExpressError = require("./util/ExpressError.js");
const {reviewSchema} = require("./schema.js");
//const ExpressError = require("./util/ExpressError.js");
const { listingSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be log In");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!res.locals.currUser._id.equals(listing.owner)) {
    req.flash("error", "You are not owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!res.locals.currUser._id.equals(review.author)) {
    req.flash("error", "You are not author of this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//schema validation middleware
module.exports.validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    // let errMsg = error.details.map((ele) =>console.log(ele.message));
     let errMsg = error.details.map((ele) => ele.message).join(",");
    //  console.log("hello", errMsg);
    throw new ExpressError(400,errMsg);
    //or below code also work.
   //throw new ExpressError(400,error);
  }else{
    next();
  }
  }

  //schema validation middleware
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    // let errMsg = error.details.map((ele) =>console.log(ele.message));
    console.log("listing error ::: ",error);
    let errMsg = error.details.map((ele) => ele.message).join(",");
    //    console.log("hello", errMsg);
    throw new ExpressError(400, errMsg);
    //or below code also work.
    //throw new ExpressError(400,error);
  } else {
    next();
  }
};
