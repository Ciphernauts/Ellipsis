import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { isPWA } from './utils/isPWA';
import Layout from './components/layout/Layout';
import PWALayout from './components/layout/PWALayout';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import TimelineCalendar from './pages/TimelineCalendar';
import TimelineSessions from './pages/TimelineSessions';
import IncidentTrends from './pages/IncidentTrends';
import IncidentHistory from './pages/IncidentHistory';
import ConstructionSites from './pages/ConstructionSites';
import Cameras from './pages/Cameras';
import ChangeMode from './pages/ChangeMode';
import Settings from './pages/Settings';
import Register from './pages/Register';
import Login from './pages/Login';
import SafetyTrends from './pages/SafetyTrends';
import OverallSafetyTrend from './pages/OverallSafetyTrend';
import AdminDashboard from './pages/AdminDashboard';
import IncidentListener from './components/IncidentListener';

// Create a wrapper component to handle fetching the profile
const AppWrapper = () => {
  const { fetchProfile } = useApp(); // Use useApp inside AppProvider

  // Fetch user profile when the app loads
  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchProfile();
    }
  }, [fetchProfile]);

  return null; // This component doesn't render anything
};

const App = () => {
  const isStandalone = isPWA();

  console.log('is PWA: ', isStandalone);

  return (
    <AppProvider>
      <AppWrapper />
      <IncidentListener />
      <Routes>
        {/* Route without nav pane */}
        <Route
          path='/'
          element={isStandalone ? <OnboardingPage /> : <HomePage />}
        />
        <Route path='/register' element={<Register isPWA={isStandalone} />} />
        <Route path='/login' element={<Login isPWA={isStandalone} />} />

        {/* Routes with nav pane */}
        <Route element={isStandalone ? <PWALayout /> : <Layout />}>
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          <Route
            path='/dashboard'
            element={<Dashboard isPWA={isStandalone} />}
          />
          <Route
            path='/safety-trends'
            element={<Navigate to='/safety-trends/overall' />}
          />

          {/* Redirect from /timeline to /timeline/calendar */}
          <Route
            path='/timeline'
            element={<Navigate to='/timeline/calendar' replace />}
          />

          <Route
            path='/timeline/calendar'
            element={<TimelineCalendar isPWA={isStandalone} />}
          />
          <Route
            path='/timeline/sessions'
            element={<TimelineSessions isPWA={isStandalone} />}
          />

          {/* Redirect from /incidents to /incidents/incident-trends */}
          <Route
            path='/incidents'
            element={<Navigate to='/incidents/incident-trends' replace />}
          />
          <Route
            path='/incidents/incident-trends'
            element={<IncidentTrends isPWA={isStandalone} />}
          />
          <Route
            path='/incidents/incident-history'
            element={<IncidentHistory isPWA={isStandalone} />}
          />

          {/* Safety Trends Routes */}
          <Route
            path='/safety-trends/overall'
            element={<OverallSafetyTrend isPWA={isStandalone} />}
          />
          <Route
            path='/safety-trends/:category/:subcategory'
            element={<SafetyTrends isPWA={isStandalone} />}
          />

          <Route
            path='/construction-sites'
            element={<ConstructionSites isPWA={isStandalone} />}
          />
          <Route path='/cameras' element={<Cameras isPWA={isStandalone} />} />

          <Route
            path='/change-mode'
            element={<ChangeMode isPWA={isStandalone} />}
          />
          <Route path='/settings' element={<Settings isPWA={isStandalone} />} />
        </Route>
      </Routes>
    </AppProvider>
  );
};

export default App;
