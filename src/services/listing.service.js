import Listing from "../models/listing.model.js";

/**
 * Fetch all listings from the database with optional filtering and pagination
 * @param {Object} filterOptions - Filtering and pagination options
 * @returns {Promise<Object>} Object containing listings and pagination info
 * @throws {Error} If there's an issue fetching the listings
 */
export const findAllListings = async (filterOptions = {}) => {
  try {
    const {
      search,
      type,
      status = 'active',
      minPrice,
      maxPrice,
      maxGuests,
      city,
      page = 1,
      limit = 12,
      availableFrom,
      availableTo,
    } = filterOptions;

    // Build filter object
    const filter = {};

    // Status filter (default to active)
    if (status) filter.status = status;

    // Availability filter
    if (availableFrom || availableTo) {
      filter.availability = {
        $elemMatch: {}
      };
      if (availableFrom) filter.availability.$elemMatch.from = { $lte: new Date(availableFrom) };
      if (availableTo) filter.availability.$elemMatch.to = { $gte: new Date(availableTo) };
    }

    // Search filter (title, description, or city)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    // Type filter
    if (type) {
      filter.type = type;
    }

    // City filter
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter["price.base"] = {};
      if (minPrice !== undefined) filter["price.base"].$gte = minPrice;
      if (maxPrice !== undefined) filter["price.base"].$lte = maxPrice;
    }

    // Max guests filter
    if (maxGuests !== undefined) {
      filter.maxGuests = { $lte: maxGuests };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [listings, totalCount] = await Promise.all([
      Listing.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Listing.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return {
      listings,
      totalCount,
      currentPage: page,
      totalPages
    };
  } catch (error) {
    console.error("findAllListings failed:", error);
    throw new Error("Failed to fetch listings: " + error.message);
  }
};

/**
 * Search listings with advanced filters (similar to findAll but with different defaults)
 */
export const searchListings = async (filterOptions) => {
  return await findAllListings(filterOptions);
};

/**
 * Creates a new listing in the database
 * @param {Object} listingData - The data from the form (req.body.listing)
 * @returns {Promise<Object>} - The saved listing object, including _id
 * @throws {Error} - If there's an error during creation
 */
export const createNewListing = async (listingData) => {
  try {
    // Ensure geometry type is set correctly
    if (listingData.location && listingData.location.geometry) {
      listingData.location.geometry.type = 'Point';
    }

    // Ensure images array is properly formatted
    if (listingData.images && Array.isArray(listingData.images)) {
      listingData.images = listingData.images.filter(img => img.url && img.url.trim() !== '');
    }

    // Ensure amenities is an array
    if (listingData.amenities && !Array.isArray(listingData.amenities)) {
      listingData.amenities = [listingData.amenities];
    }

    // Ensure availability is properly formatted
    if (listingData.availability && Array.isArray(listingData.availability)) {
      listingData.availability = listingData.availability.filter(avail => 
        avail.from && avail.to && new Date(avail.to) > new Date(avail.from)
      );
    }

    const listing = new Listing(listingData);
    const savedListing = await listing.save();
    return savedListing;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw new Error(`Failed to create listing: ${error.message}`);
  }
}

/**
 * Find a listing by its ID
 * @param {string} id - The MongoDB ObjectId of the listing
 * @returns {Promise<Object>} - The listing document
 * @throws {Error} - If the listing is not found
 */
export const findListingById = async (id) => {
  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      throw new Error("Listing not found");
    }

    return listing;
  } catch (error) {
    console.error('Error finding listing by ID:', error);
    throw new Error(`Failed to find listing: ${error.message}`);
  }
}

/**
 * Update a listing by its ID
 * @param {string} id - The MongoDB ObjectId of the listing
 * @param {Object} listingData - The data to update
 * @returns {Promise<Object>} - The updated listing document
 * @throws {Error} - If the listing is not found or update fails
 */
export const updateListingById = async (id, listingData) => {
  try {
    // Ensure geometry type is preserved if coordinates are updated
    if (listingData.location?.geometry?.coordinates) {
      listingData.location.geometry.type = 'Point';
    }

    // Filter out empty image objects and ensure proper format
    if (Array.isArray(listingData.images)) {
      listingData.images = listingData.images
        .filter(img => img.url && img.url.trim() !== '')
        .map((img, index) => ({
          url: img.url,
          filename: img.filename || `image-${Date.now()}-${index}`,
          // Preserve existing _id if it exists to avoid MongoDB creating new ones
          ...(img._id && { _id: img._id })
        }));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { $set: listingData }, // Use $set for a safer, non-destructive update
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );

    if (!updatedListing) {
      throw new Error("Listing not found for update");
    }

    return updatedListing;
  } catch (error) {
    console.error('Error updating listing:', error);
    throw new Error(`Failed to update listing: ${error.message}`);
  }
};

/**
 * Delete a listing by its ID
 * @param {string} id - The MongoDB ObjectId of the listing
 * @returns {Promise<Object|null>} - The deleted listing document, or null if not found
 * @throws {Error} - If deletion fails
 */
export const deleteListingById = async (id) => {
  try {
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      throw new Error("Listing not found");
    }

    return deletedListing;
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw new Error(`Failed to delete listing: ${error.message}`);
  }
};

/**
 * Get listings by type
 * @param {string} type - The type of listing
 * @returns {Promise<Array>} - Array of listings
 */
export const findListingsByType = async (type) => {
  try {
    const listings = await Listing.find({ type, status: 'active' }).sort({ createdAt: -1 });
    return listings;
  } catch (error) {
    throw new Error(`Failed to fetch listings by type: ${error.message}`);
  }
};

/**
 * Get featured listings (active listings with images)
 * @param {number} limit - Number of listings to return
 * @returns {Promise<Array>} - Array of featured listings
 */
export const findFeaturedListings = async (limit = 6) => {
  try {
    const listings = await Listing.find({ 
      status: 'active',
      'images.0': { $exists: true } // Has at least one image
    })
    .sort({ createdAt: -1 })
    .limit(limit);

    return listings;
  } catch (error) {
    throw new Error(`Failed to fetch featured listings: ${error.message}`);
  }
};

/**
 * Get currently available listings (with valid availability dates)
 * @param {number} limit - Number of listings to return
 * @returns {Promise<Array>} - Array of available listings
 */
export const findAvailableListings = async (limit = 12) => {
  try {
    const today = new Date();
    
    const listings = await Listing.find({ 
      status: 'active',
      availability: {
        $elemMatch: {
          from: { $lte: today },
          to: { $gte: today }
        }
      }
    })
    .sort({ createdAt: -1 })
    .limit(limit);

    return listings;
  } catch (error) {
    throw new Error(`Failed to fetch available listings: ${error.message}`);
  }
};