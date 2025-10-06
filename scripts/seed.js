import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "../src/models/listing.model.js";

dotenv.config();

function getCoordinatesForCity(city) {
  const cityCoordinates = {
    "Delhi": [77.1025, 28.7041],
    "Bangalore": [77.5946, 12.9716],
    "Jaipur": [75.7873, 26.9124],
    "Goa": [73.8278, 15.4909],
    "Gurgaon": [77.0266, 28.4595],
    "Pune": [73.8567, 18.5204],
    "Manali": [77.1734, 32.2396],
    "Kerala": [76.2711, 10.8505],
    "Mumbai": [72.8777, 19.0760],
    "Mussoorie": [78.0700, 30.4590],
    "Hyderabad": [78.4867, 17.3850],
    "Punjab": [75.3413, 31.1471],
    "Ooty": [76.6936, 11.4102],
    "Chennai": [80.2707, 13.0827],
    "Leh": [77.5770, 34.1526],
    "Noida": [77.3910, 28.5355],
    "Jaisalmer": [70.9026, 26.9157],
    "Rishikesh": [78.2676, 30.0869],
    "Udaipur": [73.7125, 24.5854],
    "Indore": [75.8577, 22.7196],
    "Kolkata": [88.3639, 22.5726],
    "Sikkim": [88.5122, 27.5330],
    "Nagpur": [79.0882, 21.1458],
    "Coorg": [75.7388, 12.4202],
    "Surat": [72.8311, 21.1702],
    "Himachal": [77.1734, 31.1048],
    "Ahmedabad": [72.5714, 23.0225],
    "Haryana": [76.0856, 29.0588],
    "Chandigarh": [76.7794, 30.7333],
    "Ranthambore": [76.3937, 26.0170],
    "Pondicherry": [79.8083, 11.9416],
    "Darjeeling": [88.2636, 27.0341],
    "Bhubaneswar": [85.8245, 20.2961],
    "Varanasi": [82.9739, 25.3176],
    "Nainital": [79.4623, 29.3803],
    "Lucknow": [80.9462, 26.8467],
    "Bikaner": [73.3119, 28.0229],
    "Shillong": [91.8933, 25.5788],
    "Patna": [85.1376, 25.5941],
    "Andaman": [92.7265, 11.6234],
    "Spiti Valley": [78.4336, 32.2432],
    "Bhopal": [77.4126, 23.2599],
    "Mysore": [76.6394, 12.2958],
    "Vizag": [83.2185, 17.6868],
    "Rajkot": [70.8022, 22.3039],
    "Uttarakhand": [78.9630, 30.0668],
    "Siliguri": [88.4336, 26.7271]
  };

  return cityCoordinates[city] || [77.2090, 28.6139]; // Default to Delhi coordinates
}

// Helper function to generate sample images
function generateSampleImages() {
  const imageCount = 1 + Math.floor(Math.random() * 4); // Always 1-4 images
  const images = [];
  for (let i = 1; i <= imageCount; i++) {
    images.push({
      url: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
      filename: `listing-image-${Date.now()}-${i}`
    });
  }
  return images;
}

// Helper function to generate availability dates
function generateAvailability() {
  const from = new Date();
  const to = new Date();
  to.setDate(to.getDate() + 30 + Math.floor(Math.random() * 60)); // 30-90 days from now
  return [{ from, to }];
}

// Helper function to generate amenities based on type
function generateAmenities(type) {
  const baseAmenities = ["Wi-Fi", "Kitchen", "Air Conditioning"];
  
  if (type === "Entire Place") {
    return [...baseAmenities, "Private Entrance", "Free Parking", "Washing Machine"];
  } else if (type === "Private Room") {
    return [...baseAmenities, "Shared Kitchen", "Laundry Access"];
  } else if (type === "Hotel Room") {
    return [...baseAmenities, "Daily Cleaning", "Room Service", "Swimming Pool"];
  } else {
    return [...baseAmenities, "Shared Bathroom", "Common Area"];
  }
}

// Helper function to generate capacity based on type
function generateCapacity(type) {
  if (type === "Entire Place") {
    return {
      maxGuests: 2 + Math.floor(Math.random() * 6), // 2-8 guests
      bedrooms: 1 + Math.floor(Math.random() * 3), // 1-4 bedrooms
      beds: 1 + Math.floor(Math.random() * 4), // 1-5 beds
      bathrooms: 1 + Math.floor(Math.random() * 2) // 1-3 bathrooms
    };
  } else if (type === "Private Room") {
    return {
      maxGuests: 1 + Math.floor(Math.random() * 2), // 1-3 guests
      bedrooms: 1,
      beds: 1,
      bathrooms: 1
    };
  } else if (type === "Hotel Room") {
    return {
      maxGuests: 1 + Math.floor(Math.random() * 2), // 1-3 guests
      bedrooms: 1,
      beds: 1 + Math.floor(Math.random() * 2), // 1-3 beds
      bathrooms: 1
    };
  } else {
    return {
      maxGuests: 1,
      bedrooms: 0,
      beds: 1,
      bathrooms: 1
    };
  }
}

const sampleListings = [
  {
    title: "Cozy Studio in Delhi",
    description: "Compact studio apartment near Connaught Place, perfect for solo travelers.",
    price: {
      base: 1200,
      currency: "INR"
    },
    location: {
      street: "12-B Connaught Place",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110001",
      geometry: {
        type: "Point",
        coordinates: getCoordinatesForCity("Delhi")
      }
    },
    type: "Entire Place",
    status: "active"
  },
  {
    title: "Modern 2BHK in Bangalore",
    description: "Spacious flat with fast Wi-Fi and balcony views of the city.",
    price: {
      base: 2500,
      currency: "INR"
    },
    location: {
      street: "45 Koramangala 5th Block",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      pincode: "560034",
      geometry: {
        type: "Point",
        coordinates: getCoordinatesForCity("Bangalore")
      }
    },
    type: "Entire Place",
    status: "active"
  },
  {
    title: "Heritage Home in Jaipur",
    description: "Stay in a 200-year-old haveli with traditional interiors.",
    price: {
      base: 1800,
      currency: "INR"
    },
    location: {
      street: "23 Hawa Mahal Road",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
      pincode: "302002",
      geometry: {
        type: "Point",
        coordinates: getCoordinatesForCity("Jaipur")
      }
    },
    type: "Entire Place",
    status: "active"
  },
  {
    title: "Beachside Shack in Goa",
    description: "Rustic bamboo hut right on the sands of Anjuna Beach.",
    price: {
      base: 2200,
      currency: "INR"
    },
    location: {
      street: "Anjuna Beach Road",
      city: "Goa",
      state: "Goa",
      country: "India",
      pincode: "403509",
      geometry: {
        type: "Point",
        coordinates: getCoordinatesForCity("Goa")
      }
    },
    type: "Entire Place",
    status: "active"
  },
  {
    title: "Luxury Villa in Gurgaon",
    description: "4BHK villa with a private pool and garden, ideal for families.",
    price: {
      base: 7500,
      currency: "INR"
    },
    location: {
      street: "DLF Phase 5",
      city: "Gurgaon",
      state: "Haryana",
      country: "India",
      pincode: "122002",
      geometry: {
        type: "Point",
        coordinates: getCoordinatesForCity("Gurgaon")
      }
    },
    type: "Entire Place",
    status: "active"
  },
  {
    title: "Budget PG in Pune",
    description: "Affordable shared accommodation for students and professionals.",
    price: {
      base: 800,
      currency: "INR"
    },
    location: {
      street: "FC Road",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      pincode: "411004",
      geometry: {
        type: "Point",
        coordinates: getCoordinatesForCity("Pune")
      }
    },
    type: "Shared Room",
    status: "active"
  },
  {
    title: "Treehouse Retreat in Manali",
    description: "Wooden treehouse surrounded by pine forests and snowy peaks.",
    price: {
      base: 3000,
      currency: "INR"
    },
    location: {
      street: "Old Manali Road",
      city: "Manali",
      state: "Himachal Pradesh",
      country: "India",
      pincode: "175131",
      geometry: {
        type: "Point",
        coordinates: getCoordinatesForCity("Manali")
      }
    },
    type: "Entire Place",
    status: "active"
  },
  {
    title: "Houseboat in Kerala",
    description: "Traditional houseboat stay in the backwaters of Alleppey.",
    price: {
      base: 5000,
      currency: "INR"
    },
    location: {
      street: "Alleppey Backwaters",
      city: "Kerala",
      state: "Kerala",
      country: "India",
      pincode: "688013",
      geometry: {
        type: "Point",
        coordinates: getCoordinatesForCity("Kerala")
      }
    },
    type: "Entire Place",
    status: "active"
  },
  {
    title: "Compact 1BHK in Mumbai",
    description: "Fully furnished apartment close to Bandra station.",
    price: {
      base: 2800,
      currency: "INR"
    },
    location: {
      street: "Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400050",
      geometry: {
        type: "Point",
        coordinates: getCoordinatesForCity("Mumbai")
      }
    },
    type: "Entire Place",
    status: "active"
  },
  {
    title: "Mountain Cabin in Mussoorie",
    description: "Cozy wooden cabin with a fireplace and valley views.",
    price: {
      base: 3500,
      currency: "INR"
    },
    location: {
      street: "Camel's Back Road",
      city: "Mussoorie",
      state: "Uttarakhand",
      country: "India",
      pincode: "248179",
      geometry: {
        type: "Point",
        coordinates: getCoordinatesForCity("Mussoorie")
      }
    },
    type: "Entire Place",
    status: "active"
  }
];

// Enhance sample listings with generated data
const enhancedListings = sampleListings.map(listing => {
  const capacity = generateCapacity(listing.type);
  return {
    ...listing,
    ...capacity,
    images: generateSampleImages(), // 1-4 images
    amenities: generateAmenities(listing.type),
    availability: generateAvailability()
  };
});

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    await Listing.deleteMany({});
    console.log("Old listings cleared.");

    await Listing.insertMany(enhancedListings);
    console.log("Database seeded successfully with sample listings!");

  // Display some stats
    const stats = await Listing.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price.base" }
        }
      }
    ]);
    
    console.log("\nListing Statistics:");
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} listings, Avg Price: ₹${stat.avgPrice.toFixed(2)}`);
    });
    
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

main();