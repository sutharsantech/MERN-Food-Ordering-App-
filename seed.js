import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foodapp";

const FoodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  ecoFriendly: Boolean
});

const Food = mongoose.model("Food", FoodSchema);

const seedData = JSON.parse(fs.readFileSync("./data/menu.json", "utf-8"));

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    await Food.deleteMany();
    await Food.insertMany(seedData);
    console.log("✅ Menu data inserted successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error inserting menu:", err);
  }
};

seedDB();
