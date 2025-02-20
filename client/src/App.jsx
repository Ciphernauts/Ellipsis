import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import TimelineCalendar from './pages/TimelineCalendar';
import TimelineSessions from './pages/TimelineSessions';
import IncidentTrends from './pages/IncidentTrends';
import IncidentHistory from './pages/IncidentHistory';
import ConstructionSites from './pages/ConstructionSites';
import ChangeMode from './pages/ChangeMode';
import Settings from './pages/Settings';

const App = () => {
  return (
    <AppProvider>
      <Routes>
        {/* Route without nav pane */}
        <Route path='/' element={<HomePage />} />

        {/* Routes with nav pane */}
        <Route element={<Layout />}>
          <Route path='/dashboard' element={<Dashboard />} />
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
        </Route>
      </Routes>
    </AppProvider>
  );
};

export default App;
