import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./routes/authRoutes";
import janeRoutes from "./routes/janeRoutes";
import patientRoutes from "./routes/patientRoutes";
import patientPortalRoutes from "./routes/patientPortalRoutes2";

dotenv.config();

const app = express();

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:5178"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(cookieParser());

// Debug middleware to log request body
app.use((req, res, next) => {
  if (req.path.includes('/auth/')) {
    console.log("Auth request body:", req.body);
    console.log("Auth request headers:", req.headers);
  }
  next();
});

// Test route
app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Test route working!" });
});

app.use("/auth", authRoutes);
app.use("/jane", janeRoutes);
app.use("/patients", patientRoutes);
app.use("/api/patient-portal", patientPortalRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});

export default app;
