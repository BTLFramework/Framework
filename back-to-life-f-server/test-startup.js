console.log('🚀 Test startup script starting...');
console.log('✅ Basic console.log works');
console.log('🔍 Environment check:');
console.log('   - NODE_ENV:', process.env.NODE_ENV);
console.log('   - PORT:', process.env.PORT);
console.log('   - DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('✅ Test startup script completed successfully');
