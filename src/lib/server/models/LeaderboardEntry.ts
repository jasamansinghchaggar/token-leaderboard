import mongoose, { type Document, Schema } from "mongoose";

export interface ILeaderboardEntry extends Document {
  publicKey: string;
  balance: number;
  rank: number;
  lastFetched: Date;
  updatedAt: Date;
}

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    publicKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      required: true,
    },
    lastFetched: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

leaderboardEntrySchema.index({ lastFetched: 1 }, { expireAfterSeconds: 86400 });

export const LeaderboardEntryModel =
  mongoose.models.LeaderboardEntry ||
  mongoose.model<ILeaderboardEntry>("LeaderboardEntry", leaderboardEntrySchema);
