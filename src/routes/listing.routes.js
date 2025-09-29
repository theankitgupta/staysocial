import express from 'express';
import { 
  getAllListings, 
  getListingById 
} from "../controllers/listing.controller.js";

const router = express.Router();

// GET /listings
router.get("/", getAllListings);

// GET /listings/:id → fetch a single listing
router.get("/:id", getListingById);

export default router;