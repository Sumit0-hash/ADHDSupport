import React, { useState, useEffect } from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react'; // Added SignInButton
import { useData } from '../context/UserContext.js';
import { useUserProfile } from '../context/UserProfileContext.js';
import { api } from '../services/api.js';
import { BookOpen, Calendar, User, CheckCircle, Lock } from 'lucide-react'; // Added Lock icon
import type { ICourse } from '../types/index.js';

export const Courses = () => {
    // --- HOOKS ---
    // Destructure isSignedIn to check auth status
    const { isLoaded: isClerkLoaded, isSignedIn } = useUser(); 
    const { courses, loading: isDataLoading } = useData();
    const { userProfile, isProfileLoading, refreshProfile } = useUserProfile();

    const [filter, setFilter] = useState<'all' | 'enrolled' | 'available'>('all');
    const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- 1. CLERK LOADING STATE ---
    // Wait until Clerk determines if the user is logged in or not
    if (!isClerkLoaded) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-[#30506C]">Checking authentication...</p>
            </div>
        );
    }

    // --- 2. NOT SIGNED IN STATE ---
    // Clerk is loaded, but user is not signed in. Show warning.
    if (!isSignedIn) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-[#D7E9ED] px-4">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                    <div className="bg-[#EAF4F6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-[#30506C]" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#30506C] mb-2">Access Restricted</h2>
                    <p className="text-[#263A47] mb-6">
                        Please sign in to view the course catalog and manage your enrollments.
                    </p>
                    <SignInButton mode="modal">
                        <button className="bg-[#469CA4] hover:bg-[#3a7f8a] text-white px-6 py-2 rounded-lg font-medium transition w-full">
                            Sign In
                        </button>
                    </SignInButton>
                </div>
            </div>
        );
    }

    // --- 3. DATA LOADING STATE ---
    // User IS signed in, but profile or courses are still fetching
    if (isDataLoading || isProfileLoading || !userProfile) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-[#30506C]">Loading courses and user data...</p>
            </div>
        );
    }

    // Safely get enrolled courses
    const enrolledCourses: string[] = userProfile 
        ? (userProfile.enrolledCourses?.map(id => id.toString()) || [])
        : [];
    
    const clerkId = userProfile.clerkId;

    const filteredCourses = courses.filter(course => {
        const courseId = course._id!;
        const isEnrolled = enrolledCourses.includes(courseId);

        if (filter === 'enrolled') {
            return isEnrolled;
        }
        if (filter === 'available') {
            return !isEnrolled;
        }
        return true;
    });

    const handleEnroll = async (courseId: string) => {
        if (!clerkId || !courseId || enrolledCourses.includes(courseId)) return;
        
        setIsSubmitting(true);
        
        try {
            await api.users.enrollCourse(clerkId, courseId);
            await refreshProfile();
            console.log(`Successfully enrolled in course: ${courseId}`);
        } catch (error) {
            console.error('Failed to enroll in course:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#D7E9ED]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-[#30506C] mb-2">Courses</h1>
                <p className="text-[#263A47] mb-8">Develop new skills and strategies tailored for ADHD</p>

                <div className="flex space-x-2 mb-6">
                    {(['all', 'enrolled', 'available'] as const).map(filterOption => (
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {filteredCourses.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                <p className="text-[#263A47] mb-4">No courses found</p>
                                {filter !== 'all' && (
                                    <button
                                        onClick={() => setFilter('all')}
                                        className="text-[#469CA4] hover:underline font-medium"
                                    >
                                        View all courses
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredCourses.map(course => {
                                const isEnrolled = enrolledCourses.includes(course._id!);
                                return (
                                    <div
                                        key={course._id}
                                        onClick={() => setSelectedCourse(course)}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                                    >
                                        <div className="bg-gradient-to-r from-[#30506C] to-[#469CA4] h-32"></div>
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-xl font-bold text-[#30506C]">{course.courseTitle}</h3>
                                                {isEnrolled && (
                                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1">
                                                        <CheckCircle size={16} />
                                                        <span className="text-sm font-medium">Enrolled</span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[#263A47] mb-4">{course.courseDescription}</p>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center space-x-2 text-[#263A47] text-sm">
                                                    <User size={16} />
                                                    <span>{course.courseInstructor}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-[#263A47] text-sm">
                                                    <Calendar size={16} />
                                                    <span>
                                                        {new Date(course.courseStartDate).toLocaleDateString()} -{' '}
                                                        {new Date(course.courseEndDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEnroll(course._id!);
                                                }}
                                                disabled={isEnrolled || isSubmitting}
                                                className={`w-full py-2 rounded-lg font-medium transition ${
                                                    isEnrolled
                                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        : 'bg-[#469CA4] hover:bg-[#3a7f8a] text-white'
                                                }`}
                                            >
                                                {isSubmitting && !isEnrolled ? 'Enrolling...' : isEnrolled ? 'Enrolled' : 'Enroll Now'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {selectedCourse && (
                        <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-6">
                            <h2 className="text-xl font-bold text-[#30506C] mb-4">Course Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-[#263A47] mb-1">Title</p>
                                    <p className="text-[#30506C]">{selectedCourse.courseTitle}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#263A47] mb-1">Instructor</p>
                                    <p className="text-[#30506C]">{selectedCourse.courseInstructor}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#263A47] mb-1">Duration</p>
                                    <p className="text-[#30506C]">
                                        {Math.ceil(
                                            (new Date(selectedCourse.courseEndDate).getTime() -
                                                new Date(selectedCourse.courseStartDate).getTime()) /
                                                (1000 * 60 * 60 * 24 * 7)
                                        )}{' '}
                                        weeks
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        handleEnroll(selectedCourse._id!);
                                        setSelectedCourse(null);
                                    }}
                                    disabled={enrolledCourses.includes(selectedCourse._id!) || isSubmitting}
                                    className={`w-full py-2 rounded-lg font-medium transition ${
                                        enrolledCourses.includes(selectedCourse._id!)
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : 'bg-[#469CA4] hover:bg-[#3a7f8a] text-white'
                                    }`}
                                >
                                    {isSubmitting && !enrolledCourses.includes(selectedCourse._id!) ? 'Enrolling...' : enrolledCourses.includes(selectedCourse._id!) ? 'Enrolled' : 'Enroll Now'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};