import { 
  findAllListings,
  createNewListing,
  findListingById,
} from "../services/listing.service.js";

/**
 * Controller to get all listings
 * Route: GET /listings
 */
export const getAllListings = async (req, res, next) => {
  try {
    const listings = await findAllListings();

    res.render("listings/index", { 
      listings, 
      title: "All Listings | StaySocial" 
    });
  } catch (error) {
    console.error("Error in getAllListings:", error.message);
    next(error);
  }
};

/**
 * Renders the form to create a new listing
 */
export const renderNewForm = (req, res) => {
  res.render('listings/new', {
    title: 'New Listing | StaySocial'
  });
}

/**
 * Handles form submission to create a new listing
 */
export const createListing = async (req, res) => {
  try {
    const newListing = await createNewListing(req.body.listing);

    res.redirect(`/listings/${newListing._id}`);
  } catch (error) {
    console.error('Failed to create listing:', error);
    res.status(500).send('Internal Server Error');
  }
}

/**
 * Controller: Get a listing by ID
 * Route: GET /listings/:id
 */
export const getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await findListingById(id);

    res.render("listings/show", { 
      listing,
      title: `${listing.title} | StaySocial`
  });
  } catch (error) {
    next(error);
  }
}