import mongoose, { Schema, Document } from 'mongoose';

export interface IVote extends Document {
  proposalId: mongoose.Types.ObjectId;
  voterId: mongoose.Types.ObjectId;
  vote: 'for' | 'against' | 'abstain';
  votingPower: number;
  timestamp: Date;
}

const voteSchema = new Schema<IVote>(
  {
    proposalId: { type: Schema.Types.ObjectId, ref: 'Proposal', required: true },
    voterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vote: { type: String, enum: ['for', 'against', 'abstain'], required: true },
    votingPower: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Compound index to prevent double voting
voteSchema.index({ proposalId: 1, voterId: 1 }, { unique: true });

export const Vote = mongoose.model<IVote>('Vote', voteSchema);
