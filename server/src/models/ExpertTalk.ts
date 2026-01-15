import mongoose, { Schema } from 'mongoose';
import { IExpertTalk } from './types.js';

const ExpertTalkSchema = new Schema<IExpertTalk>({
  title: { type: String, required: true },
  youtubeLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ExpertTalk = mongoose.model<IExpertTalk>('ExpertTalk', ExpertTalkSchema);
