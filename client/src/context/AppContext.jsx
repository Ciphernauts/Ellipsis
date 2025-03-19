import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
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
  const previousUser = useRef(null);
  const navigate = useNavigate();

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
  //       const response = await axios.get('http://localhost:3000/api/profile', {
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
    try {
      const response = await axios.get(
        'https://ellipsis-1.onrender.com/api/users',
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      console.log('fetchProfile API response:', response);
      if (previousUser.current == JSON.stringify(response.data[0])) {
        // Compare the first element
        setUser(response.data[0]); // Set user to the first element
        previousUser.current = JSON.stringify(response.data[0]); // Update ref
        console.log('User data set in AppContext (API):', response.data[0]);
      }
      return response;
    } catch (error) {
      console.error('Failed to fetch profile from API:', error);

      // Fallback to placeholder data if the API call fails
      const placeholderResponse = {
        data: {
          username: 'Pejman Jouzi',
          email: 'pejmanjouziandpartners@gmail.com',
          profilePicture: '',
          role: 'standard',
        },
      };

      setUser(placeholderResponse.data); // Set the placeholder data
      return placeholderResponse; // Return the placeholder data
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      console.log('logging in from appcontext');
      const response = await axios.post(
        'https://ellipsis-1.onrender.com/api/users/login',
        { email, password }
      );
      console.log('login response: ', response);

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token'); // Clear JWT token
    setUser(null); // Reset user state
  };

  // Update user profile (username, email, password, profile picture)
  const updateUserInfo = async (updatedData) => {
    try {
      const response = await axios.put(
        `https://ellipsis-1.onrender.com/api/users/${user.uid}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      console.log('Update User Info Response:', response); // Log the entire response

      if (response.data.message) {
        // If the update was successful, update the user context
        if (response.status === 200) {
          if (updatedData.username) {
            setUser((prevUser) => ({
              ...prevUser,
              username: updatedData.username,
            }));
            console.log('Username updated in context:', updatedData.username);
          }
          if (updatedData.email) {
            setUser((prevUser) => ({ ...prevUser, email: updatedData.email }));
            console.log('Email updated in context:', updatedData.email);
          }
        }
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: 'Failed to update user info.' };
      }
    } catch (error) {
      console.error('Failed to update user info:', error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          'An error occurred while updating user info.',
      };
    }
  };

  // Delete user account
  const deleteUserAccount = async () => {
    try {
      const response = await axios.delete(
        'https://ellipsis-1.onrender.com/api/users/delete-account',
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

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
  //       const response = await axios.get('http://localhost:3000/api/users/current-mode');
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
      // const response = await axios.get('http://localhost:3000/api/current-mode'); // Uncomment when API is ready
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
      const response = await axios.post(
        'https://ellipsis-1.onrender.com/api/update-mode',
        {
          mode: newMode,
        }
      );

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
  //       const response = await axios.get('http://localhost:3000/api/users/settings', {
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
        'https://ellipsis-1.onrender.com/api/users/settings',
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
        isAdmin: user?.role === 'admin', // Derived admin check
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
