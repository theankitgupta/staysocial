import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define schema
const listingSchema = new Schema(
  {
    // Core Fields
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // Pricing & Currencies
    price: {
      base: { 
        type: Number, 
        required: true, 
        min: 0 
      },
      currency: {
        type: String,
        required: true,
        default: "INR",
        enum: ["INR", "USD", "EUR"],
      },
    },
    // Location & GeoJSON
    location: {
      street: { 
        type: String, 
        required: true, 
        trim: true 
      },
      city: { 
        type: String, 
        required: true, 
        trim: true 
      },
      state: { 
        type: String, 
        required: true, 
        trim: true 
      },
      country: { 
        type: String, 
        required: true, 
        trim: true 
      },
      pincode: { 
        type: String, 
        required: true, 
        trim: true 
      },
      geometry: {
        type: {
          type: String,
          enum: ["Point"],
          required: true,
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    // Media & Images
    images: {
      type: [
        {
          url: { 
            type: String, 
            required: true 
          },
          filename: { 
            type: String 
          }, // Useful for Cloudinary deletion
        },
      ],
      validate: [
        (val) => val.length >= 1 && val.length <= 5,
        "A listing must have between 1 and 5 images.",
      ],
    },
    // Specifications and Capacity
    maxGuests: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, default: 1, min: 0 },
    beds: { type: Number, default: 1, min: 1 },
    bathrooms: { type: Number, default: 1, min: 0 },
    // Categorization
    type: {
      type: String,
      required: true,
      enum: ["Entire Place", "Private Room", "Hotel Room", "Shared Room"],
    },
    amenities: {
      type: [String],
      default: [],
    },
    // Listing Status
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "blocked"],
      default: "active",
    },

    // Availability (date ranges)
    availability: [
      {
        from: { type: Date, required: true },
        to: { type: Date, required: true },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure valid date ranges
listingSchema.path("availability").validate(function (ranges) {
  return ranges.every((r) => r.to > r.from);
}, "Each availability range must have 'to' date later than 'from' date.");

// Geospatial index for location queries
listingSchema.index({ "location.geometry": "2dsphere" });

// Optional virtual field example (computed value)
listingSchema.virtual("shortDescription").get(function () {
  return this.description.length > 120
    ? this.description.substring(0, 117) + "..."
    : this.description;
});

// Create model
const Listing = model("Listing", listingSchema);

export default Listing;