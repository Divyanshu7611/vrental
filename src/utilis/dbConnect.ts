import mongoose from "mongoose";

const mongoDBUrl =
  process.env.MONGODB_URL ||
  "mongodb+srv://dvyanshudb:t4cNwb8WoHuqg8hJ@cluster0.0ikjeoq.mongodb.net/vrental";

export const ConnectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB.");
      return mongoose.connection.asPromise();
    } else {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(mongoDBUrl, { family: 4 });
      console.log("Connected to MongoDB.");
      return mongoose.connection;
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export const DisconnectMongoDB = async () => {
  try {
    console.log("Disconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw error;
  }
};
