import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login     from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Prices    from './pages/Prices.jsx';
import Crops     from './pages/Crops.jsx';
import Queries   from './pages/Queries.jsx';
import Layout    from './components/Layout.jsx';

const isAuth = () => !!localStorage.getItem('shamba_admin_token');

function Protected({ children }) {
  return isAuth() ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/" element={isAuth() ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/dashboard" element={<Protected><Layout page="dashboard"><Dashboard /></Layout></Protected>} />
        <Route path="/prices"    element={<Protected><Layout page="prices"><Prices /></Layout></Protected>} />
        <Route path="/crops"     element={<Protected><Layout page="crops"><Crops /></Layout></Protected>} />
        <Route path="/queries"   element={<Protected><Layout page="queries"><Queries /></Layout></Protected>} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
