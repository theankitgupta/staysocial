import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "../src/models/listing.model.js";

dotenv.config();

const sampleListings = [
  {
    title: "Cozy Studio in Delhi",
    description: "Compact studio apartment near Connaught Place, perfect for solo travelers.",
    price: 1200,
  },
  {
    title: "Modern 2BHK in Bangalore",
    description: "Spacious flat with fast Wi-Fi and balcony views of the city.",
    price: 2500,
  },
  {
    title: "Heritage Home in Jaipur",
    description: "Stay in a 200-year-old haveli with traditional interiors.",
    price: 1800,
  },
  {
    title: "Beachside Shack in Goa",
    description: "Rustic bamboo hut right on the sands of Anjuna Beach.",
    price: 2200,
  },
  {
    title: "Luxury Villa in Gurgaon",
    description: "4BHK villa with a private pool and garden, ideal for families.",
    price: 7500,
  },
  {
    title: "Budget PG in Pune",
    description: "Affordable shared accommodation for students and professionals.",
    price: 800,
  },
  {
    title: "Treehouse Retreat in Manali",
    description: "Wooden treehouse surrounded by pine forests and snowy peaks.",
    price: 3000,
  },
  {
    title: "Houseboat in Kerala",
    description: "Traditional houseboat stay in the backwaters of Alleppey.",
    price: 5000,
  },
  {
    title: "Compact 1BHK in Mumbai",
    description: "Fully furnished apartment close to Bandra station.",
    price: 2800,
  },
  {
    title: "Mountain Cabin in Mussoorie",
    description: "Cozy wooden cabin with a fireplace and valley views.",
    price: 3500,
  },
  {
    title: "Designer Loft in Hyderabad",
    description: "Open-plan loft with modern decor and smart home features.",
    price: 4200,
  },
  {
    title: "Farmstay in Punjab",
    description: "Rural experience with fields, tractors, and organic meals.",
    price: 1500,
  },
  {
    title: "Colonial Bungalow in Ooty",
    description: "Tea estate bungalow with vintage furniture and gardens.",
    price: 4000,
  },
  {
    title: "Capsule Pod in Chennai",
    description: "Futuristic pod-style accommodation near the airport.",
    price: 900,
  },
  {
    title: "Himalayan Homestay in Leh",
    description: "Experience Ladakhi culture with a warm family home.",
    price: 1600,
  },
  {
    title: "Studio Apartment in Noida",
    description: "Modern studio with kitchenette and metro access.",
    price: 2100,
  },
  {
    title: "Desert Camp in Jaisalmer",
    description: "Luxury tent under the stars with camel safari included.",
    price: 3700,
  },
  {
    title: "Riverside Cottage in Rishikesh",
    description: "Private riverside stay with yoga and rafting options.",
    price: 2800,
  },
  {
    title: "Lake View Apartment in Udaipur",
    description: "Balcony views of Lake Pichola and City Palace.",
    price: 3300,
  },
  {
    title: "Smart 1RK in Indore",
    description: "Minimalist one-room kitchen for solo professionals.",
    price: 1200,
  },
  {
    title: "Luxury Penthouse in Kolkata",
    description: "Top-floor penthouse with a terrace garden and city views.",
    price: 8500,
  },
  {
    title: "Eco Hut in Sikkim",
    description: "Sustainable bamboo hut with organic meals included.",
    price: 1900,
  },
  {
    title: "Shared Dorm in Delhi",
    description: "Hostel-style dormitory for backpackers and budget travelers.",
    price: 500,
  },
  {
    title: "Suburban Home in Nagpur",
    description: "Family-friendly home in a quiet residential colony.",
    price: 2000,
  },
  {
    title: "Luxury Hotel Room in Mumbai",
    description: "5-star hotel stay with breakfast and ocean views.",
    price: 9500,
  },
  {
    title: "Tiny House in Coorg",
    description: "Charming tiny house surrounded by coffee plantations.",
    price: 2600,
  },
  {
    title: "Studio Flat in Surat",
    description: "Affordable and modern studio with Wi-Fi and AC.",
    price: 1400,
  },
  {
    title: "Rustic Homestay in Himachal",
    description: "Family-run cottage with homemade food and trekking.",
    price: 1700,
  },
  {
    title: "Artistic Loft in Ahmedabad",
    description: "Loft filled with quirky artwork and an open kitchen.",
    price: 2800,
  },
  {
    title: "Countryside Farm in Haryana",
    description: "Farmhouse stay with tractor rides and dairy experience.",
    price: 2200,
  },
  {
    title: "Studio in Chandigarh",
    description: "Clean, compact apartment in a planned neighborhood.",
    price: 2000,
  },
  {
    title: "Luxury Tent in Ranthambore",
    description: "Safari tent with AC, perfect for tiger reserve visits.",
    price: 4500,
  },
  {
    title: "Seaside Villa in Pondicherry",
    description: "French-inspired villa right on the beach.",
    price: 6000,
  },
  {
    title: "Hilltop Lodge in Darjeeling",
    description: "Stay with tea garden views and vintage charm.",
    price: 3700,
  },
  {
    title: "Studio in Bhubaneswar",
    description: "Modern studio with all basic amenities.",
    price: 1600,
  },
  {
    title: "Traditional Homestay in Varanasi",
    description: "Live with a local family near the ghats.",
    price: 1500,
  },
  {
    title: "Lakefront Villa in Nainital",
    description: "Private villa with lake views and bonfire nights.",
    price: 7000,
  },
  {
    title: "Studio Flat in Lucknow",
    description: "Compact and cozy flat for business travelers.",
    price: 1700,
  },
  {
    title: "Heritage Haveli in Bikaner",
    description: "Royal haveli stay with frescoes and courtyards.",
    price: 3800,
  },
  {
    title: "Guesthouse in Shillong",
    description: "Charming guesthouse with music and local cuisine.",
    price: 2400,
  },
  {
    title: "Studio in Patna",
    description: "Comfortable stay with AC and Wi-Fi for professionals.",
    price: 1500,
  },
  {
    title: "Eco Resort in Andaman",
    description: "Beachfront eco-cottages built from local materials.",
    price: 5500,
  },
  {
    title: "Tent Stay in Spiti Valley",
    description: "Adventure tenting experience with bonfires.",
    price: 2300,
  },
  {
    title: "Downtown Apartment in Bhopal",
    description: "2BHK apartment close to markets and cafes.",
    price: 2500,
  },
  {
    title: "Cultural Homestay in Mysore",
    description: "Live with locals, enjoy yoga and traditional meals.",
    price: 1900,
  },
  {
    title: "Minimalist Loft in Vizag",
    description: "Modern minimalist loft with ocean view balcony.",
    price: 3100,
  },
  {
    title: "Studio Flat in Rajkot",
    description: "Affordable flat in the heart of the textile city.",
    price: 1300,
  },
  {
    title: "Luxury Stay in Chandigarh",
    description: "Premium service apartment with rooftop dining.",
    price: 4800,
  },
  {
    title: "Adventure Lodge in Uttarakhand",
    description: "Perfect for trekking and river rafting enthusiasts.",
    price: 2700,
  },
  {
    title: "Guesthouse in Siliguri",
    description: "Transit-friendly guesthouse with clean rooms.",
    price: 1200,
  },
];

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    await Listing.deleteMany({});
    console.log("Old listings cleared.");

    await Listing.insertMany(sampleListings);
    console.log("Database seeded successfully with sample listings!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    mongoose.connection.close();
  }
}

main();