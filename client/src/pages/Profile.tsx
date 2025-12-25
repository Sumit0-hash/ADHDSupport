import React, { useState, useCallback } from 'react';
// Import the global data hook (for application state)
import { useData } from '../context/UserContext.js'; 
// Import the custom user profile hook (for Mongo-backed user data and updates)
import { useUserProfile } from '../context/UserProfileContext.js';
// Import the Clerk hook only for basic authentication status and image URL
import { useUser } from '@clerk/clerk-react'; 
import { Mail, User, BookOpen, Calendar, X } from 'lucide-react';
import type { IPlannerEntry, IEmotionalCheckin, IUser } from '../types/index.js';

// --- Reusable Modal Component ---
const Modal: React.FC<{ title: string; children: React.ReactNode; onClose: () => void }> = ({ title, children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold text-[#30506C]">{title}</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-800"><X size={24} /></button>
            </div>
            <div className="p-4">{children}</div>
        </div>
    </div>
);


export const Profile = () => {
    // --- 1. HOOKS ---
    const { user, isLoaded: isClerkLoaded } = useUser();
    
    // LIVE PROFILE DATA: Contains Mongo-backed user object and update methods
    const { userProfile, isProfileLoading, updateProfile } = useUserProfile();

    // GLOBAL DATA: For linking IDs to course/event/resource details
    const { courses, events, loading: isDataLoading } = useData();

    // --- Local State for Editing ---
    const [isEditing, setIsEditing] = useState(false);
    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [isSaving, setIsSaving] = useState(false);


    // --- HANDLER: Profile Update (Calls /api/users/:clerkId PUT) ---
    const handleSaveProfile = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSaving || !userProfile) return;

        setIsSaving(true);
        const updates: Partial<IUser> = {
            userFirstName: editFirstName,
            userLastName: editLastName,
        };

        try {
            // Call the context function to push updates to the backend
            await updateProfile(updates); 
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save profile updates:', error);
        } finally {
            setIsSaving(false);
        }
    }, [editFirstName, editLastName, isSaving, updateProfile, userProfile]);

    
    // Set initial form state based on the loaded user profile
    const startEditing = () => {
        if (!userProfile) return;
        setEditFirstName(userProfile.userFirstName);
        setEditLastName(userProfile.userLastName);
        setIsEditing(true);
    };


    // --- LOADING/Error Check ---
    if (!isClerkLoaded || isDataLoading || isProfileLoading || !userProfile) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-[#30506C]">Loading full profile data...</p>
            </div>
        );
    }
    
    // --- LIVE DATA EXTRACTION ---
    const profile = userProfile as IUser; 
    
    const primaryEmail = profile.userEmail || 'N/A';
    
    const emotionalCheckins = profile.emotionalCheckins || [];
    const plannerEntries = profile.plannerEntries || [];
    // Map object IDs to strings for comparison
    const enrolledCoursesIds = profile.enrolledCourses?.map(id => id.toString()) || [];
    const registeredEventsIds = profile.registeredEvents?.map(id => id.toString()) || [];

    // Combine Data Sources
    const enrolledCourseDetails = courses.filter(c => enrolledCoursesIds.includes(c._id!));
    const registeredEventDetails = events.filter(e => registeredEventsIds.includes(e._id!));


    return (
        <div className="min-h-screen bg-[#D7E9ED]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-[#30506C] to-[#469CA4] h-32"></div>

                    <div className="px-6 py-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
                            <div className="w-20 h-20 -mt-16 bg-[#469CA4] rounded-full flex items-center justify-center text-white">
                                <img 
                                    src={user?.imageUrl || 'https://placehold.co/80x80/469CA4/FFFFFF?text=P'} 
                                    alt={profile.userFirstName || "Profile"} 
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-[#30506C]">
                                    {profile.userFirstName} {profile.userLastName}
                                </h1>
                                <p className="text-[#263A47] flex items-center space-x-2 mt-1">
                                    <Mail size={18} />
                                    <span>{primaryEmail}</span>
                                </p>
                                {profile.userType === 'admin' && (
                                    <div className="mt-2 inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Administrator
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={startEditing}
                                className="md:self-start bg-[#469CA4] hover:bg-[#3a7f8a] text-white py-2 px-4 rounded-lg text-sm font-medium transition"
                            >
                                Edit Profile
                            </button>
                        </div>

                        {/* Profile Edit Form Modal */}
                        {isEditing && (
                            <Modal title="Edit Profile Details" onClose={() => setIsEditing(false)}>
                                <form onSubmit={handleSaveProfile} className="space-y-4">
                                    <h3 className="font-semibold text-[#30506C]">Name</h3>
                                    <input type="text" placeholder="First Name" required value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-[#469CA4] focus:border-[#469CA4]" />
                                    <input type="text" placeholder="Last Name" required value={editLastName} onChange={(e) => setEditLastName(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-[#469CA4] focus:border-[#469CA4]" />
                                    
                                    <button type="submit" disabled={isSaving} className="w-full bg-[#469CA4] hover:bg-[#3a7f8a] text-white font-medium py-2 rounded-lg transition disabled:bg-gray-400">
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </form>
                            </Modal>
                        )}


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-[#D7E9ED] rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[#263A47] text-sm">Total Check-ins</p>
                                        <p className="text-2xl font-bold text-[#30506C]">{emotionalCheckins.length}</p>
                                    </div>
                                    <div className="text-[#469CA4] opacity-20">
                                        <User size={32} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#D7E9ED] rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[#263A47] text-sm">Enrolled Courses</p>
                                        <p className="text-2xl font-bold text-[#30506C]">
                                            {enrolledCoursesIds.length}
                                        </p>
                                    </div>
                                    <div className="text-[#469CA4] opacity-20">
                                        <BookOpen size={32} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#D7E9ED] rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[#263A47] text-sm">Pending Tasks</p>
                                        <p className="text-2xl font-bold text-[#30506C]">
                                            {plannerEntries.filter(p => p.pEntryStatus === 'pending').length}
                                        </p>
                                    </div>
                                    <div className="text-[#469CA4] opacity-20">
                                        <Calendar size={32} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-[#EFE3DF] pt-8 space-y-8">


                            <div>
                                <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
                                    <BookOpen size={24} />
                                    <span>Enrolled Courses</span>
                                </h2>
                                {enrolledCourseDetails.length === 0 ? (
                                    <p className="text-[#263A47]">No courses enrolled yet. Start learning!</p>
                                ) : (
                                    <div className="space-y-3">
                                        {enrolledCourseDetails.map(course => (
                                            <div key={course._id} className="bg-[#F5F0ED] rounded-lg p-4">
                                                <h3 className="font-semibold text-[#30506C]">{course.courseTitle}</h3>
                                                <p className="text-sm text-[#263A47]">Instructor: {course.courseInstructor}</p>
                                                <p className="text-xs text-[#263A47] mt-1">
                                                    Ends: {new Date(course.courseEndDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-[#30506C] mb-4 flex items-center space-x-2">
                                    <Calendar size={24} />
                                    <span>Registered Events</span>
                                </h2>
                                {registeredEventDetails.length === 0 ? (
                                    <p className="text-[#263A47]">No events registered. Check out upcoming events!</p>
                                ) : (
                                    <div className="space-y-3">
                                        {registeredEventDetails.map(event => (
                                            <div key={event._id} className="bg-[#F5F0ED] rounded-lg p-4">
                                                <h3 className="font-semibold text-[#30506C]">{event.eventName}</h3>
                                                <p className="text-sm text-[#263A47]">
                                                    {new Date(event.eventDate).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-[#263A47]">{event.eventLocation}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};