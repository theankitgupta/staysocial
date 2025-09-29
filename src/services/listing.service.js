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