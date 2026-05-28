import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description: string;
  category: 'research' | 'education' | 'mission' | 'advocacy';
  status: 'planning' | 'active' | 'completed' | 'archived';
  lead: mongoose.Types.ObjectId;
  team: mongoose.Types.ObjectId[];
  budget: {
    total: number;
    currency: 'USDT' | 'SOL' | 'ETH';
    spent: number;
  };
  timeline: {
    startDate: Date;
    endDate?: Date;
    milestones: Array<{
      name: string;
      dueDate: Date;
      completed: boolean;
    }>;
  };
  impact: {
    description: string;
    expectedOutcome: string;
    actualOutcome?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['research', 'education', 'mission', 'advocacy'],
      required: true,
    },
    status: {
      type: String,
      enum: ['planning', 'active', 'completed', 'archived'],
      default: 'planning',
    },
    lead: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    budget: {
      total: Number,
      currency: { type: String, enum: ['USDT', 'SOL', 'ETH'], default: 'USDT' },
      spent: { type: Number, default: 0 },
    },
    timeline: {
      startDate: Date,
      endDate: Date,
      milestones: [
        {
          name: String,
          dueDate: Date,
          completed: { type: Boolean, default: false },
        },
      ],
    },
    impact: {
      description: String,
      expectedOutcome: String,
      actualOutcome: String,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', projectSchema);
