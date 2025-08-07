// Debug script to check environment variables in Railway
console.log('🔍 Environment Variables Debug');
console.log('=============================');

// Check critical environment variables
const criticalVars = [
  'DATABASE_URL',
  'JWT_SECRET', 
  'SETUP_SECRET',
  'NODE_ENV',
  'PORT'
];

console.log('\n📋 Critical Variables:');
criticalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive values
    if (varName.includes('SECRET') || varName.includes('URL')) {
      console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

// Check all environment variables (for debugging)
console.log('\n🔍 All Environment Variables:');
Object.keys(process.env).forEach(key => {
  const value = process.env[key];
  if (key.includes('SECRET') || key.includes('URL') || key.includes('PASSWORD')) {
    console.log(`${key}: ${value ? value.substring(0, 10) + '...' : 'NOT SET'}`);
  } else {
    console.log(`${key}: ${value || 'NOT SET'}`);
  }
});

// Test database connection
console.log('\n🗄️ Testing Database Connection...');
try {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  prisma.$connect()
    .then(() => {
      console.log('✅ Database connection successful');
      return prisma.$queryRaw`SELECT 1 as test`;
    })
    .then((result) => {
      console.log('✅ Database query successful:', result);
      return prisma.$disconnect();
    })
    .catch((error) => {
      console.error('❌ Database connection failed:', error.message);
    });
} catch (error) {
  console.error('❌ Failed to initialize Prisma:', error.message);
}

console.log('\n🏁 Debug complete'); 