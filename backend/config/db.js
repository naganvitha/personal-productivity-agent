const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/productivity_agent';
    
    // Set a quick timeout for local connection attempt
    mongoose.set('strictQuery', false);
    
    try {
      await mongoose.connect(connStr, {
        serverSelectionTimeoutMS: 2000
      });
      console.log(`[Database] MongoDB Connected to local instance: ${mongoose.connection.host}`);
    } catch (localErr) {
      console.log('[Database] Local MongoDB not detected. Launching in-memory MongoDB server for seamless zero-config operation...');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] In-Memory MongoDB Connected at: ${memoryUri}`);
    }
  } catch (err) {
    console.error(`[Database Error] Connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
