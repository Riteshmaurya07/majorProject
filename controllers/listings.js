const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN || 'your-default-map-token';
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}

module.exports.renderNewForm=(req, res) => {
    console.log(req.user);
    res.render("listings/new");
}

module.exports.showListings=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Cannot find the listing");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing })
}

module.exports.createListing=async (req, res, next) => {
    // let response = await geocodingClient.forwardGeocode({
    //     query: req.body.listing.location,
    //     limit: 1
    // }).send();
    // console.log(response.body.features[0].geometry.coordinates);

   
    let url = req.file.path;
    let filename = req.file.filename;

    // console.log(url, "....", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url, filename};

    // newListing.geometry = response.body.features[0].geometry;
    
    await newListing.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find the listing");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url; // Assuming the image URL is stored in listing.image.url
    originalImageUrl = originalImageUrl.replace("upload", "upload/w_200,h_200"); // This will resize the image to 200x200 pixels
    res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !== 'undefined'){

    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url, filename};
    await listing.save();
    }

    req.flash("success", "Successfully updated the listing");
    res.redirect(`/listings/${id}`);

}

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted the listing");
    res.redirect("/listings");

}