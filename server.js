const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
 // Notes routes
const userRouter = require("./routes/User");   // Users routes

const app = express();

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ MongoDB URI (use env var on Render)
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://aryanuser:aryanmongo@cluster0.bikutzo.mongodb.net/aryanuser";

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// ------------------- ROUTES -------------------
app.get("/", (req, res) => {
  res.json({ statuscode: res.statusCode, message: "🚀 API Works!" });
});

// ✅ Use routes
app.use("/users", userRouter);

// ------------------- SERVER -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("=====================================");
  console.log(`🎯 Server started at PORT: ${PORT}`);
  console.log(`👉 Click here: http://localhost:${PORT}`);
  console.log("=====================================");
});