console.log("✅ envValidation.js is running at runtime");

console.log("✅ envValidation.js loaded and executing");

// Environment Variable Validation
// This ensures all critical variables are present before the app starts

const requiredEnvVars = [
  'JWT_SECRET',
  'SETUP_SECRET',
  'DATABASE_URL',
  'NODE_ENV'
];

function validateEnvironment() {
  // Check if Railway environment variables are properly set
  if (!process.env.JWT_SECRET) {
    console.error("❌ CRITICAL: JWT_SECRET not set in Railway environment");
    process.exit(1);
  }
  
  if (!process.env.SETUP_SECRET) {
    console.error("❌ CRITICAL: SETUP_SECRET not set in Railway environment");
    process.exit(1);
  }
  
  if (!process.env.DATABASE_URL) {
    console.error("❌ CRITICAL: DATABASE_URL not set in Railway environment");
    process.exit(1);
  }
  
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "production";
    console.log("ℹ️  Setting NODE_ENV to production for Railway deployment");
  }

  const missing = [];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.error('❌ CRITICAL: Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n💡 Add these variables in Railway Dashboard → Variables tab');
    console.error('💡 See ENVIRONMENT_VARIABLES.md for details');
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are present');
  console.log('🚀 Railway deployment environment validated successfully');
}

module.exports = { validateEnvironment };
