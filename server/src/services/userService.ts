// server/src/services/userService.ts

import { IUser, IEmotionalCheckin, IPlannerEntry, IBrainDumpEntry, IFocusSession } from '../models/types.js';
import { User } from '../models/User.js'; // Import the Mongoose Model



export const userService = {
  /**
   * Retrieves a User document by their Clerk ID.
   * @param clerkId The unique ID provided by Clerk.
   * @returns The user object or null if not found.
   */
  async getUserByClerkId(clerkId: string): Promise<IUser | null> {
    // Replaced mockUsers.get(clerkId) with Mongoose findOne
    return await User.findOne({ clerkId });
  },

  /**
   * Creates a new User document in the database.
   * @returns The newly created user object.
   */
  async deleteBrainDumpEntry(clerkId: string, entryId: string): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { clerkId },
      {
        $pull: {
          // Use $pull to remove the element where _id matches entryId
          brainDumpEntries: { _id: entryId }
        },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
  },

  async deletePlannerEntry(clerkId: string, entryId: string): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { clerkId },
      {
        $pull: {
          // Use $pull to remove the element where _id matches entryId
          plannerEntries: { _id: entryId }
        },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
  },


  async createUser(
    clerkId: string,
    userFirstName: string,
    userLastName: string,
    userEmail: string
  ): Promise<IUser> {
    // Replaced manual object creation and map set with Mongoose create
    const newUser = await User.create({
      clerkId,
      userFirstName,
      userLastName,
      userEmail,
      userType: 'user',
      // Mongoose handles default values (emotionalCheckins: [], createdAt, etc.) automatically
    });
    return newUser;
  },

  /**
   * Updates general user profile information.
   * @param clerkId The unique ID provided by Clerk.
   * @param updates A partial object of user fields to update.
   * @returns The updated user object or null if not found.
   */
  async updateUser(clerkId: string, updates: Partial<IUser>): Promise<IUser | null> {
    // findOneAndUpdate for atomic update
    return await User.findOneAndUpdate(
      { clerkId },
      { $set: { ...updates, updatedAt: new Date() } },
      { new: true } // returns the updated document
    );
  },

  /**
   * Adds a new emotional checkin to the user's document.
   * @param clerkId The unique ID provided by Clerk.
   * @param checkin The checkin data.
   * @returns The updated user object or null if not found.
   */
  async addEmotionalCheckin(clerkId: string, checkin: IEmotionalCheckin): Promise<IUser | null> {
    // Use $push to add a new checkin to the array
    return await User.findOneAndUpdate(
      { clerkId },
      {
        $push: { emotionalCheckins: { ...checkin, checkinDate: checkin.checkinDate || new Date() } },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
  },

  /**
   * Retrieves all emotional checkins for a user.
   * @returns An array of checkin objects.
   */
  async getEmotionalCheckins(clerkId: string): Promise<IEmotionalCheckin[]> {
    // Use select to retrieve only the emotionalCheckins field
    const user = await User.findOne({ clerkId }).select('emotionalCheckins -_id');
    return user?.emotionalCheckins || [];
  },

  /**
   * Adds a new planner entry to the user's document.
   * @returns The updated user object or null if not found.
   */
  async addPlannerEntry(clerkId: string, entry: IPlannerEntry): Promise<IUser | null> {
    // Use $push to add a new entry to the array
    return await User.findOneAndUpdate(
      { clerkId },
      {
        $push: { plannerEntries: { ...entry, createdAt: new Date() } },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
  },

  // --- NEW METHOD: Add Brain Dump Entry ---
  async addBrainDumpEntry(clerkId: string, entry: IBrainDumpEntry): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { clerkId },
      {
        $push: { brainDumpEntries: { ...entry, createdAt: new Date() } },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
  },

  // --- NEW METHOD: Add Focus Session ---
  async addFocusSession(clerkId: string, session: IFocusSession): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { clerkId },
      {
        $push: { focusSessions: { ...session, completedAt: new Date() } },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
  },

  /**
   * Retrieves all planner entries for a user.
   * @returns An array of planner entry objects.
   */
  async getPlannerEntries(clerkId: string): Promise<IPlannerEntry[]> {
    // Use select to retrieve only the plannerEntries field
    const user = await User.findOne({ clerkId }).select('plannerEntries -_id');
    return user?.plannerEntries || [];
  },

  /**
   * Updates a specific planner entry using its array ID.
   * @returns The updated planner entry object or null if not found.
   */
  async updatePlannerEntry(
    clerkId: string,
    entryId: string,
    updates: Partial<IPlannerEntry>
  ): Promise<IPlannerEntry | null> {
    // Use the positional operator ($) to update a specific element in an array
    const updatedUser = await User.findOneAndUpdate(
      { clerkId, 'plannerEntries._id': entryId },
      {
        $set: {
          'plannerEntries.$.pEntryTime': updates.pEntryTime,
          'plannerEntries.$.pEntryTask': updates.pEntryTask,
          'plannerEntries.$.pEntryStatus': updates.pEntryStatus,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!updatedUser) return null;

    // Manually find and return the updated sub-document for type safety/consistency
    return updatedUser.plannerEntries.find(e => e._id?.toString() === entryId) || null;
  },

  /**
   * Enrolls a user in a course by adding the course ID to the enrolledCourses array.
   */
  async enrollCourse(clerkId: string, courseId: string): Promise<IUser | null> {
    // Use $addToSet to add the ID only if it doesn't already exist
    return await User.findOneAndUpdate(
      { clerkId, enrolledCourses: { $ne: courseId } },
      { $addToSet: { enrolledCourses: courseId }, $set: { updatedAt: new Date() } },
      { new: true }
    );
  },


  async addFavoriteResource(clerkId: string, resourceId: string): Promise<IUser | null> {
    // Use $addToSet to add the ID only if it doesn't already exist
    return await User.findOneAndUpdate(
      { clerkId, favoriteResources: { $ne: resourceId } },
      { $addToSet: { favoriteResources: resourceId }, $set: { updatedAt: new Date() } },
      { new: true }
    );
  },

  /**
   * Registers a user for an event by adding the event ID to the registeredEvents array.
   */
  async registerEvent(clerkId: string, eventId: string): Promise<IUser | null> {
    // Use $addToSet to add the ID only if it doesn't already exist
    return await User.findOneAndUpdate(
      { clerkId, registeredEvents: { $ne: eventId } },
      { $addToSet: { registeredEvents: eventId }, $set: { updatedAt: new Date() } },
      { new: true }
    );
  },
};