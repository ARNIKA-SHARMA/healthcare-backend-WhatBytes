const express = require("express");
const cors = require("cors");
const { sequelize } = require("./db");

// Import routes
const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patients");
const doctorRoutes = require("./routes/doctors");
const mappingRoutes = require("./routes/mappings");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/mappings", mappingRoutes);

// Database connection and server start
sequelize.sync({ alter: true }) // alter:true will keep schema updated (use { force:true } to drop & recreate tables)
  .then(() => {
    console.log("Database connected and synced successfully!!");
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

