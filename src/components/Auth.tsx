import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendEmailVerification,
  updateProfile 
} from 'firebase/auth';
import { Chrome } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!isLogin && !validatePassword(password)) {
        setError('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character');
        return;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/todos');
      } else {
        if (!name.trim()) {
          setError('Name is required');
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name.trim()
        });
        await sendEmailVerification(userCredential.user);
        alert('Please verify your email before logging in');
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        navigate('/todos');
      }
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
        return;
      }
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required={!isLogin}
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn btn-primary">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      
      <button onClick={handleGoogleSignIn} className="btn btn-google">
        <Chrome size={20} />
        Continue with Google
      </button>

      <div className="auth-links">
        {isLogin && (
          <button 
            onClick={() => navigate('/forgot-password')} 
            className="btn btn-link"
          >
            Forgot Password?
          </button>
        )}
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="btn btn-link"
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};

export default Auth;