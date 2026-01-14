import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ICourse, IEvent, IResource } from '../types/index.js';
import { api } from '../services/api.js'; // 1. Import API Client

// Interface now only tracks application data and loading state
interface DataContextType {
  courses: ICourse[];
  setCourses: React.Dispatch<React.SetStateAction<ICourse[]>>;

  events: IEvent[];
  setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;

  resources: IResource[];
  setResources: React.Dispatch<React.SetStateAction<IResource[]>>;

  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
// Renamed context internally to DataContext
const DataContext = createContext<DataContextType | undefined>(undefined);

// Renamed provider internally to DataProvider
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [resources, setResources] = useState<IResource[]>([]);
  const [loading, setLoading] = useState(false);

  // 2. Use useEffect to fetch data on component mount
  useEffect(() => {
    const fetchGlobalData = async () => {
      setLoading(true); // Start loading state
      try {
        // Fetch Courses
        const courseResponse = await api.courses.getAll();
        setCourses(courseResponse.data);

        // Fetch Upcoming Events
        const eventResponse = await api.events.getUpcoming(); // Fetching upcoming events is usually better for dashboard
        setEvents(eventResponse.data);

        // Fetch Resources
        const resourceResponse = await api.resources.getAll();
        setResources(resourceResponse.data);

      } catch (error) {
        console.error("Failed to fetch initial application data:", error);
        // Optionally, show an error notification to the user
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchGlobalData();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <DataContext.Provider
      value={{
        courses,
        setCourses,
        events,
        setEvents,
        resources,
        setResources,
        loading,
        setLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Renamed hook to useData
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};