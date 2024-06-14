const { ref } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review");
const schema = mongoose.Schema;
// const Review = require("../models/review.js");

const listingSchema = new schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    },
  category:{
    type:String,
    enum:["Trending","Rooms","Iconic cities","Mountains","Boats","Amezing pools","Camping","Farms","Arctic","Domes"],
 
     },
  image:{
    url: String,
    filename: String,
  },
  // image: {
  //   type: String,
  //   default:
  //     "https://images.unsplash.com/photo-1715630914788-71ec3db8bf6b?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   set: (val) =>
  //     val === ""
  //       ? "https://images.unsplash.com/photo-1715630914788-71ec3db8bf6b?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  //       : val,
  // },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type: schema.Types.ObjectId,
    ref: "User",
  },
  
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
     await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

let Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
