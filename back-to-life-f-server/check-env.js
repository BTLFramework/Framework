#!/usr/bin/env node

console.log('🔍 Checking environment variables...\n');

const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET', 
  'SETUP_SECRET',
  'NODE_ENV'
];

let allSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing`);
    allSet = false;
  }
});

console.log('\n📊 Database URL Preview:');
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  const parts = dbUrl.split('@');
  if (parts.length > 1) {
    console.log(`   Host: ${parts[1].split('/')[0]}`);
    console.log(`   Database: ${parts[1].split('/')[1]?.split('?')[0] || 'Unknown'}`);
  }
} else {
  console.log('   No DATABASE_URL found');
}

console.log('\n🚀 Environment Status:', allSet ? 'READY' : 'MISSING VARIABLES');

if (!allSet) {
  console.log('\n❌ Please set all required environment variables before starting the server');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set');
}
