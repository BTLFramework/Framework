import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from "./routes/authRoutes";
import janeRoutes from "./routes/janeRoutes";
import patientRoutes from "./routes/patientRoutes";
import patientPortalRoutes from "./routes/patientPortalRoutes2";
import clinicalNotesRoutes from "./routes/clinicalNotesRoutes";
const recoveryPointsRoutes = require("./routes/recoveryPointsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const practitionerAssessmentRoutes = require("./routes/practitionerAssessmentRoutes");
// Use require for getAssignedExercisesByEmail to avoid import issues
const { getAssignedExercisesByEmail } = require("./models/patientModel");
import { Request, Response } from "express";

dotenv.config();

// CORS DEBUGGING: To enable debug mode, set DEBUG_CORS=true in environment variables
// This will allow all origins for troubleshooting CORS issues
// DEPLOYMENT TIMESTAMP: 2025-08-22 22:37 UTC - Force Railway redeploy with enhanced CORS debugging

// Validate environment variables before starting
const { validateEnvironment } = require('./config/envValidation');
validateEnvironment();

const app = express();

// Enhanced logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  
  // Log response status
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[${timestamp}] Response: ${res.statusCode} for ${req.method} ${req.path}`);
    return originalSend.call(this, data);
  };
  
  next();
});

// CORS configuration - Railway deployment focused
// UPDATED: Railway deployment with proper CORS configuration for production frontends
// DEPLOYMENT TIMESTAMP: 2025-01-27 - Railway deployment with production CORS setup

const allowedOrigins = [
  // Local development HTTP (for development only)
  "http://localhost:3000",
  "http://localhost:3001", 
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  // Railway production domains
  "https://framework-production-92f5.up.railway.app",
  // Production frontend domains
  "https://backtolife.vercel.app",
  "https://intake.backtolife.vercel.app", 
  "https://clinician.backtolife.vercel.app",
  "https://patientportalupdate.vercel.app",
  "https://back-to-life-f.vercel.app",
  "https://back-to-life-f-3.vercel.app",
  "https://dashboard.vercel.app",
  "https://the-framework.vercel.app",
  "https://framework-recovery.vercel.app",
  "https://theframework-app.vercel.app",
  "https://framework-portal.vercel.app",
  // Environment variable fallbacks
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ...(process.env.PATIENT_PORTAL_URL ? [process.env.PATIENT_PORTAL_URL] : []),
  ...(process.env.CLINICIAN_DASHBOARD_URL ? [process.env.CLINICIAN_DASHBOARD_URL] : [])
];

// Clean CORS configuration for Railway deployment
console.log('🚀 Railway CORS Configuration loaded');
console.log('📋 Allowed origins count:', allowedOrigins.length);
console.log('🔍 Railway URL included:', allowedOrigins.includes('https://framework-production-92f5.up.railway.app'));

// Environment-based CORS configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isDebugMode = process.env.DEBUG_CORS === 'true';

console.log(`🔧 CORS Mode: ${isDevelopment ? 'Development' : 'Production'}`);
console.log(`🐛 Debug Mode: ${isDebugMode ? 'Enabled' : 'Disabled'}`);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('🌐 CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    console.log(`🌐 CORS: Checking origin: ${origin}`);
    
    // In debug mode, allow all origins for troubleshooting
    if (isDebugMode) {
      console.log(`🐛 DEBUG MODE: Allowing all origins including ${origin}`);
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS: Allowing origin: ${origin}`);
      callback(null, true);
    } else {
      console.log(`🚫 CORS: Blocking origin: ${origin}`);
      console.log(`📋 Allowed origins:`, allowedOrigins);
      console.log(`❌ CORS Error: Origin ${origin} not allowed`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cookie', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

// Note: CORS middleware handles OPTIONS requests automatically
// No need for explicit OPTIONS handler

// Additional CORS debugging middleware to catch any issues
app.use((req, res, next) => {
  // Log CORS-related headers for debugging
  if (req.headers.origin) {
    console.log(`🔍 Request CORS Debug:`);
    console.log(`   - Origin: ${req.headers.origin}`);
    console.log(`   - Method: ${req.method}`);
    console.log(`   - Path: ${req.path}`);
    console.log(`   - Origin in allowed list: ${allowedOrigins.includes(req.headers.origin)}`);
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Debug middleware to log request body
app.use((req, res, next) => {
  if (req.path.includes('/auth/')) {
    console.log("Auth request body:", req.body);
    console.log("Auth request headers:", req.headers);
  }
  next();
});

// Root route to keep server alive
app.get("/", (req, res) => {
  res.json({ 
    message: "Back to Life Server is running!",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      patients: "/patients",
      auth: "/auth",
      test: "/test"
    }
  });
});

// Test route
app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Test route working!" });
});

// Health check endpoint with database status
app.get("/health", async (req, res) => {
  try {
    // Test database connection using centralized Prisma instance
    const prisma = require('./db').default;
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({ 
      status: "OK", 
      database: "Connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      endpoints: {
        patients: "/patients",
        patientPortal: "/api/patient-portal",
        auth: "/auth"
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: "ERROR",
      database: "Disconnected",
      error: error.message || 'Unknown error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
});

app.use("/auth", authRoutes);
app.use("/jane", janeRoutes);
app.use("/patients", patientRoutes);
app.use("/api/patient-portal", patientPortalRoutes);
app.use("/api/recovery-points", recoveryPointsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/practitioner-assessment", practitionerAssessmentRoutes);
app.use("/api/clinical-notes", clinicalNotesRoutes);

// Specific CORS preflight handler for messages endpoint
app.options('/api/messages/*', (req, res) => {
  console.log('🔍 CORS Preflight request for messages endpoint');
  console.log('   - Origin:', req.headers.origin);
  console.log('   - Method:', req.headers['access-control-request-method']);
  console.log('   - Headers:', req.headers['access-control-request-headers']);
  
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// Direct route for assigned exercises (for Next.js API proxy compatibility)
app.get("/api/patient-portal/exercises/:email", async (req: any, res: any) => {
  try {
    const { email } = req.params;
    const data = await getAssignedExercisesByEmail(email);
    if (!data) {
      return res.status(404).json({ error: "No exercises found for this patient" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assigned exercises" });
  }
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Global error handler:', err);
  
  // Special handling for CORS errors
  if (err.message && err.message.includes('CORS')) {
    console.error('🚫 CORS Error Details:');
    console.error('   - Error:', err.message);
    console.error('   - Request Origin:', req.headers.origin);
    console.error('   - Request Path:', req.path);
    console.error('   - Request Method:', req.method);
    console.error('   - Allowed Origins:', allowedOrigins);
    console.error('   - Origin in allowed list:', req.headers.origin ? allowedOrigins.includes(req.headers.origin) : 'No origin');
    
    // Send CORS-specific error response
    res.status(403).json({ 
      error: 'CORS Error',
      message: err.message,
      origin: req.headers.origin,
      path: req.path,
      timestamp: new Date().toISOString()
    });
  } else {
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

const PORT = process.env.PORT || 3001;

console.log(`🚀 Starting server on port ${PORT}`);
console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔗 Database URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}`);
console.log(`🔗 Environment Variables Debug:`);
console.log(`   - NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   - PORT: ${process.env.PORT}`);
console.log(`   - JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
console.log(`   - SETUP_SECRET: ${process.env.SETUP_SECRET ? 'Set' : 'Not set'}`);

// Use Railway's PORT or fallback to 3001
const serverPort = parseInt(process.env.PORT || '3001', 10);

app.listen(serverPort, '0.0.0.0', () => {
  console.log(`✅ HTTP Server running at http://0.0.0.0:${serverPort}`);
  console.log(`🏥 Health check available at http://0.0.0.0:${serverPort}/health`);
  console.log(`👥 Patient routes available at http://0.0.0.0:${serverPort}/patients`);
}).on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

export default app;
