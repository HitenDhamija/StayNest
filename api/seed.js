require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Place = require("./models/Place");

const MONGO_URI = process.env.DB_URL || "mongodb://127.0.0.1:27017/staynest";

const samplePlaces = [
  {
    title: "Mountain View Cabin",
    address: "Shimla, Himachal Pradesh, India",
    photos: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    description: "A cozy mountain cabin with breathtaking views of the Himalayas.",
    perks: ["wifi", "free-parking", "tv", "pets-allowed"],
    extraInfo: "Check-in after 2 PM.",
    maxGuests: 6,
    price: 3500,
  },
  {
    title: "Beachfront Villa",
    address: "Goa, India",
    photos: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    ],
    description: "Luxurious beachfront villa with private access to the beach.",
    perks: ["wifi", "free-parking", "pool", "air-conditioning"],
    extraInfo: "Pets are not allowed.",
    maxGuests: 8,
    price: 8500,
  },
  {
    title: "Heritage Haveli Stay",
    address: "Jaipur, Rajasthan, India",
    photos: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    ],
    description: "Experience royal Rajasthani hospitality in this restored heritage haveli.",
    perks: ["wifi", "breakfast", "air-conditioning", "tv"],
    extraInfo: "Traditional dinner available on request.",
    maxGuests: 4,
    price: 5000,
  },
  {
    title: "Lake House Retreat",
    address: "Nainital, Uttarakhand, India",
    photos: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    ],
    description: "A charming lakefront house with panoramic views of Naini Lake.",
    perks: ["wifi", "free-parking", "breakfast", "pets-allowed"],
    extraInfo: "Kayaking can be arranged.",
    maxGuests: 5,
    price: 4200,
  },
  {
    title: "Valley View Homestay",
    address: "Manali, Himachal Pradesh, India",
    photos: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    description: "Nestled in the Kullu valley with stunning views of snow-capped peaks.",
    perks: ["wifi", "free-parking", "breakfast"],
    extraInfo: "Bonfire on request.",
    maxGuests: 7,
    price: 3800,
  },
  {
    title: "Luxury Apartment",
    address: "Mumbai, Maharashtra, India",
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    description: "Modern luxury apartment in the heart of the city.",
    perks: ["wifi", "air-conditioning", "tv", "gym"],
    extraInfo: "24/7 security.",
    maxGuests: 3,
    price: 6000,
  },
  {
    title: "Backwater Houseboat",
    address: "Alleppey, Kerala, India",
    photos: [
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
    ],
    description: "Traditional Kerala houseboat experience on the famous backwaters.",
    perks: ["wifi", "meals-included", "air-conditioning"],
    extraInfo: "Full board meals included.",
    maxGuests: 6,
    price: 12000,
  },
  {
    title: "Forest Treehouse",
    address: "Coorg, Karnataka, India",
    photos: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    description: "Live among the treetops in this unique treehouse surrounded by coffee plantations.",
    perks: ["wifi", "free-parking", "breakfast", "pets-allowed"],
    extraInfo: "Coffee plantation tour included.",
    maxGuests: 4,
    price: 7500,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await Place.deleteMany({});
    console.log("Cleared existing places");

    let user = await User.findOne({ email: "demo@staynest.com" });
    if (!user) {
      user = await User.create({
        name: "Demo User",
        email: "demo@staynest.com",
        password: "password123",
      });
      console.log("Created demo user (demo@staynest.com / password123)");
    }

    const places = samplePlaces.map((p) => ({ ...p, owner: user._id }));
    await Place.insertMany(places);
    console.log(`Seeded ${places.length} places`);

    await mongoose.disconnect();
    console.log("Done!");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
