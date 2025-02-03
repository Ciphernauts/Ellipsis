import React, { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext();

export const useMode = () => useContext(ModeContext);

export function ModeProvider({ children }) {
  // Set "General" as the default mode
  const [mode, setMode] = useState('General');

  // Uncomment this when the API is developed
  // useEffect(() => {
  //   fetch("/api/current-mode") // Adjust URL as needed
  //     .then((response) => response.json())
  //     .then((data) => setMode(data.mode))
  //     .catch((error) => console.error("Error fetching mode:", error));
  // }, []);

  return (
    <ModeContext.Provider value={{ mode }}>{children}</ModeContext.Provider>
  );
}
