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
  userId: string;
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
  brainDumpEntries: IBrainDumpEntry[];
  focusSessions: IFocusSession[]; 
  enrolledCourses: string[];
  favoriteResources: string[];
  registeredEvents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourse {
  _id?: string;
  courseTitle: string;
  courseDescription: string;
  courseInstructor: string;
  courseStartDate: Date;
  courseEndDate: Date;
  paymentLink?: string;
  courseLink?: string;
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
  attendees: string[];
  paymentLink?: string;
  eventLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExpertTalk {
  _id?: string;
  title: string;
  youtubeLink: string;
  createdAt: Date;
  updatedAt: Date;
}
