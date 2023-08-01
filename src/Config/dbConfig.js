import { config } from "dotenv";

config();

const dbConfig = {
  // MongoDB connection string
  db: "mongodb://127.0.0.1:27017/test",
};

export default dbConfig;
