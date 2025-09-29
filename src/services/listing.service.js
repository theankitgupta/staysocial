import Listing from "../models/listing.model.js";

/**
 * Fetch all listings from the database
 * @returns {Promise<Array>} Array of listing documents
 */

export const findAllListings = async () => {
  try {
    const listings = await Listing.find({});
    return listings;
  } catch (error) {
    throw new Error("Error fetching listings: " + error.message);
  }
};

/**
 * Find a listing by its ID
 * @param {string} id - The MongoDB ObjectId of the listing
 * @returns {Promise<Object>} - The listing document
 * @throws {Error} - If the listing is not found
 */

export async function findListingById(id) {
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new Error("Listing not found");
  }

  return listing;
}