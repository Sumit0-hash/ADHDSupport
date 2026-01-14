// server/src/models/types.ts - FULL UPDATED CONTENT

import { Types } from 'mongoose'; // <-- Ensure this is still here for Mongoose compatibility

export interface IEmotionalCheckin {
  _id?: string;
  checkinMood: 'happy' | 'sad' | 'anxious' | 'calm' | 'overwhelmed' | 'focused';
  checkinNotes: string;
  checkinDate: Date;
}

export interface IPlannerEntry {
  _id?: string;
  pEntryTime: string;
  pEntryTask: string;
  pEntryStatus: 'pending' | 'in-progress' | 'completed';
  createdAt?: Date;
}

// --- NEW INTERFACE FOR BRAIN DUMP ---
export interface IBrainDumpEntry {
  _id?: string;
  content: string;
  createdAt: Date;
}

// --- NEW INTERFACE FOR FOCUS TIMER ---
export interface IFocusSession {
  _id?: string;
  duration: number; // duration in minutes
  completedAt: Date;
}

export interface IHabit {
  _id?: string;
  habitName: string;
  habitFrequency: 'daily' | 'weekly' | 'monthly';
  habitProgress: number;
  userId: string | Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// --- USER INTERFACE (Crucial for Clerk Integration) ---
export interface IUser {
  _id?: string;
  clerkId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userType: 'user' | 'admin';
  emotionalCheckins: IEmotionalCheckin[];
  plannerEntries: IPlannerEntry[];
  
  // --- NEW FIELDS ADDED HERE ---
  brainDumpEntries: IBrainDumpEntry[]; 
  focusSessions: IFocusSession[];
  
  // Note: Using Types.ObjectId | string for references for Mongoose compatibility
  enrolledCourses: (string | Types.ObjectId)[];
  favoriteResources: (string | Types.ObjectId)[];
  registeredEvents: (string | Types.ObjectId)[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IEnrollment {
  _id?: string;
  userId: string | Types.ObjectId;
  courseId: string | Types.ObjectId;
  enrollmentDate: Date;
  completionStatus: 'enrolled' | 'in-progress' | 'completed';
}

export interface ICourse {
  _id?: string;
  courseTitle: string;
  courseDescription: string;
  courseInstructor: string;
  courseStartDate: Date;
  courseEndDate: Date;
  paymentLink?: string; // optional
  courseLink?: string;  // optional
  createdAt: Date;
  updatedAt: Date;
}


export interface IResource {
  _id?: string;
  resourceTitle: string;
  resourceCategory: 'article' | 'video' | 'tool' | 'guide' | 'other';
  resourceLink: string;
  resourceDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent {
  _id?: string;
  eventName: string;
  eventDate: Date;
  eventLocation: string;
  eventDescription: string;
  attendees: (string | Types.ObjectId)[];
  paymentLink?: string;
  eventLink?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface IAdmin {
  _id?: string;
  clerkId: string;
  adminUsername: string;
  adminEmail: string;
  createdAt: Date;
  updatedAt: Date;
}