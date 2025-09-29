import { findAllListings } from "../services/listing.service.js";

/**
 * Controller to get all listings
 */
export const getAllListings = async (req, res, next) => {
  try {
    const listings = await findAllListings();

    // Render listings view (adjust path if needed)
    res.render("listings/index", { 
      listings, 
      title: "All Listings | StaySocial" 
    });
  } catch (error) {
    console.error("Error in getAllListings:", error.message);
    next(error);
  }
};