import mongoose, { Schema, Document } from "mongoose";

interface ICoopRoom extends Document {
    roomName: string;
    player1: string;
    player2: string;
}

const CoopSchema = new Schema<ICoopRoom>({
    roomName: { type: String, required: true},
    player1: { type: String, required: true},
    player2: { type: String },
}, { timestamps: true });

export default mongoose.model<ICoopRoom>('CoopRoom', CoopSchema);