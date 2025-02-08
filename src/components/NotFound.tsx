
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          <Home size={20} />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;