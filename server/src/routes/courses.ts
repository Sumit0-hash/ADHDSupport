// server/src/routes/courses.ts

import express, { Router, Request, Response } from 'express';
import { courseService } from '../services/index.js';

const router: Router = express.Router();

// GET /api/courses - Get the entire course catalog
router.get('/', async (req: Request, res: Response) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/courses/:courseId - Get a specific course by ID
router.get('/:courseId', async (req: Request, res: Response) => {
  try {
    const course = await courseService.getCourseById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET /api/courses/:courseId/payment-link - Get payment link only
router.get('/:courseId/payment-link', async (req: Request, res: Response) => {
  try {
    const data = await courseService.getCoursePaymentLink(req.params.courseId);

    if (!data) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!data.paymentLink) {
      return res.status(404).json({ error: 'Payment link not available for this course' });
    }

    res.json({ paymentLink: data.paymentLink });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:courseId/course-link', async (req: Request, res: Response) => {
  try {
    const data = await courseService.getCourseLink(req.params.courseId);

    if (!data) return res.status(404).json({ error: 'Course not found' });
    if (!data.courseLink) return res.status(404).json({ error: 'Course link not available for this course' });

    res.json({ courseLink: data.courseLink });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


// POST /api/courses - Create a new course (Admin function)
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      courseTitle,
      courseDescription,
      courseInstructor,
      courseStartDate,
      courseEndDate,
      paymentLink,
      courseLink,
    } = req.body;


    if (!courseTitle || !courseInstructor || !courseStartDate || !courseEndDate) {
      return res.status(400).json({ error: 'Missing required course fields' });
    }

    const newCourse = await courseService.createCourse(
      courseTitle,
      courseDescription,
      courseInstructor,
      new Date(courseStartDate),
      new Date(courseEndDate),
      paymentLink,
      courseLink
    );

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


// PUT /api/courses/:courseId - Update an existing course (Admin function)
router.put('/:courseId', async (req: Request, res: Response) => {
  try {
    const updatedCourse = await courseService.updateCourse(req.params.courseId, req.body);

    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE /api/courses/:courseId - Delete a course (Admin function)
router.delete('/:courseId', async (req: Request, res: Response) => {
  try {
    const success = await courseService.deleteCourse(req.params.courseId);
    if (!success) {
      return res.status(404).json({ error: 'Course not found or could not be deleted' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
