import mongoose, { Schema, Document } from 'mongoose';

export interface ITreasuryBalance extends Document {
  currency: 'BTC' | 'ETH' | 'SOL' | 'USDT' | 'DOGE';
  chain: 'bitcoin' | 'ethereum' | 'solana' | 'polygon' | 'base';
  balance: number;
  address: string;
  lastUpdated: Date;
}

export interface ITreasuryTransaction extends Document {
  type: 'deposit' | 'withdrawal' | 'transfer';
  currency: 'BTC' | 'ETH' | 'SOL' | 'USDT' | 'DOGE';
  chain: 'bitcoin' | 'ethereum' | 'solana' | 'polygon' | 'base';
  amount: number;
  fromAddress: string;
  toAddress: string;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  proposalId?: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const treasuryBalanceSchema = new Schema<ITreasuryBalance>(
  {
    currency: { type: String, enum: ['BTC', 'ETH', 'SOL', 'USDT', 'DOGE'], required: true },
    chain: {
      type: String,
      enum: ['bitcoin', 'ethereum', 'solana', 'polygon', 'base'],
      required: true,
    },
    balance: { type: Number, default: 0 },
    address: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const treasuryTransactionSchema = new Schema<ITreasuryTransaction>(
  {
    type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
    currency: { type: String, enum: ['BTC', 'ETH', 'SOL', 'USDT', 'DOGE'], required: true },
    chain: {
      type: String,
      enum: ['bitcoin', 'ethereum', 'solana', 'polygon', 'base'],
      required: true,
    },
    amount: { type: Number, required: true },
    fromAddress: { type: String, required: true },
    toAddress: { type: String, required: true },
    txHash: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
    proposalId: { type: Schema.Types.ObjectId, ref: 'Proposal' },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TreasuryBalance = mongoose.model<ITreasuryBalance>('TreasuryBalance', treasuryBalanceSchema);
export const TreasuryTransaction = mongoose.model<ITreasuryTransaction>('TreasuryTransaction', treasuryTransactionSchema);
