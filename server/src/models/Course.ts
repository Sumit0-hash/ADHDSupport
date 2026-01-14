import mongoose, { Schema } from 'mongoose';
import { ICourse } from './types.js';

const CourseSchema = new Schema<ICourse>({
  courseTitle: { type: String, required: true },
  courseDescription: { type: String, required: true },
  courseInstructor: { type: String, required: true },
  courseStartDate: { type: Date, required: true },
  courseEndDate: { type: Date, required: true },

  paymentLink: { type: String, default: '' },
  courseLink: { type: String, default: '' }, // NEW

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
