import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  rankPoints: number;
  bestScore: number;
  rank: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  rankPoints: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 },
  rank: { type: Schema.Types.ObjectId, ref: 'Rank' }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);

