import mongoose, { Schema, Document } from 'mongoose';

export interface IProposal extends Document {
  title: string;
  description: string;
  author: mongoose.Types.ObjectId;
  category: 'governance' | 'treasury' | 'project' | 'amendment';
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorumRequired: number;
  quorumMet: boolean;
  startDate: Date;
  endDate: Date;
  executionData?: {
    contractAddress: string;
    functionName: string;
    parameters: any[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const proposalSchema = new Schema<IProposal>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      enum: ['governance', 'treasury', 'project', 'amendment'],
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'passed', 'rejected', 'executed'],
      default: 'draft',
    },
    votesFor: { type: Number, default: 0 },
    votesAgainst: { type: Number, default: 0 },
    votesAbstain: { type: Number, default: 0 },
    quorumRequired: { type: Number, default: 30 },
    quorumMet: { type: Boolean, default: false },
    startDate: Date,
    endDate: Date,
    executionData: {
      contractAddress: String,
      functionName: String,
      parameters: [Schema.Types.Mixed],
    },
  },
  { timestamps: true }
);

export const Proposal = mongoose.model<IProposal>('Proposal', proposalSchema);
