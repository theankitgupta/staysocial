import Listing from "../models/listing.model.js";

/**
 * Fetch all listings from the database
 * @returns {Promise<Array>} Array of listing documents
 * @throws {Error} If there's an issue fetching the listings
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
 * Creates a new listing in the database
 * @param {Object} listingData - The data from the form (req.body.listing)
 * @returns {Promise<Object>} - The saved listing object, including _id
 * @throws {Error} - If there's an error during creation
 */
export const createNewListing = async(listingData) => {
  try {
    const listing = new Listing(listingData);
    const savedListing = await listing.save();
    return savedListing;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
}

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