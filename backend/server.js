const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Load environment variables from potential .env locations
[
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend", ".env"),
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "backend", ".env")
].forEach((envPath) => {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
});

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const harvestRoutes = require("./routes/harvestRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const marketRoutes = require("./routes/marketRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const chatRoutes = require("./routes/chatRoutes");
const enamRoutes = require("./routes/enamRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Create Express app
const app = express();

// CORS Configuration for Production (Vercel -> Render) and Local Development
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://farm-os-beta-roan.vercel.app",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, server-to-server, Postman)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    // Reflect origin for any other Vercel preview or production deployments
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true
}));


app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/harvests", harvestRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/enam", enamRoutes);
// Swagger API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Home Route
app.get("/", (req, res) => {
  res.send("🌾 FarmOS Backend is Running!");
});

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
