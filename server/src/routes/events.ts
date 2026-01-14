import express, { Router, Request, Response } from 'express';
import { eventService } from '../services/index.js';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/upcoming', async (req: Request, res: Response) => {
  try {
    const upcomingEvents = await eventService.getUpcomingEvents();
    res.json(upcomingEvents);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/:eventId', async (req: Request, res: Response) => {
  try {
    const event = await eventService.getEventById(req.params.eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ✅ NEW: payment link only
router.get('/:eventId/payment-link', async (req: Request, res: Response) => {
  try {
    const data = await eventService.getEventPaymentLink(req.params.eventId);

    if (!data) return res.status(404).json({ error: 'Event not found' });
    if (!data.paymentLink) return res.status(404).json({ error: 'Payment link not available for this event' });

    res.json({ paymentLink: data.paymentLink });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ✅ NEW: event link only
router.get('/:eventId/event-link', async (req: Request, res: Response) => {
  try {
    const data = await eventService.getEventLink(req.params.eventId);

    if (!data) return res.status(404).json({ error: 'Event not found' });
    if (!data.eventLink) return res.status(404).json({ error: 'Event link not available for this event' });

    res.json({ eventLink: data.eventLink });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// ✅ UPDATED POST: accept paymentLink + eventLink
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      paymentLink,
      eventLink,
    } = req.body;

    if (!eventName || !eventDate || !eventLocation) {
      return res.status(400).json({ error: 'Missing required event fields' });
    }

    const newEvent = await eventService.createEvent(
      eventName,
      new Date(eventDate),
      eventLocation,
      eventDescription,
      paymentLink,
      eventLink
    );

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put('/:eventId', async (req: Request, res: Response) => {
  try {
    const updatedEvent = await eventService.updateEvent(req.params.eventId, req.body);
    if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/:eventId/attendee/:userId', async (req: Request, res: Response) => {
  try {
    const updatedEvent = await eventService.addAttendee(req.params.eventId, req.params.userId);
    if (!updatedEvent) return res.status(404).json({ error: 'Event not found' });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/:eventId/attendee/:userId', async (req: Request, res: Response) => {
  try {
    const updatedEvent = await eventService.removeAttendee(req.params.eventId, req.params.userId);
    if (!updatedEvent) return res.status(404).json({ error: 'Event or User not found' });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete('/:eventId', async (req: Request, res: Response) => {
  try {
    const success = await eventService.deleteEvent(req.params.eventId);
    if (!success) return res.status(404).json({ error: 'Event not found or could not be deleted' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
