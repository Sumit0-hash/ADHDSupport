import React, { useMemo, useState } from 'react';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { useData } from '../context/UserContext.js';
import { useUserProfile } from '../context/UserProfileContext.js';
import { api } from '../services/api.js';
import { Calendar, User, CheckCircle, Lock, CreditCard, ExternalLink } from 'lucide-react';
import type { ICourse } from '../types/index.js';

export const Courses = () => {
  const { isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { courses, loading: isDataLoading } = useData();
  const { userProfile, isProfileLoading, refreshProfile } = useUserProfile();

  const [filter, setFilter] = useState<'all' | 'enrolled' | 'available'>('all');
  const [submittingCourseId, setSubmittingCourseId] = useState<string | null>(null);

  // ✅ IMPORTANT: Hooks must be called before any conditional return.
  // When userProfile is null, use empty arrays.
  const enrolledCourses: string[] = useMemo(() => {
    if (!userProfile) return [];
    return userProfile.enrolledCourses?.map((id) => id.toString()) || [];
  }, [userProfile]);

  const filteredCourses: ICourse[] = useMemo(() => {
    return (courses || []).filter((course) => {
      const courseId = course._id!;
      const isEnrolled = enrolledCourses.includes(courseId);

      if (filter === 'enrolled') return isEnrolled;
      if (filter === 'available') return !isEnrolled;
      return true;
    });
    
  }, [courses, enrolledCourses, filter]);

  // --- UI STATES (safe now, hooks already called) ---
  if (!isClerkLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-[#30506C]">Checking authentication...</p>
      </div>
    );
  }

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

  if (isDataLoading || isProfileLoading || !userProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-[#30506C]">Loading courses and user data...</p>
      </div>
    );
  }

  const clerkId = userProfile.clerkId;

  const handleEnroll = async (courseId: string) => {
    if (!clerkId || !courseId || enrolledCourses.includes(courseId)) return;

    setSubmittingCourseId(courseId);
    try {
      await api.users.enrollCourse(clerkId, courseId);
      await refreshProfile();
    } catch (error) {
      console.error('Failed to enroll in course:', error);
    } finally {
      setSubmittingCourseId(null);
    }
  };

  const openInNewTab = (url?: string) => {
    const cleaned = url?.trim();
    if (!cleaned) return;
    window.open(cleaned, '_blank', 'noopener,noreferrer');
  };
  console.log("COURSES DATA:", courses);


  return (
    <div className="min-h-screen bg-[#D7E9ED]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[#30506C] mb-2">Courses</h1>
        <p className="text-[#263A47] mb-8">Develop new skills and strategies tailored for ADHD</p>

        <div className="flex space-x-2 mb-6">
          {(['all', 'enrolled', 'available'] as const).map((filterOption) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center md:col-span-2">
              <p className="text-[#263A47] mb-4">No courses found</p>
              {filter !== 'all' && (
                <button onClick={() => setFilter('all')} className="text-[#469CA4] hover:underline font-medium">
                  View all courses
                </button>
              )}
            </div>
          ) : (
            filteredCourses.map((course) => {
              const courseId = course._id!;
              const isEnrolled = enrolledCourses.includes(courseId);
              const isSubmittingThis = submittingCourseId === courseId;

              const hasPayment = !!course.paymentLink?.trim();
              const hasCourseLink = !!course.courseLink?.trim();

              return (
                <div key={courseId} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-[#30506C] to-[#469CA4] h-24" />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#30506C]">{course.courseTitle}</h3>

                      {isEnrolled && (
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center space-x-1 shrink-0">
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

                      <div className="text-sm text-[#263A47]">
                        <span className="font-medium">Duration:</span>{' '}
                        {Math.ceil(
                          (new Date(course.courseEndDate).getTime() - new Date(course.courseStartDate).getTime()) /
                            (1000 * 60 * 60 * 24 * 7)
                        )}{' '}
                        weeks
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => handleEnroll(courseId)}
                        disabled={isEnrolled || isSubmittingThis}
                        className={`w-full py-2 rounded-lg font-medium transition ${
                          isEnrolled
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-[#469CA4] hover:bg-[#3a7f8a] text-white'
                        }`}
                      >
                        {isSubmittingThis ? 'Enrolling...' : isEnrolled ? 'Enrolled' : 'Enroll Now'}
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <button
                          onClick={() => openInNewTab(course.paymentLink)}
                          disabled={!hasPayment}
                          className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                            hasPayment
                              ? 'bg-[#EAF4F6] text-[#263A47] hover:bg-[#D7E9ED]'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <CreditCard size={18} />
                          Payment
                        </button>

                        <button
                          onClick={() => openInNewTab(course.courseLink)}
                          disabled={!hasCourseLink}
                          className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                            hasCourseLink
                              ? 'bg-[#EAF4F6] text-[#263A47] hover:bg-[#D7E9ED]'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <ExternalLink size={18} />
                          Course Link
                        </button>
                      </div>

                      {/* ✅ Optional debug: remove later */}
                      {/* <pre className="text-xs text-gray-400">{JSON.stringify({ paymentLink: course.paymentLink, courseLink: course.courseLink }, null, 2)}</pre> */}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
