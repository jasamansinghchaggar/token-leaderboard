import mongoose, { type Document, Schema } from "mongoose";

export interface IUser extends Document {
  publicKey: string;
  walletName: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    publicKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    walletName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
