require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Place = require("./models/Place");

const MONGO_URI = process.env.DB_URL || "mongodb://127.0.0.1:27017/staynest";

const samplePlaces = [
  {
    title: "Snow Peak Mountain Cabin",
    address: "Shimla, Himachal Pradesh, India",
    photos: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    description: "A cozy mountain cabin with breathtaking views of the Himalayas. Perfect for a weekend getaway.",
    perks: ["wifi", "free-parking", "tv", "pets-allowed"],
    extraInfo: "Check-in after 2 PM. Check-out before 11 AM.",
    maxGuests: 6,
    price: 3500,
  },
  {
    title: "Colonial Ridge Cottage",
    address: "Shimla, Himachal Pradesh, India",
    photos: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800",
    ],
    description: "A charming colonial-era cottage nestled among pine trees with panoramic valley views.",
    perks: ["wifi", "free-parking", "breakfast", "fireplace"],
    extraInfo: "Heated rooms. Winter bonfire available.",
    maxGuests: 5,
    price: 4500,
  },
  {
    title: "Beachfront Villa",
    address: "Goa, India",
    photos: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    description: "Luxurious beachfront villa with private access to the beach. Enjoy stunning sunset views.",
    perks: ["wifi", "free-parking", "pool", "air-conditioning"],
    extraInfo: "Pets are not allowed. Pool available 24/7.",
    maxGuests: 8,
    price: 8500,
  },
  {
    title: "Anjuna Beach Shack",
    address: "Goa, India",
    photos: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
      "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7c?w=800",
    ],
    description: "Rustic beach shack steps from Anjuna beach. Perfect for backpackers and solo travelers.",
    perks: ["wifi", "free-parking", "breakfast", "pets-allowed"],
    extraInfo: "Shared kitchen. Night market walking distance.",
    maxGuests: 2,
    price: 2000,
  },
  {
    title: "Heritage Haveli Stay",
    address: "Jaipur, Rajasthan, India",
    photos: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d955e5bde?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    description: "Experience royal Rajasthani hospitality in this restored heritage haveli.",
    perks: ["wifi", "breakfast", "air-conditioning", "tv"],
    extraInfo: "Traditional Rajasthani dinner available. Rooftop terrace.",
    maxGuests: 4,
    price: 5000,
  },
  {
    title: "Desert Camp Luxury Tent",
    address: "Jaisalmer, Rajasthan, India",
    photos: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
      "https://images.unsplash.com/photo-1548018560-c7196e771014?w=800",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
    ],
    description: "Glamping in the Thar Desert with starry skies and camel rides.",
    perks: ["wifi", "meals-included", "air-conditioning", "free-parking"],
    extraInfo: "Includes camel safari and folk music evening.",
    maxGuests: 3,
    price: 7000,
  },
  {
    title: "Lake House Retreat",
    address: "Nainital, Uttarakhand, India",
    photos: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    description: "A charming lakefront house with panoramic views of Naini Lake.",
    perks: ["wifi", "free-parking", "breakfast", "pets-allowed"],
    extraInfo: "Kayaking and boating can be arranged.",
    maxGuests: 5,
    price: 4200,
  },
  {
    title: "Valley View Homestay",
    address: "Manali, Himachal Pradesh, India",
    photos: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800",
    ],
    description: "Nestled in the Kullu valley with stunning views of snow-capped peaks.",
    perks: ["wifi", "free-parking", "breakfast", "fireplace"],
    extraInfo: "Trekking guides can be arranged. Bonfire on request.",
    maxGuests: 7,
    price: 3800,
  },
  {
    title: "Riverside Cottage",
    address: "Rishikesh, Uttarakhand, India",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800",
    ],
    description: "Peaceful riverside cottage near the Ganges. Perfect for yoga retreats.",
    perks: ["wifi", "free-parking", "breakfast", "air-conditioning"],
    extraInfo: "Yoga sessions available. River rafting trips on request.",
    maxGuests: 4,
    price: 3200,
  },
  {
    title: "Luxury Apartment",
    address: "Mumbai, Maharashtra, India",
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7f34b5e9a65?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    description: "Modern luxury apartment in the heart of the city.",
    perks: ["wifi", "air-conditioning", "tv", "gym"],
    extraInfo: "24/7 security and concierge service.",
    maxGuests: 3,
    price: 6000,
  },
  {
    title: "Backwater Houseboat",
    address: "Alleppey, Kerala, India",
    photos: [
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    ],
    description: "Traditional Kerala houseboat experience on the famous backwaters.",
    perks: ["wifi", "meals-included", "air-conditioning", "tv"],
    extraInfo: "Full board meals included.",
    maxGuests: 6,
    price: 12000,
  },
  {
    title: "Forest Treehouse",
    address: "Coorg, Karnataka, India",
    photos: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    description: "Live among the treetops in this unique treehouse surrounded by coffee plantations.",
    perks: ["wifi", "free-parking", "breakfast", "pets-allowed"],
    extraInfo: "Coffee plantation tour included.",
    maxGuests: 4,
    price: 7500,
  },
  {
    title: "Houseboat Serenity",
    address: "Kumarakom, Kerala, India",
    photos: [
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    ],
    description: "Premium houseboat with air-conditioned bedrooms and a private upper deck.",
    perks: ["wifi", "meals-included", "air-conditioning", "free-parking"],
    extraInfo: "Ayurvedic massage available on board.",
    maxGuests: 4,
    price: 15000,
  },
  {
    title: "Tea Garden Bungalow",
    address: "Darjeeling, West Bengal, India",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    ],
    description: "Heritage bungalow amidst rolling tea gardens with Kanchenjunga views.",
    perks: ["wifi", "breakfast", "fireplace", "free-parking"],
    extraInfo: "Tea garden tour included.",
    maxGuests: 5,
    price: 5500,
  },
  {
    title: "Pondicherry Beach House",
    address: "Pondicherry, Tamil Nadu, India",
    photos: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    ],
    description: "French colonial beach house in the White Town area.",
    perks: ["wifi", "free-parking", "air-conditioning", "breakfast"],
    extraInfo: "Bicycle rental available.",
    maxGuests: 4,
    price: 4000,
  },
  {
    title: "Ladakh Mountain Lodge",
    address: "Leh, Ladakh, India",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800",
    ],
    description: "High-altitude lodge with stunning views of the Ladakh range.",
    perks: ["wifi", "meals-included", "free-parking"],
    extraInfo: "Heater in rooms. Inner line permit assistance.",
    maxGuests: 3,
    price: 9000,
  },
  {
    title: "Udaipur Lake Palace View",
    address: "Udaipur, Rajasthan, India",
    photos: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d955e5bde?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    description: "Boutique hotel with direct views of Lake Pichola and the City Palace.",
    perks: ["wifi", "breakfast", "air-conditioning", "pool"],
    extraInfo: "Boat ride on Lake Pichola included.",
    maxGuests: 2,
    price: 8000,
  },
  {
    title: "Andaman Beach Cottage",
    address: "Havelock Island, Andaman, India",
    photos: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
    ],
    description: "Beachfront cottage on the pristine Radhanagar Beach.",
    perks: ["wifi", "free-parking", "breakfast", "air-conditioning"],
    extraInfo: "Scuba diving arrangements. Ferry transfers included.",
    maxGuests: 2,
    price: 11000,
  },
  {
    title: "Hampi Heritage Stay",
    address: "Hampi, Karnataka, India",
    photos: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d955e5bde?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    ],
    description: "Heritage stay overlooking the ancient ruins of the Vijayanagara Empire.",
    perks: ["wifi", "free-parking", "breakfast", "air-conditioning"],
    extraInfo: "Guided heritage walk included.",
    maxGuests: 3,
    price: 3000,
  },
  {
    title: "Srinagar Houseboat",
    address: "Srinagar, Jammu & Kashmir, India",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    ],
    description: "Traditional Kashmiri houseboat on Dal Lake with shikara rides included.",
    perks: ["wifi", "meals-included", "heater", "tv"],
    extraInfo: "Shikara ride included. Mughal garden tours.",
    maxGuests: 4,
    price: 10000,
  },
  {
    title: "Heritage Haveli in Old City",
    address: "Varanasi, Uttar Pradesh, India",
    photos: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d955e5bde?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    description: "A restored haveli overlooking the Ganges ghats.",
    perks: ["wifi", "breakfast", "air-conditioning", "heater"],
    extraInfo: "Ganga aarti viewing from rooftop.",
    maxGuests: 4,
    price: 4500,
  },
  {
    title: "Meghalaya Cave Cottage",
    address: "Cherrapunji, Meghalaya, India",
    photos: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    description: "Unique cottage built into the cliffs near living root bridges.",
    perks: ["wifi", "free-parking", "breakfast", "fireplace"],
    extraInfo: "Trek to living root bridges included.",
    maxGuests: 3,
    price: 5000,
  },
  {
    title: "Spice Garden Villa",
    address: "Munnar, Kerala, India",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    ],
    description: "Villa surrounded by tea and spice plantations in the Western Ghats.",
    perks: ["wifi", "free-parking", "breakfast", "pool"],
    extraInfo: "Spice plantation tour included.",
    maxGuests: 6,
    price: 6500,
  },
  {
    title: "Rajasthani Desert Fort Stay",
    address: "Bikaner, Rajasthan, India",
    photos: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
      "https://images.unsplash.com/photo-1548018560-c7196e771014?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
      "https://images.unsplash.com/photo-1590490360182-c33d955e5bde?w=800",
    ],
    description: "Stay inside a restored desert fort with sand dune views.",
    perks: ["wifi", "meals-included", "air-conditioning", "free-parking"],
    extraInfo: "Camel safari included.",
    maxGuests: 4,
    price: 7500,
  },
  {
    title: "Goa River House",
    address: "Panaji, Goa, India",
    photos: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    description: "Portuguese-style house on the Mandovi River with private jetty.",
    perks: ["wifi", "free-parking", "pool", "air-conditioning"],
    extraInfo: "Kayak and paddleboard use included.",
    maxGuests: 5,
    price: 7000,
  },
  {
    title: "Tribal Homestay Experience",
    address: "Pachmarhi, Madhya Pradesh, India",
    photos: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800",
    ],
    description: "Authentic tribal homestay in the Satpura hills.",
    perks: ["wifi", "free-parking", "breakfast", "meals-included"],
    extraInfo: "Village walk and tribal dance included.",
    maxGuests: 4,
    price: 2500,
  },
  {
    title: "Hilltop Wind Chime Cottage",
    address: "Ooty, Tamil Nadu, India",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    ],
    description: "Cozy cottage on a Nilgiri hilltop with 360-degree valley views.",
    perks: ["wifi", "free-parking", "breakfast", "fireplace"],
    extraInfo: "Toy train ride to Ooty included.",
    maxGuests: 4,
    price: 4000,
  },
  {
    title: "Jungle Safari Lodge",
    address: "Ranthambore, Rajasthan, India",
    photos: [
      "https://images.unsplash.com/photo-1548018560-c7196e771014?w=800",
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
    ],
    description: "Eco-lodge on the edge of Ranthambore tiger reserve.",
    perks: ["wifi", "meals-included", "free-parking", "air-conditioning"],
    extraInfo: "Two jungle safaris included.",
    maxGuests: 3,
    price: 12000,
  },
  {
    title: "Kashmir Walnut Wood Cottage",
    address: "Gulmarg, Jammu & Kashmir, India",
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    ],
    description: "Handcrafted walnut wood cottage in the meadows of Gulmarg.",
    perks: ["wifi", "heater", "meals-included", "free-parking"],
    extraInfo: "Gondola ride included.",
    maxGuests: 4,
    price: 9500,
  },
  {
    title: "Beachside Bamboo Hut",
    address: "Varkala, Kerala, India",
    photos: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800",
    ],
    description: "Eco-friendly bamboo hut perched on the red cliffs of Varkala.",
    perks: ["wifi", "free-parking", "breakfast", "pets-allowed"],
    extraInfo: "Cliff-top yoga classes available.",
    maxGuests: 2,
    price: 3000,
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
