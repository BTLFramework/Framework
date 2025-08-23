console.log("🔥 IF YOU SEE THIS, THE RIGHT FILE RAN 🔥");
console.log("Current working directory:", process.cwd());
console.log("Node version:", process.version);
console.log("Environment variables:", {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
});
