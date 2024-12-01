import crypto from "node:crypto";
import mongoose, { type Document, type Model, Schema } from "mongoose";

interface UserPreferences {
  enable2FA: boolean;
  emailNotification: boolean;
  twoFactorSecret?: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  userPreferences: UserPreferences;

  // Method to compare passwords
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Extend the model type to include static methods
export interface UserModel extends Model<UserDocument> {
  hashPassword(password: string): Promise<string>;
}

const userPreferencesSchema = new Schema<UserPreferences>({
  enable2FA: { type: Boolean, default: false },
  emailNotification: { type: Boolean, default: false },
  twoFactorSecret: { type: String, required: false },
});

const userSchema = new Schema<UserDocument, UserModel>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name must be less than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  isEmailVerified: { type: Boolean, default: false },
  userPreferences: { type: userPreferencesSchema, required: true }
},{
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if  (!this.isModified('password')) { return next(); }

  try {
    // Hash password using crypto
    this.password = await UserModel.hashPassword(this.password);
    next();
  } catch (error) {
    return next(error as Error);
  }
});

// Static method to hash password
userSchema.statics.hashPassword = async (password: string): Promise<string> => {
  // Use crypto to create a salt and hash
  const salt = crypto.randomBytes(16).toString('hex');
  const hash =  await crypto.pbkdf2Sync(
    password,
    salt,
    1000,  // iterations
    64,    // key length
    'sha512' // digest algorithm
  ).toString('hex');

  return `${salt}:${hash}`;
};

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  const [salt, originalHash] = this.password.split(':');

  const candidateHash = await crypto.pbkdf2Sync(
    candidatePassword,
    salt,
    1000,
    64,
    'sha512'
  ).toString('hex');

  return candidateHash === originalHash;
};

// JSON transformation
userSchema.set('toJSON', {

  transform: (_doc, ret):UserDocument => {
    const { password, userPreferences, ...rest } = ret;
    const { twoFactorSecret, ...safePreferences } = userPreferences || {};
    return { ...rest, userPreferences: safePreferences };
  }

});

export const UserModel = mongoose.model<UserDocument, UserModel>("User", userSchema);