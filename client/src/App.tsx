import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, SignIn, SignUp, useUser } from '@clerk/clerk-react'; 
import { DataProvider } from './context/UserContext.js'; 

import { Header } from './components/Header';
import { Footer } from './components/Footer'; // 1. Import the Footer
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Productivity } from './pages/Productivity';
import { Courses } from './pages/Courses';
import { Resources } from './pages/Resources';
import { Events } from './pages/Events';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

// --- NEW PROTECTED ROUTE COMPONENT (Uses Clerk) ---
const ProtectedRoute = () => {
    const { isLoaded, isSignedIn } = useAuth();
    
    if (!isLoaded) {
        return <div className="p-4 text-center">Loading...</div>;
   }

    if (isSignedIn) {
        return <Outlet />;
    }

    return <Navigate to="/sign-in" replace />;
};

const App: React.FC = () => {
    const { user: clerkUser, isLoaded: isUserLoaded } = useUser(); 
    
    const isAdmin = isUserLoaded && clerkUser?.publicMetadata?.userType === 'admin'; 
    
    return (
        <Router>
            <DataProvider>
                {/* 'min-h-screen' ensures the container takes full height 
                   'flex-col' stacks Header, Main, and Footer vertically 
                */}
                <div className="flex flex-col min-h-screen">
                    <Header isAdmin={isAdmin} /> 
                    
                    {/* 'flex-1' makes the main content expand to fill available space, pushing Footer down */}
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/courses" element={<Courses />} />
                            <Route path="/resources" element={<Resources />} />
                            <Route path="/events" element={<Events />} />
                            
                            <Route 
                                path="/sign-in/*" 
                                element={<SignIn routing="path" path="/sign-in" />} 
                            />
                            <Route 
                                path="/sign-up/*" 
                                element={<SignUp routing="path" path="/sign-up" />} 
                            />

                            <Route element={<ProtectedRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/productivity" element={<Productivity />} />
                                <Route path="/profile" element={<Profile />} />
                                
                                <Route path="/admin" element={<Admin />} />
                            </Route>

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>

                    {/* 2. Place Footer here */}
                    <Footer />
                </div>
            </DataProvider>
        </Router>
    );
};

export default App;