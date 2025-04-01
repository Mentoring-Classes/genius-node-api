import mongoose, { Schema, Document } from "mongoose";

interface IRank extends Document {
  rank: string;
  nextRank: string;
  requiredPoints: number
}

const RankSchema = new Schema<IRank>({
  rank: { type: String, required: true, unique: true },
  requiredPoints: { type: Number, default: 300 },
  nextRank: { type: String }
}, { timestamps: true });

const Rank = mongoose.model<IRank>('Rank', RankSchema);
export default Rank;
