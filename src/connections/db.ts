import { config } from "@/configs/env-config";
import { createLogger } from "@/utils/loger";
import mongoose from "mongoose";

const logger = createLogger();

export const connectDatabase = async (): Promise<void>   => {
  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info("Connected to Mongo database");
  } catch (error) {
    logger.error("Error connecting to Mongo database", error as Error);
    process.exit(1);
  }
};

