import mongoose from "mongoose";
import type { Document } from "mongoose";

// biome-ignore lint/nursery/noEnum: <explanation>
enum VerificationEnum {
  SMS = 0,
  EMAIL = 1
}

export interface VerificationCodeDocument extends Document {
  userId: mongoose.Types.ObjectId;
  code: number;
  type: VerificationEnum;
  expiresAt: Date;
  createdAt: Date;
}

const generateUniqueCode = (): number => Math.floor(Math.random() * 90000) + 10000;

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", index: true },
    code: { type: Number, required: true, unique: true, default: generateUniqueCode },
    type: { type: Number, enum: VerificationEnum, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const VerificationModel = mongoose.model<VerificationCodeDocument>("Verification", verificationCodeSchema);