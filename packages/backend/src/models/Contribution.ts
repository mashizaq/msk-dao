import mongoose, { Schema, Document } from 'mongoose';

export interface IContribution extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'research' | 'logistics' | 'mentorship' | 'voting' | 'proposal';
  credits: number;
  description: string;
  proof?: string; // IPFS hash or URL
  verified: boolean;
  verifiedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contributionSchema = new Schema<IContribution>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['research', 'logistics', 'mentorship', 'voting', 'proposal'],
      required: true,
    },
    credits: { type: Number, required: true },
    description: { type: String, required: true },
    proof: String,
    verified: { type: Boolean, default: false },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Contribution = mongoose.model<IContribution>('Contribution', contributionSchema);
