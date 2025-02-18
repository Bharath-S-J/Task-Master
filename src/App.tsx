
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import TodoList from './components/TodoList';
import LandingPage from './components/LandingPage';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import ForgotPassword from './components/ForgotPassword';
import './styles.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/todos"
              element={
                <ProtectedRoute>
                  <TodoList />
                </ProtectedRoute>
              }
            />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App