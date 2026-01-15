import React, { useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useData } from '../context/UserContext.js';
import { useUserProfile } from '../context/UserProfileContext.js';
import { api } from '../services/api.js';
import { BookOpen, Calendar, Users, Settings, Plus, X, Trash2, AlertTriangle, Video } from 'lucide-react';
import type { ICourse, IEvent, IResource, IExpertTalk } from '../types/index.js';

// --- Reusable Modal Component ---
const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({
  title,
  children,
  onClose,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg animate-fade-in">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold text-[#30506C]">{title}</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <X size={24} />
        </button>
      </div>
      <div className="p-4">{children}</div>
    </div>
  </div>
);

export const Admin = () => {
  // --- HOOKS ---
  const { user, isLoaded: isUserLoaded } = useUser();
  const {
    courses,
    events,
    resources,
    expertTalks,
    loading: isDataLoading,
    setCourses,
    setEvents,
    setResources,
    setExpertTalks,
  } = useData();

  const { userProfile, isProfileLoading } = useUserProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal State for Adds
  const [modalType, setModalType] = useState<'course' | 'event' | 'resource' | 'expertTalk' | null>(null);

  // --- DELETE STATE ---
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'course' | 'event' | 'resource' | 'expertTalk';
    id: string;
    title: string;
  } | null>(null);

  // ---------------------------
  // Form States: COURSE
  // ---------------------------
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseInst, setNewCourseInst] = useState('');
  const [newCourseStart, setNewCourseStart] = useState('');
  const [newCourseEnd, setNewCourseEnd] = useState('');
  const [newCoursePaymentLink, setNewCoursePaymentLink] = useState('');
  const [newCourseCourseLink, setNewCourseCourseLink] = useState('');

  // ---------------------------
  // Form States: EVENT
  // ---------------------------
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventPaymentLink, setNewEventPaymentLink] = useState('');
  const [newEventLink, setNewEventLink] = useState('');

  // ---------------------------
  // Form States: RESOURCE
  // ---------------------------
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceCategory, setNewResourceCategory] = useState<'article' | 'video' | 'tool' | 'guide' | 'other'>(
    'article'
  );
  const [newResourceLink, setNewResourceLink] = useState('');
  const [newResourceDesc, setNewResourceDesc] = useState('');

  // ---------------------------
  // Form States: EXPERT TALKS
  // ---------------------------
  const [newTalkTitle, setNewTalkTitle] = useState('');
  const [newTalkYoutubeLink, setNewTalkYoutubeLink] = useState('');

  // --- RESET FORMS ---
  const resetForms = () => {
    // Course
    setNewCourseTitle('');
    setNewCourseDesc('');
    setNewCourseInst('');
    setNewCourseStart('');
    setNewCourseEnd('');
    setNewCoursePaymentLink('');
    setNewCourseCourseLink('');

    // Event
    setNewEventName('');
    setNewEventDate('');
    setNewEventLocation('');
    setNewEventDesc('');
    setNewEventPaymentLink('');
    setNewEventLink('');

    // Resource
    setNewResourceTitle('');
    setNewResourceLink('');
    setNewResourceDesc('');

    // Expert Talks
    setNewTalkTitle('');
    setNewTalkYoutubeLink('');
  };

  // ---------------------------
  // CREATE: COURSE
  // ---------------------------
  const handleAddCourse = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting || !newCourseTitle || !newCourseInst || !newCourseStart || !newCourseEnd) return;

      setIsSubmitting(true);

      const courseData: Partial<ICourse> = {
        courseTitle: newCourseTitle,
        courseDescription: newCourseDesc,
        courseInstructor: newCourseInst,
        courseStartDate: new Date(newCourseStart),
        courseEndDate: new Date(newCourseEnd),
        paymentLink: newCoursePaymentLink.trim() ? newCoursePaymentLink.trim() : undefined,
        courseLink: newCourseCourseLink.trim() ? newCourseCourseLink.trim() : undefined,
      };

      try {
        const response = await api.courses.create(courseData);
        setCourses((prev) => [...prev, response.data]);
        setModalType(null);
        resetForms();
      } catch (err) {
        console.error('Failed to create course:', err);
        alert('Failed to create course. Check console for details.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      newCourseTitle,
      newCourseDesc,
      newCourseInst,
      newCourseStart,
      newCourseEnd,
      newCoursePaymentLink,
      newCourseCourseLink,
      setCourses,
    ]
  );

  // ---------------------------
  // CREATE: EVENT
  // ---------------------------
  const handleAddEvent = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting || !newEventName || !newEventDate || !newEventLocation) return;

      setIsSubmitting(true);

      const eventData: Partial<IEvent> = {
        eventName: newEventName,
        eventDate: new Date(newEventDate),
        eventLocation: newEventLocation,
        eventDescription: newEventDesc,
        attendees: [],
        paymentLink: newEventPaymentLink.trim() ? newEventPaymentLink.trim() : undefined,
        eventLink: newEventLink.trim() ? newEventLink.trim() : undefined,
      };

      try {
        const response = await api.events.create(eventData);
        setEvents((prev) => [...prev, response.data]);
        setModalType(null);
        resetForms();
      } catch (err) {
        console.error('Failed to create event:', err);
        alert('Failed to create event. Check console for details.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, newEventName, newEventDate, newEventLocation, newEventDesc, newEventPaymentLink, newEventLink, setEvents]
  );

  // ---------------------------
  // CREATE: RESOURCE
  // ---------------------------
  const handleAddResource = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting || !newResourceTitle || !newResourceCategory || !newResourceLink) return;

      setIsSubmitting(true);

      const resourceData: Partial<IResource> = {
        resourceTitle: newResourceTitle,
        resourceCategory: newResourceCategory,
        resourceLink: newResourceLink,
        resourceDescription: newResourceDesc,
      };

      try {
        const response = await api.resources.create(resourceData);
        setResources((prev) => [...prev, response.data]);
        setModalType(null);
        resetForms();
      } catch (err) {
        console.error('Failed to create resource:', err);
        alert('Failed to create resource. Check console for details.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, newResourceTitle, newResourceCategory, newResourceLink, newResourceDesc, setResources]
  );

  // ---------------------------
  // CREATE: EXPERT TALK
  // ---------------------------
  const handleAddExpertTalk = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isSubmitting || !newTalkTitle.trim() || !newTalkYoutubeLink.trim()) return;

      setIsSubmitting(true);

      const payload: Partial<IExpertTalk> = {
        title: newTalkTitle.trim(),
        youtubeLink: newTalkYoutubeLink.trim(),
      };

      try {
        const response = await api.expertTalks.create(payload);
        setExpertTalks((prev) => [...prev, response.data]);
        setModalType(null);
        resetForms();
      } catch (err) {
        console.error('Failed to create expert talk:', err);
        alert('Failed to create expert talk. Check console for details.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, newTalkTitle, newTalkYoutubeLink, setExpertTalks]
  );

  // ---------------------------
  // DELETE CONFIRM
  // ---------------------------
  const handleConfirmDelete = async () => {
    if (!deleteTarget || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (deleteTarget.type === 'course') {
        await api.courses.delete(deleteTarget.id);
        setCourses((prev) => prev.filter((c) => c._id !== deleteTarget.id));
      } else if (deleteTarget.type === 'event') {
        await api.events.delete(deleteTarget.id);
        setEvents((prev) => prev.filter((e) => e._id !== deleteTarget.id));
      } else if (deleteTarget.type === 'resource') {
        await api.resources.delete(deleteTarget.id);
        setResources((prev) => prev.filter((r) => r._id !== deleteTarget.id));
      } else if (deleteTarget.type === 'expertTalk') {
        await api.expertTalks.delete(deleteTarget.id);
        setExpertTalks((prev) => prev.filter((t) => t._id !== deleteTarget.id));
      }

      setDeleteTarget(null);
    } catch (err) {
      console.error(`Failed to delete ${deleteTarget.type}:`, err);
      alert('Failed to delete. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LOADING/SECURITY CHECK ---
  if (!isUserLoaded || !user || isProfileLoading || isDataLoading) {
    return (
      <div className="min-h-screen bg-[#EFE3DF] flex items-center justify-center">
        <p className="text-[#30506C]">Loading Admin authentication...</p>
      </div>
    );
  }

  const userType = userProfile?.userType || 'user';

  if (userType !== 'admin') {
    return (
      <div className="min-h-screen bg-[#EFE3DF] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md">
          <Settings size={48} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-[#30506C] mb-2">Access Denied</h1>
          <p className="text-[#263A47]">
            You do not have permission to access the admin dashboard. Current type: <b>{userType}</b>
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: <BookOpen /> },
    { label: 'Total Events', value: events.length, icon: <Calendar /> },
    { label: 'Total Resources', value: resources.length, icon: <Users /> },
    { label: 'Expert Talks', value: expertTalks?.length || 0, icon: <Video /> },
  ];

  // --- RENDER MODALS ---
  const renderModal = () => {
    // 1. DELETE CONFIRMATION MODAL
    if (deleteTarget) {
      return (
        <Modal title="Confirm Deletion" onClose={() => setDeleteTarget(null)}>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Delete{' '}
              {deleteTarget.type === 'course'
                ? 'Course'
                : deleteTarget.type === 'event'
                ? 'Event'
                : deleteTarget.type === 'resource'
                ? 'Resource'
                : 'Expert Talk'}
              ?
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to delete <span className="font-bold">"{deleteTarget.title}"</span>? This action
              cannot be undone.
            </p>
            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none disabled:bg-gray-400"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      );
    }

    // 2. ADD MODALS
    switch (modalType) {
      case 'course':
        return (
          <Modal title="Add New Course" onClose={() => setModalType(null)}>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <input
                type="text"
                placeholder="Course Title"
                required
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={newCourseDesc}
                onChange={(e) => setNewCourseDesc(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg resize-none"
                rows={3}
              />
              <input
                type="text"
                placeholder="Instructor"
                required
                value={newCourseInst}
                onChange={(e) => setNewCourseInst(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <label className="block text-sm text-[#263A47]">Start Date:</label>
              <input
                type="date"
                required
                value={newCourseStart}
                onChange={(e) => setNewCourseStart(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <label className="block text-sm text-[#263A47]">End Date:</label>
              <input
                type="date"
                required
                value={newCourseEnd}
                onChange={(e) => setNewCourseEnd(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <input
                type="url"
                placeholder="Payment Link (optional)"
                value={newCoursePaymentLink}
                onChange={(e) => setNewCoursePaymentLink(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <input
                type="url"
                placeholder="Course Link (optional)"
                value={newCourseCourseLink}
                onChange={(e) => setNewCourseCourseLink(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition disabled:bg-gray-400"
              >
                {isSubmitting ? 'Creating...' : 'Create Course'}
              </button>
            </form>
          </Modal>
        );

      case 'event':
        return (
          <Modal title="Add New Event" onClose={() => setModalType(null)}>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <input
                type="text"
                placeholder="Event Name"
                required
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg resize-none"
                rows={3}
              />
              <label className="block text-sm text-[#263A47]">Date & Time:</label>
              <input
                type="datetime-local"
                required
                value={newEventDate}
                onChange={(e) => setNewEventDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Location (e.g., Virtual - Zoom)"
                required
                value={newEventLocation}
                onChange={(e) => setNewEventLocation(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <input
                type="url"
                placeholder="Payment Link (optional)"
                value={newEventPaymentLink}
                onChange={(e) => setNewEventPaymentLink(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <input
                type="url"
                placeholder="Event Link (optional)"
                value={newEventLink}
                onChange={(e) => setNewEventLink(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition disabled:bg-gray-400"
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </button>
            </form>
          </Modal>
        );

      case 'resource':
        return (
          <Modal title="Add New Resource" onClose={() => setModalType(null)}>
            <form onSubmit={handleAddResource} className="space-y-4">
              <input
                type="text"
                placeholder="Resource Title"
                required
                value={newResourceTitle}
                onChange={(e) => setNewResourceTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <select
                required
                value={newResourceCategory}
                onChange={(e) =>
                  setNewResourceCategory(e.target.value as 'article' | 'video' | 'tool' | 'guide' | 'other')
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="article">Article</option>
                <option value="guide">Book</option>
                <option value="video">Video</option>
                <option value="tool">Tool</option>
                <option value="other">Other</option>
              </select>
              <input
                type="url"
                placeholder="Link (URL)"
                required
                value={newResourceLink}
                onChange={(e) => setNewResourceLink(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={newResourceDesc}
                onChange={(e) => setNewResourceDesc(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg resize-none"
                rows={3}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition disabled:bg-gray-400"
              >
                {isSubmitting ? 'Creating...' : 'Create Resource'}
              </button>
            </form>
          </Modal>
        );

      case 'expertTalk':
        return (
          <Modal title="Add Expert Talk" onClose={() => setModalType(null)}>
            <form onSubmit={handleAddExpertTalk} className="space-y-4">
              <input
                type="text"
                placeholder="Talk Title"
                required
                value={newTalkTitle}
                onChange={(e) => setNewTalkTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="url"
                placeholder="YouTube Link"
                required
                value={newTalkYoutubeLink}
                onChange={(e) => setNewTalkYoutubeLink(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition disabled:bg-gray-400"
              >
                {isSubmitting ? 'Creating...' : 'Create Expert Talk'}
              </button>
            </form>
          </Modal>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#D7E9ED]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[#30506C] mb-2">Admin Dashboard</h1>
        <p className="text-[#263A47] mb-8">Manage courses, events, resources, and expert talks</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#469CA4]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#263A47] text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#30506C] mt-2">{stat.value}</p>
                </div>
                <div className="text-3xl text-[#469CA4]">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Top grid: Courses + Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* --- COURSES SECTION --- */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
              <BookOpen size={24} />
              <span>Courses</span>
            </h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {courses.length === 0 ? (
                <p className="text-[#263A47]">No courses yet</p>
              ) : (
                courses.map((course) => (
                  <div key={course._id} className="p-3 bg-[#F5F0ED] rounded-lg flex justify-between items-center group">
                    <div>
                      <p className="font-semibold text-[#30506C]">{course.courseTitle}</p>
                      <p className="text-xs text-[#263A47]">{course.courseInstructor}</p>
                    </div>
                    <button
                      onClick={() => setDeleteTarget({ type: 'course', id: course._id!, title: course.courseTitle })}
                      className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                      title="Delete Course"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => {
                resetForms();
                setModalType('course');
              }}
              className="w-full mt-4 bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition"
            >
              <Plus size={16} className="inline mr-1" /> Add Course
            </button>
          </div>

          {/* --- EVENTS SECTION --- */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
              <Calendar size={24} />
              <span>Events</span>
            </h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-[#263A47]">No events yet</p>
              ) : (
                events.map((event) => (
                  <div key={event._id} className="p-3 bg-[#F5F0ED] rounded-lg flex justify-between items-center group">
                    <div>
                      <p className="font-semibold text-[#30506C]">{event.eventName}</p>
                      <p className="text-xs text-[#263A47]">{new Date(event.eventDate).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => setDeleteTarget({ type: 'event', id: event._id!, title: event.eventName })}
                      className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full"
                      title="Delete Event"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => {
                resetForms();
                setModalType('event');
              }}
              className="w-full mt-4 bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition"
            >
              <Plus size={16} className="inline mr-1" /> Add Event
            </button>
          </div>
        </div>

        {/* Bottom grid: Resources + Expert Talks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* --- RESOURCES SECTION --- */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
              <Users size={24} />
              <span>Resources</span>
            </h2>
            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
              {resources.length === 0 ? (
                <p className="text-[#263A47]">No resources yet</p>
              ) : (
                resources.map((resource) => (
                  <div key={resource._id} className="p-3 bg-[#F5F0ED] rounded-lg flex justify-between items-center group">
                    <div className="overflow-hidden">
                      <p className="font-semibold text-[#30506C] truncate">{resource.resourceTitle}</p>
                      <p className="text-xs text-[#263A47]">{resource.resourceCategory}</p>
                    </div>
                    <button
                      onClick={() =>
                        setDeleteTarget({ type: 'resource', id: resource._id!, title: resource.resourceTitle })
                      }
                      className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full flex-shrink-0 ml-2"
                      title="Delete Resource"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => {
                resetForms();
                setModalType('resource');
              }}
              className="w-full mt-4 bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition"
            >
              <Plus size={16} className="inline mr-1" /> Add Resource
            </button>
          </div>

          {/* --- EXPERT TALKS SECTION --- */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
              <Video size={24} />
              <span>Expert Talks</span>
            </h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {!expertTalks || expertTalks.length === 0 ? (
                <p className="text-[#263A47]">No expert talks yet</p>
              ) : (
                expertTalks.map((talk) => (
                  <div key={talk._id} className="p-3 bg-[#F5F0ED] rounded-lg flex justify-between items-center group">
                    <div className="overflow-hidden">
                      <p className="font-semibold text-[#30506C] truncate">{talk.title}</p>
                      <p className="text-xs text-[#263A47] truncate">{talk.youtubeLink}</p>
                    </div>
                    <button
                      onClick={() => setDeleteTarget({ type: 'expertTalk', id: talk._id!, title: talk.title })}
                      className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full flex-shrink-0 ml-2"
                      title="Delete Expert Talk"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => {
                resetForms();
                setModalType('expertTalk');
              }}
              className="w-full mt-4 bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition"
            >
              <Plus size={16} className="inline mr-1" /> Add Expert Talk
            </button>
          </div>
        </div>
      </div>

      {/* Modal Renderer */}
      {renderModal()}
    </div>
  );
};
