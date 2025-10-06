import express from 'express';
import { 
  getAllListings, 
  renderNewForm, 
  createListing,
  getListingById,
  renderEditForm,
  updateListing,
  deleteListing,
  searchListings
} from "../controllers/listing.controller.js";
import { 
  validate, 
  validateQuery, 
  listingSchema, 
  listingUpdateSchema, 
  listingSearchSchema 
} from '../utils/validation.js';

const router = express.Router();

// GET /listings → fetch all listings (with optional search/filter)
router.get("/", validateQuery(listingSearchSchema), getAllListings);

// GET /listings/search → search listings with filters
router.get("/search", validateQuery(listingSearchSchema), searchListings);

// GET /listings/new → render form to create a new listing
router.get('/new', renderNewForm);

// POST /listings → create a new listing
router.post('/', validate(listingSchema), createListing);

// GET /listings/:id → fetch a single listing
router.get("/:id", getListingById);

// GET /listings/:id/edit → render form to edit a listing
router.get("/:id/edit", renderEditForm);

// PUT /listings/:id → update a listing
router.put("/:id", validate(listingUpdateSchema), updateListing);

// DELETE /listings/:id → delete a listing
router.delete("/:id", deleteListing);

export default router;