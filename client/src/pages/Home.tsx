import React from 'react';
import { Link } from 'react-router-dom';
import { 
  SignedIn, 
  SignedOut, 
} from '@clerk/clerk-react'; 

export function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br bg-[#D7E9ED] text-[#263A47] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            
            <img
              src="/clientpic.jpg" 
              alt="Client Pic"
              className="h-32 w-32 mx-auto mb-6 rounded-full object-cover"
            />
            
            <h1 className="text-5xl font-bold mb-6">Welcome to ADHD + Autism Support UK</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Your trusted companion for managing ADHD. Access productivity tools, educational
              resources, and a supportive community.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              
              <SignedOut>
                <Link
                  to="/sign-in" 
                  className="px-8 py-3 bg-[#469CA4] text-white rounded-md hover:bg-[#3a7d84] hover:text-white transition font-semibold"
                >
                  Get Started
                </Link>
                <Link
                  to="/courses"
                  className="px-8 py-3 bg-white text-[#30506C] rounded-md hover:bg-gray-100 transition font-semibold"
                >
                  Explore Courses
                </Link>
              </SignedOut>

              <SignedIn>
                <Link
                  to="/dashboard"
                  className="px-8 py-3 bg-[#469CA4] text-white rounded-md hover:bg-[#3a7d84] hover:text-white transition font-semibold"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/productivity"
                  className="px-8 py-3 bg-white text-[#30506C] rounded-md hover:bg-gray-100 transition font-semibold"
                >
                  Productivity Tools
                </Link>
              </SignedIn>

            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#30506C] text-center mb-12">Explore Our Hub</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <Link 
              to="/resources"
              className="group bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center h-48 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#469CA4]"
            >
              <div className="mb-4 text-[#469CA4] group-hover:scale-110 transition-transform">
                <span className="text-4xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#30506C] mb-2 group-hover:text-[#469CA4] transition-colors">Parenting Support</h3>
              <p className="text-gray-600">Guides, articles, and toolkits for parents and guardians.</p>
            </Link>

            <Link 
              to="/events"
              className="group bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center h-48 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#469CA4]"
            >
              <div className="mb-4 text-[#469CA4] group-hover:scale-110 transition-transform">
                <span className="text-4xl">🗓️</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#30506C] mb-2 group-hover:text-[#469CA4] transition-colors">Community Events</h3>
              <p className="text-gray-600">Join workshops, meetups, and local support gatherings.</p>
            </Link>

            <Link 
              to="/courses"
              className="group bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center text-center h-48 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#469CA4]"
            >
              <div className="mb-4 text-[#469CA4] group-hover:scale-110 transition-transform">
                <span className="text-4xl">🎓</span>
              </div>
              <h3 className="text-2xl font-semibold text-[#30506C] mb-2 group-hover:text-[#469CA4] transition-colors">Expert Talks</h3>
              <p className="text-gray-600">Learn from leading ADHD specialists through curated video content.</p>
            </Link>

          </div>
        </div>
      </section>

      <section className="bg-[#D7E9ED] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#30506C] mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-[#263A47] mb-8 max-w-2xl mx-auto">
            Join our community today and access tools designed to help you thrive with ADHD.
          </p>
          
          <SignedOut>
            <Link
              to="/sign-in"
              className="inline-block px-8 py-3 bg-[#469CA4] text-white rounded-md hover:bg-[#3a7d84] transition font-semibold"
            >
              Create Your Free Account
            </Link>
          </SignedOut>
          
          <SignedIn>
            <Link
              to="/dashboard"
              className="inline-block px-8 py-3 bg-[#469CA4] text-white rounded-md hover:bg-[#3a7d84] hover:text-white transition font-semibold"
            >
              Go to Your Dashboard
            </Link>
          </SignedIn>
        </div>
      </section>
    </div>
  );
}