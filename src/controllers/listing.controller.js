import { 
  findAllListings,
  createNewListing,
  findListingById,
  updateListingById,
  deleteListingById,
  searchListings as searchListingsService,
} from "../services/listing.service.js";

/**
 * Controller to get all listings with optional search/filter
 * Route: GET /listings
 */
export const getAllListings = async (req, res, next) => {
  try {
    const {
      search,
      type,
      status = "active",
      minPrice,
      maxPrice,
      maxGuests,
      city,
      page = 1,
      limit = 12,
      availableFrom,
      availableTo,
    } = req.query;
    
    const filterOptions = {
      search,
      type,
      status,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      maxGuests: maxGuests ? parseInt(maxGuests) : undefined,
      city,
      page: parseInt(page),
      limit: parseInt(limit),
      availableFrom,
      availableTo,
    };

    const { listings, totalCount, currentPage, totalPages } = await findAllListings(filterOptions);

    res.render("listings/index", { 
      listings, 
      totalCount,
      currentPage,
      totalPages,
      filterOptions,
      title: "All Listings | StaySocial",
      active: "listings"
    });
  } catch (error) {
    console.error("Error in getAllListings:", error.message);
    next(error);
  }
};

/**
 * Search listings with filters (API endpoint)
 */
export const searchListings = async (req, res, next) => {
  try {
    const filterOptions = { ...req.query };
    const result = await searchListingsService(filterOptions);

    res.json({
      success: true,
      data: {
        listings: result.listings,
        pagination: {
          currentPage: result.currentPage,
          totalPages: result.totalPages,
          totalCount: result.totalCount,
          hasNext: result.currentPage < result.totalPages,
          hasPrev: result.currentPage > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error in searchListings:", error);
    res.status(500).json({ success: false, error: "Failed to search listings" });
  }
};

/**
 * Renders the form to create a new listing
 */
export const renderNewForm = (req, res) => {
  res.render('listings/new', {
    title: 'New Listing | StaySocial',
    active: "new"
  });
}

/**
 * Handles form submission to create a new listing
 */
export const createListing = async (req, res, next) => {
  try {
    const newListing = await createNewListing(req.body.listing);

    res.redirect(`/listings/${newListing._id}`);
  } catch (error) {
    console.error('Failed to create listing:', error);
    
    // Re-render the form with previous data
    res.render('listings/new', {
      title: 'New Listing | StaySocial',
      active: "new",
      formData: req.body.listing,
      messages: { error: error.message },
    });
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
      title: `${listing.title} | StaySocial`,
      active: "listing"
    });
  } catch (error) {
    console.error("Error in getListingById:", error.message);
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
      title: `Edit ${listing.title} | StaySocial`,
      active: "edit"
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
    const listingData = req.body.listing;

    // 1. Handle Image Deletions and Updates
    const imagesToDelete = req.body.deleteImages || []; // This is an array of image _id's
    
    if (listingData.images) {
      // Filter out images that were marked for deletion
      if (imagesToDelete.length > 0) {
        listingData.images = listingData.images.filter(img => !imagesToDelete.includes(img._id));
      }

      // Filter out any newly added but empty image URL fields
      listingData.images = listingData.images.filter(img => img.url && img.url.trim() !== '');
    }

    // 2. Process amenities - ensure it's an array
    if (listingData.amenities && !Array.isArray(listingData.amenities)) {
      listingData.amenities = [listingData.amenities];
    } else if (!listingData.amenities) {
      // If no amenities are checked, the field might be missing. Set to empty array.
      listingData.amenities = [];
    }

    // 3. Process availability - filter out invalid date ranges
    if (listingData.availability) {
      listingData.availability = listingData.availability.filter(range =>
        range.from && range.to && new Date(range.to) >= new Date(range.from)
      );
    }

    // 4. Call the service to update the listing
    const updatedListing = await updateListingById(id, listingData);

    res.redirect(`/listings/${updatedListing._id}`);
  } catch (error) {
    console.error('Error updating listing:', error);
    
    // In case of an error, re-render the edit form with an error message
    const listing = await findListingById(req.params.id); // Refetch original data
    res.render('listings/edit', {
      listing,
      title: `Edit ${listing.title} | StaySocial`,
      active: "edit",
      messages: { error: 'Failed to update listing: ' + error.message }
    });
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
    
    res.redirect(`/listings/${req.params.id}`);
  }
};