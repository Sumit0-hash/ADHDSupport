import { ICourse } from '../models/types.js';
import { Course } from '../models/Course.js'; // Import the Mongoose Model

export const courseService = {
  /**
   * Retrieves all courses in the catalog.
   * @returns An array of all course objects.
   */
  async getAllCourses(): Promise<ICourse[]> {
    return await Course.find({}).lean<ICourse[]>();
  },

  /**
   * Retrieves a single course by its ID.
   * @param courseId The ID of the course.
   * @returns The course object or null if not found.
   */
  async getCourseById(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId).lean<ICourse | null>();
  },

  /**
   * Retrieves only the payment link for a course.
   * @param courseId The ID of the course.
   * @returns Object with paymentLink or null if course not found.
   */
  async getCoursePaymentLink(courseId: string): Promise<{ paymentLink?: string } | null> {
    return await Course.findById(courseId)
      .select('paymentLink')
      .lean<{ paymentLink?: string } | null>();
  },
  async getCourseLink(courseId: string): Promise<{ courseLink?: string } | null> {
    return await Course.findById(courseId)
      .select('courseLink')
      .lean<{ courseLink?: string } | null>();
  },

  /**
   * Creates a new course and saves it to the database.
   * @returns The newly created course object.
   */
  async createCourse(
  courseTitle: string,
  courseDescription: string,
  courseInstructor: string,
  courseStartDate: Date,
  courseEndDate: Date,
  paymentLink?: string,
  courseLink?: string
): Promise<ICourse> {
  const newCourse = await Course.create({
    courseTitle,
    courseDescription,
    courseInstructor,
    courseStartDate,
    courseEndDate,
    paymentLink,
    courseLink,
  });

  return newCourse.toObject() as ICourse;
},



  /**
   * Updates an existing course.
   * @param courseId The ID of the course to update.
   * @param updates A partial object of course fields to update.
   * @returns The updated course object or null if not found.
   */
  async updateCourse(courseId: string, updates: Partial<ICourse>): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(
      courseId,
      {
        $set: { ...updates, updatedAt: new Date() },
      },
      { new: true }
    ).lean<ICourse | null>();
  },

  /**
   * Deletes a specific course by its ID.
   * @param courseId The ID of the course to delete.
   * @returns A boolean indicating success.
   */
  async deleteCourse(courseId: string): Promise<boolean> {
    const result = await Course.deleteOne({ _id: courseId });
    return result.deletedCount === 1;
  },
};
