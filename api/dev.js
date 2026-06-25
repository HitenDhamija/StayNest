const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('./models/User');
const Place = require('./models/Place');

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
    description: "A cozy mountain cabin with breathtaking views of the Himalayas. Perfect for a weekend getaway with family or friends. Wake up to misty mornings and crisp mountain air.",
    perks: ["wifi", "free-parking", "tv", "pets-allowed"],
    extraInfo: "Check-in after 2 PM. Check-out before 11 AM. The cabin has a fully equipped kitchen.",
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
    description: "A charming colonial-era cottage nestled among pine trees. Enjoy panoramic valley views from the wraparound porch.",
    perks: ["wifi", "free-parking", "breakfast", "fireplace"],
    extraInfo: "Heated rooms. Winter bonfire available. Trekking guides on request.",
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
    description: "Luxurious beachfront villa with private access to the beach. Enjoy stunning sunset views from the terrace.",
    perks: ["wifi", "free-parking", "pool", "air-conditioning"],
    extraInfo: "Pets are not allowed. Pool available 24/7. Beach towels provided.",
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
    description: "Rustic beach shack steps from Anjuna beach. Perfect for backpackers and solo travelers looking for the real Goa experience.",
    perks: ["wifi", "free-parking", "breakfast", "pets-allowed"],
    extraInfo: "Shared kitchen. Night market walking distance. Bike rental available.",
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
    description: "Experience royal Rajasthani hospitality in this restored heritage haveli. Intricate architecture and traditional decor.",
    perks: ["wifi", "breakfast", "air-conditioning", "tv"],
    extraInfo: "Traditional Rajasthani dinner available on request. Rooftop terrace.",
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
    description: "Glamping in the Thar Desert with starry skies and camel rides. Luxury tents with attached bathrooms.",
    perks: ["wifi", "meals-included", "air-conditioning", "free-parking"],
    extraInfo: "Includes camel safari and folk music evening. Desert safari at extra cost.",
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
    description: "A charming lakefront house with panoramic views of Naini Lake. Ideal for couples and small families.",
    perks: ["wifi", "free-parking", "breakfast", "pets-allowed"],
    extraInfo: "Kayaking and boating can be arranged at extra cost.",
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
    description: "Nestled in the Kullu valley with stunning views of snow-capped peaks. A serene retreat for nature lovers.",
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
    description: "Peaceful riverside cottage near the Ganges. Perfect for yoga retreats and spiritual getaways.",
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
    description: "Modern luxury apartment in the heart of the city. Close to restaurants, shopping, and nightlife.",
    perks: ["wifi", "air-conditioning", "tv", "gym"],
    extraInfo: "24/7 security and concierge service. Parking included.",
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
    description: "Traditional Kerala houseboat experience on the famous backwaters. Includes all meals and a crew.",
    perks: ["wifi", "meals-included", "air-conditioning", "tv"],
    extraInfo: "Full board meals included. 1Night/2Day cruise package.",
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
    description: "Live among the treetops in this unique treehouse surrounded by coffee plantations and lush greenery.",
    perks: ["wifi", "free-parking", "breakfast", "pets-allowed"],
    extraInfo: "Coffee plantation tour included. Bonfire available.",
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
    description: "Premium houseboat with air-conditioned bedrooms and a private upper deck for bird watching.",
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
    description: "Heritage bungalow amidst rolling tea gardens with Kanchenjunga views. Wake up to the aroma of fresh tea.",
    perks: ["wifi", "breakfast", "fireplace", "free-parking"],
    extraInfo: "Tea garden tour included. Toy train ride nearby.",
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
    description: "French colonial beach house in the White Town area. Walking distance to Promenade Beach and cafes.",
    perks: ["wifi", "free-parking", "air-conditioning", "breakfast"],
    extraInfo: "Bicycle rental available. Auroville day trip organized.",
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
    description: "High-altitude lodge with stunning views of the Ladakh range. Oxygen support available for acclimatization.",
    perks: ["wifi", "meals-included", "free-parking"],
    extraInfo: "Altitude: 11,500ft. Heater in rooms. Inner line permit assistance.",
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
    description: "Boutique hotel with direct views of Lake Pichola and the City Palace. Rooftop dining with sunset views.",
    perks: ["wifi", "breakfast", "air-conditioning", "pool"],
    extraInfo: "Boat ride on Lake Pichola included. Traditional puppet show on weekends.",
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
    description: "Beachfront cottage on the pristine Radhanagar Beach. Snorkeling and scuba diving nearby.",
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
    description: "Heritage stay overlooking the ancient ruins of the Vijayanagara Empire. Perfect for history buffs.",
    perks: ["wifi", "free-parking", "breakfast", "air-conditioning"],
    extraInfo: "Guided heritage walk included. Coracle ride on the Tungabhadra river.",
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
    description: "Traditional Kashmiri houseboat on Dal Lake with shikara rides included. Walnut wood interiors.",
    perks: ["wifi", "meals-included", "heater", "tv"],
    extraInfo: "Shikara ride included. Mughal garden tours arranged.",
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
    description: "A restored haveli overlooking the Ganges ghats. Wake up to the sound of temple bells and morning aarti.",
    perks: ["wifi", "breakfast", "air-conditioning", "heater"],
    extraInfo: "Ganga aarti viewing from rooftop. Walking tour of old city included.",
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
    description: "Unique cottage built into the cliffs near living root bridges. Experience the wettest place on Earth in comfort.",
    perks: ["wifi", "free-parking", "breakfast", "fireplace"],
    extraInfo: "Trek to living root bridges. Cave exploration with guide.",
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
    description: "Villa surrounded by tea and spice plantations in the Western Ghats. Misty mornings and cool mountain air.",
    perks: ["wifi", "free-parking", "breakfast", "pool"],
    extraInfo: "Spice plantation tour included. Bonfire and BBQ on request.",
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
    description: "Stay inside a restored desert fort with sand dune views. Royal Rajasthani cuisine and folk performances.",
    perks: ["wifi", "meals-included", "air-conditioning", "free-parking"],
    extraInfo: "Camel safari and desert safari included. Folk dance evening.",
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
    description: "Portuguese-style house on the Mandovi River. Private jetty with kayaks and paddleboards.",
    perks: ["wifi", "free-parking", "pool", "air-conditioning"],
    extraInfo: "Kayak and paddleboard use included. Old Goa tours arranged.",
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
    description: "Authentic tribal homestay in the Satpura hills. Experience the culture of the Gond tribe firsthand.",
    perks: ["wifi", "free-parking", "breakfast", "meals-included"],
    extraInfo: "Village walk and tribal dance performance. Nature trails nearby.",
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
    description: "Cozy cottage on a Nilgiri hilltop with 360-degree valley views. Famous for its wind chimes and sunrise deck.",
    perks: ["wifi", "free-parking", "breakfast", "fireplace"],
    extraInfo: "Toy train ride to Ooty. Botanical garden visit included.",
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
    description: "Eco-lodge on the edge of Ranthambore tiger reserve. Spot tigers, leopards, and exotic birds on safari.",
    perks: ["wifi", "meals-included", "free-parking", "air-conditioning"],
    extraInfo: "Two jungle safaris included. Naturalist guide provided.",
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
    description: "Handcrafted walnut wood cottage in the meadows of Gulmarg. Skiing in winter, golf in summer.",
    perks: ["wifi", "heater", "meals-included", "free-parking"],
    extraInfo: "Gondola ride included. Skiing equipment available in winter.",
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
    description: "Eco-friendly bamboo hut perched on the red cliffs of Varkala. Direct access to the black sand beach below.",
    perks: ["wifi", "free-parking", "breakfast", "pets-allowed"],
    extraInfo: "Cliff-top yoga classes. Ayurvedic spa nearby.",
    maxGuests: 2,
    price: 3000,
  },
];

async function seedDatabase(uri) {
  await mongoose.connect(uri);
  console.log("Connected to in-memory MongoDB");

  await Place.deleteMany({});
  await User.deleteMany({});

  const user = await User.create({
    name: "Demo User",
    email: "demo@staynest.com",
    password: "password123",
  });
  console.log("Created demo user (demo@staynest.com / password123)");

  const places = samplePlaces.map((p) => ({ ...p, owner: user._id }));
  await Place.insertMany(places);
  console.log(`Seeded ${places.length} sample places`);
}

async function start() {
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  console.log(`In-memory MongoDB started at: ${uri}`);

  await seedDatabase(uri);

  process.env.DB_URL = uri;
  process.env.PORT = process.env.PORT || 8000;

  require('./index');
}

start();
