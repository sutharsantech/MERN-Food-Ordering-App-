// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foodapp";
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Schemas & models
const FoodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  ecoFriendly: Boolean
});
const OrderSchema = new mongoose.Schema({
  items: [String],
  status: { type: String, default: "Preparing" },
  createdAt: { type: Date, default: Date.now }
});

const Food = mongoose.model("Food", FoodSchema);
const Order = mongoose.model("Order", OrderSchema);

// Routes
app.get("/api/foods", async (req, res) => {
  const foods = await Food.find();
  res.json(foods);
});

app.post("/api/orders", async (req, res) => {
  const { items } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: "No items" });
  const order = new Order({ items });
  await order.save();
  res.json(order);
});

app.get("/api/orders/:id", async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});

app.listen(PORT, () => console.log(`Backend running: http://localhost:${PORT}`));

