import { ThirtyDaysFromNow } from "@/utils/date-time";
import mongoose,  { Schema,type Document } from "mongoose";

export interface SessionDocument extends Document {
  userId: mongoose.Types.ObjectId,
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
}

const sessionSchema = new Schema<SessionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    userAgent: { type: String },
    expiresAt: { type: Date, required: true,default: ThirtyDaysFromNow },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)


export const  SessionModel = mongoose.model<SessionDocument>("session", sessionSchema)