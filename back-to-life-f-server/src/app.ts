// Global error handlers - MUST be first
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err?.stack || err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

console.log("💡 app.ts is running ✅");

// Fail fast if wrong image/environment (temporarily disabled)
if (false && (!process.env.EXPECT_MARKER || process.env.EXPECT_MARKER !== 'ROBUST_RESOLVER_V4')) {
  console.error('❌ WRONG IMAGE/ENV: EXPECT_MARKER mismatch', process.env.EXPECT_MARKER);
  process.exit(1);
}

// Log build stamp at runtime
try {
  const stamp = fs.readFileSync(path.resolve(__dirname, '.buildstamp'), 'utf8').trim();
  console.log('🧾 BUILD_STAMP:', stamp);
} catch {
  console.log('🧾 BUILD_STAMP: (missing)');
}

import './config/envValidation';

console.log("🟢 App entrypoint executing:", __dirname);

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
const authRoutes = require("./routes/authRoutes").default;
const janeRoutes = require("./routes/janeRoutes").default;
const patientRoutes = require("./routes/patientRoutes").default;
const patientPortalRoutes = require("./routes/patientPortalRoutes2").default;
const clinicalNotesRoutes = require("./routes/clinicalNotesRoutes").default;
const recoveryPointsRoutes = require("./routes/recoveryPointsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const practitionerAssessmentRoutes = require("./routes/practitionerAssessmentRoutes");
// Use require for getAssignedExercisesByEmail to avoid import issues
const { getAssignedExercisesByEmail } = require("./models/patientModel");
import { Request, Response } from "express";

dotenv.config();

// CORS DEBUGGING: To enable debug mode, set DEBUG_CORS=true in environment variables
// This will allow all origins for troubleshooting CORS issues
// DEPLOYMENT TIMESTAMP: 2025-01-27 15:45 UTC - Force Railway redeploy with updated compiled code

// Validate environment variables before starting
console.log('🔍 Starting environment validation...');
const { validateEnvironment } = require('./config/envValidation');
console.log('✅ Environment validation module loaded');
validateEnvironment();
console.log('✅ Environment validation completed');

// Prisma runtime check
console.log('🔌 Testing Prisma connection...');
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.$connect()
  .then(() => console.log('✅ Prisma connected'))
  .catch(err => console.error('❌ Prisma connection failed:', err));

console.log('🚀 Creating Express app...');
const app = express();
console.log('✅ Express app created successfully');

console.log('🔧 Setting up logging middleware...');
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
// UPDATED: Railway deployment with exact drop-in CORS logic for Vercel previews
// DEPLOYMENT TIMESTAMP: 2025-01-27 - Railway deployment with drop-in CORS setup

const allowedOrigins = [
  'https://dashboard.theframework.vercel.app', // custom domain (future)
  'http://localhost:3000',                     // local dev
  'http://localhost:3001', 
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  // Railway production domains
  'https://framework-production-92f5.up.railway.app',
  // Production frontend domains
  'https://backtolife.vercel.app',
  'https://intake.backtolife.vercel.app', 
  'https://clinician.backtolife.vercel.app',
  'https://patientportalupdate.vercel.app',
  'https://back-to-life-f.vercel.app',
  'https://back-to-life-f-3.vercel.app',
  'https://dashboard.vercel.app',
  'https://the-framework.vercel.app',
  'https://framework-recovery.vercel.app',
  'https://theframework-app.vercel.app',
  'https://framework-portal.vercel.app',
  // Current dashboard URL
  'https://dashboard-kdpgzr1ic-theframework.vercel.app',
  // Additional dashboard URLs from logs
  'https://dashboard-ag1sllt22-theframework.vercel.app',
  'https://dashboard-2awgqzcyj-theframework.vercel.app',
  'https://dashboard-pddbpp75m-theframework.vercel.app',
  'https://theframework-dashboard.vercel.app',
  'https://dashboard-e9khyy8u1-theframework.vercel.app',
  'https://dashboard-4xar3wl7e-theframework.vercel.app',
  'https://dashboard-5057ubz7n-theframework.vercel.app',
  'https://patientportalupdate-theframework.vercel.app',
  'https://back-to-life-f-3-theframework.vercel.app',
  'https://dashboard-theframework.vercel.app',
  'https://dashboard-vercel.vercel.app',
  'https://dashboard-vercel-theframework.vercel.app',
  'https://back-to-life-f-3-vercel.vercel.app',
  'https://dashboard-three-taupe-47.vercel.app'
];

// Comprehensive CORS origin checker for all Vercel deployments
const dynamicOriginCheck = function (origin: string | undefined, callback: any) {
  console.log('✅ Running comprehensive CORS middleware');
  console.log('Incoming Origin:', origin);

  // Multiple regex patterns to catch all Vercel deployment variations
  const vercelPatterns = [
    /^https:\/\/dashboard-[\w-]+-[\w-]+\.vercel\.app$/,           // dashboard-xxx-yyy.vercel.app
    /^https:\/\/dashboard-[\w-]+\.vercel\.app$/,                   // dashboard-xxx.vercel.app
    /^https:\/\/[\w-]+-[\w-]+\.vercel\.app$/,                      // xxx-yyy.vercel.app
    /^https:\/\/[\w-]+\.vercel\.app$/,                             // xxx.vercel.app
    /^https:\/\/[\w-]+-theframework\.vercel\.app$/                 // xxx-theframework.vercel.app
  ];
  
  // Debug logging
  console.log('🔍 CORS Debug Details:');
  console.log('   - Origin:', origin);
  console.log('   - No origin check:', !origin);
  console.log('   - In allowed origins:', allowedOrigins.includes(origin || ''));
  
  // Test against all regex patterns
  let regexMatch = false;
  for (let i = 0; i < vercelPatterns.length; i++) {
    if (vercelPatterns[i].test(origin || '')) {
      regexMatch = true;
      console.log(`   - Regex pattern ${i + 1} matched:`, vercelPatterns[i].toString());
      break;
    }
  }
  console.log('   - Any regex pattern matched:', regexMatch);

  if (
    !origin ||                             // Allow non-browser tools
    allowedOrigins.includes(origin) ||     // Allow exact whitelisted origins
    regexMatch                             // Allow any Vercel deployment URL
  ) {
    console.log('✅ CORS: Origin allowed');
    callback(null, true);
  } else {
    console.log('❌ CORS: Origin rejected');
    console.log('   - Rejected origin:', origin);
    console.log('   - Allowed origins count:', allowedOrigins.length);
    console.log('   - Regex patterns tested:', vercelPatterns.length);
    callback(new Error(`Not allowed by CORS: ${origin}`));
  }
};

// Clean CORS configuration for Railway deployment
console.log('🚀 Railway CORS Configuration loaded with exact drop-in logic');
console.log('📋 Allowed origins count:', allowedOrigins.length);
console.log('🔍 Railway URL included:', allowedOrigins.includes('https://framework-production-92f5.up.railway.app'));

// Environment-based CORS configuration
const isDevelopment = process.env.NODE_ENV === 'development';
const isDebugMode = process.env.DEBUG_CORS === 'true';

console.log(`🔧 CORS Mode: ${isDevelopment ? 'Development' : 'Production'}`);
console.log(`🐛 Debug Mode: ${isDebugMode ? 'Enabled' : 'Disabled'}`);

// Fallback CORS for development or debug mode
if (isDevelopment || isDebugMode) {
  console.log('🚨 DEVELOPMENT/DEBUG MODE: Using permissive CORS');
  app.use(cors({
    origin: true, // Allow all origins in dev/debug mode
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['*'],
    exposedHeaders: ['Set-Cookie']
  }));
} else {
  console.log('🔒 PRODUCTION MODE: Using strict CORS with comprehensive pattern matching');
  app.use(cors({
    origin: dynamicOriginCheck,
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
}

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

// Health check route for Railway
app.get('/healthz', (_: any, res: any) => res.status(200).send('ok'));

app.use("/auth", authRoutes);
app.use("/jane", janeRoutes);
app.use("/patients", patientRoutes);
app.use("/api/patient-portal", patientPortalRoutes);
app.use("/api/recovery-points", recoveryPointsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/practitioner-assessment", practitionerAssessmentRoutes);
app.use("/api/clinical-notes", clinicalNotesRoutes);

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
