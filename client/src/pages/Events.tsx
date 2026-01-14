// client/src/pages/Events.tsx
import React, { useState } from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { useData } from '../context/UserContext.js';
import { useUserProfile } from '../context/UserProfileContext.js';
import { api } from '../services/api.js';
import { Calendar, MapPin, CheckCircle, Lock, CreditCard, ExternalLink } from 'lucide-react';
import type { IEvent } from '../types/index.js';

export const Events = () => {
  const { isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { events, loading: isDataLoading } = useData();
  const { userProfile, isProfileLoading, refreshProfile } = useUserProfile();

  const [filter, setFilter] = useState<'all' | 'registered'>('all');

  // ✅ submitting per-event (prevents all buttons showing "Registering...")
  const [submittingEventId, setSubmittingEventId] = useState<string | null>(null);

  // --- 1) CLERK LOADING ---
  if (!isClerkLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-[#30506C]">Checking authentication...</p>
      </div>
    );
  }

  // --- 2) NOT SIGNED IN ---
  if (!isSignedIn) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#D7E9ED] px-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="bg-[#EAF4F6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-[#30506C]" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#30506C] mb-2">Access Restricted</h2>
          <p className="text-[#263A47] mb-6">Please sign in to view events and manage registrations.</p>
          <SignInButton mode="modal">
            <button className="bg-[#469CA4] hover:bg-[#3a7f8a] text-white px-6 py-2 rounded-lg font-medium transition w-full">
              Sign In
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  // --- 3) DATA LOADING ---
  if (isDataLoading || isProfileLoading || !userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-[#30506C]">Loading events and registration status...</p>
      </div>
    );
  }

  const clerkId = userProfile.clerkId;

  const registeredEvents: string[] = userProfile.registeredEvents?.map((id) => id.toString()) || [];

  const filteredEvents = events.filter((event) => {
    const isRegistered = registeredEvents.includes(event._id!);
    if (filter === 'registered') return isRegistered;
    return true;
  });

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );

  const openInNewTab = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRegister = async (eventId: string) => {
    if (!clerkId || !eventId || registeredEvents.includes(eventId)) return;

    setSubmittingEventId(eventId);
    try {
      await api.users.registerEvent(clerkId, eventId);
      await refreshProfile();
    } catch (error) {
      console.error('Failed to register for event:', error);
    } finally {
      setSubmittingEventId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#D7E9ED]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[#30506C] mb-2">Events & Community</h1>
        <p className="text-[#263A47] mb-8">Connect with others and learn from experts in the ADHD community</p>

        <div className="flex space-x-2 mb-6">
          {(['all', 'registered'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === filterOption
                  ? 'bg-[#469CA4] text-white'
                  : 'bg-white text-[#263A47] hover:bg-[#D7E9ED]'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        {sortedEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-[#263A47] mb-4">No events found</p>
            {filter !== 'all' && (
              <button onClick={() => setFilter('all')} className="text-[#469CA4] hover:underline font-medium">
                View all events
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sortedEvents.map((event: IEvent) => {
              const eventId = event._id!;
              const isRegistered = registeredEvents.includes(eventId);
              const isSubmittingThis = submittingEventId === eventId;

              return (
                <div key={eventId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-gradient-to-br from-[#469CA4] to-[#30506C] p-6 md:w-32 md:flex-shrink-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-2xl font-bold">{new Date(event.eventDate).getDate()}</div>
                        <div className="text-sm">
                          {new Date(event.eventDate).toLocaleString('default', { month: 'short' })}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <h3 className="text-xl font-bold text-[#30506C]">{event.eventName}</h3>
                        {isRegistered && (
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1 flex-shrink-0">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">Registered</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[#263A47] mb-4">{event.eventDescription}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-[#263A47]">
                          <Calendar size={18} className="text-[#469CA4]" />
                          <span className="text-sm">{new Date(event.eventDate).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[#263A47]">
                          <MapPin size={18} className="text-[#469CA4]" />
                          <span className="text-sm">{event.eventLocation}</span>
                        </div>
                      </div>

                      {/* ✅ Actions: Register + Payment + Event Link */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleRegister(eventId)}
                          disabled={isRegistered || isSubmittingThis}
                          className={`py-2 px-6 rounded-lg font-medium transition ${
                            isRegistered
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-[#469CA4] hover:bg-[#3a7f8a] text-white'
                          }`}
                        >
                          {isSubmittingThis ? 'Registering...' : isRegistered ? 'Registered' : 'Register Now'}
                        </button>

                        <button
                          onClick={() => openInNewTab(event.paymentLink)}
                          disabled={!event.paymentLink}
                          className={`py-2 px-6 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                            event.paymentLink
                              ? 'bg-[#EAF4F6] text-[#263A47] hover:bg-[#D7E9ED]'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          title={event.paymentLink ? 'Open payment link' : 'Payment link not available'}
                        >
                          <CreditCard size={18} />
                          Payment
                        </button>

                        <button
                          onClick={() => openInNewTab(event.eventLink)}
                          disabled={!event.eventLink}
                          className={`py-2 px-6 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                            event.eventLink
                              ? 'bg-[#EAF4F6] text-[#263A47] hover:bg-[#D7E9ED]'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                          title={event.eventLink ? 'Open event link' : 'Event link not available'}
                        >
                          <ExternalLink size={18} />
                          Event Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
