import express from 'express';
import { 
  getAllListings, 
  renderNewForm, 
  createListing,
  getListingById,
  renderEditForm,
  updateListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { 
  validate, 
  listingSchema 
} from '../utils/validation.js';

const router = express.Router();

// GET /listings → fetch all listings
router.get("/", getAllListings);

// GET /listings/new → render form to create a new listing
router.get('/new', renderNewForm);

// POST /listings → create a new listing
router.post('/', validate(listingSchema), createListing);

// GET /listings/:id → fetch a single listing
router.get("/:id", getListingById);

// GET /listings/:id/edit → render form to edit a listing
router.get("/:id/edit", renderEditForm);

// PUT /listings/:id → update a listing
router.put("/:id", validate(listingSchema), updateListing);

// DELETE /listings/:id → delete a listing
router.delete("/:id", deleteListing);

export default router;