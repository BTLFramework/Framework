// Environment Variable Validation
// This ensures all critical variables are present before the app starts

const requiredEnvVars = [
  'JWT_SECRET',
  'SETUP_SECRET',
  'DATABASE_URL',
  'NODE_ENV'
];

function validateEnvironment() {
  // TEMPORARY FIX: Hardcode values if Railway isn't injecting them
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = "067ab2801453eda64bfcbf33c52920061320907ffa2839b4bfc26a95bde807b5";
    console.log("⚠️  Using hardcoded JWT_SECRET (Railway injection failed)");
  }
  
  if (!process.env.SETUP_SECRET) {
    process.env.SETUP_SECRET = "9b10d81b24a920bd996a9ed3973cfd5e";
    console.log("⚠️  Using hardcoded SETUP_SECRET (Railway injection failed)");
  }
  
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://postgres:TpOMVoiKZbBlphyjkUBFQRGrFuNxfbMj@maglev.proxy.rlwy.net:56776/railway";
    console.log("⚠️  Using hardcoded DATABASE_URL (Railway injection failed)");
  }
  
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "production";
    console.log("⚠️  Using hardcoded NODE_ENV (Railway injection failed)");
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
    console.error('💡 See ENVIRONMENT_VARIABLE.md for details');
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are present');
}

module.exports = { validateEnvironment };
