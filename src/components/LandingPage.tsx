import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  UserCircle, 
  Edit3, 
  Layout, 
  Shield, 
  Clock
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="layout-wrapper landing-page">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">Task Master</h1>
          <h4 >🚫 Email reminders are currently disabled. Backend is not deployed due to free-tier mail limits.</h4>
          <div className="auth-buttons">
            <button onClick={() => navigate('/auth')} className="btn btn-primary">
              Login / Register
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <h2 className="hero-title">Organize Your Life, One Task at a Time</h2>
          <p className="hero-subtitle">
            A powerful, yet simple todo list application to help you stay organized and productive.
          </p>
        </section>

        <div className="features-grid">
          <FeatureCard
            icon={<CheckCircle size={32} color="#4a90e2" />}
            title="Task Management"
            description="Create, edit, and organize your tasks with ease"
          />
          <FeatureCard
            icon={<Layout size={32} color="#2ecc71" />}
            title="Grid View"
            description="Visualize your tasks in an intuitive grid layout"
          />
          <FeatureCard
            icon={<Shield size={32} color="#9b59b6" />}
            title="Secure"
            description="Your data is protected with industry-standard security"
          />
          <FeatureCard
            icon={<UserCircle size={32} color="#3498db" />}
            title="User Profiles"
            description="Personalized experience with user profiles"
          />
          <FeatureCard
            icon={<Edit3 size={32} color="#f1c40f" />}
            title="Easy Editing"
            description="Edit your tasks anytime with inline editing"
          />
          <FeatureCard
            icon={<Clock size={32} color="#e74c3c" />}
            title="Real-time Updates"
            description="Changes are saved and updated instantly"
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

export default LandingPage;