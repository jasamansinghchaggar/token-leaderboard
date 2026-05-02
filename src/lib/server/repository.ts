import { connectDB } from "./db";
import { LeaderboardEntryModel } from "./models/LeaderboardEntry";
import { User } from "./models/User";

export async function createUser(publicKey: string, walletName: string) {
  await connectDB();
  return User.findOneAndUpdate(
    { publicKey },
    { publicKey, walletName },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );
}

export async function getAllUsers() {
  await connectDB();
  const users = await User.find({}, { publicKey: 1, _id: 0 });
  return users.map((user) => user.publicKey);
}

export async function updateLeaderboardEntry(publicKey: string, balance: number, rank: number) {
  await connectDB();
  return LeaderboardEntryModel.findOneAndUpdate(
    { publicKey },
    { publicKey, balance, rank, lastFetched: new Date() },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );
}

export async function getLeaderboardEntries() {
  await connectDB();
  return LeaderboardEntryModel.find().sort({ rank: 1 });
}

export async function deleteAllLeaderboardEntries() {
  await connectDB();
  await LeaderboardEntryModel.deleteMany({});
}
