import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ICourse, IEvent, IResource, IExpertTalk } from '../types/index.js';
import { api } from '../services/api.js';

interface DataContextType {
  courses: ICourse[];
  setCourses: React.Dispatch<React.SetStateAction<ICourse[]>>;

  events: IEvent[];
  setEvents: React.Dispatch<React.SetStateAction<IEvent[]>>;

  resources: IResource[];
  setResources: React.Dispatch<React.SetStateAction<IResource[]>>;

  expertTalks: IExpertTalk[];
  setExpertTalks: React.Dispatch<React.SetStateAction<IExpertTalk[]>>;

  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [resources, setResources] = useState<IResource[]>([]);
  const [expertTalks, setExpertTalks] = useState<IExpertTalk[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGlobalData = async () => {
      setLoading(true);
      try {
        const [courseResponse, eventResponse, resourceResponse, talkResponse] = await Promise.all([
          api.courses.getAll(),
          api.events.getUpcoming(),
          api.resources.getAll(),
          api.expertTalks.getAll(),
        ]);

        setCourses(courseResponse.data);
        setEvents(eventResponse.data);
        setResources(resourceResponse.data);
        setExpertTalks(talkResponse.data);
      } catch (error) {
        console.error('Failed to fetch initial application data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        courses,
        setCourses,
        events,
        setEvents,
        resources,
        setResources,
        expertTalks,
        setExpertTalks,
        loading,
        setLoading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
