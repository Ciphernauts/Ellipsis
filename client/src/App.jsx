import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import TimelineCalendar from './pages/TimelineCalendar';
import TimelineSessions from './pages/TimelineSessions';
import IncidentTrends from './pages/IncidentTrends';
import IncidentHistory from './pages/IncidentHistory';
import { ModeProvider } from './context/ModeContext';
import ConstructionSites from './pages/ConstructionSites';

const App = () => {
  return (
    <ModeProvider>
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
        </Route>
      </Routes>
    </ModeProvider>
  );
};

export default App;
