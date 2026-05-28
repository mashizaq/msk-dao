import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  passwordHash: string;
  walletAddress: string;
  solanaPubkey?: string;
  stacksAddress?: string;
  contributionCredits: number;
  role: 'member' | 'council' | 'admin';
  isVerified: boolean;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
  };
  governance: {
    votingPower: number;
    proposalsCreated: number;
    votesParticipated: number;
    lastVotedAt?: Date;
  };
  rewards: {
    solBalance: number;
    dogeBalance: number;
    usdtBalance: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    walletAddress: { type: String, required: true, unique: true },
    solanaPubkey: String,
    stacksAddress: String,
    contributionCredits: { type: Number, default: 0 },
    role: { type: String, enum: ['member', 'council', 'admin'], default: 'member' },
    isVerified: { type: Boolean, default: false },
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
      bio: String,
      location: String,
      website: String,
    },
    governance: {
      votingPower: { type: Number, default: 0 },
      proposalsCreated: { type: Number, default: 0 },
      votesParticipated: { type: Number, default: 0 },
      lastVotedAt: Date,
    },
    rewards: {
      solBalance: { type: Number, default: 0 },
      dogeBalance: { type: Number, default: 0 },
      usdtBalance: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
