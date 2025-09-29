import { 
  findAllListings,
  findListingById
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
 * Controller: Get a listing by ID
 * Route: GET /listings/:id
 */
export async function getListingById(req, res, next) {
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