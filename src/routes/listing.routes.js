import express from 'express';
import { getAllListings } from "../controllers/listing.controller.js";

const router = express.Router();

// GET /listings
router.get("/", getAllListings);

export default router;