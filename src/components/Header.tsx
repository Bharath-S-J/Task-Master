import React from 'react';
import { LogOut, User } from 'lucide-react';

interface HeaderProps {
  userName: string | null | undefined;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Task Master</h1>
        <h4 >🚫 Email reminders are currently disabled. Backend is not deployed due to free-tier mail limits.</h4>
        <div className="user-info">
          <div className="user-name">
            <User size={20} />
            <span>{userName || 'User'}</span>
          </div>
          <button onClick={onLogout} className="btn btn-danger">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;