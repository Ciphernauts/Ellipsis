import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AppContext
const AppContext = createContext();

// Custom hook to use the AppContext
export const useApp = () => useContext(AppContext);

// AppProvider component
export function AppProvider({ children }) {
  // User state
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Mode state
  const [mode, setMode] = useState('General');

  // Settings state (merged system & notifications)
  const [settings, setSettings] = useState({
    defaultMode: 'General',
    dataRefreshInterval: '5 minutes',
    dataTransferInterval: '5 minutes',
    pushNotifications: true,
    emailAlerts: true,
    highPriorityAlerts: false,
  });

  // UNCOMMENT THIS WHEN API IS MADE

  // Fetch user profile from the server
  //   const fetchProfile = async () => {
  //     try {
  //       const response = await axios.get('${API_BASE_URL}/profile', {
  //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  //       });
  //       setUser(response.data);
  //     } catch (error) {
  //       console.error('Failed to fetch profile:', error);
  //       setUser(null);
  //     }
  //   };

  // SIMULATING FETCHING USER PROFILE, YOU CAN DELETE THIS LATER

  // Fetch user profile from the server
  const fetchProfile = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const response = {
            data: {
              username: 'Pejman Jouzi',
              email: 'pejmanjouziandpartners@gmail.com',
              profilePicture: '',
            },
          };
          setUser(response.data);
          resolve(response);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          reject(error);
        }
      }, 100); // Simulate a 500ms delay
    });
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await axios.post('${API_BASE_URL}/login', credentials);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Update user profile (username, email, password, profile picture)
  const updateUserInfo = async (updates) => {
    try {
      const response = await axios.put(
        '${API_BASE_URL}/update-profile',
        updates,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.status === 200) {
        setUser((prevUser) => ({ ...prevUser, ...updates })); // Merge changes into user state
        return { success: true, message: 'Profile updated successfully!' };
      } else {
        return { success: false, message: 'Failed to update profile.' };
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating profile',
      };
    }
  };

  // Delete user account
  const deleteUserAccount = async () => {
    try {
      const response = await axios.delete('${API_BASE_URL}/delete-account', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (response.status === 200) {
        logout(); // Clear user state and token
        return { success: true, message: 'Account deleted successfully!' };
      } else {
        return { success: false, message: 'Failed to delete account.' };
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error deleting account',
      };
    }
  };

  // UNCOMMENT THIS WHEN API IS MADE

  // Fetch mode from the server
  //   const fetchMode = async () => {
  //     try {
  //       const response = await axios.get('${API_BASE_URL}/current-mode');
  //       setMode(response.data.mode);
  //     } catch (error) {
  //       console.error('Error fetching mode:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  // SIMULATING FETCHING USER PROFILE, YOU CAN DELETE THIS LATER

  // Fetch mode from the server (with simulated response)
  const fetchMode = async () => {
    try {
      // const response = await axios.get('${API_BASE_URL}/current-mode'); // Uncomment when API is ready
      const response = { data: { mode: 'General' } }; // Simulate API response
      setMode(response.data.mode);
    } catch (error) {
      console.error('Error fetching mode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update mode
  const updateMode = async (newMode) => {
    try {
      const response = await axios.post('${API_BASE_URL}/update-mode', {
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

  // UNCOMMENT THIS WHEN API IS MADE

  // Fetch settings from the server
  //   const fetchSettings = async () => {
  //     try {
  //       const response = await axios.get('${API_BASE_URL}/settings', {
  //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  //       });
  //       setSettings(response.data);
  //     } catch (error) {
  //       console.error('Error fetching settings:', error);
  //     }
  //   };

  // SIMULATING FETCHING SETTINGS, YOU CAN DELETE THIS LATER

  const fetchSettings = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const response = {
            data: {
              defaultMode: 'General',
              dataRefreshInterval: '5 minutes',
              dataTransferInterval: '5 minutes',
              pushNotifications: true,
              emailAlerts: true,
              highPriorityAlerts: false,
            },
          };
          resolve(response);
        } catch (error) {
          console.error('Failed to fetch settings:', error);
          reject(error);
        }
      }, 500);
    });
  };

  // Update settings
  const updateSettings = async (newSettings) => {
    try {
      const response = await axios.put(
        '${API_BASE_URL}/settings',
        newSettings,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.status === 200) {
        setSettings((prev) => ({ ...prev, ...newSettings }));
      } else {
        console.error('Failed to update settings:', response.status);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  // Fetch initial data when the app loads
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchProfile();
      fetchSettings();
    }
    fetchMode();
  }, []);

  return (
    <AppContext.Provider
      value={{
        // User
        user,
        login,
        logout,
        fetchProfile,
        updateUserInfo,
        deleteUserAccount,

        // Mode
        mode,
        isLoading,
        fetchMode,
        updateMode,

        // Settings
        settings,
        fetchSettings,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
