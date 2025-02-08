import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setError('');
      setSuccess('');
      setIsResending(true);
      
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/auth', // Redirect URL after password reset
      });
      
      setSuccess('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <button 
          type="submit" 
          className="btn btn-primary w-full"
          disabled={isResending}
        >
          <Send size={16} />
          {isResending ? 'Sending...' : 'Send Reset Link'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/auth')}
          className="btn btn-secondary w-full mt-4"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;