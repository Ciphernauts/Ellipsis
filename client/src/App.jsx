import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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
import ChangeMode from './pages/ChangeMode';
import Settings from './pages/Settings';
import Register from './pages/Register';
import Login from './pages/Login';
import SafetyTrends from './pages/SafetyTrends';
import OverallSafetyTrend from './pages/OverallSafetyTrend';

const App = () => {
  const isStandalone = isPWA();
  console.log('is PWA: ', isStandalone);

  return (
    <AppProvider>
      <Routes>
        {/* Route without nav pane */}
        <Route
          path='/'
          element={isStandalone ? <OnboardingPage /> : <HomePage />}
        />
        <Route path='/Register' element={<Register />} />
        <Route path='/Login' element={<Login />} />

        {/* Routes with nav pane */}
        <Route element={isStandalone ? <PWALayout /> : <Layout />}>
          <Route path='/test' />
          <Route
            path='/dashboard'
            element={<Dashboard isPWA={isStandalone} />}
          />
          <Route path='/safety-trends' element={<Dashboard />} />
          {/* Redirect from /timeline to /timeline/calendar */}
          <Route
            path='/timeline'
            element={<Navigate to='/timeline/calendar' replace />}
          />
          <Route path='/timeline/calendar' element={<TimelineCalendar />} />
          <Route path='/timeline/sessions' element={<TimelineSessions />} />
          {/* Redirect from /incidents to /incidents/incident-trends */}
          <Route
            path='/incidents'
            element={<Navigate to='/incidents/incident-trends' replace />}
          />
          <Route
            path='/incidents/incident-trends'
            element={<IncidentTrends />}
          />
          <Route
            path='/incidents/incident-history'
            element={<IncidentHistory />}
          />
          <Route path='/construction-sites' element={<ConstructionSites />} />
          <Route path='/cameras' element={<Dashboard />} />
          <Route path='/change-mode' element={<ChangeMode />} />
          <Route path='/settings' element={<Settings />} />

          {/* Safety Trends Routes */}
          <Route
            path='/safety-trends/overall'
            element={<OverallSafetyTrend />}
          />
          <Route
            path='/safety-trends/:category/:subcategory'
            element={<SafetyTrends />}
          />
        </Route>
      </Routes>
    </AppProvider>
  );
};

export default App;
