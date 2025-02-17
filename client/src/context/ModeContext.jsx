import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ModeContext = createContext();

export const useMode = () => useContext(ModeContext);

export function ModeProvider({ children }) {
  const [mode, setMode] = useState('General');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const response = await axios.get('/api/current-mode');
        setMode(response.data.mode);
      } catch (error) {
        console.error('Error fetching mode:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMode();
  }, []);

  const updateMode = async (newMode) => {
    try {
      const response = await axios.post('/api/update-mode', {
        mode: newMode,
      });

      if (response.status === 200) {
        setMode(newMode);
      } else {
        console.error('Failed to update mode:', response.status);
      }
    } catch (error) {
      console.error('Error updating mode:', error);
    }
  };

  return (
    <ModeContext.Provider value={{ mode, isLoading, updateMode }}>
      {children}
    </ModeContext.Provider>
  );
}
