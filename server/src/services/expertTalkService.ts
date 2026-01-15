import { IExpertTalk } from '../models/types.js';
import { ExpertTalk } from '../models/ExpertTalk.js';

export const expertTalkService = {
  async getAll(): Promise<IExpertTalk[]> {
    return await ExpertTalk.find({}).sort({ createdAt: -1 }).lean<IExpertTalk[]>();
  },

  async create(title: string, youtubeLink: string): Promise<IExpertTalk> {
    const doc = await ExpertTalk.create({ title, youtubeLink });
    return doc.toObject() as IExpertTalk;
  },

  async delete(id: string): Promise<boolean> {
    const result = await ExpertTalk.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },
};
