// Environment Variable Validation
// This ensures all critical variables are present before the app starts

const requiredEnvVars = [
  'JWT_SECRET',
  'SETUP_SECRET',
  'DATABASE_URL',
  'NODE_ENV'
];

function validateEnvironment() {
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
}

module.exports = { validateEnvironment };
