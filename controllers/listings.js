const Listing = require("../models/listing");

module.exports.index = async(req, res, next) => {
  
  const { category } = req.params;
  let allListing;

  if(category){
     allListing = await Listing.find({category:category});
  }else{
     allListing = await Listing.find();
  }
       
  // console.log(allListing);
    res.render("listing/index.ejs", { allListing });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listing/new.ejs");
  }

  module.exports.showListing = async(req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    // console.log(req.user);
   // console.log(listing);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exits!");
      res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
  }

  module.exports.createListing = async (req, res, next) => {
    // let {title,description,price, location,country} = req.body;
    // console.log(req.body.listing); //some syntax chaange for new.ejs file see there
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    console.log("______******",req.body.listing);
    newListing.image = {url,filename}
    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success", "New Listing created");
    res.redirect("/listings");
  }

  module.exports.editListing = async (req, res, next) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exits!");
      res.redirect("/listings");
    }
    console.log(listing.image.url);
    let originalImgUrl = listing.image.url;
    // originalImgUrl = originalImgUrl.replace("upload","upload/ar_1.0,c_fill,w_250/r_max/f_auto"); //showing image preview in circle form
    //originalImgUrl = originalImgUrl.replace("upload","upload/w_250");

    console.log(originalImgUrl);
    res.render("listing/edit.ejs", { listing,originalImgUrl });
  }

  module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;
    const newlist = req.body.listing;
    // await Listing.findByIdAndUpdate(id,{...req.body.listing}); // we can use this code also
    let updatedList = await Listing.findByIdAndUpdate(id, newlist, {
      new: true,
    });
    if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;
    updatedList.image = {url,filename};
    updatedList.save();
    }
    // console.log(updatedList);
    req.flash("success", " Listing Updated!");
    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyListing = async (req, res, next) => {
    const { id } = req.params;
    const deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  }

  module.exports.searchListing = async (req,res,next) =>{
    const {country} = req.query;
    //console.log(country);
    let allListing = await Listing.find({country:country});
    res.render("listing/index.ejs",{allListing})

  }