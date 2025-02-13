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
import { ModeProvider } from './context/ModeContext';

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

          <Route path='/alert-history' element={<Dashboard />} />
          <Route path='/construction-sites' element={<Dashboard />} />
          <Route path='/cameras' element={<Dashboard />} />
        </Route>
      </Routes>
    </ModeProvider>
  );
};

export default App;
