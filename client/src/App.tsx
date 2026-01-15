import React, { useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import {
  useAuth,
  SignInButton,
  useUser,
} from '@clerk/clerk-react';
import { DataProvider } from './context/UserContext.js';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Productivity } from './pages/Productivity';
import { Courses } from './pages/Courses';
import { Resources } from './pages/Resources';
import { Events } from './pages/Events';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import ParentingBook from "./pages/ParentingBook";
import { ExpertTalks } from './pages/ExpertTalks.js';


const AutoSignInModal = () => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // auto-open modal
    buttonRef.current?.click();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <SignInButton mode="modal">
        <button ref={buttonRef} className="hidden">
          Open Sign In
        </button>
      </SignInButton>
    </div>
  );
};

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (isSignedIn) {
    return <Outlet />;
  }

  // ⬇️ OPEN MODAL (same as Home.tsx)
  return <AutoSignInModal />;
};


const App: React.FC = () => {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const isAdmin = isUserLoaded && clerkUser?.publicMetadata?.userType === 'admin';

  return (
    <Router>
      <DataProvider>
        <div className="flex flex-col min-h-screen">
          <Header isAdmin={isAdmin} />

          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/events" element={<Events />} />
              <Route path="/parenting-book" element={<ParentingBook />} />
              <Route path="/expert-talks" element={<ExpertTalks />} />


              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/productivity" element={<Productivity />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </DataProvider>
    </Router>
  );
};

export default App;
