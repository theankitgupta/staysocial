import express from 'express';
import { 
  getAllListings, 
  renderNewForm, 
  createListing,
  getListingById,
} from "../controllers/listing.controller.js";

const router = express.Router();

// GET /listings → fetch all listings
router.get("/", getAllListings);

// GET /listings/new → render form to create a new listing
router.get('/new', renderNewForm);
// POST /listings → create a new listing
router.post('/', createListing);

// GET /listings/:id → fetch a single listing
router.get("/:id", getListingById);

export default router;