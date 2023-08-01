import { config } from "dotenv";

config();

const dbConfig = {
  // MongoDB connection string
  db: "mongodb://localhost:27017/test",
};

export default dbConfig;
