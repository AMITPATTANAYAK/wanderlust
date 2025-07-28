// ===================================================
// DATABASE INITIALIZATION SCRIPT
// ===================================================
// This script connects to the MongoDB database,
// clears existing data in the 'listings' collection,
// and populates it with new data from 'data.js'.
// ===================================================

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// --- Database Connection ---
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// --- Database Seeding Function ---
const initDB = async () => {
  // 1. Clear all existing documents from the collection
  console.log("Clearing existing data...");
  await Listing.deleteMany({});
  console.log("Existing data cleared.");

  // 2. Transform the data to match the schema
  // The original data has 'image' as an object, but the schema expects a string.
  // We use .map() to create a new array where the 'image' field is just the URL.
  console.log("Transforming data...");
  const transformedData = initData.data.map((obj) => ({
    ...obj, // Copy all fields from the original object
    image: obj.image.url, // Replace the 'image' object with just its 'url' string
  }));
  console.log("Data transformed successfully.");


  // 3. Insert the transformed data into the database
  console.log("Inserting new data...");
  await Listing.insertMany(transformedData);
  console.log("Data was initialized successfully!");
};

// --- Execute the Function ---
// This line calls the initDB function to start the process.
initDB().then(() => {
    // Close the connection after the script is done
    mongoose.connection.close();
    console.log("Database connection closed.");
});
