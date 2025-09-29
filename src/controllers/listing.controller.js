import { 
  findAllListings,
  createNewListing,
  findListingById,
  updateListingById,
  deleteListingById,
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

/**
 * Renders the edit form for a specific listing
 * Route: GET /listings/:id/edit
 */
export const renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await findListingById(id);

    res.render('listings/edit', {
      listing,
      title: `Edit ${listing.title} | StaySocial`
    });
  } catch (error) {
    console.error('Error rendering edit form:', error);
    next(error);
  }
}

/**
 * Handles form submission to update a listing
 * Route: PUT /listings/:id
 */
export const updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body.listing;

    const updatedListing = await updateListingById(id, updatedData);

    // PRG pattern: redirect after successful update
    res.redirect(`/listings/${updatedListing._id}`);
  } catch (error) {
    console.error('Error updating listing:', error);
    next(error);
  }
}

/**
 * Handles deletion of a listing
 * Route: DELETE /listings/:id
 */
export const deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteListingById(id);

    res.redirect('/listings');
  } catch (error) {
    console.error('Error deleting listing:', error);
    next(error);
  }
};