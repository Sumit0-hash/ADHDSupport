import { IEvent } from '../models/types.js';
import { Event } from '../models/Event.js';

export const eventService = {
  async getAllEvents(): Promise<IEvent[]> {
    return await Event.find({}).lean<IEvent[]>();
  },

  async getEventById(eventId: string): Promise<IEvent | null> {
    return await Event.findById(eventId).lean<IEvent | null>();
  },

  async getUpcomingEvents(): Promise<IEvent[]> {
    const now = new Date();
    return await Event.find({ eventDate: { $gt: now } })
      .sort({ eventDate: 1 })
      .lean<IEvent[]>();
  },

  // ✅ NEW: get payment link only
  async getEventPaymentLink(eventId: string): Promise<{ paymentLink?: string } | null> {
    return await Event.findById(eventId)
      .select('paymentLink')
      .lean<{ paymentLink?: string } | null>();
  },

  // ✅ NEW: get event link only
  async getEventLink(eventId: string): Promise<{ eventLink?: string } | null> {
    return await Event.findById(eventId)
      .select('eventLink')
      .lean<{ eventLink?: string } | null>();
  },

  // ✅ UPDATED: now supports links
  async createEvent(
    eventName: string,
    eventDate: Date,
    eventLocation: string,
    eventDescription: string,
    paymentLink?: string,
    eventLink?: string
  ): Promise<IEvent> {
    const newEvent = await Event.create({
      eventName,
      eventDate,
      eventLocation,
      eventDescription,
      attendees: [],
      paymentLink,
      eventLink,
    });

    return newEvent.toObject() as IEvent;
  },

  async addAttendee(eventId: string, userId: string): Promise<IEvent | null> {
    return await Event.findByIdAndUpdate(
      eventId,
      {
        $addToSet: { attendees: userId },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    ).lean<IEvent | null>();
  },

  async removeAttendee(eventId: string, userId: string): Promise<IEvent | null> {
    return await Event.findByIdAndUpdate(
      eventId,
      {
        $pull: { attendees: userId },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    ).lean<IEvent | null>();
  },

  async updateEvent(eventId: string, updates: Partial<IEvent>): Promise<IEvent | null> {
    return await Event.findByIdAndUpdate(
      eventId,
      { $set: { ...updates, updatedAt: new Date() } },
      { new: true }
    ).lean<IEvent | null>();
  },

  async deleteEvent(eventId: string): Promise<boolean> {
    const result = await Event.deleteOne({ _id: eventId });
    return result.deletedCount === 1;
  },
};
